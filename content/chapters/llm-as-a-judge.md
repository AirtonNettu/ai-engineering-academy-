## Fundamentação

A avaliação rigorosa de aplicações baseadas em modelos de linguagem representa um dos maiores desafios da engenharia de software contemporânea. Métricas determinísticas clássicas de processamento de linguagem natural, como BLEU e ROUGE, dependem de sobreposição n-grama exata em relação a referências estáticas. Para tarefas de geração aberta — tais como sumarização executiva, síntese técnica de código e raciocínio deliberativo —, essas métricas falham categoricamente: uma resposta semanticamente impecável com sinônimos e paráfrases elegantes pode receber nota próxima a zero, enquanto uma resposta truncada com termos repetidos pode receber pontuação elevada.

A abordagem _LLM-as-a-Judge_ substitui ou complementa métricas léxicas através do emprego de modelos de fronteira altamente capacitados para atuar como avaliadores automatizados de saídas geradas por outros sistemas. O avaliador recebe o prompt original, o contexto recuperado (em arquiteturas RAG), a resposta gerada pelo modelo candidato e um conjunto explícito de critérios qualitativos e rubricas graduadas, produzindo uma nota numérica acompanhada de justificativa analítica em linguagem natural.

Existem duas configurações metodológicas fundamentais de julgamento:

1. **Julgamento Pareado (_Pairwise Comparison_):** Dois modelos candidatos geram respostas para a mesma entrada, e o juiz decide qual é superior (Modelo A, Modelo B ou Empate). É a base de benchmarks como o LMSYS Chatbot Arena e o MT-Bench, exibindo alta concordância relativa com preferências de especialistas humanos;
2. **Pontuação com Rubrica Única (_Single-Answer Scoring_):** Cada resposta é avaliada isoladamente em uma escala ordinal (geralmente de 1 a 5) em dimensões pré-estabelecidas, como fidelidade factual (_faithfulness_), relevância da resposta (_answer relevance_) e completude lógica.

Embora o método reduza o custo e o tempo de ciclos de validação em ordens de magnitude quando comparado à contratação de painéis de especialistas humanos, o engenheiro de IA deve tratar o modelo juiz com ceticismo técnico. Modelos avaliadores possuem vieses cognitivos e estruturais próprios que podem distorcer severamente os relatórios de qualidade caso não sejam controlados por protocolos experimentais rigorosos. Para explorar como o backend orquestra validação de esquemas e saídas estruturadas, analise o código do [Adaptador FastAPI](/projetos/fastapi-ollama?file=app/integrations/ollama.py).

## Funcionamento intermediário

Os vieses sistemáticos mais documentados em avaliações conduzidas por LLMs incluem:

- **Viés de Posição (_Position Bias_):** Em comparações pareadas, juízes tendem a favorecer desproporcionalmente o primeiro concorrente apresentado no prompt (_primacy bias_) ou, em certos contextos de atenção, o último (_recency bias_). A mitigação obrigatória consiste no protocolo de _Swap Evaluation_: a ordem dos competidores é invertida ($A \text{ vs } B$ e $B \text{ vs } A$). Uma vitória só é consolidada se o modelo vencer em ambas as permutações; se cada modelo vencer na sua respectiva posição, a disputa é registrada como empate técnico ou inconsistência de julgamento;
- **Viés de Verbosidade (_Verbosity Bias_):** Juízes correlacionam incorretamente extensão de texto com autoridade e completude, penalizando respostas diretas e concisas. O prompt de julgamento deve instruir explicitamente o modelo a desconsiderar o tamanho da resposta e pontuar com base estrita no rigor conceitual e precisão fática;
- **Viés de Auto-Aprimoramento (_Self-Enhancement Bias_):** Modelos avaliadores exibem propensão estatisticamente mensurável a conceder notas superiores a saídas produzidas pela sua própria família arquitetural ou fornecedor, decorrente do compartilhamento de estilo e distribuições de tokens.

```python
# Protocolo de julgamento com inversão de posição (Swap Evaluation)
def evaluate_pairwise(client, prompt: str, out_a: str, out_b: str) -> str:
    """Executa julgamento simétrico para neutralizar viés de posição."""
    res1 = client.judge(prompt=prompt, first=out_a, second=out_b) # Ordem normal
    res2 = client.judge(prompt=prompt, first=out_b, second=out_a) # Ordem invertida

    # Mapeamento do resultado da segunda chamada para as entidades originais
    res2_normalized = "A" if res2 == "B" else "B" if res2 == "A" else "EMPATE"

    if res1 == res2_normalized:
        return res1  # Julgamento consistente em ambas as ordens
    return "EMPATE_POR_INCONSISTENCIA"
```

A calibração do modelo juiz é mensurada através de coeficientes estatísticos de concordância interanotadores com benchmarks humanos de referência (_Golden Datasets_). O Coeficiente Kappa de Cohen ($\kappa$) avalia a concordância categórica corrigida pelo acaso, enquanto o Coeficiente de Correlação de Spearman ($\rho$) mede a monotonicidade ordinal das pontuações. Um juiz automatizado só deve ser integrado à esteira de entrega se atingir $\kappa \ge 0.70$ e $\rho \ge 0.80$ no domínio específico da aplicação.

## Análise avançada

Em esteiras corporativas maduras de engenharia de software, o protocolo _LLM-as-a-Judge_ atua como um _Quality Gate_ automatizado dentro da integração contínua (CI/CD). Cada alteração de engenharia — seja um novo prompt de sistema (_system prompt_), uma mudança na estratégia de chunking de um pipeline RAG ou a substituição do modelo base por uma versão quantizada — dispara uma bateria de testes sobre conjuntos de dados congelados de regressão (_golden evaluation suites_).

A arquitetura do juiz deve impor saídas estritamente tipadas através de Pydantic ou esquemas JSON Schema rígidos, forçando o avaliador a estruturar seu veredito em campos como:

- `criterio_pontuado`: dimensão avaliada;
- `evidencia_contextual`: citação do trecho que sustenta a nota;
- `pontuacao`: valor inteiro de 1 a 5;
- `motivo_infracao`: categorização de eventuais falhas (alucinação, omissão de requisito, tom inadequado).

O custo computacional de invocar juízes de última geração para cada requisição em produção pode ser contornado pela técnica de destilação de julgamento (_Judge Distillation_). Um modelo massivo atua como juiz durante o desenvolvimento e geração de rótulos sintéticos, treinando um classificador compacto ou modelo de 8B especializado em auditoria de qualidade. Esse modelo derivado é então executado localmente de forma assíncrona sobre amostras do tráfego produtivo, fornecendo observabilidade contínua sem custos astronômicos de API.

Por fim, o engenheiro deve estar ciente da vulnerabilidade a ataques adversariais direcionados ao juiz. Se o prompt do usuário contiver instruções de injeção de prompt indireta (_Indirect Prompt Injection_) manipulando o formato de pontuação do avaliador, o sistema pode mascarar respostas nocivas com notas máximas. O isolamento do contexto de avaliação e a sanitização de entradas são pré-requisitos inegociáveis. Para aprofundar nas práticas de observabilidade e métricas de produção, consulte os capítulos sobre [Produção e evals](/capitulos/producao-evals) e [Segurança e avaliação](/capitulos/seguranca-avaliacao).

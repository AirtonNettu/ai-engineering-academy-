## Um modelo estima distribuições

Um modelo de linguagem causal estima a distribuição do próximo token condicionado aos tokens anteriores. Ele não recupera necessariamente uma frase de um banco de respostas. Durante inferência, os pesos aprendidos permanecem fixos no uso habitual. A cada passo, o modelo produz logits; uma estratégia de decodificação transforma esses valores em uma escolha de token.

Isso explica por que uma frase gramatical pode ser falsa. O objetivo de treinamento e o processo de geração não equivalem a verificar fatos em fontes. RAG e ferramentas podem fornecer evidências, mas o sistema ainda precisa avaliar se a resposta está apoiada nelas.

## Tokens não são palavras

O tokenizer transforma texto em ids de um vocabulário. Uma palavra pode ser um token, vários fragmentos ou combinar-se com espaços. A mesma ideia em idiomas diferentes pode consumir quantidades diferentes de tokens. Não estime o tamanho de uma chamada contando palavras como se a relação fosse exata.

```text
Texto → tokenizer → ids → embeddings → blocos transformer
                                      ↓
                    token escolhido ← logits
```

Esse desenho omite detalhes específicos da arquitetura. Não é uma execução real e não fornece uma tokenização universal. Use o tokenizer do modelo escolhido quando precisar de contagem precisa.

## Embeddings e posição

O embedding de entrada mapeia um id para um vetor aprendido. Informações de posição são incorporadas pelo mecanismo usado pelo modelo, como codificações posicionais ou RoPE. Sem um mecanismo de posição, a atenção por si só não representa a ordem da mesma maneira que uma sequência textual requer.

Não confunda o embedding interno de um token com o vetor de uma sentença produzido por um modelo de embeddings para busca semântica. Ambos são vetores, mas têm treinamento, dimensões e usos diferentes. Dois modelos podem produzir vetores com o mesmo tamanho e espaços incompatíveis.

## Atenção e contexto

Em um transformer causal, cada posição atende a posições permitidas pela máscara causal. Queries e keys determinam pesos de atenção; values são combinados com esses pesos. Camadas adicionais, conexões residuais e normalização transformam a representação. Atenção não deve ser interpretada automaticamente como uma explicação causal fiel da decisão.

A janela de contexto limita a sequência que o sistema pode processar. Instruções, histórico, trechos recuperados, descrições de ferramentas e saída competem por orçamento. Uma janela nominal grande não garante uso igualmente bom de toda informação inserida. A ordem, a redundância e a relevância afetam o comportamento.

## Prefill e decodificação

No prefill, o modelo processa o prompt. Na decodificação, gera tokens sucessivos usando o estado permitido pela implementação, frequentemente com cache de keys e values. O cache reduz recomputação, mas consome memória que cresce com o contexto, a arquitetura e a precisão utilizada.

Latência até o primeiro token e taxa de tokens por segundo medem partes diferentes da experiência. Batching, quantização, comprimento de entrada e hardware alteram esses números. Não há um número universal de desempenho que sirva para todo modelo.

## Temperatura não é um controle de verdade

Temperatura altera a distribuição usada na amostragem; top-p restringe o conjunto de candidatos por massa de probabilidade. Reduzir variabilidade pode facilitar testes, mas não transforma uma resposta em fato. Mesmo temperatura zero pode não garantir resultados idênticos em todos os servidores e hardwares.

Um teste determinístico de integração pode verificar que o backend envia `stream: false` e interpreta o JSON corretamente. Uma avaliação do modelo precisa de casos representativos, rubricas e registro de versão do modelo, prompt e configuração.

## Treinamento, fine-tuning e RAG

Treinamento ajusta pesos a partir de dados e uma função objetivo. Fine-tuning continua esse ajuste para uma tarefa ou distribuição. RAG fornece informações no contexto durante a inferência. Eles resolvem problemas diferentes: conteúdo que muda frequentemente costuma ser mais simples de atualizar no índice do que em pesos, mas recuperação ruim pode entregar contexto incorreto.

Antes de escolher uma técnica, escreva o erro que quer reduzir: falta de informação atual, formato inadequado, incapacidade de seguir um domínio ou latência excessiva. Meça uma linha de base. A técnica deve responder a um problema observado.

## Prática guiada

No diagrama, percorra texto, tokens, transformer e decodificação. Depois leia o adaptador do projeto FastAPI: o backend não implementa um transformer; ele delega inferência ao Ollama. Manter essa fronteira clara ajuda a distinguir AI Application Engineering de desenvolvimento e treinamento de modelos.

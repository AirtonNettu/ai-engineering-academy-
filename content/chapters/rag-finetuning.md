## Fundamentação

API de LLM, RAG e fine-tuning resolvem problemas diferentes. Uma API é uma interface de acesso a um modelo: o consumidor envia entrada e recebe saída conforme um contrato. RAG recupera evidências externas e as acrescenta ao contexto durante a inferência. Fine-tuning ajusta parâmetros de um modelo com exemplos adicionais. Treinamento do zero inicia um processo muito mais amplo de aprendizagem de parâmetros, normalmente com requisitos elevados de dados e computação.

A primeira pergunta não deve ser qual técnica parece mais avançada, mas qual erro precisa diminuir. Se o sistema não sabe uma política publicada ontem, atualizar uma base consultável pode ser mais adequado que ajustar pesos. Se ele recebe os fatos certos, mas insiste em um formato inadequado, melhorar instrução, validação ou adaptação supervisionada pode ser relevante. Se o problema é permissão, nenhuma dessas técnicas substitui autorização no código.

Imagine atendimento de uma empresa com documentos que mudam semanalmente. RAG facilita associar a resposta à versão do documento e removê-la do índice. Isso não garante que o modelo use a evidência corretamente. Fine-tuning com conversas pode ajudar estilo e comportamento, mas não cria uma base factual consultável e atualizável por registro. Dados memorizados nos pesos são mais difíceis de localizar, corrigir e apagar seletivamente.

Essas abordagens podem coexistir. Um modelo adaptado a um domínio pode receber contexto recuperado por um sistema RAG. O custo e a complexidade da combinação precisam ser justificados por avaliação. Comece com um baseline simples, como modelo existente, instrução clara e um conjunto pequeno de testes. Compare com [RAG](/capitulos/rag), [treinamento](/capitulos/treinamento-avaliacao) e [inferência](/capitulos/llm-inferencia) sem tratar uma técnica como substituta universal das outras.

## Funcionamento intermediário

Um desenho experimental separa perguntas respondíveis pelos documentos, perguntas fora de escopo, conflitos entre fontes e casos de autorização. Avalie se o retriever encontra a passagem, se ela cabe no contexto e se a resposta é apoiada nela. Uma falha na recuperação pede investigação diferente de uma resposta inventada apesar de evidência correta. Misturar todas as falhas em uma nota média dificulta escolher a intervenção.

Fine-tuning supervisionado minimiza uma perda nos exemplos de adaptação. Para geração causal, a perda costuma somar log-probabilidades negativas dos tokens alvo, conforme a máscara de treinamento. Escolher quais tokens contribuem para a perda altera o comportamento aprendido. Dados duplicados, respostas ruins e templates inconsistentes podem dominar o sinal. Separar validação por origem e tempo reduz risco de avaliar memorização de exemplos quase idênticos.

Adaptação com parâmetros eficientes, como LoRA, adiciona atualizações de baixa ordem em matrizes selecionadas. Uma forma simplificada é W' = W + BA, com A e B menores que uma atualização completa de W. Isso reduz parâmetros treináveis, mas não elimina memória de execução, curadoria de dados nem risco de overfitting. Compatibilidade de checkpoint, tokenizer e template de chat continua necessária. Misturar versões pode invalidar uma comparação aparentemente justa.

No RAG, a intervenção correspondente envolve corpus, chunking, embeddings, busca híbrida, reranking e seleção. O [Embedding Explorer](/laboratorios/embeddings) e sua [implementação](/laboratorios/embeddings?codigo=1) permitem conferir cosseno e ranking com dados didáticos. Não executam fine-tuning ou ingestão real. Para cada hipótese, altere um componente controlado e registre versões de todos os demais. Caso contrário, não será possível atribuir melhora a uma causa plausível.

## Análise avançada

Custo total inclui preparação, avaliação, operação e manutenção. Um modelo adaptado menor pode reduzir custo por chamada, mas exige controlar artefatos e atualizar o processo de adaptação. Um RAG pode dispensar treino, mas acrescenta índices, ingestão, autorização e monitoramento de frescor. Estime custo por tarefa concluída com qualidade aceitável, incluindo recusas e revisões humanas. Comparar apenas preço por token omite falhas que geram retrabalho.

Há limites de privacidade em ambas as abordagens. RAG pode expor documentos pelo contexto ou por caches; fine-tuning pode memorizar exemplos sensíveis. Avalie licença e base legal dos dados, aplique minimização e mantenha política de exclusão coerente com derivados e checkpoints. Um contrato com provedor não deve ser inferido a partir da existência de uma API: verifique retenção, treinamento com dados do cliente e controles aplicáveis ao serviço escolhido.

Um bom critério de decisão pode exigir não inferioridade em segurança, melhora mensurável na tarefa e custo operacional sustentável. Defina a margem antes de testar muitas variantes. Reserve casos finais que não orientaram ajustes e registre incerteza. Um juiz por LLM pode acelerar triagem, mas precisa de validação humana, controle de viés e evidências. Não use concordância entre dois modelos como prova de verdade factual.

O entregável inclui tabela de falhas, baseline, dados versionados, política de abstenção e plano de rollback. Consulte o artigo original de [RAG](https://arxiv.org/abs/2005.11401), a documentação [PEFT](https://huggingface.co/docs/peft/index) e [Transformers](https://huggingface.co/docs/transformers/index) para detalhes de implementação. Essas referências não significam que a Academy tenha treinado ou publicado um modelo. Continue em [evals de produção](/capitulos/producao-evals) para decidir quando uma melhora offline justifica expor comportamento novo a usuários.

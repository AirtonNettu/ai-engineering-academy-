## Fundamentação

A operação de modelos de linguagem em ambientes de alta concorrência exige a compreensão precisa da física que governa a execução em aceleradores gráficos (GPUs). A inferência autoregressiva de LLMs opera sob dois regimes computacionais radicalmente distintos entre suas fases:

1. **Fase de Prefill (Processamento do Prompt):** O modelo processa todos os tokens de entrada simultaneamente, calculando projeções de atenção e representações intermediárias em matrizes densas. Essa etapa exibe alta intensidade aritmética — razão entre operações de ponto flutuante executadas (FLOPs) e bytes transferidos da memória de alta largura de banda (HBM). Nesse regime, a GPU opera próxima de sua capacidade teórica máxima de processamento (_compute-bound_);
2. **Fase de Decode (Geração de Novos Tokens):** Novos tokens são produzidos sequencialmente, um a cada passo de inferência. Para gerar um único token, a GPU precisa ler integralmente todas as matrizes de pesos do modelo da VRAM para os registradores dos processadores de fluxo (_Streaming Multiprocessors_ — SMs), gerando baixa intensidade aritmética (frequentemente inferior a 1 FLOP por byte transferido). Nesse regime, a GPU opera estritamente limitada pela largura de banda de memória (_memory-bound_).

Essa assimetria fundamental dita que a latência de geração de um token é determinada quase exclusivamente pela velocidade com que os pesos do modelo e o cache de chaves e valores (_KV-Cache_) transitam entre a memória da GPU e as unidades de computação. Consequentemente, estratégias ingênuas de servir modelos — como alocação estática de memória por requisição e processamento de lotes tradicionais (_static batching_) — resultam em ociosidade massiva dos núcleos de computação e desperdício de VRAM por fragmentação interna.

O projeto de infraestrutura de serving busca maximizar o throughput global (tokens por segundo gerados pelo cluster) sem degradar o tempo até o primeiro token (_Time to First Token_ — TTFT) nem a latência entre tokens sucessivos (_Time Per Output Token_ — TPOT). Para acompanhar como essas grandezas variam sob diferentes quantizações e hardwares reais, consulte as medições no [Observatório de IA](/observatorio).

## Funcionamento intermediário

A principal barreira histórica para a escalabilidade de servidores de LLMs residia no gerenciamento do KV-Cache. Em implementações convencionais, o servidor precisa pré-alocar um bloco de memória contíguo na VRAM dimensionado para a janela de contexto máxima suportada pelo modelo (por exemplo, 8.192 ou 32.768 tokens). Como a maioria das interações reais utiliza apenas uma fração desse limite, até 60% a 80% da memória de GPU ficava bloqueada por espaço reservado e nunca utilizado, gerando fragmentação interna severa. Além disso, a memória não podia ser compartilhada entre sequências com prefixos comuns.

A arquitetura _PagedAttention_, introduzida pelo framework vLLM e inspirada no gerenciamento de memória virtual de sistemas operacionais, solucionou esse problema dividindo o KV-Cache em blocos físicos de tamanho fixo (geralmente 16 ou 32 tokens). As sequências em andamento não exigem espaço contíguo: uma tabela de páginas lógica mapeia posições sequenciais de tokens para blocos físicos arbitrários dispersos na VRAM. Quando um novo bloco se faz necessário, o alocador dinâmico reserva uma página livre; ao término da geração, as páginas são imediatamente devolvidas ao pool compartilhado.

```python
# Mapeamento simplificado de páginas lógicas para blocos físicos no PagedAttention
class BlockManager:
    def __init__(self, block_size: int = 16):
        self.block_size = block_size
        self.page_table: dict[str, list[int]] = {}  # req_id -> lista de índices físicos

    def append_token(self, req_id: str, token_idx: int) -> int:
        """Aloca nova página na GPU apenas quando o bloco atual é preenchido."""
        needed_blocks = (token_idx // self.block_size) + 1
        current_blocks = len(self.page_table.setdefault(req_id, []))
        if needed_blocks > current_blocks:
            new_physical_block_id = self.allocate_free_gpu_page()
            self.page_table[req_id].append(new_physical_block_id)
        return self.page_table[req_id][-1]

    def allocate_free_gpu_page(self) -> int:
        return 42 # Retorna índice de bloco livre no pool compartilhado da VRAM
```

Complementando a paginação de memória, o agendamento contínuo em lotes (_Continuous Batching_) atua a nível de passo de iteração individual em vez de ciclo de vida de requisição. Em um lote tradicional, todo o batch deve aguardar a conclusão da sequência mais longa antes de liberar a GPU. No Continuous Batching, assim que uma requisição emite o token de parada (`<eos>`), suas páginas de KV-cache são liberadas e uma nova requisição em espera entra imediatamente no próximo passo de decode do lote ativo.

O mecanismo de _Chunked Prefill_ resolve a interferência mútua entre prefill e decode. Em cargas com prompts extensos, o processamento de entrada pode bloquear a geração de tokens das requisições já conectadas, introduzindo engasgos perceptíveis na experiência de streaming. Ao particionar o prefill em pedaços (_chunks_) de tamanho fixo (ex: 512 tokens), o escalonador intercala blocos de prefill com passos regulares de decode, estabilizando a variabilidade do TPOT.

## Análise avançada

Quando um modelo excede a capacidade de memória de uma única GPU ou quando a latência de decode precisa ser reduzida além dos limites físicos de largura de banda de um barramento isolado, impõe-se a divisão do modelo entre múltiplos aceleradores via paralelismo distribuído.

- **Paralelismo Tensorial (_Tensor Parallelism_ — TP):** Divide as operações matriciais de atenção e camadas feed-forward horizontal e verticalmente entre GPUs conectadas por links de altíssima velocidade (NVLink ou NVSwitch). Em cada camada do Transformer, uma operação coletiva All-Reduce sincroniza as saídas parciais entre todos os aceleradores do grupo. Devido à frequência extrema de comunicação (múltiplas vezes por token gerado), o paralelismo tensorial só é viável dentro do mesmo nó físico;
- **Paralelismo de Pipeline (_Pipeline Parallelism_ — PP):** Distribui camadas sequenciais completas do modelo entre diferentes nós de um cluster interconectados por rede InfiniBand ou RoCE. Embora exija menor largura de banda de interconexão, introduz ociosidade temporária nos processadores (_pipeline bubbles_), sendo mais comum em sessões de treinamento massivo do que em inferência de baixa latência.

Uma das técnicas de aceleração algorítmica mais eficazes em produção é a decodificação especulativa (_Speculative Decoding_). Um modelo rascunho (_Draft Model_) compacto e ultra-rápido gera $K$ tokens candidatos em passos sucessivos com baixíssimo custo. Em seguida, o modelo alvo (_Target Model_) executa uma única passagem forward densa de validação paralela sobre todos os $K$ candidatos, aceitando tokens que satisfaçam critérios estritos de amostragem probabilística via amostragem com rejeição (_rejection sampling_). Esse mecanismo permite gerar múltiplos tokens por ciclo de acesso à memória principal da GPU sem alterar em absolutamente nada a distribuição estatística da saída do modelo alvo.

Para inspecionar o fluxo detalhado de validação de tokens e sincronização de KV-cache na decodificação especulativa, acesse a análise interativa no [Atlas de Arquiteturas: Speculative Decoding](/arquiteturas?diagrama=speculative). A consolidação do projeto deve integrar monitoramento de filas, controle de admissão (_admission control_) para prevenir saturação de memória e políticas de fallback documentadas em [HTTP, APIs e contratos](/capitulos/http-apis) e [inferência eficiente](/capitulos/inferencia-eficiente).

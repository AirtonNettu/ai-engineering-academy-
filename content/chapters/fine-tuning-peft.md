## Fundamentação

O fine-tuning completo (_Full Fine-Tuning_) de modelos de linguagem contemporâneos exige atualizar e armazenar gradientes e estados de otimizador para dezenas ou centenas de bilhões de parâmetros. Para um modelo de 70 bilhões de parâmetros em ponto flutuante de 16 bits (FP16), apenas o armazenamento dos pesos consome aproximadamente 140 GB de memória de GPU (VRAM). Quando se somam os gradientes (outros 140 GB) e os estados do otimizador AdamW (que mantém o primeiro e segundo momentos em FP32, consumindo mais 560 GB), o treinamento exige múltiplos nós com aceleradores de alto desempenho e interconexões ultra-rápidas como NVLink, tornando o processo proibitivo para a esmagadora maioria das equipes de engenharia.

As técnicas de Adaptação Eficiente em Parâmetros (_Parameter-Efficient Fine-Tuning_ — PEFT) solucionam esse gargalo partindo da premissa de que as matrizes de pesos aprendidas durante o pré-treinamento residem em um subespaço intrínseco de baixa dimensão (_intrinsic rank_). Em vez de modificar a matriz de peso densa original $W_0 \in \mathbb{R}^{d_{\text{out}} \times d_{\text{in}}}$, o método LoRA (_Low-Rank Adaptation_) congela $W_0$ e decompõe a atualização de peso $\Delta W$ no produto de duas matrizes de baixo rank $B \in \mathbb{R}^{d_{\text{out}} \times r}$ e $A \in \mathbb{R}^{r \times d_{\text{in}}}$, onde o rank $r \ll \min(d_{\text{in}}, d_{\text{out}})$.

A operação de passagem para a frente (_forward pass_) para uma ativação de entrada $x$ é formulada linearmente como:

$$h = W_0 x + \Delta W x = W_0 x + \frac{\alpha}{r} (B \cdot A) x$$

O hiperparâmetro $\alpha$ é uma constante de escala que permite calibrar a magnitude da contribuição do adaptador sobre a representação base congelada, facilitando a transição entre diferentes valores de rank sem necessidade de reajustar exaustivamente a taxa de aprendizado (_learning rate_). Para experimentar como ativações e gradientes se propagam em matrizes de peso durante o treino, utilize o [Neural Network Training Lab](/laboratorios/neural-network).

A matriz $A$ é tipicamente inicializada a partir de uma distribuição normal gaussiana $\mathcal{N}(0, \sigma^2)$, enquanto a matriz $B$ é iniciada com zeros exatos. Essa inicialização garante que no início do treinamento $\Delta W = 0$, preservando integralmente o comportamento e o conhecimento original do modelo base até que os primeiros passos de gradiente comecem a moldar a adaptação para o domínio desejado.

## Funcionamento intermediário

O método QLoRA (_Quantized Low-Rank Adaptation_) aprofundou drasticamente a eficiência de hardware ao introduzir três inovações complementares: o tipo de dados NormalFloat 4-bit (NF4), a quantização dupla (_Double Quantization_ — DQ) e os otimizadores paginados (_Paged Optimizers_). A quantização NF4 é informacionalmente ótima para pesos neurais pré-treinados com distribuição aproximadamente gaussiana, segmentando a curva de densidade de probabilidade em 16 intervalos de massa idêntica, o que minimiza o erro médio de quantização em comparação a tipos inteiros uniformes (como INT4).

A quantização dupla atua sobre as próprias constantes de escala da quantização de primeiro nível. Em vez de armazenar números de 32 bits para cada bloco de 64 pesos quantizados (o que representaria 0.5 bit por parâmetro apenas para constantes de escala), a técnica aplica uma segunda rodada de quantização FP8 sobre essas constantes, reduzindo a pegada de memória auxiliar de metadados para apenas 0.127 bit por parâmetro. Esse ganho percentual aparentemente modesto é decisivo para viabilizar o carregamento de modelos de 70B em uma única GPU de 48 GB ou nós de 2x 24 GB.

```python
# Formulação vetorial da atualização de baixo rank (LoRA)
import numpy as np

def lora_forward(x: np.ndarray, w0: np.ndarray, a: np.ndarray, b: np.ndarray, alpha: float, r: int) -> np.ndarray:
    """Calcula a saída com decomposição matricial de baixo rank."""
    # Saída do modelo base congelado
    base_out = np.dot(x, w0.T)
    # Projeção de baixo rank: x -> r dimensões -> d_out dimensões
    lora_proj = np.dot(x, a.T)
    lora_out = np.dot(lora_proj, b.T)
    # Escalonamento pelo fator alpha / r
    return base_out + (alpha / r) * lora_out
```

Os otimizadores paginados utilizam o gerenciador de memória virtual unificada da arquitetura CUDA para descarregar (_offload_) automaticamente os estados do otimizador AdamW da VRAM da GPU para a RAM do sistema hospedeiro quando ocorrem picos temporários de alocação de ativações durante a retropropagação (_backpropagation_). Embora o tráfego pelo barramento PCIe adicione latência marginal aos passos de atualização, o mecanismo impede falhas catastróficas por estouro de memória (_Out-Of-Memory_ — OOM), garantindo convergência estável em lotes de treinamento variáveis.

A seleção dos módulos alvo no modelo determina a capacidade de adaptação. Inicialmente, o LoRA era aplicado apenas às matrizes de projeção de atenção ($W_q$ e $W_v$). Práticas contemporâneas demonstram que expandir os adaptadores para todas as matrizes lineares dos blocos Transformer — incluindo projeções de saída de atenção ($W_o$) e as matrizes densas das camadas feed-forward ($W_1, W_2, W_3$) — recupera a expressividade do fine-tuning completo com apenas 1% a 2% de parâmetros treináveis.

## Análise avançada

No dimensionamento de infraestrutura para fine-tuning em produção, o cálculo preciso do orçamento de VRAM previne falhas operacionais e custos desnecessários em instâncias de nuvem. A memória total consumida durante uma sessão de treino via QLoRA é dada pela soma de:

1. **Memória dos pesos quantizados:** Para um modelo de $N$ bilhões de parâmetros em NF4, o consumo basal é $N \times 0.5 \text{ GB}$ (ex: 35 GB para um modelo de 70B);
2. **Memória dos parâmetros treináveis e seus gradientes:** Depende do rank $r$ escolhido e do número de camadas adaptadas, consumindo tipicamente menos de 1 GB a 2 GB em FP16;
3. **Memória do otimizador:** Como o AdamW rastreia apenas os adaptadores treináveis em FP32, o overhead é restrito a $8 \text{ bytes} \times \text{parâmetros LoRA}$;
4. **Memória de ativações:** Varia linearmente com o tamanho do batch e quadraticamente com o comprimento da sequência de contexto, sendo mitigada pelo uso de _Activation Checkpointing_ (recomputação de ativações no backward pass).

Na etapa de implantação em produção (_deployment_), o engenheiro enfrenta a decisão entre fundir os pesos (_merge_) ou servir os adaptadores dinamicamente (_Multi-LoRA serving_). A fusão soma a matriz multiplicada $\Delta W = \frac{\alpha}{r} (B \cdot A)$ diretamente à matriz $W_0$, resultando em um modelo denso sem qualquer overhead de latência adicional durante a inferência. Contudo, essa abordagem perde a flexibilidade de atender múltiplos clientes ou domínios especializados com uma única réplica do modelo base na VRAM.

Servidores modernos de inferência como vLLM e SGLang suportam serving multi-LoRA com paginação de adaptadores. Múltiplos conjuntos de pesos $A$ e $B$ residem na memória da GPU e são ativados dinamicamente com base no cabeçalho ou metadados da requisição HTTP. Enquanto o modelo base compartilhado permanece estático na VRAM, cada requisição aplica seu respectivo adaptador em tempo de execução, permitindo consolidar centenas de especializações departamentais (jurídico, suporte técnico, programação) em um único cluster otimizado. Para conectar a inferência desse modelo aos fluxos de entrega de software, consulte o capítulo sobre [HTTP, APIs e contratos](/capitulos/http-apis) e o catálogo de métricas no [Observatório de IA](/observatorio).

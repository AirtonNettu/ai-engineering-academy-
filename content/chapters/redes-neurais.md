## Fundamentação

Uma rede neural é uma função parametrizada que transforma entradas em previsões. Um neurônio artificial calcula uma soma ponderada e aplica uma ativação: z = w₁x₁ + w₂x₂ + b e a = f(z). Os pesos w controlam quanto cada entrada contribui; o viés b desloca o ponto em que a unidade responde. Não há entendimento humano escondido nessa operação. Aprender significa escolher parâmetros que reduzam um erro definido sobre exemplos, sob hipóteses sobre dados futuros.

Imagine prever consumo de energia a partir de temperatura e ocupação. Unidades diferentes podem aprender combinações distintas dessas variáveis. Uma camada linear sozinha não representa qualquer relação: empilhar transformações lineares sem ativação continua produzindo uma transformação linear. Ativações não lineares permitem compor padrões mais ricos. ReLU calcula max(0,z); sigmoid calcula 1/(1+exp(-z)), limitando a saída ao intervalo entre zero e um. Essa saída só tem interpretação probabilística adequada quando objetivo, dados e calibração sustentam tal uso.

No laboratório, a rede pequena recebe dois números e produz uma saída. Isso torna visíveis os cálculos sem sugerir que alguns neurônios simulam um LLM. Conexões representam multiplicações por pesos; nós representam somas e ativações. A largura da linha não mede importância causal universal. Um peso pequeno pode integrar um caminho relevante, e mudanças de escala da entrada mudam os valores que os parâmetros precisam assumir.

Antes de treinar, diferencie entrada, alvo e previsão. O alvo é fornecido pelo dataset; a previsão é calculada pela rede. A função de perda compara ambos. Para regressão simples, erro quadrático médio é L = Σ(ŷ−y)²/N, onde N é a quantidade de exemplos. Ele penaliza grandes erros mais intensamente, mas também fica sensível a valores extremos. Escolher a perda já expressa uma decisão sobre o que o sistema considera ruim.

## Funcionamento intermediário

O forward percorre as camadas e guarda valores necessários ao gradiente. Para uma camada densa, Z = XW + b; a multiplicação exige dimensões compatíveis. Se X contém B exemplos e d atributos, W transforma d atributos em h unidades, produzindo uma matriz B por h. O viés é aplicado a cada exemplo. Escrever dimensões ao lado de cada tensor evita erros que uma biblioteca pode esconder por broadcasting válido, porém indesejado.

Backpropagation aplica a regra da cadeia ao grafo dessas operações. No neurônio com sigmoid, da/dz = a(1−a). Para uma perda quadrática individual, dL/da = 2(a−y); portanto dL/dwᵢ = 2(a−y)a(1−a)xᵢ. Isso explica tanto o sinal quanto a escala da atualização. Se xᵢ é zero, aquele exemplo não altera diretamente o respectivo peso; o viés ainda pode mudar. A derivada não avalia moralmente a previsão: mede sensibilidade local da perda ao parâmetro.

Gradiente descendente atualiza θ ← θ − η∇L, onde θ reúne pesos e vieses e η é a taxa de aprendizado. Um passo muito pequeno demora; um passo grande pode atravessar regiões úteis e aumentar a perda. A superfície de uma rede não é em geral convexa, e reduzir erro de treino não garante melhor comportamento fora da amostra. Escalonar atributos, controlar inicialização e acompanhar métricas ajuda a interpretar trajetórias de otimização.

Abra o [laboratório de rede neural](/laboratorios/neural-network) e altere a taxa de aprendizado após resetar o estado. Compare o valor inicial e o valor final da perda para o mesmo orçamento de passos. O código em [implementação matemática](/laboratorios/neural-network?codigo=1) é a referência executável da demonstração. Registre parâmetros e observações localmente; este artigo não afirma ter executado uma medição específica nessa interface.

## Análise avançada

Gradientes podem desaparecer quando ativações saturam e multiplicamos muitas derivadas pequenas. Também podem crescer excessivamente, tornando a atualização instável. ReLU evita parte da saturação positiva, mas unidades que ficam sempre na região negativa podem deixar de receber gradiente. Normalização, inicialização e conexões residuais tratam problemas diferentes; não são curas intercambiáveis. Na rede pequena, inspecionar derivadas costuma ensinar mais que acrescentar camadas.

Uma verificação forte do backprop compara o gradiente analítico com diferenças finitas: [L(θ+ε)−L(θ−ε)]/(2ε). Use ε pequeno, mas não tão pequeno que arredondamento domine. Compare erros absoluto e relativo, evitando pontos não diferenciáveis como z=0 da ReLU. Esse teste detecta sinais invertidos, médias aplicadas duas vezes e índices trocados. Ele verifica cálculo local; não comprova generalização nem convergência em qualquer dataset.

Em PyTorch, tensores com requires_grad registram operações; loss.backward() acumula gradientes. optimizer.zero_grad() é necessário entre passos habituais, antes de backward, para não acumular atualizações de batches diferentes por acidente. optimizer.step() altera parâmetros; model.eval() muda comportamento de certas camadas, mas não desliga autograd. Para inferência sem gradientes, use o contexto apropriado. Essas distinções são importantes quando se migra da matemática manual para uma biblioteca.

A demonstração tem orçamento finito e estado pequeno para funcionar em dispositivos modestos. Não estima consumo de GPU, capacidade de um transformer nem dificuldade de treinar em dados reais. Continue em [treinamento e avaliação](/capitulos/treinamento-avaliacao), observe a arquitetura [LLM](/arquiteturas?diagrama=llm) e compare a composição linear com [attention](/capitulos/attention-transformers). A referência oficial de [otimização no PyTorch](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html) descreve o ciclo de perda, backward e atualização; adapte os detalhes à versão instalada.

## Qualidade é uma propriedade do sistema

Um modelo forte não garante uma aplicação confiável. O resultado depende de entrada, contexto, permissões, ferramentas, recuperação e apresentação. Avalie o caminho completo. Uma integração pode passar em testes HTTP e ainda produzir respostas sem fundamento; um modelo pode acertar uma pergunta e ainda vazar informação em outra.

Separe testes determinísticos de avaliações probabilísticas. Os primeiros verificam contratos e falhas reproduzíveis; as segundas usam casos, rubricas e amostras para estimar comportamento. Ambos devem registrar versões para permitir comparação.

## Construa uma linha de base

Selecione perguntas representativas do domínio, incluindo casos difíceis e sem resposta. Para cada uma, defina o que torna a resposta aceitável e quais erros são graves. Registre modelo, configuração, prompt, fontes, latência e resultado. Evite substituir critérios por uma nota genérica de um juiz automático.

Um LLM como avaliador também erra, pode favorecer verbosidade e sofrer viés. Calibre com revisão humana e mantenha exemplos de desacordo. Dados de teste não devem ser copiados para o prompt de produção só para aumentar a pontuação.

## Prompt injection é uma quebra de fronteira

Texto recuperado, páginas web e saídas de ferramentas são dados não confiáveis. Um atacante pode colocar instruções nesses dados para tentar alterar a tarefa. Delimitar texto ajuda, mas não garante isolamento. A defesa inclui reduzir privilégios, validar saídas e autorizar ações fora do modelo.

Uma ferramenta que lê documentos não precisa escrever arquivos do sistema. Uma ferramenta de busca não precisa de credenciais de deploy. Defina permissões mínimas por capacidade e revise os argumentos antes de qualquer efeito externo importante.

## MCP e agentes

MCP padroniza interfaces entre clientes e servidores que oferecem recursos, prompts e ferramentas. Ele não concede confiança automática ao servidor nem elimina a necessidade de autorização. A compatibilidade depende de versão do protocolo e recursos suportados, não apenas do nome do produto.

Um agente combina um modelo com um ciclo de decisão e ferramentas. Quanto maior o conjunto de ações, maior a superfície de falhas. Use orçamento de passos, tempo e chamadas; registre decisões sem expor segredos. Orquestração multiagente adiciona coordenação e comunicação, não uma garantia de correção.

## Skills de terceiros

Uma skill pode conter instruções, scripts e solicitações de permissões. Antes de instalar, revise origem, licença, manutenção, código executável e destinos de rede. Não cole tokens em prompts nem execute comandos só porque um catálogo os recomenda. O catálogo da Academy aponta fontes; ele não certifica itens externos.

No caso de skills.sh, o site funciona como diretório externo. Verifique a documentação do autor e a compatibilidade no ambiente real. A Academy não inventa comandos de instalação nem garante funcionamento de todos os itens listados lá.

## Observabilidade sem vigilância

Métricas úteis incluem taxa de erro por fronteira, latência por etapa, tamanho de entrada e saída e saturação de recursos. Logs de prompts podem conter dados pessoais e segredos. Defina retenção e minimização antes de registrar conteúdo. Redigir um campo depois de enviá-lo a terceiros já não desfaz o envio.

A plataforma pública não inclui analytics nem envia consultas de busca para serviços externos. Progresso e tema ficam no navegador e podem ser apagados. Isso reduz operação e facilita o orçamento de R$ 0, mas não sincroniza estudo entre dispositivos.

## Operação e deploy

Um site estático pode continuar disponível independentemente de n8n e Ollama. A automação editorial deve produzir propostas versionadas, nunca publicar texto gerado sem revisão. Branches e pull requests preservam diff, fontes e decisões.

Para o exemplo Python, testes mockados são uma etapa anterior à validação em hardware real. Um deploy público exige autorização, limites de uso e observação da capacidade disponível. Para a Academy, Cloudflare Pages é um destino futuro documentado, sem pipeline automático de produção.

## Exercício de revisão

Escolha uma competência da trilha de LLMOps e escreva um modo de falha verificável. Por exemplo: se o modelo retorna um corpo inválido com status 200, o backend deve responder 502 sem vazar a resposta bruta. Esse é um teste de engenharia. Para uma pergunta factual, defina fontes esperadas e um critério de abstenção: esse é um caso de avaliação.

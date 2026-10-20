## Fundamentação

Um sistema de IA pronto para produção precisa cumprir um contrato útil dentro de riscos conhecidos. Gerar texto em uma demonstração não comprova confiabilidade, segurança ou adequação ao usuário. Especifique o que pode responder, quais ações pode executar, quando deve se abster e como alguém corrige uma falha. Prontidão depende do domínio: uma sugestão de título e uma decisão sobre crédito exigem controles e responsabilidades diferentes.

Avaliação de sistemas não determinísticos combina testes de código e análise de comportamento. Um teste unitário pode verificar que um timeout vira erro público controlado. Uma avaliação de resposta precisa de casos representativos, critérios e evidências. Não abandone testes determinísticos porque existe um modelo; eles protegem contratos, cálculos, autorização e serialização. Também não confunda mocks de sucesso com prova de que um modelo responde corretamente em cenários reais.

Hallucination descreve saídas sem apoio adequado ou factualmente incorretas, conforme a tarefa. Uma resposta fluente pode conter um número inventado ou uma citação inexistente. RAG fornece evidências possíveis, mas não obriga seu uso fiel. Rubricas devem separar correção, apoio em fonte, cobertura da pergunta e segurança. Uma recusa apropriada em pergunta sem evidência pode ser melhor que uma resposta aparentemente completa.

Defina uma unidade de avaliação próxima à decisão de produto. Para um assistente de documentação, pode ser responder à pergunta citando uma passagem acessível e atual. Para ferramentas, inclui escolher operação correta e não ultrapassar autorização. Compare [RAG](/capitulos/rag), [agentes](/capitulos/mcp-agentes) e a implementação real de [testes HTTP](/projetos/fastapi-ollama?file=tests/test_chat.py). Cada artefato cobre uma fronteira distinta.

## Funcionamento intermediário

Uma suite começa com casos comuns, casos difíceis e casos de risco. Versione entrada, contexto, saída esperada quando houver, rubrica e justificativa da anotação. Para textos com várias respostas aceitáveis, avalie propriedades observáveis em vez de exigir igualdade literal. Para JSON, valide schema e semântica de campos; para citações, verifique existência e suporte à afirmação. Uma string que contém o id da fonte ainda pode usá-la de modo incorreto.

Separe conjunto de desenvolvimento do conjunto final. Ajustar prompt repetidamente olhando o mesmo teste pode produzir overfitting editorial. Inclua casos novos ao longo do tempo sem apagar o histórico. Métricas agregadas precisam de contagens e cortes por categoria. Se um risco raro tem alto impacto, acompanhe-o com uma condição específica de bloqueio, em vez de diluí-lo numa média. Ausência de falhas em poucos exemplos não prova risco zero.

Observabilidade acompanha operação com minimização de dados. Registre latência, categoria de erro, versão de modelo, configuração, recuperação e resultado de ferramenta, quando necessário. Identificadores de correlação ajudam a reconstruir fluxo sem gravar prompts inteiros. Conteúdo sensível pode aparecer em logs de exceção e traces de terceiros; revise também esses caminhos. O site público da Academy não envia telemetria e não depende de um serviço externo de monitoramento.

Confiabilidade inclui timeouts, limites de concorrência, filas finitas, retry com orçamento e circuit breakers quando adequados. Retry indiscriminado pode multiplicar custo e executar uma ferramenta duas vezes. Defina idempotência e diferencie falha transitória de entrada inválida. O [adaptador Ollama](/projetos/fastapi-ollama?file=app/integrations/ollama.py) demonstra timeout e tradução de falhas; ele não implementa uma plataforma distribuída, autenticação ou política completa de produção.

## Análise avançada

Segurança começa na identidade e na autorização, antes do prompt. Uma API que aceita um resource_id precisa verificar acesso ao recurso, não confiar no id sugerido pelo modelo. Prompt injection pode chegar por documentos recuperados e resultados de ferramenta. Use menor privilégio, separação entre dados e política, allowlists e validação de argumentos. Filtros textuais isolados não garantem proteção contra instruções adversariais em todos os formatos.

Um rollout precisa ser reversível. Versione prompt, modelo, índice e política como configuração identificável; mantenha uma versão anterior que possa ser restaurada. Shadow testing compara comportamento sem aplicar efeitos; canary expõe uma parcela controlada, quando privacidade e contexto permitem. Defina sinais para interromper a mudança antes de observar o resultado. A Academy não implementa esse rollout e não faz deploy automático de propostas editoriais.

Backend, dados, segurança e infraestrutura são competências conectadas. SQL ajuda a auditar fontes e permissões; Linux e redes ajudam a entender limites e conectividade; containers ajudam a empacotar ambientes, mas não tornam uma aplicação segura por si só. Cloud é uma opção de operação, não requisito de todo exercício. O pipeline editorial futuro mantém n8n e Ollama privados gerando propostas revisadas por humanos via issue e PR, sem autopublicar.

Uma checklist de decisão deve exigir baseline, evidências de qualidade, análise de risco, orçamento, recuperação e responsável operacional. Não é uma certificação universal. Consulte [OWASP GenAI](https://genai.owasp.org/) e [FastAPI — testes](https://fastapi.tiangolo.com/tutorial/testing/) para aprofundar controles e contratos. Execute localmente os testes descritos no README do projeto se quiser reproduzir o exemplo Python; este capítulo não afirma uma execução nova desses testes. Termine registrando lacunas e critérios de aceite, depois conecte decisões técnicas ao [papel profissional](/capitulos/carreira-ai-engineer) que assume sua manutenção.

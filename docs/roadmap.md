# Mapa de trabalho e cobertura

Não há divisão artificial por versões. A plataforma entrega os sistemas de leitura, busca, diagramas, trilhas, catálogo, glossário e código em conjunto.

## Entregue

- Conteúdo e schema editorial, busca e persistência local.
- Projeto FastAPI/Ollama executável e testado com transporte mockado.
- Interface pública responsiva e ferramentas interativas.
- Validações, testes, documentação e contrato de automação futura.

## Continuidade editorial

Priorizar capítulos dedicados de Git/Linux, SQL, Docker/CI e avaliação com datasets antes de ampliar tópicos avançados. Depois desenvolver capítulos próprios de embeddings/bancos vetoriais, MCP/tool calling, agentes/LangGraph e fundamentos matemáticos/PyTorch. Todo conteúdo exige fontes, exemplos reprodutíveis quando aplicável e revisão técnica.

## Trabalho que depende de configuração externa

- Domínio e publicação em Cloudflare Pages: aprovação explícita de deploy.
- Teste com modelo real: Ollama/hardware/modelo e licença adequados.
- n8n editorial: credenciais privadas de leitura/PR, fontes autorizadas e revisão do contrato operacional.
- Revisão editorial independente por especialistas e avaliação manual com tecnologias assistivas.

## Melhorias técnicas justificáveis

Prerender completo de capítulos para leitura sem JS; testes em Firefox/WebKit quando houver navegadores disponíveis; avaliação de desempenho em dispositivo físico e leitor de tela. Nenhuma delas deve criar dependência de serviço pago para a leitura.

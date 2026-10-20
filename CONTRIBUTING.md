# Contribuir

Leia AGENTS.md, docs/requirements.md e docs/content-model.md. Abra uma branch por tarefa. Nunca faça force push, merge ou deploy sem aprovação. Nenhum serviço pago ou token é necessário para desenvolver a interface.

Use Node 24+ e npm ci. Antes de enviar: npm run check e npm run test:e2e; para o exemplo, execute pytest conforme seu README. Se um navegador ou serviço externo não estiver disponível, registre o teste não executado, sem inventar resultado.

Conteúdo deve ser original em pt-BR, tecnicamente verificável e referenciar fontes autorizadas. Não copie material protegido. Explique funcionamento, limites e implementação; identifique pseudocódigo. Atualize metadados, glossário e relações quando necessário. A data de revisão deve refletir revisão efetiva. Propostas geradas com IA exigem revisão humana e fontes.

PRs devem descrever problema, comportamento, critérios cobertos e testes reais. Prefira alterações focadas e dependências justificadas. Reporte vulnerabilidades sem expor segredos em issues públicas; combine um canal privado com o mantenedor antes de compartilhar detalhes sensíveis.

Para capítulos, preserve as três camadas e relacione cartões/labs/implementações reais. Alterações de SRS ou backup precisam de casos de relógio, versão, corrupção e importação sem perda de dados. Alterações de cálculo exigem testes matemáticos, não apenas screenshots. Nunca publique um exemplo de LLM/PyTorch não executado como teste validado; identifique snippets ilustrativos. Consulte docs/issue-2-acceptance.md e docs/learning-data.md.

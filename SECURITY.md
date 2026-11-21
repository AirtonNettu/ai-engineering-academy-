# Política de segurança

Obrigado por ajudar a proteger a IA Engineer Academy.

## Como reportar vulnerabilidades

**Não publique vulnerabilidades exploráveis em issues públicas.** Utilize o recurso **Report a vulnerability** (Private Vulnerability Reporting) diretamente na aba [Security do repositório](https://github.com/AirtonNettu/ai-engineering-academy-/security/advisories/new), que está ativo e configurado como canal privado oficial. Se houver qualquer impedimento técnico no envio pelo GitHub, entre em contato privadamente com o mantenedor para orientações de divulgação coordenada, sem incluir detalhes exploráveis em público.

Inclua impacto, versão/commit, passos mínimos para reproduzir e possíveis mitigações. Não envie senhas, tokens ou dados pessoais.

## Escopo

Inclui o frontend, armazenamento local do progresso, importação/exportação de dados, dependências e exemplo Python. O projeto é educacional; demonstrações não devem ser interpretadas como garantias de segurança em produção.

Não há prazo de resposta ou programa de recompensas prometido. Correções serão avaliadas conforme gravidade e disponibilidade do mantenedor.

## Política da auditoria de dependências

O workflow `security-audit.yml` roda semanalmente, manualmente na referência
selecionada e em PRs que alterem o próprio workflow ou seu avaliador/testes.
Inclui dependências npm de desenvolvimento e o lock do exemplo Python.

- **npm:** high/critical bloqueiam; info/low/moderate geram aviso e exigem triagem,
  sem bloquear o job. O relatório completo é preservado em qualquer severidade.
- **Python:** o JSON do pip-audit não fornece severidade. Todo achado bloqueia
  até triagem; ausência de severidade não significa risco baixo. Não inferimos
  CVSS, nem ignoramos automaticamente achados sem correção disponível.
- **Falha operacional:** erro de rede/ferramenta, JSON ausente/inválido,
  dependência pulada ou divergência entre exit code e relatório bloqueiam como
  erro de ferramenta/relatório, sem afirmar que houve vulnerabilidade.
  O exit code 1 da ferramenta, isoladamente, não comprova um achado.

O avaliador retorna 0 para relatório aceito, 1 para achados bloqueantes e 2 para
erro operacional. O GitHub exibe ambos os últimos como falha, diferenciados no
resumo do job. stdout JSON, stderr e exit code original são artefatos separados,
retidos por sete dias e enviados também após falha da auditoria. Se instalação
ou setup falhar antes da auditoria, o log do Actions é a evidência; não há
relatório de varredura concluída. Job verde não significa zero achados: consulte
o resumo e os artefatos. Essa política não altera os checks obrigatórios da main.

Na triagem, registrar pacote/versão, advisory, alcance e impacto no uso do projeto,
correção/mitigação e responsável pelo acompanhamento. Achados abaixo do gate
devem entrar no backlog; achados bloqueantes requerem correção ou decisão humana
documentada antes de integração. Falhas operacionais exigem corrigir/reexecutar a
auditoria, nunca dispensa automática. Detalhes exploráveis seguem o canal privado
acima. Não há exceções automáticas nem `audit fix` neste workflow.

Contratos das ferramentas: [npm audit](https://docs.npmjs.com/cli/commands/npm-audit/)
e [pip-audit (exit codes e formato JSON)](https://github.com/pypa/pip-audit#readme).

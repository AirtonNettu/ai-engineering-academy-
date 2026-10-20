# Percurso, revisão e dados locais

## Estado e migração

O schema Zod em `src/learning/model.ts` define formato versionado de dados (a versão é do arquivo, não uma fase de produto). `academy:learning` contém `reading`, `study` e `cards`. Ao não existir registro válido, somente marcadores booleanos de `academy:progress` são reaproveitados. Os seis slugs antigos permanecem. Atualizações continuam gravando os marcadores legados para compatibilidade.

Cada percurso armazena etapa atual, etapas explicitamente concluídas e timestamp de atualização. As etapas são: leitura fundamental, intermediária, avançada, arquitetura, implementação e flashcards. Avançar sem concluir não marca sucesso. O fim da etapa de cartões requer que todos os cartões do assunto tenham ao menos uma resposta registrada; isso não comprova domínio. O estado pode ser retomado pelo artigo ou pela lista na área de dados.

Cada cartão armazena acertos/erros declarados, sequência de acertos, intervalo, última resposta e próximo vencimento. As estatísticas somam respostas realmente registradas e sinalizam quando ainda não existe taxa de acerto. Novos cartões vencem imediatamente. Um cartão respondido sai da fila de vencidos até sua próxima revisão.

## Agendamento explicável

- Erro: sequência volta a zero; nova revisão em 10 minutos.
- Primeiro acerto após início/erro: 1 dia.
- Acertos seguintes: 3, 7, 14 e 30 dias; depois permanece em 30 dias.

Um dia equivale a 86.400.000 ms. O relógio é injetado nos testes; a UI usa o relógio do dispositivo. Não é SM-2/FSRS nem uma inferência automática sobre memória. A fila atualiza o relógio periodicamente. Desmarcar “apenas novos ou vencidos” permite prática antecipada, explicitamente informada como alteração da agenda.

## Exportação e importação

JSON contém formato `ia-engineer-academy-learning`, versão, data de exportação e estado. Importar não executa conteúdo nem altera o banco editorial de cartões. O upload é processado só no navegador, limitado a 500 KB; tipos, limites, datas, etapa, chaves e identificadores são validados. O usuário vê resumo e precisa confirmar substituição. Não há merge de contadores, pois combiná-los sem um log de eventos duplicaria estatísticas.

JSON inválido, versões desconhecidas e IDs não existentes são rejeitados sem alterar os dados atuais. Um backup antigo que referencia conteúdo removido precisa de migração explícita; o sistema não inventa um cartão substituto. Exportar antes de limpar/importar é recomendado. Limpeza afeta apenas dados de estudo da Academy; tema, fonte e outros sites são preservados.

## Limites de disponibilidade

LocalStorage é adequado ao volume atual (45 cartões e 15 percursos); não precisamos de IndexedDB, servidor ou conta. Acesso pode falhar por quota/permissão; nesse caso a interface avisa que a sessão está em memória e oferece exportação. Dados podem ser apagados pelo navegador. Não há sincronização multiaba/dispositivo ou resolução de conflitos. Alterar o relógio afeta vencimentos. Nada disso exige enviar dados a terceiros.

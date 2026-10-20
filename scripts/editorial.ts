import { readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { proposalSchema, validateProposal } from '../src/lib/editorial';
const file = process.argv[2];
if (file === '--schema') {
  writeFileSync(
    'content/editorial-proposal.schema.json',
    JSON.stringify(z.toJSONSchema(proposalSchema), null, 2) + '\n',
  );
  console.log('Schema gerado.');
} else if (file) {
  const p = validateProposal(JSON.parse(readFileSync(file, 'utf8')));
  console.log(
    `Proposta válida: ${p.id}; revisão humana obrigatória. Nenhum arquivo editorial alterado.`,
  );
} else
  throw Error('Uso: npm run validate:proposal -- caminho.json ou --schema');

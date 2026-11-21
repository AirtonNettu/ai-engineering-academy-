# ADR-004: Governança de APIs Científicas, Cotas Gratuitas e Fallback Estático

**Status:** Proposto  
**Data:** 2026-11-21  
**Autor:** Equipe 2 — Pesquisa Científica (Agente 05) & Equipe 6 — Qualidade e Segurança (Agente 18)  
**Revisor:** Agente 01 (Solutions Architect)

---

## 1. Contexto e Problema

O ecossistema acadêmico oferece diversas APIs para descoberta científica (OpenAlex, arXiv API, Hugging Face Hub, Semantic Scholar). No entanto, o consumo dessas interfaces em uma aplicação web estática pública no Cloudflare Pages impõe desafios críticos:

- _Segurança:_ Proibição de embutir chaves de API secretas ou tokens de acesso no código cliente.
- _Custo:_ A plataforma deve ter **custo zero permanente (R$ 0)**, sem planos pagos ou assinaturas.
- _Confiabilidade e Rate Limits:_ APIs acadêmicas gratuitas impõem limites de requisições rígidos (ex: arXiv restringe a 1 requisição a cada 3 segundos; OpenAlex exige pool educado com e-mail no cabeçalho; Semantic Scholar bloqueia chamadas repetitivas).

Se o frontend executasse consultas diretas nas APIs a cada visita de estudante, a plataforma sofreria bloqueios por _HTTP 429 Too Many Requests_, falhas de _CORS_ e telas quebradas.

---

## 2. Decisão

Adotamos a **Ingestão Pré-Compilada em Ambiente Offline/CI com Zero Tokens no Cliente**:

1. **Pipeline de Ingestão Desacoplado (`scripts/ingest-research.ts`):**
   - As consultas às APIs abertas (OpenAlex e arXiv) são executadas exclusivamente por scripts de build ou ferramentas de manutenção do mantenedor.
   - O script respeita rigorosamente o _polite pool_ do OpenAlex e o rate limit de 3 segundos do arXiv através de _throttling_ assíncrono.
   - O resultado é salvo localmente em arquivos JSON auditados (`content/research/*.json`).
2. **Zero Dependência em Runtime:** O site publicado no Cloudflare Pages não realiza chamadas para as APIs acadêmicas durante o carregamento das páginas. Todos os metadados são servidos como assets estáticos locais pelo próprio CDN da plataforma.
3. **Validação de Integridade em CI:** O workflow de validação do GitHub Actions executa o script `scripts/validate-v2-data.ts`, confirmando que todos os links canônicos (DOI, arXiv, Hugging Face) são sintaticamente válidos e apontam para esquemas HTTPS autorizados.

---

## 3. Alternativas Consideradas

| Alternativa                                                    | Prós                                                                                                                         | Contras                                                                                                                                                  | Decisão                                                               |
| :------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **A. Chamadas Diretas do Navegador via `fetch()`**             | Simplicidade aparente de implementação.                                                                                      | Quebra por CORS em dezenas de navegadores; atinge limites de taxa na primeira aula com 30 alunos simultâneos; risco de vazamento se chaves forem usadas. | **Rejeitada.** Inaceitável para produção educacional.                 |
| **B. Cloudflare Workers / Serverless Proxy com Chaves**        | Permite mascarar as chamadas com chaves em variáveis de ambiente Cloudflare.                                                 | Exige configuração de conta com possíveis custos futuros; adiciona complexidade de infraestrutura de backend desnecessária.                              | **Rejeitada.** Fere a decisão de manter o projeto puramente estático. |
| **C. Ingestão Prévia em Build-Time com Snapshots Versionados** | Custo R$ 0; resiliência infinita a falhas externas; tempos de resposta instantâneos (<50ms); versionamento auditável no Git. | Atualizações de catálogo exigem commit e build (o que já é o modelo padrão da plataforma).                                                               | **Aprovada.**                                                         |

---

## 4. Consequências

### Positivas

- Resiliência absoluta: o site nunca fica fora do ar por instabilidade de repositórios científicos externos.
- Total conformidade com as políticas de uso aceitável do arXiv e do OpenAlex.
- Ausência total de credenciais no frontend, simplificando auditorias de segurança e CSP.
- Conformidade integral com o [AGENTS.md](../../../AGENTS.md).

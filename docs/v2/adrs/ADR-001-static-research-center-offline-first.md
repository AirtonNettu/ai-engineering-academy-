# ADR-001: Centro de Pesquisa Científica Offline-First e Estático

**Status:** Proposto  
**Data:** 2026-11-21  
**Autor:** Equipe 1 — Arquitetura (Agente 01 & Agente 02)  
**Revisor:** Agente 03 (Architecture Reviewer)

---

## 1. Contexto e Problema

A IA Engineer Academy tem como missão educar engenheiros de IA conectando fundamentos teóricos, pesquisa científica e implementação prática. O **Centro de Pesquisa** (Issue #5) precisa permitir a consulta e o aprendizado sobre artigos seminais (ex: Transformers, RoPE, LoRA, FlashAttention), modelos abertos e datasets fundamentais.

No entanto, a arquitetura da plataforma possui restrições inegociáveis ([AGENTS.md](../../../AGENTS.md)):

- Acesso gratuito (custo zero de infraestrutura e serviços).
- Ausência de backend público ou banco de dados relacional remoto.
- Hospedagem 100% estática via Cloudflare Pages.
- Proibição de exposição de credenciais privadas no cliente.
- Resiliência operacional sem depender de conectividade ininterrupta ou cotas de APIs de terceiros.

---

## 2. Decisão

Adotamos a arquitetura de **Ingestão Estática em Build-Time com Carregamento Lazy no Cliente (Offline-First)**:

1. **Catálogo Estático Compilado:** Todos os artigos curados, modelos e datasets são consolidados em arquivos JSON auditados (`content/research/papers.json` e `content/research/models-datasets.json`) validados por schemas TypeScript estritos.
2. **Carregamento sob Demanda (Code Splitting):** O componente `ResearchCenter.tsx` é carregado de forma assíncrona (`lazy`) apenas quando a rota `/pesquisa` é acessada pelo usuário, não onerando o bundle da página inicial.
3. **Busca e Filtragem em Memória no Navegador:** As operações de pesquisa textual e filtros por área são executadas no cliente usando algoritmos eficientes em memória, sem necessidade de consultas remotas.
4. **Links Abertos para PDFs e Repositórios:** A leitura integral de artigos acadêmicos é delegada via links HTTPS diretos para fontes abertas oficiais (arXiv.org, OpenAlex, Hugging Face, GitHub), sem hospedar arquivos binários de PDF pesados no repositório.

---

## 3. Alternativas Consideradas

| Alternativa                                                         | Prós                                                                                                            | Contras                                                                                                                           | Decisão                                                              |
| :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **A. Chamadas Diretas via Frontend (Fetch no Navegador para APIs)** | Dados sempre em tempo real.                                                                                     | Violação de CORS em muitas APIs; esgotamento rápido de rate limits anônimos; lentidão e telas quebradas quando a API externa cai. | **Rejeitada.** Fragiliza a estabilidade e a experiência educacional. |
| **B. Backend Próprio (Node.js / Python API em nuvem paga)**         | Cache centralizado no servidor e flexibilidade.                                                                 | Violação da restrição de custo zero (exige hospedagem paga e manutenção contínua de servidor).                                    | **Rejeitada.** Incompatível com o projeto estático gratuito.         |
| **C. Ingestão Estática Compilada (Snapshot Local Auditado)**        | Confiabilidade de 100%, carregamento instantâneo, custo zero, sem segredos, auditabilidade humana de cada dado. | Requer execução de scripts periódicos para adicionar novos papers (perfeitamente alinhado ao modelo editorial do projeto).        | **Aprovada.**                                                        |

---

## 4. Consequências

### Positivas

- A plataforma funciona perfeitamente sem falhas mesmo se serviços externos (OpenAlex, arXiv) estiverem indisponíveis.
- Desempenho de carregamento sub-segundo no Cloudflare Pages.
- Total respeito à privacidade dos usuários (sem chamadas com IPs dos usuários para serviços terceiros durante a navegação).
- Curadoria manual de qualidade humana (sem alucinações de artigos inexistentes).

### Riscos e Mitigações

- _Risco:_ Catálogo pode defasar em relação a publicações muito recentes da semana.
- _Mitigação:_ Script de manutenção offline documentado que permite atualizar o snapshot sem quebrar contratos, associado a um pipeline de revisão editorial periódica.

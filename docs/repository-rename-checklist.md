# Checklist de renomeação controlada do repositório

> [!IMPORTANT]
> **Status:** Preparado e documentado. **A renomeação NÃO foi executada** e permanece sob aprovação prévia e explícita do proprietário do repositório.

- **Nome atual no GitHub:** `AirtonNettu/ai-engineering-academy-`
- **Nome desejado no GitHub:** `AirtonNettu/ai-engineering-academy`
- **Nome do pacote npm (`package.json`):** `ia-engineer-academy` (permanece inalterado; não é necessário igualar ao nome do repositório).

---

## 1. Pré-renomeação (Verificações)

- [ ] Verificar se o nome `AirtonNettu/ai-engineering-academy` está disponível na conta GitHub.
- [ ] Mapear todas as integrações ativas (Cloudflare Pages, webhooks, forks).
- [ ] Confirmar que os rulesets e proteções de branch (`main-protection`) serão transferidos automaticamente pelo GitHub.
- [ ] Confirmar que não há deploys automáticos configurados para disparar sem autorização.

---

## 2. Execução administrativa no GitHub

- [ ] Acessar **Settings** > **General** > **Repository name** em `AirtonNettu/ai-engineering-academy-`.
- [ ] Alterar o nome para `ai-engineering-academy` e confirmar.

---

## 3. Pós-renomeação (Atualizações técnicas)

- [ ] **Remote Git local:**
  ```bash
  git remote set-url origin https://github.com/AirtonNettu/ai-engineering-academy.git
  git remote -v
  ```
- [ ] **Links no README e Documentação:**
  - [ ] Atualizar badge de CI em `README.md` (`AirtonNettu/ai-engineering-academy/actions/workflows/quality.yml/badge.svg`).
  - [ ] Atualizar links de repositório em `README.md`, `SECURITY.md`, `CONTRIBUTING.md` e `docs/`.
  - [ ] Atualizar links em `src/components/Layout.tsx` (`https://github.com/AirtonNettu/ai-engineering-academy`).
- [ ] **Integração Cloudflare Pages:**
  - [ ] Verificar a vinculação do repositório no dashboard do Cloudflare Pages.
  - [ ] Confirmar que o endereço `ai-engineering-academy-3cy.pages.dev` permanece inalterado.
- [ ] **Validação completa:**
  - [ ] Executar `npm run check`, `npm run check:links` e `npm run test:e2e`.
  - [ ] Confirmar execução verde do workflow `Quality` no GitHub Actions após o primeiro push.

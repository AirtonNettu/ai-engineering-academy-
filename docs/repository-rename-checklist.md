# Renomeação controlada do repositório

Nome atual: `AirtonNettu/ai-engineering-academy-`.
Nome desejado: `AirtonNettu/ai-engineering-academy`.

A renomeação é uma operação administrativa do GitHub e **não foi executada por este PR**. O pacote npm já usa `ia-engineer-academy`; avaliar impacto antes de alterá-lo, pois não é obrigatório igualar o nome do pacote ao repositório.

Antes da renomeação: verificar se o novo nome está disponível; registrar referências ao clone, links GitHub, badges, documentação, Cloudflare Pages e integrações. Verificar workflows e proteções de branch.

Depois da renomeação: atualizar o remote local (`git remote set-url origin https://github.com/AirtonNettu/ai-engineering-academy.git`), URLs no README e documentação, integração Cloudflare/GitHub, links do portfólio e quaisquer badges. Conferir se redirects do GitHub estão ativos, mas não depender deles permanentemente. Validar CI e publicação sem disparar deploy não autorizado.

**A renomeação não implica alterar o endereço atual do Cloudflare Pages.**

# Acessibilidade e evidências visuais

## Verificações executadas

- Chromium desktop e Pixel 7 emulado: larguras 320, 390, 768 e 1280 px.
- Sete páginas representativas por largura: biblioteca, Atlas, três labs, capítulo e dados locais. Testes de limites da viewport/overflow, títulos e carregamento.
- Texto 200% e reduced-motion; botão de passo por Enter, foco por Tab, reinício por Espaço. A suíte existente verifica trap/retorno de foco do menu, Escape, temas, dados inválidos, flashcards, controles e gestos touch/pinch.
- Os oito testes dos controles medem caixas reais de ícones, texto e botões, áreas separadas e dimensão mínima de 44 px.
- Axe nas páginas representativas em claro/escuro e no laboratório com texto ampliado, usando regras WCAG 2 A/AA e 2.1 AA. Lighthouse local complementa semântica e nomes acessíveis.
- Quinze capítulos legíveis sem JavaScript, com um h1, conteúdo/âncoras e referências. Ao ativar JS, o React substitui o fallback; controles não são simulados na leitura estática.

## Achados corrigidos

1. Em 768 px com texto 200%, a ação GitHub do cabeçalho excedia a viewport por 17 px. Reprodução via bounding boxes e captura local; cabeçalho flex agora quebra linha sem esconder controles.
2. Biblioteca pulava de h1 para h3 nos cartões. Um h2 semântico para os capítulos mantém hierarquia e identidade visual, com teste unitário de regressão.
3. Os nós opcionais do Atlas exibiam OPCIONAL, mas o aria-label não incluía essa palavra. Lighthouse reportou label-content-name-mismatch; o nome agora inclui rótulo visível e título. Posições, conexões e tamanhos do diagrama permanecem intactos.
4. Lighthouse detectou salto do rodapé durante lazy loading. O conteúdo mantém altura mínima de viewport menos cabeçalho, e teste segura o chunk para verificar a posição do rodapé antes do carregamento.

## Evidências e limites

As capturas de biblioteca, Atlas e rede em docs/assets/screenshots foram geradas do build local em 1280 px; mostram a interface real. A captura da rede foi feita após uma época real, sem alterar pesos ou resultados para a imagem. Banner SVG anterior permanece intacto. A imagem social PNG também é captura real.

A revisão visual manteve o desenho dos diagramas. Cálculos e coordenadas dos laboratórios não mudaram. As imagens não comprovam a versão publicada no Pages. Auditorias automáticas não são certificação WCAG e podem omitir problemas. Leitores de tela, aparelho físico, Firefox/WebKit e avaliação com pessoas usuárias não estavam disponíveis; a checklist de publicação pede revisão humana dessas dimensões.

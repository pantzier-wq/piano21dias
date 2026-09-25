# Piano & Teclado em 21 Dias — página de vendas (Portugal)

Página de vendas em português de Portugal para o livro digital **Piano & Teclado em 21 Dias · Método Punhado de Teclas**.

## Ficheiros

- `index.html` — a página inteira (HTML, CSS e JavaScript no mesmo ficheiro).
- `imagens/` — imagem do produto e fotos da prova social, em WebP.

As imagens estão em ficheiros separados para carregarem mais depressa e ficarem em cache. Suba sempre o `index.html` e a pasta `imagens/` juntos.

## O que falta antes de pôr a página no ar

| O quê | Onde, no `index.html` |
|---|---|
| Vídeo de vendas (VSL) | procure `Cole aqui o código de incorporação da VSL` |
| Links do checkout | o botão com `data-checkout="completo"` (pack único de 14,90€) está com `href="#"` |
| Data do fim da oferta | `var FIM_DA_OFERTA` no fim do ficheiro |
| Rodapé legal | nome ou empresa, NIF, email, Política de Privacidade e Termos |
| Espaços amarelos | cada um diz o que lá vai: mockups, bónus, especialista, segunda prova social |

## Publicar no GitHub Pages

Settings → Pages → Branch `main`, pasta `/ (root)` → Save. A página fica em `https://pantzier-wq.github.io/piano21dias/`.

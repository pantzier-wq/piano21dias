# Piano & Teclado em 21 Dias — página de vendas (Portugal)

Página de vendas em português de Portugal para o livro digital **Piano & Teclado em 21 Dias · Método Punhado de Teclas**.

## Ficheiros

- `index.html` — a página inteira (HTML, CSS e JavaScript no mesmo ficheiro).
- `imagens/` — imagem do produto e fotos da prova social, em WebP.

As imagens estão em ficheiros separados para carregarem mais depressa e ficarem em cache. Suba sempre o `index.html` e a pasta `imagens/` juntos.

## Funil pós-compra

- `/upsell/` apresenta a Biblioteca Prática Completa por **27,90 €**.
- `/downsell/` apresenta o mesmo material por **19 €** após a recusa.
- `/obrigado/` encerra o percurso de recusa; não confirma o estado da transação.

O livro fornecido tem 70 páginas, sete percursos e 24 áudios MP3. O primeiro percurso contém 18 exercícios, não 30. A capa em `imagens/biblioteca-capa.webp` foi extraída do PDF fornecido; o conteúdo pago não está publicado neste repositório.

O botão de compra de cada página secundária está desativado até que o produto e as duas ofertas sejam criados na Hotmart. Para ativar a compra pós-pagamento com o Funil de Vendas da Hotmart:

1. Cadastre e libere para venda o produto **Piano Sem Bloqueios — Biblioteca Prática Completa**, com o PDF e os 24 MP3, e crie as ofertas de 27,90 € e 19 €.
2. Crie um Funil de Vendas para a oferta principal do Piano & Teclado em 21 Dias. Configure o upsell com `https://piano21dias.vercel.app/upsell/`, a recusa com `https://piano21dias.vercel.app/downsell/` e a recusa final com `https://piano21dias.vercel.app/obrigado/`. Direcione os caminhos de aceite para a página de obrigado adequada.
3. Copie o **Código do Widget do Funil de Vendas** gerado pela Hotmart e instale-o nas duas páginas externas. Substitua os botões desativados e os links manuais de recusa pelos controles oficiais do widget. O widget é indispensável para o aceite/recusa e para a compra com um clique.
4. Ative o funil e faça uma compra teste na mesma oferta inicial configurada no funil, conferindo aceites, recusas e entrega do material.

Não confunda o Widget do Funil de Vendas com o Widget da Página de Pagamento. As páginas atuais estão prontas visualmente, mas **o funil automático ainda não está ativo**.

## Pendências da página principal

| O quê | Onde, no `index.html` |
|---|---|
| Vídeo de vendas (VSL) | player da VTurb já integrado; confirme a versão publicada |
| Rodapé legal | nome ou empresa, NIF, email, Política de Privacidade e Termos |
| Checkout principal | `https://pay.hotmart.com/J107806231G?checkoutMode=10` |

## Publicar no GitHub Pages

Settings → Pages → Branch `main`, pasta `/ (root)` → Save. A página fica em `https://pantzier-wq.github.io/piano21dias/`.

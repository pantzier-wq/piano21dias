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

O material fornecido tem 70 páginas, sete percursos e 24 áudios MP3. O primeiro percurso contém 18 exercícios, não 30. A imagem promocional em `imagens/biblioteca-visual.webp` foi fornecida pelo produtor e usada nas duas páginas; o conteúdo pago não está publicado neste repositório.

O widget oficial do Funil de Vendas da Hotmart está instalado nas páginas de upsell e downsell. Ele gera os botões de aceite e recusa quando o comprador chega a estas páginas durante uma compra válida. Ao abrir a URL diretamente, sem uma compra em andamento, a Hotmart mostra um erro de contexto; isso não substitui o teste do funil completo. Para ativar a compra pós-pagamento:

A página de upsell mostra a data do dia em `Europe/Lisbon` e anuncia a condição de 27,90 € até às 23h59 desse dia. Como a condição se renova diariamente, mantenha a oferta de 27,90 € disponível na Hotmart em todos os dias anunciados; a indicação da página não altera automaticamente o preço ou a validade dentro da Hotmart.

1. Cadastre e libere para venda o produto **Piano Sem Bloqueios — Biblioteca Prática Completa**, com o PDF e os 24 MP3, e crie as ofertas de 27,90 € e 19 €.
2. Crie um Funil de Vendas para a oferta principal do Piano & Teclado em 21 Dias. Configure o upsell com `https://piano21dias.vercel.app/upsell/`, a recusa com `https://piano21dias.vercel.app/downsell/` e a recusa final com `https://piano21dias.vercel.app/obrigado/`. Direcione os caminhos de aceite para a página de obrigado adequada.
3. Confirme que o widget instalado nas duas páginas corresponde ao código exibido no painel da Hotmart. Os antigos botões desativados e links manuais de recusa foram substituídos pelo widget oficial.
4. Ative o funil e faça uma compra teste na mesma oferta inicial configurada no funil, conferindo aceites, recusas e entrega do material.

Não confunda o Widget do Funil de Vendas com o Widget da Página de Pagamento. A integração das páginas está pronta, mas **a ativação e o teste do funil na Hotmart ainda precisam ser confirmados**.

## Pendências da página principal

| O quê | Onde, no `index.html` |
|---|---|
| Vídeo de vendas (VSL) | player da VTurb já integrado; confirme a versão publicada |
| Rodapé legal | nome ou empresa, NIF, email, Política de Privacidade e Termos |
| Checkout principal | `https://pay.hotmart.com/J107806231G?checkoutMode=10` |

## Publicar no GitHub Pages

Settings → Pages → Branch `main`, pasta `/ (root)` → Save. A página fica em `https://pantzier-wq.github.io/piano21dias/`.

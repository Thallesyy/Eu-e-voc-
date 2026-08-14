# Eu e você — versão React

Site migrado de HTML/CSS/JS puro pra React + Vite. Mesma cara, mesmo comportamento,
mas agora organizado em componentes — muito mais fácil de adicionar coisas novas.

## Como rodar (Linux)

```bash
cd eu-e-voce-react
npm install
npm run dev
```

Abre o link que aparecer no terminal (geralmente `http://localhost:5173`).

Pra gerar a versão final pra hospedar:

```bash
npm run build
```

Isso cria uma pasta `dist/` com tudo pronto pra subir no seu host.

## IMPORTANTE: colocar as fotos, músicas e ícones

Tudo que era um arquivo solto (fotos, `.mp3`, ícones do PWA) agora vai dentro da
pasta `public/`. Tudo que está em `public/` é servido na raiz do site automaticamente.

Copia pra dentro de `public/`:
- Todas as fotos dos álbuns: `dates1.jpg` até `dates39.jpg`, `random1.jpg` até
  `random29.jpg`, `us1.jpg` até `us53.jpg`
- `capa.jpg`, `sobre-nos.jpg`, `banner1.jpg`
- `album_dates_cover.jpg`, `album_random_cover.jpg`, `album_us_cover.jpg`
- `capa1.jpg` até `capa7.jpg` (capas das músicas)
- `pyramids.mp3`, `musica2.mp3` até `musica7.mp3`
- `icon-72x72.png`, `icon-96x96.png`, `icon-128x128.png`, `icon-144x144.png`,
  `icon-152x152.png`, `icon-192x192.png`, `icon-384x384.png`, `icon-512x512.png`

Sem esses arquivos, o site abre e funciona normal — só aparece foto quebrada
onde faltar.

## Onde editar cada coisa

Tudo que é conteúdo (texto, datas, listas) ficou separado da lógica, dentro de
`src/data/`:

- `src/data/config.js` — senha, data de início do namoro, config do Firebase (opcional)
- `src/data/timeline.js` — os momentos da "Nossa história"
- `src/data/reasons.js` — a lista de "por que eu gosto de você"
- `src/data/albums.js` — quantas fotos tem em cada álbum (é só mudar o número
  quando subir fotos novas)
- `src/data/tracks.js` — a playlist

Cada seção do site é um componente dentro de `src/components/`. Por exemplo,
pra mexer no banner de foto+texto, edita `src/components/PhotoBanner.jsx` — e
pra criar um banner novo, é só usar `<PhotoBanner ... />` de novo dentro de
`src/App.jsx`, igual o banner "Familia" que já tem lá.

## Estrutura

```
src/
  data/         → conteúdo editável (textos, listas, config)
  hooks/        → lógica reutilizável (contador, localStorage, texto especial)
  components/   → cada seção/tela do site
  styles/       → o CSS original, sem mudanças visuais
  App.jsx       → junta tudo (fluxo senha → animação → app)
  main.jsx      → ponto de entrada
public/         → fotos, músicas, ícones, manifest.json, sw.js
```

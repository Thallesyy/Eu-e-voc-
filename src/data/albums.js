// Cada álbum gera automaticamente a lista de fotos a partir do prefixo + quantidade.
// Pra adicionar fotos novas: sobe os arquivos com nome "prefixoN.jpg" (ex: dates20.jpg)
// e só aumenta o "count" abaixo. Use o script renomear-fotos.ps1 pra renomear em lote.

function buildPhotos(prefix, count, caption) {
  return Array.from({ length: count }, (_, i) => ({
    src: `/${prefix}${i + 1}.jpg`,
    caption,
  }));
}

export const albums = {
  dates: {
    title: 'Suas fotos',
    photos: buildPhotos('dates', 39, 'Todas as tuas fotos que eu tanto amo ver'),
  },
  random: {
    title: 'Fotos aleatórias',
    photos: buildPhotos('random', 29, 'Nossos momentos mais aleatórios'),
  },
  us: {
    title: 'Nossas fotos',
    photos: buildPhotos('us', 53, 'Nossos momentos especiais'),
  },
};

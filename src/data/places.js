// ===== MAPA DE LUGARES =====
// Cada lugar especial que vocês já estiveram juntos vira um pin no mapa.
//
// Como pegar lat/lng de um lugar novo:
// 1. Abra o Google Maps, toque e segure no local até aparecer um pin vermelho
// 2. Toque no card que aparece embaixo — as coordenadas aparecem lá (ex: -29.81, -51.16)
// 3. Cole o primeiro número em "lat" e o segundo em "lng"
//
// (Ou manda o nome/endereço do lugar pro Claude que ele acha as coordenadas pra você.)
//
// Fotos: coloque os arquivos dentro de public/lugares/ com o nome
// "<id>-1.jpg", "<id>-2.jpg" etc (o id é o mesmo campo "id" do lugar) e
// liste os caminhos no campo "photos". Pode deixar o array vazio ([]) se
// ainda não tiver foto daquele lugar — o card aparece normalmente, só sem foto.

export const places = [
  {
    id: 'zoologico',
    title: 'O primeiro encontro',
    date: '19/04',
    lat: -29.7901536,
    lng: -51.1807967,
    memory: 'O famoso dia do zoológico, o dia em que tu falou que me amava, o dia em que tu deixou eu seguir as tuas contas do pv, aí foi o começo de tudo',
    photos: ['/lugares/zoologico-1.jpg'],
  },
  {
    id: 'park-shopping-canoas',
    title: 'Cinema',
    date: '06/05',
    lat: -29.91587,
    lng: -51.1654021,
    memory: 'O dia do filme do MJ no Park Shopping Canoas, quando tu chorou falando que me ama, e eu chorei também, um grande dia para a nossa história',
    photos: ['/lugares/park-shopping-canoas-1.jpg'],
  },

  // Adicione mais lugares aqui embaixo (casa da vovó, festa do Samuel, etc)
  // seguindo o mesmo formato — é só duplicar um objeto e trocar os dados.
];

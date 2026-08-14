import { useState } from 'react';

const MESSAGE = `Nicolly, você é a pessoa mais incrível que eu já conheci. Obrigado por estar ao meu lado e por tornar cada dia mais especial, mas nao é so isso, todos os dias eu me apaixono mais e mais por quem tu é, e eu acho isso incrivel, o fato que msm quando eu acho que eu nao consigo gostar mais de ti mesmo assim eu gosto mais e mais e mais, eu nao consigo mais pensar em um dia sem voce, nao consigo mais imaginar um dia que eu nao queria  te ter, e eu fico ansioso todos os dias quando eu durmo pensando "q bom que eu vou ver ela amanha", as vezes quando nos tamo naquele momento so nosso eu penso "bem q poderia durar pra sempre ne", e eu realmente gostaria que durasse, eu quero todo os dias sentir o teu cheiro, sentir o teu calor, ver nos fundos do teus olhos e poder falar "eu te amo", e isso que eu quero, e eu nao tenho duvidas disso, pq oq tu faz eu sentir eu nunca senti na minha vida, e eu quero sentir isso mais e mais, eu espero fazer tu se sentir assim tambem, pq, vei, eu sou completamnete louco por ti. Mas as vezes eu penso eu não sou um romântico sabe? Eu sou só um homem apaixonado por uma princesa cujo cada detalhe é magnífico, cujo cada gesto é belo, cujo cada frase cada olhada cada andada, cada palavra é extraordinária, eu so sou um cara apaixonado por uma rainha, que cada segundo, cada minuto é cada hora demostra mais e mais a sua magnitude e beleza, eu sou so um cara apaixonado por uma deusa, que so de estar no mesmo ambiente muda tudo, que so de estar presente  mostra pra mim oque é se sentir vivo, mostra para mim oq é gostar de sentir um cheiro doce, mostra para mim oq eu preciso pra ter o meu "tudo" que eu tanto busquei é essa princesa, rainha e deusa não podia ser ninguém menos que você, essa linda leitora de Contos BIZARROS de medicina, que tem o olhar mais lindo que eu ja vi, que faz eu sentir o quão simples pode ser viver ao sei lado, que faz eu gostar até dos teus pequenos gestos, que me faz pensar que até as tuas imperfeições são tão perfeitas, que me faz querer acordar todo dia e ser melhor por você, e eu não sei quando comecei a me sentir assim, mas eu sei que eu amo isso eu amo te amar, muito obrigado por ser tão especial e incrível branquinha e muito obrigado por estar ao meu lado todos os dias, Nicolly Assunção Medina.`;

export default function SpecialMessage() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section">
      <div className="section-card special">
        <div className="section-header">Recado especial</div>
        <div className="section-body">
          <p className="special-text">Aqui vai a minha declaração</p>
          <div className={`msg-wrap ${open ? 'expanded' : ''}`}>
            <p className="msg">{MESSAGE}</p>
          </div>
          <button
            className="btn"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            {open ? 'Esconder mensagem' : 'Mostrar mensagem'}
          </button>
        </div>
      </div>
    </section>
  );
}

import { useTextBox } from '../hooks/useTextBox';

const STATUS_LABEL = {
  idle: '💾 Salvo automaticamente',
  saving: 'Salvando...',
  saved: 'Salvo ✓',
  'local-only': '⚠️ Salvo só neste aparelho',
};

export default function SpecialTextBox({
  label = 'Escreva algo especial',
  placeholder = 'Eu queria fazer tu fazer parte do site, entao, aqui tem um cantinho pra tu escrever o que tu quiser',
  storageKey = 'eu_e_voce_texto_especial',
  firebasePath = 'site/textoEspecial',
}) {
  const { text, updateText, status } = useTextBox(storageKey, firebasePath);

  return (
    <div className="text-box-container">
      <div className="text-box-label">{label}</div>
      <textarea
        className={`text-box ${status === 'saved' ? 'text-box-saved' : ''}`}
        placeholder={placeholder}
        spellCheck={false}
        value={text}
        onChange={(e) => updateText(e.target.value)}
      />
      <div className="text-box-hint">{STATUS_LABEL[status]}</div>
    </div>
  );
}

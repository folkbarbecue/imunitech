// Simple voice helper using SpeechSynthesis API
function speak(text){if(!('speechSynthesis' in window)){alert('Leitura por voz não disponível neste navegador.');return}
  const u=new SpeechSynthesisUtterance(String(text));u.lang='pt-BR';u.rate=1;u.pitch=1;speechSynthesis.cancel();speechSynthesis.speak(u);
}
// Expose for debugging
nwindow.speak=speak;

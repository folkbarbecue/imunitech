# ImuniTech — Site estático de demonstração

Este diretório contém um protótipo estático do site para o aplicativo ImuniTech.

Páginas incluídas:
- `index.html` — Login (demo)
- `dashboard.html` — Dashboard do usuário (vacinas e doações)
- `reminders.html` — Criar e listar lembretes
- `info.html` — Conteúdo educativo
- `gamification.html` — Pontos e badges

Como testar localmente:
1. Abra o arquivo `index.html` no seu navegador (arraste para a janela do navegador ou use um servidor estático).
2. Use um e-mail qualquer e clique em Entrar ou clique em "Criar demo".

Notas de acessibilidade:
- Alto contraste usando as cores fornecidas: `#5a6e97` (primária) e `#c5686c` (acento).
- Botões de leitura por voz usam a API SpeechSynthesis (navegadores modernos).
- Skip link, foco visível e roles/aria foram adicionados.

Tecnologias: HTML, CSS, JavaScript puro. Dados são guardados em `localStorage` para demo.

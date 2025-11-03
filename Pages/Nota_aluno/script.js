// notes-page.js
// Renderiza dinamicamente a lista de disciplinas.
// Substitua fetchDisciplines() pela chamada real ao seu backend (fetch/axios).

document.addEventListener('DOMContentLoaded', function() {
  const list = document.getElementById('disciplinesList');

  // Exemplo: dados vindos do backend (troque por fetch real)
  function fetchDisciplines() {
    // exemplo estático; no seu projeto troque por fetch('/api/disciplinas').then(...)
    return Promise.resolve([
      { id: 1, name: 'Disciplina 1', grade: '10', desc: '' },
      { id: 2, name: 'Disciplina 2', grade: '6', desc: 'Menu description.' },
      { id: 3, name: 'Disciplina 3', grade: '8', desc: 'Menu description.' },
      { id: 4, name: 'Disciplina 1', grade: '10', desc: '' },
      { id: 5, name: 'Disciplina 2', grade: '6', desc: 'Menu description.' },
      { id: 6, name: 'Disciplina 3', grade: '8', desc: 'Menu description.' },
    ]);
  }

  function createStarSVG() {
    return `
      <svg class="item-star" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 17.3L6.16 20l1.15-6.7L2 9.5l6.9-1L12 2l3.1 6.5L22 9.5l-5.31 3.8L17.84 20 12 17.3z" fill="currentColor"/>
      </svg>
    `;
  }

  function render(items) {
    list.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'disc-item';
      li.innerHTML = `
        <div class="item-left">
          ${createStarSVG()}
          <div class="item-meta">
            <div class="item-title">${escapeHtml(it.name)}</div>
            ${it.desc ? `<div class="item-desc">${escapeHtml(it.desc)}</div>` : ''}
          </div>
        </div>
        <div class="item-note">${escapeHtml(it.grade)}</div>
      `;
      list.appendChild(li);
    });
  }

  // pequena função para escapar conteúdo vindo do servidor
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // buscar e renderizar
  fetchDisciplines().then(render).catch(err => {
    console.error('Erro ao obter disciplinas:', err);
    list.innerHTML = '<li class="disc-item">Erro ao carregar disciplinas.</li>';
  });
});


document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('disciplinesList');

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function createStarSVG() {
    return `
      <svg class="item-star" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 17.3L6.16 20l1.15-6.7L2 9.5l6.9-1L12 2l3.1 6.5L22 9.5l-5.31 3.8L17.84 20 12 17.3z" fill="currentColor"/>
      </svg>
    `;
  }

  function setLoading(msg = 'Carregando...') {
    list.innerHTML = `<li class="disc-item small">${escapeHtml(msg)}</li>`;
  }

  function setError(msg = 'Erro ao carregar disciplinas/notas.') {
    list.innerHTML = `<li class="disc-item small" style="color:crimson">${escapeHtml(msg)}</li>`;
  }

  function renderItems(items = [], alunoNome = '') {
    list.innerHTML = '';
    if (alunoNome) {
      const liHead = document.createElement('li');
      liHead.className = 'disc-item small';
      liHead.style.fontWeight = '700';
      liHead.style.marginBottom = '6px';
      liHead.textContent = `Aluno: ${alunoNome}`;
      list.appendChild(liHead);
    }
    if (!items || items.length === 0) {
      list.innerHTML += `<li class="disc-item small">Nenhuma nota encontrada.</li>`;
      return;
    }

    items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'disc-item';
      
      const grade = (it.nota === 0 || it.nota) ? String(it.nota) : (it.grade || '');
      const disciplinaNome = it.disciplina || it.disciplina_nome || it.disciplina_codigo || it.disciplinaCodigo || it.disciplina_codigo || '—';
      const desc = it.desc || it.descricao || it.observacao || '';
      li.innerHTML = `
        <div class="item-left">
          ${createStarSVG()}
          <div class="item-meta">
            <div class="item-title">${escapeHtml(disciplinaNome)}</div>
            ${desc ? `<div class="item-desc">${escapeHtml(desc)}</div>` : ''}
          </div>
        </div>
        <div class="item-note">${escapeHtml(grade)}</div>
      `;
      list.appendChild(li);
    });
  }

  
  function getUsuarioCpfFromApi() {
    if (typeof API !== 'undefined' && typeof API.getUsuarioLogado === 'function') {
      const u = API.getUsuarioLogado();
      if (!u) return null;
      
      return (u.cpf || u.cnpj || u.matricula || u.username || null);
    }
    
    try {
      const raw = localStorage.getItem('usuario_logado');
      if (!raw) return null;
      const u = JSON.parse(raw);
      return (u.cpf || u.cnpj || u.matricula || u.username || null);
    } catch (e) {
      return null;
    }
  }

  
  async function loadNotasDoUsuario() {
    setLoading('Buscando notas do usuário...');
    const chave = getUsuarioCpfFromApi();
    if (!chave) {
      setError('Nenhum usuário logado. Faça login para ver suas notas.');
      return;
    }

    
    let alunoNome = '';
    try {
      if (typeof API !== 'undefined' && API.usuarios) {
        try {
          const u = await API.usuarios.getById(encodeURIComponent(chave));
          if (u) alunoNome = u.nome || u.name || '';
        } catch (e) {
          
        }
      }
    } catch (e) { /* ignore */ }

    try {
      // Buscar notas do aluno usando o endpoint específico /api/notas/aluno/:cpf
      let notas = [];
      
      if (typeof API !== 'undefined') {
        // Usar o endpoint correto do backend: GET /api/notas/aluno/:cpf
        const response = await API.get(`/notas/aluno/${encodeURIComponent(chave)}`, null, API.authHeaders());
        notas = Array.isArray(response) ? response : [];
      } else {
        setError('API não disponível.');
        return;
      }

      
      const normalized = (Array.isArray(notas) ? notas : []).map(n => ({
        disciplina: n.disciplina || n.disciplina_nome || n.disciplina_codigo || '',
        nota: (n.nota != null) ? n.nota : '',
        desc: n.descricao || n.observacao || ''
      }));

      renderItems(normalized, alunoNome);

    } catch (err) {
      console.error('Erro buscando notas:', err);
      const text = err?.payload?.error || err?.payload?.message || err?.message || 'Erro ao buscar notas';
      setError(text);
    }
  }

  
  loadNotasDoUsuario();

  
  if (typeof API !== 'undefined' && typeof API.onAuthChange === 'function') {
    API.onAuthChange((u) => {
      
      setTimeout(() => loadNotasDoUsuario(), 100);
    });
  }
});

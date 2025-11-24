
document.addEventListener('DOMContentLoaded', () => {
  const courseInput = document.getElementById('courseName');
  const discInput = document.getElementById('disciplineInput');
  const addBtn = document.getElementById('addBtn');
  const removeSelectedBtn = document.getElementById('removeSelectedBtn');
  const listEl = document.getElementById('disciplinesList');
  const saveBtn = document.getElementById('saveBtn');
  const messageEl = document.getElementById('message');

  const disciplines = [];
  let allDisciplines = []; // Armazena todas as disciplinas disponíveis

  // Verificar autenticação e permissão
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    showMessage('Você precisa estar logado para acessar esta página.', 'error');
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente') {
    showMessage('Apenas funcionários e gerentes podem criar cursos.', 'error');
    setTimeout(() => window.history.back(), 2000);
    return;
  }

  function sanitize(str){
    if (str === null || str === undefined) return '';
    return String(str).trim();
  }

  function showMessage(text, type = 'info') {
    if (!messageEl) return;
    messageEl.hidden = false;
    messageEl.textContent = text;
    messageEl.style.background = (type === 'error') ? '#f8d7da' : '#d1e7dd';
    messageEl.style.color = (type === 'error') ? '#842029' : '#0f5132';
  }
  function hideMessage() { if (!messageEl) return; messageEl.hidden = true; messageEl.textContent = ''; }

  function render() {
    listEl.innerHTML = '';
    disciplines.forEach((d, idx) => {
      const li = document.createElement('li');
      li.className = 'disc-item';
      li.dataset.index = idx;

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'item-checkbox';
      chk.checked = !!d.checked;
      chk.addEventListener('change', () => { d.checked = chk.checked; });

      const name = document.createElement('div');
      name.className = 'item-name';
      name.textContent = d.name;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'item-remove';
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remover';
      removeBtn.addEventListener('click', () => removeAtIndex(idx));

      li.appendChild(chk);
      li.appendChild(name);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }

  function addDiscipline(selectedId) {
    const id = parseInt(selectedId);
    if (!id) { showMessage('Selecione uma disciplina.', 'error'); return; }
    
    const exists = disciplines.some(d => d.id === id);
    if (exists) { showMessage('Disciplina já adicionada.', 'error'); return; }
    
    // Buscar a disciplina completa da lista
    const disc = allDisciplines.find(d => d.id === id);
    if (!disc) { showMessage('Disciplina não encontrada.', 'error'); return; }
    
    disciplines.push({ id: disc.id, name: disc.nome, checked: false });
    render();
    discInput.value = '';
    discInput.focus();
    hideMessageAfter();
  }

  function removeAtIndex(index) {
    if (index >= 0 && index < disciplines.length) { disciplines.splice(index, 1); render(); }
  }

  function removeSelected() {
    const before = disciplines.length;
    for (let i = disciplines.length - 1; i >= 0; i--) {
      if (disciplines[i].checked) disciplines.splice(i, 1);
    }
    if (disciplines.length === before) showMessage('Nenhuma disciplina selecionada para remoção.', 'error');
    else { render(); hideMessageAfter(); }
  }

  function codeFromName(name) {
    if (!name) return '';
    const from = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return from.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'').toUpperCase();
  }

  let _hideTimer = null;
  function hideMessageAfter(ms = 3000) {
    if (_hideTimer) clearTimeout(_hideTimer);
    _hideTimer = setTimeout(() => hideMessage(), ms);
  }

  // Carregar disciplinas disponíveis
  async function loadDisciplines() {
    try {
      const result = await API.get('/disciplinas', API.authHeaders());
      allDisciplines = result || [];
      
      // Preencher o select
      discInput.innerHTML = '<option value="">Selecione uma disciplina...</option>';
      allDisciplines.forEach(disc => {
        const option = document.createElement('option');
        option.value = disc.id;
        option.textContent = disc.nome;
        discInput.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar disciplinas:', err);
      showMessage('Erro ao carregar disciplinas.', 'error');
    }
  }

  
  async function save() {
    hideMessage();
    const courseName = sanitize(courseInput.value);
    if (!courseName) {
      showMessage('Informe o nome do curso antes de salvar.', 'error');
      return;
    }
    if (disciplines.length === 0) {
      showMessage('Adicione ao menos uma disciplina antes de salvar.', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') {
        throw new Error('API global não encontrado.');
      }

      // Criar/atualizar curso com disciplinas selecionadas
      const courseCode = codeFromName(courseName);
      const coursePayload = {
        codigo: courseCode,
        nome: courseName,
        disciplinas: disciplines.map(d => d.id)
      };

      let courseResult = null;
      try {
        // Tentar criar curso
        courseResult = await API.post('/cursos', coursePayload, API.authHeaders());
      } catch (errCourse) {
        // Se já existe (409), atualizar
        if (errCourse?.status === 409) {
          courseResult = await API.put(`/cursos/${courseCode}`, coursePayload, API.authHeaders());
        } else {
          throw errCourse;
        }
      }

      showMessage('Curso salvo com sucesso.');
      console.log('Curso salvo:', courseResult);
      hideMessageAfter(1200);

      setTimeout(() => {
        try {
          window.history.back();
        } catch (e) {
          window.location.href = '/';
        }
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar curso/disciplinas:', err);
      const msg = err?.payload?.error || err?.payload?.message || err?.message || 'Erro ao salvar';
      showMessage(msg, 'error');
      hideMessageAfter(4000);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar';
    }
  }

  
  addBtn.addEventListener('click', () => addDiscipline(discInput.value));
  removeSelectedBtn.addEventListener('click', removeSelected);
  saveBtn.addEventListener('click', save);

  discInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDiscipline(discInput.value);
    }
  });

  
  window.__UNI_DISCIPLINES = { get: () => disciplines, render };
  render();
  
  // Carregar disciplinas ao iniciar
  loadDisciplines();
});

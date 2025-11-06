// script.js — Novo Curso (integra com global.js)
// Versão corrigida: garante que mock_db_v1 tenha coleções `disciplinas` e `cursos` no modo teste
document.addEventListener('DOMContentLoaded', () => {
  const courseInput = document.getElementById('courseName');
  const discInput = document.getElementById('disciplineInput');
  const addBtn = document.getElementById('addBtn');
  const removeSelectedBtn = document.getElementById('removeSelectedBtn');
  const listEl = document.getElementById('disciplinesList');
  const saveBtn = document.getElementById('saveBtn');
  const messageEl = document.getElementById('message');

  const disciplines = [];

  // Cursos permitidos (exibidos)
  const CURSO_OPCOES = ['ADS', 'Marketing', 'Administração'];

  (function createCourseDatalist(){
    let dl = document.getElementById('course-options-datalist');
    if (!dl) {
      dl = document.createElement('datalist');
      dl.id = 'course-options-datalist';
      CURSO_OPCOES.forEach(c => {
        const o = document.createElement('option');
        o.value = c;
        dl.appendChild(o);
      });
      document.body.appendChild(dl);
    }
    if (courseInput) courseInput.setAttribute('list', dl.id);
  })();

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

  function addDiscipline(name) {
    const clean = sanitize(name);
    if (!clean) { showMessage('Informe o nome da disciplina.', 'error'); return; }
    const exists = disciplines.some(d => d.name.toLowerCase() === clean.toLowerCase());
    if (exists) { showMessage('Disciplina já adicionada.', 'error'); return; }
    disciplines.push({ name: clean, checked: false });
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

  // Se mock (API.getMockDb disponível), garante coleções existentes
  function ensureMockCollectionsExist(names = []) {
    try {
      if (typeof API === 'undefined' || typeof API.getMockDb !== 'function') return;
      const mock = API.getMockDb();
      if (!mock) return;
      let changed = false;
      names.forEach(n => {
        if (!Array.isArray(mock[n])) {
          mock[n] = [];
          changed = true;
        }
      });
      if (changed) {
        // persiste diretamente no localStorage (mock_db_v1)
        localStorage.setItem('mock_db_v1', JSON.stringify(mock));
        console.log('[script] mock_db_v1 atualizado com coleções:', names);
      }
    } catch (e) {
      console.warn('[script] falha ao garantir coleções no mock:', e);
    }
  }

  // upsert discipline helper (POST then PUT on conflict)
  async function upsertDiscipline(discPayload) {
    const svc = API.disciplinas || API.resource('disciplinas');
    try {
      return await svc.create(discPayload);
    } catch (err) {
      if (err && err.status === 409) {
        // tenta PUT
        const code = discPayload.codigo || codeFromName(discPayload.nome);
        return await svc.update(encodeURIComponent(code), discPayload);
      }
      // se recurso não encontrado (mock sem coleção) lançará aqui — propagar
      throw err;
    }
  }

  // main save adapted to mock presence
  async function save() {
    hideMessage();
    const courseName = sanitize(courseInput.value);
    if (!courseName) { showMessage('Informe o nome do curso antes de salvar.', 'error'); return; }
    if (disciplines.length === 0) { showMessage('Adicione ao menos uma disciplina antes de salvar.', 'error'); return; }

    // valida curso contra opções (exige uma das 3)
    const okCurso = CURSO_OPCOES.some(c => c.toLowerCase() === courseName.toLowerCase());
    if (!okCurso) {
      showMessage(`Curso inválido. Opções: ${CURSO_OPCOES.join(', ')}.`, 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') throw new Error('API global não encontrado. Verifique se global.js foi carregado antes.');

      // garantir coleções no mock para evitar "Recurso não encontrado"
      ensureMockCollectionsExist(['disciplinas', 'cursos']);

      const disciplinasSvc = API.disciplinas || API.resource('disciplinas');
      const cursosSvc = API.cursos || API.resource('cursos');

      // 1) Upsert each discipline (POST then PUT on conflict)
      const createdDiscs = [];
      for (const d of disciplines) {
        const discCode = codeFromName(d.name);
        const discPayload = { codigo: discCode, nome: d.name, carga_horaria: d.carga_horaria || 60 };
        try {
          const created = await upsertDiscipline(discPayload);
          createdDiscs.push(created);
        } catch (err) {
          // detectar caso de recurso não encontrado no mock
          if (err && err.payload && (String(err.payload.message).toLowerCase().includes('recurso não encontrado') || String(err.message).toLowerCase().includes('recurso não encontrado'))) {
            // tentamos criar a coleção e repetir (segunda chance)
            try {
              ensureMockCollectionsExist(['disciplinas', 'cursos']);
              const created2 = await upsertDiscipline(discPayload);
              createdDiscs.push(created2);
            } catch (err2) {
              throw err2;
            }
          } else {
            throw err;
          }
        }
      }

      // 2) Create or update course: codigo derived from name
      const courseCode = codeFromName(courseName);
      const coursePayload = {
        codigo: courseCode,
        nome: courseName,
        disciplinas: createdDiscs.map(cd => (cd.codigo || cd.nome || codeFromName(cd.nome || cd)))
      };

      let courseResult = null;
      try {
        courseResult = await cursosSvc.create(coursePayload);
      } catch (errCourse) {
        if (errCourse && errCourse.status === 409) {
          courseResult = await cursosSvc.update(encodeURIComponent(courseCode), coursePayload);
        } else if (errCourse && (String(errCourse.message).toLowerCase().includes('recurso não encontrado') || (errCourse.payload && String(errCourse.payload.message).toLowerCase().includes('recurso não encontrado')))) {
          // no mock, criar coleção e tentar de novo
          ensureMockCollectionsExist(['cursos']);
          courseResult = await cursosSvc.create(coursePayload);
        } else {
          throw errCourse;
        }
      }

      // sucesso geral
      showMessage('Curso e disciplinas salvos com sucesso.');
      console.log('Curso salvo:', courseResult);
      hideMessageAfter(1200);

      setTimeout(() => {
        try { window.history.back(); } catch (e) { window.location.href = '/'; }
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar curso/disciplinas:', err);
      const msg = err?.payload?.message || err?.message || 'Erro ao salvar';
      showMessage(msg, 'error');
      hideMessageAfter(4000);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar';
    }
  }

  // eventos
  addBtn.addEventListener('click', () => addDiscipline(discInput.value));
  removeSelectedBtn.addEventListener('click', removeSelected);
  saveBtn.addEventListener('click', save);

  discInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDiscipline(discInput.value);
    }
  });

  // expose and render
  window.__UNI_DISCIPLINES = { get: () => disciplines, render };
  render();
});

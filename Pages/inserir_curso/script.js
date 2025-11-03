

document.addEventListener('DOMContentLoaded', () => {
  const courseInput = document.getElementById('courseName');
  const discInput = document.getElementById('disciplineInput');
  const addBtn = document.getElementById('addBtn');
  const removeSelectedBtn = document.getElementById('removeSelectedBtn');
  const listEl = document.getElementById('disciplinesList');
  const saveBtn = document.getElementById('saveBtn');
  const messageEl = document.getElementById('message');

 
  const disciplines = [];

  
  function sanitize(str){
    if (str === null || str === undefined) return '';
    return String(str).trim();
  }

  function showMessage(text, type = 'info') {
    messageEl.hidden = false;
    messageEl.textContent = text;
    messageEl.style.background = (type === 'error') ? '#f8d7da' : '#d1e7dd';
    messageEl.style.color = (type === 'error') ? '#842029' : '#0f5132';
    
    setTimeout(() => { messageEl.hidden = true; }, 4000);
  }

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
      chk.addEventListener('change', () => {
        d.checked = chk.checked;
      });

      
      const name = document.createElement('div');
      name.className = 'item-name';
      name.textContent = d.name;

     
      const removeBtn = document.createElement('button');
      removeBtn.className = 'item-remove';
      removeBtn.type = 'button';
      removeBtn.innerHTML = 'Remover';
      removeBtn.addEventListener('click', () => {
        removeAtIndex(idx);
      });

      li.appendChild(chk);
      li.appendChild(name);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }

  function addDiscipline(name) {
    const clean = sanitize(name);
    if (!clean) {
      showMessage('Informe o nome da disciplina.', 'error');
      return;
    }
    
    const exists = disciplines.some(d => d.name.toLowerCase() === clean.toLowerCase());
    if (exists) {
      showMessage('Disciplina já adicionada.', 'error');
      return;
    }
    disciplines.push({ name: clean, checked: false });
    render();
    discInput.value = '';
    discInput.focus();
  }

  function removeAtIndex(index) {
    if (index >= 0 && index < disciplines.length) {
      disciplines.splice(index, 1);
      render();
    }
  }

  function removeSelected() {
    const before = disciplines.length;
    for (let i = disciplines.length - 1; i >= 0; i--) {
      if (disciplines[i].checked) disciplines.splice(i, 1);
    }
    if (disciplines.length === before) {
      showMessage('Nenhuma disciplina selecionada para remoção.', 'error');
    } else {
      render();
    }
  }

  function save() {
    const courseName = sanitize(courseInput.value);
    if (!courseName) {
      showMessage('Informe o nome do curso antes de salvar.', 'error');
      return;
    }
    if (disciplines.length === 0) {
      showMessage('Adicione ao menos uma disciplina antes de salvar.', 'error');
      return;
    }

    
    const payload = {
      course: courseName,
      disciplines: disciplines.map(d => ({ name: d.name, selected: !!d.checked }))
    };

    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    
    fetch('/api/disciplinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar';
      if (!res.ok) {
        let msg = 'Erro ao salvar.';
        try {
          const json = await res.json();
          if (json && json.message) msg = json.message;
        } catch (e) {  }
        throw new Error(msg);
      }
      showMessage('Curso e disciplinas salvos com sucesso.');
      
    })
    .catch(err => {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar';
      console.error(err);
      showMessage(err.message || 'Erro ao salvar no servidor.', 'error');
    });
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
});

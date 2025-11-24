
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('docenteForm');
  if (!form) return console.warn('Form #docenteForm não encontrado');

  const cpfInput = document.getElementById('cpf');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const telefoneInput = document.getElementById('telefone');
  const grauSelect = document.getElementById('grau');
  const disciplinaSelect = document.getElementById('disciplina');
  const cargaInput = document.getElementById('carga');
  const messageEl = document.getElementById('message');

  let allDisciplinas = [];

  function setMessage(txt, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = txt || '';
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
    messageEl.className = 'message' + (isError ? ' error' : ' success');
  }

  function setFormEditable(enabled) {
    [cpfInput, nomeInput, emailInput, telefoneInput, grauSelect, disciplinaSelect, cargaInput].forEach(i => { if (!i) return; i.disabled = !enabled; });
    if (enabled) cpfInput.focus();
  }

  let podeEditar = false;

  function updatePermissionAndUI(source='init') {
    const usuario = (typeof API !== 'undefined') ? API.getUsuarioLogado() : null;
    const novo = Boolean(usuario && window.isEditorFromUser(usuario));
    console.log('[inserir-docente] updatePermissionAndUI', { source, usuario, novo });
    podeEditar = novo;
    if (podeEditar) {
      setFormEditable(true);
      setMessage('Preencha os dados do docente. Se o CPF já existir, será atualizado; caso contrário, será criado um novo usuário.');
    } else {
      setFormEditable(false);
      if (!usuario) setMessage('Faça login como funcionário ou gerente para editar.', true);
      else setMessage('Apenas funcionários ou gerentes podem inserir/alterar docentes.', true);
    }
  }

  
  updatePermissionAndUI('first');
  setTimeout(()=>updatePermissionAndUI('retry-200ms'), 200);
  setTimeout(()=>updatePermissionAndUI('retry-1000ms'), 1000);

  if (typeof API !== 'undefined' && typeof API.onAuthChange === 'function') {
    API.onAuthChange((u) => {
      console.log('[inserir-docente] onAuthChange', u);
      updatePermissionAndUI('onAuthChange');
      if (window.isEditorFromUser(u)) form.reset();
    });
  } else {
    console.warn('[inserir-docente] API.onAuthChange não disponível — verifique ordem dos scripts');
  }

  
  function validarCarga(val) {
    if (val == null || val === '') return false;
    const n = Number(val);
    return Number.isFinite(n) && n > 0;
  }

  // Carregar disciplinas
  async function loadDisciplinas() {
    try {
      const result = await API.get('/disciplinas', null, API.authHeaders());
      allDisciplinas = result || [];
      
      disciplinaSelect.innerHTML = '<option value="">Selecione uma disciplina...</option>';
      allDisciplinas.forEach(disc => {
        const option = document.createElement('option');
        option.value = disc.nome;
        option.textContent = disc.nome;
        disciplinaSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar disciplinas:', err);
      setMessage('Erro ao carregar disciplinas.', true);
    }
  }

  // Carregar graus acadêmicos
  async function loadGraus() {
    try {
      const result = await API.get('/graus-academicos', null, API.authHeaders());
      const graus = result || [];
      
      grauSelect.innerHTML = '<option value="">Selecione um grau acadêmico...</option>';
      graus.forEach(grau => {
        const option = document.createElement('option');
        option.value = grau.nome;
        option.textContent = grau.nome;
        grauSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar graus acadêmicos:', err);
      setMessage('Erro ao carregar graus acadêmicos.', true);
    }
  }

  
  cpfInput && cpfInput.addEventListener('blur', async () => {
    const cpf = (cpfInput.value || '').replace(/\D/g, '').trim();
    if (!cpf) return;
    try {
      const usuariosSvc = API.usuarios || API.resource('usuarios');
      const user = await usuariosSvc.getById(encodeURIComponent(cpf));
      if (user) {
        if (user.nome && nomeInput) nomeInput.value = user.nome;
        if (user.email && emailInput) emailInput.value = user.email;
        if (user.telefone && telefoneInput) telefoneInput.value = user.telefone;
        if (user.grau_academico && grauSelect) grauSelect.value = user.grau_academico;
        if (user.disciplina && disciplinaSelect) disciplinaSelect.value = user.disciplina;
        if (user.carga_horaria && cargaInput) cargaInput.value = user.carga_horaria;
        setMessage('Dados do usuário carregados (registro existente).');
      }
    } catch (err) {
      if (err && err.status === 404) {
        
      } else {
        console.error(err);
      }
    }
  });

  
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('');

    updatePermissionAndUI('before-submit');
    if (!podeEditar) { setMessage('Você não tem permissão para executar esta operação.', true); return; }

    const cpfRaw = (cpfInput.value || '').replace(/\D/g, '').trim();
    const nome = (nomeInput.value || '').trim();
    const email = (emailInput.value || '').trim();
    const telefone = (telefoneInput.value || '').trim();
    const grau = (grauSelect.value || '').trim();
    const disciplina = (disciplinaSelect.value || '').trim();
    const carga = (cargaInput.value || '').trim();

    if (!cpfRaw || cpfRaw.length !== 11) { setMessage('CPF deve ter 11 dígitos.', true); cpfInput.focus(); return; }
    if (!nome) { setMessage('Nome é obrigatório.', true); nomeInput.focus(); return; }
    if (!email) { setMessage('Email é obrigatório.', true); emailInput.focus(); return; }
    if (!grau) { setMessage('Grau acadêmico é obrigatório.', true); grauSelect.focus(); return; }
    if (!disciplina) { setMessage('Disciplina é obrigatória.', true); disciplinaSelect.focus(); return; }
    if (!validarCarga(carga)) { setMessage('Carga horária inválida (deve ser número > 0).', true); cargaInput.focus(); return; }

    try {
      setMessage('Verificando existência do usuário...');
      const usuariosSvc = API.usuarios || API.resource('usuarios');
      const docentesSvc = API.docentes || API.resource('docentes');

      let usuarioExistente = null;
      let isUpdate = false;
      
      try {
        usuarioExistente = await usuariosSvc.getById(encodeURIComponent(cpfRaw));
        isUpdate = true;
      } catch (err) {
        const is404 = err && (err.status === 404 || (err.payload && String(err.payload.message||'').toLowerCase().includes('não encontrado')));
        if (!is404) throw err;
      }

      let usuarioResult;
      
      if (isUpdate) {
        // Atualizar usuário existente
        const payloadUsuario = {
          nome: nome,
          email: email,
          telefone: telefone,
          tipo_conta: 'docente',
          grau_academico: grau,
          disciplina: disciplina,
          carga_horaria: Number(carga)
        };
        setMessage('Atualizando usuário...');
        usuarioResult = await usuariosSvc.update(encodeURIComponent(cpfRaw), payloadUsuario);
      } else {
        // Criar novo usuário
        const payloadUsuario = {
          cpf: cpfRaw,
          nome: nome,
          email: email,
          telefone: telefone,
          tipo_conta: 'docente',
          senha: 'senha123',
          grau_academico: grau,
          disciplina: disciplina,
          carga_horaria: Number(carga)
        };
        setMessage('Criando novo docente...');
        usuarioResult = await usuariosSvc.create(payloadUsuario);
      }

      
      try {
        let docenteExistente = null;
        try {
          docenteExistente = await docentesSvc.getById(encodeURIComponent(cpfRaw));
        } catch (errD) {
          const is404d = errD && (errD.status === 404 || (errD.payload && String(errD.payload.message||'').toLowerCase().includes('não encontrado')));
          if (is404d) docenteExistente = null;
          else throw errD;
        }

        if (docenteExistente) {
          const payloadDocente = Object.assign({}, docenteExistente, {
            cpf: cpfRaw,
            grau_academico: grau,
            disciplina: disciplina,
            carga_horaria: Number(carga)
          });
          await docentesSvc.update(encodeURIComponent(cpfRaw), payloadDocente);
        } else {
          
          console.warn('Registro em "docentes" não encontrado para este CPF — não será criado (apenas PUT).');
        }
      } catch (errDocUpd) {
        console.warn('Erro ao atualizar coleção docentes (PUT):', errDocUpd);
      }

      
      const usuarioLogado = API.getUsuarioLogado();
      if (usuarioLogado && (usuarioLogado.cpf === cpfRaw || usuarioLogado.cnpj === cpfRaw)) {
        const merged = Object.assign({}, usuarioLogado, usuarioResult);
        API.setUsuarioLogado(merged);
      }

      
      const successMsg = isUpdate ? 'Docente atualizado com sucesso!' : 'Docente criado com sucesso!';
      setMessage(successMsg, false);
      console.log(isUpdate ? 'Docente atualizado:' : 'Docente criado:', usuarioResult);
      
      setTimeout(() => {
        form.reset();
        setMessage('');
      }, 2000);

    } catch (err) {
      console.error('Erro ao atualizar docente:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao salvar';
      setMessage(`Erro: ${text}`, true);
    }
  });

  // Carregar disciplinas e graus ao iniciar
  loadDisciplinas();
  loadGraus();

});

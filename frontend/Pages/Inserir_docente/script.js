
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('docenteForm');
  if (!form) return console.warn('Form #docenteForm não encontrado');

  const cpfInput = document.getElementById('cpf');
  const grauInput = document.getElementById('grau');
  const disciplinaInput = document.getElementById('disciplina');
  const cargaInput = document.getElementById('carga');
  const messageEl = document.getElementById('message');

  function setMessage(txt, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = txt || '';
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
    messageEl.className = 'message' + (isError ? ' error' : ' success');
  }

  
  function normalizeTipoFromUser(u) {
    if (!u) return '';
    const cands = [u.tipo_conta, u.tipoConta, u.tipo, u.role, u.role_name];
    for (const c of cands) {
      if (!c && c !== 0) continue;
      const s = String(c).trim().toLowerCase();
      if (s) return s;
    }
    return '';
  }
  function isEditorFromUser(u) {
    const t = normalizeTipoFromUser(u);
    const ok = ['funcionario','funcionário','gerente','adm','administrador','admin','staff','func'];
    return ok.includes(t);
  }

  function setFormEditable(enabled) {
    [cpfInput, grauInput, disciplinaInput, cargaInput].forEach(i => { if (!i) return; i.disabled = !enabled; });
    if (enabled) cpfInput.focus();
  }

  let podeEditar = false;

  function updatePermissionAndUI(source='init') {
    const usuario = (typeof API !== 'undefined') ? API.getUsuarioLogado() : null;
    const novo = Boolean(usuario && isEditorFromUser(usuario));
    console.log('[inserir-docente] updatePermissionAndUI', { source, usuario, novo });
    podeEditar = novo;
    if (podeEditar) {
      setFormEditable(true);
      setMessage('Preencha CPF, grau, disciplina e carga horária. Ao salvar será feito PUT em /usuarios/:cpf e PUT /docentes/:cpf (se existir).');
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
      if (isEditorFromUser(u)) form.reset();
    });
  } else {
    console.warn('[inserir-docente] API.onAuthChange não disponível — verifique ordem dos scripts');
  }

  
  function validarCarga(val) {
    if (val == null || val === '') return false;
    const n = Number(val);
    return Number.isFinite(n) && n > 0;
  }

  
  cpfInput && cpfInput.addEventListener('blur', async () => {
    const cpf = (cpfInput.value || '').replace(/\D/g, '').trim();
    if (!cpf) return;
    try {
      const usuariosSvc = API.usuarios || API.resource('usuarios');
      const user = await usuariosSvc.getById(encodeURIComponent(cpf));
      if (user) {
        
        if (user.grau_academico && grauInput) grauInput.value = user.grau_academico;
        if (user.disciplina && disciplinaInput) disciplinaInput.value = user.disciplina;
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
    const grau = (grauInput.value || '').trim();
    const disciplina = (disciplinaInput.value || '').trim();
    const carga = (cargaInput.value || '').trim();

    if (!cpfRaw) { setMessage('CPF é obrigatório.', true); cpfInput.focus(); return; }
    if (!grau) { setMessage('Grau acadêmico é obrigatório.', true); grauInput.focus(); return; }
    if (!disciplina) { setMessage('Disciplina é obrigatória.', true); disciplinaInput.focus(); return; }
    if (!validarCarga(carga)) { setMessage('Carga horária inválida (deve ser número > 0).', true); cargaInput.focus(); return; }

    try {
      setMessage('Verificando existência do usuário (PUT obrigatório)...');
      const usuariosSvc = API.usuarios || API.resource('usuarios');
      const docentesSvc = API.docentes || API.resource('docentes');

      
      let usuarioExistente = null;
      try {
        usuarioExistente = await usuariosSvc.getById(encodeURIComponent(cpfRaw));
      } catch (err) {
        const is404 = err && (err.status === 404 || (err.payload && String(err.payload.message||'').toLowerCase().includes('não encontrado')));
        if (is404) {
          setMessage('Usuário com este CPF não existe. Não é permitido criar novo docente aqui (somente atualização).', true);
          return;
        }
        throw err;
      }

      
      const payloadUsuario = Object.assign({}, usuarioExistente, {
        tipo_conta: 'docente',
        grau_academico: grau,
        disciplina: disciplina,
        carga_horaria: Number(carga)
      });

      setMessage('Atualizando usuário (PUT)...');
      const usuarioResult = await usuariosSvc.update(encodeURIComponent(cpfRaw), payloadUsuario);

      
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

      
      setMessage('Docente atualizado com sucesso. Voltando...', false);
      console.log('Docente atualizado (PUT):', usuarioResult);
      setTimeout(() => { try { window.history.back(); } catch(e) { window.location.href = '/'; } }, 1000);

    } catch (err) {
      console.error('Erro ao atualizar docente:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao salvar';
      setMessage(`Erro: ${text}`, true);
    }
  });

});

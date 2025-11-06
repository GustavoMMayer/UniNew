
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('alunoForm');
  if (!form) return console.warn('Form #alunoForm não encontrado');

  const cpfInput = document.getElementById('cpf');
  const cursoInput = document.getElementById('curso');
  const situacaoInput = document.getElementById('situacao');
  const messageEl = document.getElementById('message');

  const CURSOS = ['ADS', 'Marketing', 'Administração'];
  const SITUACOES = ['Ativo', 'Inativo'];

  
  (function createDatalists(){
    if (cursoInput) {
      let dl = document.getElementById('cursos-datalist');
      if (!dl) {
        dl = document.createElement('datalist'); dl.id = 'cursos-datalist';
        CURSOS.forEach(c => { const o = document.createElement('option'); o.value = c; dl.appendChild(o); });
        document.body.appendChild(dl);
      }
      cursoInput.setAttribute('list', 'cursos-datalist');
    }
    if (situacaoInput) {
      let dl2 = document.getElementById('situacoes-datalist');
      if (!dl2) {
        dl2 = document.createElement('datalist'); dl2.id = 'situacoes-datalist';
        SITUACOES.forEach(s => { const o = document.createElement('option'); o.value = s; dl2.appendChild(o); });
        document.body.appendChild(dl2);
      }
      situacaoInput.setAttribute('list', 'situacoes-datalist');
    }
  })();

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
    [cpfInput, cursoInput, situacaoInput].forEach(i => { if (!i) return; i.disabled = !enabled; });
    if (enabled) cpfInput.focus();
  }

  
  let podeEditar = false;

  
  function updatePermissionAndUI(source='init') {
    const usuario = (typeof API !== 'undefined') ? API.getUsuarioLogado() : null;
    const novo = Boolean(usuario && isEditorFromUser(usuario));
    console.log('[inserir-aluno] updatePermissionAndUI', { source, usuario, novo });
    podeEditar = novo;
    if (podeEditar) {
      setFormEditable(true);
      setMessage('Preencha CPF, curso e situação. Ao salvar será feito PUT em /usuarios/:cpf.');
    } else {
      setFormEditable(false);
      if (!usuario) setMessage('Faça login como funcionário ou gerente para editar.', true);
      else setMessage('Apenas funcionários ou gerentes podem inserir/alterar dados de aluno.', true);
    }
  }

  
  updatePermissionAndUI('first');
  setTimeout(()=>updatePermissionAndUI('retry-200ms'), 200);
  setTimeout(()=>updatePermissionAndUI('retry-1000ms'), 1000);

  
  if (typeof API !== 'undefined' && typeof API.onAuthChange === 'function') {
    API.onAuthChange((u) => {
      console.log('[inserir-aluno] onAuthChange', u);
      updatePermissionAndUI('onAuthChange');
      
      if (isEditorFromUser(u)) form.reset();
    });
  } else {
    console.warn('[inserir-aluno] API.onAuthChange não disponível — verifique ordem de scripts');
  }

  function validarCurso(val) { return CURSOS.some(c => c.toLowerCase() === String(val||'').toLowerCase()); }
  function validarSituacao(val) { return SITUACOES.some(s => s.toLowerCase() === String(val||'').toLowerCase()); }

  
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('');

    
    updatePermissionAndUI('before-submit');
    if (!podeEditar) { setMessage('Você não tem permissão para executar essa operação.', true); return; }

    const cpfRaw = (cpfInput.value || '').replace(/\D/g, '').trim();
    const curso = (cursoInput.value || '').trim();
    const situacao = (situacaoInput.value || '').trim();

    if (!cpfRaw) { setMessage('CPF é obrigatório.', true); cpfInput.focus(); return; }
    if (!curso) { setMessage('Curso é obrigatório.', true); cursoInput.focus(); return; }
    if (!situacao) { setMessage('Situação é obrigatória.', true); situacaoInput.focus(); return; }
    if (!validarCurso(curso)) { setMessage(`Curso inválido. Opções: ${CURSOS.join(', ')}`, true); cursoInput.focus(); return; }
    if (!validarSituacao(situacao)) { setMessage(`Situação inválida. Opções: ${SITUACOES.join(', ')}`, true); situacaoInput.focus(); return; }

    try {
      setMessage('Verificando existência do usuário (PUT obrigatório)...');

      const usuariosSvc = API.usuarios || API.resource('usuarios');
      const alunosSvc = API.alunos || API.resource('alunos');

      
      let usuarioExistente = null;
      try {
        usuarioExistente = await usuariosSvc.getById(encodeURIComponent(cpfRaw));
      } catch (err) {
        const is404 = err && (err.status === 404 || (err.payload && String(err.payload.message||'').toLowerCase().includes('não encontrado')));
        if (is404) {
          setMessage('Usuário com este CPF não existe. Não é permitido criar novo aluno aqui (somente atualização).', true);
          return;
        }
        throw err;
      }

      
      const payload = Object.assign({}, usuarioExistente, {
        curso: curso,
        situacao: situacao,
        tipo_conta: 'aluno'
      });

      setMessage('Atualizando usuário (PUT)...');
      const usuarioResult = await usuariosSvc.update(encodeURIComponent(cpfRaw), payload);

      
      try {
        let alunoExistente = null;
        try {
          alunoExistente = await alunosSvc.getById(encodeURIComponent(cpfRaw));
        } catch (errA) {
          const is404a = errA && (errA.status === 404 || (errA.payload && String(errA.payload.message||'').toLowerCase().includes('não encontrado')));
          if (is404a) alunoExistente = null;
          else throw errA;
        }

        if (alunoExistente) {
          const alunoPayload = {
            cpf: cpfRaw,
            nome: usuarioResult.nome || usuarioResult.name || '',
            email: usuarioResult.email || '',
            telefone: usuarioResult.telefone || '',
            curso: curso,
            situacao: situacao
          };
          await alunosSvc.update(encodeURIComponent(cpfRaw), alunoPayload);
        } else {
          console.warn('Coleção "alunos" sem registro para este CPF — não será criado (apenas PUT).');
        }
      } catch (errAlunoUpd) {
        console.warn('Erro ao atualizar coleção alunos (PUT):', errAlunoUpd);
      }

      
      const usuarioLogado = API.getUsuarioLogado();
      if (usuarioLogado && (usuarioLogado.cpf === cpfRaw || usuarioLogado.cnpj === cpfRaw)) {
        const merged = Object.assign({}, usuarioLogado, usuarioResult);
        API.setUsuarioLogado(merged);
      }

      
      setMessage('Dados do aluno atualizados com sucesso. Voltando...', false);
      console.log('Usuário atualizado (PUT):', usuarioResult);
      setTimeout(() => { try { window.history.back(); } catch(e) { window.location.href = '/'; } }, 1000);

    } catch (err) {
      console.error('Erro ao atualizar aluno:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao salvar';
      setMessage(`Erro: ${text}`, true);
    }
  });

  
  cpfInput && cpfInput.addEventListener('blur', async () => {
    const cpfRaw = (cpfInput.value || '').replace(/\D/g, '').trim();
    if (!cpfRaw) return;
    try {
      const usuariosSvc = API.usuarios || API.resource('usuarios');
      const user = await usuariosSvc.getById(encodeURIComponent(cpfRaw));
      if (user) {
        if (user.curso && cursoInput) cursoInput.value = user.curso;
        if (user.situacao && situacaoInput) situacaoInput.value = user.situacao;
        setMessage('Dados do usuário carregados (registro existente).');
      }
    } catch (err) {
      if (err && err.status === 404) {
        
      } else {
        console.error(err);
      }
    }
  });

  
  cursoInput && cursoInput.addEventListener('input', () => {
    if (!cursoInput.value) { cursoInput.setCustomValidity(''); return; }
    if (!validarCurso(cursoInput.value)) { cursoInput.setCustomValidity('Curso inválido.'); cursoInput.reportValidity(); }
    else cursoInput.setCustomValidity('');
  });
  situacaoInput && situacaoInput.addEventListener('input', () => {
    if (!situacaoInput.value) { situacaoInput.setCustomValidity(''); return; }
    if (!validarSituacao(situacaoInput.value)) { situacaoInput.setCustomValidity('Situação inválida.'); situacaoInput.reportValidity(); }
    else situacaoInput.setCustomValidity('');
  });

});

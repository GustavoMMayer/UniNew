document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gerenciaForm');
  const pessoasSelect = document.getElementById('pessoas');
  const docentesSelect = document.getElementById('docentes');
  const fornecedoresSelect = document.getElementById('fornecedores');
  const funcionariosSelect = document.getElementById('funcionarios');
  const alunosSelect = document.getElementById('alunos');
  const messageEl = document.getElementById('message');

  function showMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = 'message' + (isError ? ' error' : ' success');
  }

  // Verificar autenticação e permissão
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    showMessage('Você precisa estar logado para acessar esta página.', true);
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente') {
    showMessage('Apenas funcionários e gerentes podem acessar esta página.', true);
    setTimeout(() => window.history.back(), 2000);
    return;
  }

  // Carregar dados de cada entidade
  async function loadData() {
    try {
      showMessage('Carregando dados...');

      // Carregar todas as entidades em paralelo
      const [usuarios, fornecedores] = await Promise.all([
        API.get('/usuarios', null, API.authHeaders()),
        API.get('/fornecedores', null, API.authHeaders())
      ]);

      // Filtrar usuários por tipo
      const alunos = usuarios.filter(u => u.tipo_conta === 'aluno');
      const docentes = usuarios.filter(u => u.tipo_conta === 'docente');
      const funcionarios = usuarios.filter(u => u.tipo_conta === 'funcionario');

      // Preencher select de pessoas
      pessoasSelect.innerHTML = '<option value="">Selecione uma pessoa...</option>';
      usuarios.forEach(u => {
        const option = document.createElement('option');
        option.value = u.cpf;
        option.textContent = `${u.nome} (${u.cpf}) - ${u.tipo_conta}`;
        pessoasSelect.appendChild(option);
      });

      // Preencher select de docentes
      docentesSelect.innerHTML = '<option value="">Selecione um docente...</option>';
      docentes.forEach(d => {
        const option = document.createElement('option');
        option.value = d.cpf;
        option.textContent = `${d.nome} (${d.cpf})`;
        docentesSelect.appendChild(option);
      });

      // Preencher select de fornecedores
      fornecedoresSelect.innerHTML = '<option value="">Selecione um fornecedor...</option>';
      fornecedores.forEach(f => {
        const option = document.createElement('option');
        option.value = f.cnpj;
        option.textContent = `${f.razao_social} (${f.cnpj})`;
        fornecedoresSelect.appendChild(option);
      });

      // Preencher select de funcionários
      funcionariosSelect.innerHTML = '<option value="">Selecione um funcionário...</option>';
      funcionarios.forEach(func => {
        const option = document.createElement('option');
        option.value = func.cpf;
        option.textContent = `${func.nome} (${func.cpf})`;
        funcionariosSelect.appendChild(option);
      });

      // Preencher select de alunos
      alunosSelect.innerHTML = '<option value="">Selecione um aluno...</option>';
      alunos.forEach(a => {
        const option = document.createElement('option');
        option.value = a.cpf;
        option.textContent = `${a.nome} (${a.cpf}) - ${a.curso || 'Sem curso'}`;
        alunosSelect.appendChild(option);
      });

      showMessage('Dados carregados. Selecione os itens que deseja excluir.');
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      showMessage('Erro ao carregar dados: ' + (err?.message || 'Erro desconhecido'), true);
    }
  }

  // Excluir itens selecionados
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pessoaSelecionada = pessoasSelect.value;
    const docenteSelecionado = docentesSelect.value;
    const fornecedorSelecionado = fornecedoresSelect.value;
    const funcionarioSelecionado = funcionariosSelect.value;
    const alunoSelecionado = alunosSelect.value;

    const selecionados = [
      pessoaSelecionada,
      docenteSelecionado,
      fornecedorSelecionado,
      funcionarioSelecionado,
      alunoSelecionado
    ].filter(Boolean);

    if (selecionados.length === 0) {
      showMessage('Selecione pelo menos um item para excluir.', true);
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir ${selecionados.length} item(ns) selecionado(s)? Esta ação não pode ser desfeita!`)) {
      return;
    }

    showMessage('Excluindo itens...');
    let sucessos = 0;
    let erros = 0;

    try {
      // Excluir pessoa (usuário)
      if (pessoaSelecionada) {
        try {
          await API.delete(`/usuarios/${pessoaSelecionada}`, null, API.authHeaders());
          sucessos++;
        } catch (err) {
          console.error(`Erro ao excluir usuário ${pessoaSelecionada}:`, err);
          erros++;
        }
      }

      // Excluir docente (usuário)
      if (docenteSelecionado && docenteSelecionado !== pessoaSelecionada) {
        try {
          await API.delete(`/usuarios/${docenteSelecionado}`, null, API.authHeaders());
          sucessos++;
        } catch (err) {
          console.error(`Erro ao excluir docente ${docenteSelecionado}:`, err);
          erros++;
        }
      }

      // Excluir fornecedor
      if (fornecedorSelecionado) {
        try {
          await API.delete(`/fornecedores/${fornecedorSelecionado}`, null, API.authHeaders());
          sucessos++;
        } catch (err) {
          console.error(`Erro ao excluir fornecedor ${fornecedorSelecionado}:`, err);
          erros++;
        }
      }

      // Excluir funcionário (usuário)
      if (funcionarioSelecionado && funcionarioSelecionado !== pessoaSelecionada) {
        try {
          await API.delete(`/usuarios/${funcionarioSelecionado}`, null, API.authHeaders());
          sucessos++;
        } catch (err) {
          console.error(`Erro ao excluir funcionário ${funcionarioSelecionado}:`, err);
          erros++;
        }
      }

      // Excluir aluno (usuário)
      if (alunoSelecionado && alunoSelecionado !== pessoaSelecionada) {
        try {
          await API.delete(`/usuarios/${alunoSelecionado}`, null, API.authHeaders());
          sucessos++;
        } catch (err) {
          console.error(`Erro ao excluir aluno ${alunoSelecionado}:`, err);
          erros++;
        }
      }

      if (erros === 0) {
        showMessage(`✅ ${sucessos} item(ns) excluído(s) com sucesso!`);
        // Limpar selects
        pessoasSelect.value = '';
        docentesSelect.value = '';
        fornecedoresSelect.value = '';
        funcionariosSelect.value = '';
        alunosSelect.value = '';
      } else {
        showMessage(`⚠️ ${sucessos} excluído(s), ${erros} erro(s). Verifique o console.`, true);
      }

      // Recarregar dados após 1 segundo
      setTimeout(() => loadData(), 1000);

    } catch (err) {
      console.error('Erro ao excluir itens:', err);
      showMessage('Erro ao excluir itens: ' + (err?.message || 'Erro desconhecido'), true);
    }
  });

  // Carregar dados ao iniciar
  loadData();
});
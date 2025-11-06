document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return console.warn('Form login não encontrado: #loginForm');

  const loginInput = document.getElementById('login');
  const senhaInput = document.getElementById('senha');
  const messageEl = document.getElementById('message');

  function setMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text || '';
    // classes: "message", "message error", "message success"
    messageEl.className = 'message' + (isError ? ' error' : ' success');
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = (loginInput.value || '').trim();
    const senha = (senhaInput.value || '').trim();

    if (!login || !senha) {
      setMessage('Por favor, preencha todos os campos.', true);
      return;
    }

    setMessage('Verificando login...');

    // monta credenciais compatíveis com o mock (MODO_TESTE) e com backends reais
    let credentialsToSend;
    if (typeof MODO_TESTE !== 'undefined' && MODO_TESTE) {
      // se parece com email usa email, senão trata como cpf
      if (login.includes('@')) {
        credentialsToSend = { email: login, senha: senha };
      } else {
        // remove caracteres não numéricos do CPF (opcional)
        const onlyDigits = login.replace(/\D/g, '');
        credentialsToSend = { cpf: onlyDigits, senha: senha };
      }
    } else {
      // modo real: username/password (ajuste se seu backend esperar outros nomes)
      credentialsToSend = { username: login, password: senha };
    }

    try {
      // Chama API.login — o global.js em modo teste encaminhará para o mock
      const resp = await API.login(credentialsToSend);

      // obtém o usuario logado salvo pelo API.login
      const usuario = API.getUsuarioLogado();

      if (!usuario) {
        setMessage('Erro ao obter dados do usuário após login.', true);
        return;
      }

      // tenta identificar o campo que guarda o tipo da conta (compatibilidade)
      const tipo = (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '').toString().toLowerCase();

      if (!tipo) {
        setMessage('Tipo de conta não informado no usuário.', true);
        console.warn('Usuário sem tipo:', usuario);
        return;
      }

      setMessage('Login bem-sucedido! Redirecionando...');

      // redireciona com base no tipo
      setTimeout(() => {
        if (tipo === 'aluno') {
          window.location.href = '/pages/menu_aluno/';
        } else if (tipo === 'docente') {
          window.location.href = '/pages/menu_docente/';
        } else if (tipo === 'funcionario' || tipo === 'gerente' || tipo === 'adm' || tipo === 'administrador') {
          window.location.href = '/pages/menu_adm/';
        } else {
          setMessage('Tipo de conta desconhecido.', true);
          console.warn('Tipo de conta não reconhecido:', tipo, usuario);
        }
      }, 600);

    } catch (err) {
      console.error('Erro no login:', err);
      // No mock, o erro traz err.payload.message; em fetch pode ser err.message
      const msg = err?.payload?.message || err?.message || 'Falha ao conectar ao servidor.';
      setMessage(msg, true);
    }
  });
});

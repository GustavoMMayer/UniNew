document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return console.warn('Form login não encontrado: #loginForm');

  const loginInput = document.getElementById('login');
  const senhaInput = document.getElementById('senha');
  const messageEl = document.getElementById('message');

  function setMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text || '';
    
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

    try {
      const resp = await API.login({ username: login, password: senha });
      const usuario = API.getUsuarioLogado();

      if (!usuario) {
        setMessage('Erro ao obter dados do usuário após login.', true);
        return;
      }

      const tipo = (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '').toString().toLowerCase();

      if (!tipo) {
        setMessage('Tipo de conta não informado no usuário.', true);
        console.warn('Usuário sem tipo:', usuario);
        return;
      }

      setMessage('Login bem-sucedido! Redirecionando...');

      setTimeout(() => {
        const redirectMap = {
          'aluno': '/pages/menu_aluno/',
          'docente': '/pages/menu_docente/',
          'funcionario': '/pages/menu_adm/',
          'gerente': '/pages/menu_adm/',
          'adm': '/pages/menu_adm/',
          'administrador': '/pages/menu_adm/'
        };
        
        const redirectUrl = redirectMap[tipo];
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          setMessage('Tipo de conta desconhecido.', true);
          console.warn('Tipo de conta não reconhecido:', tipo, usuario);
        }
      }, 600);

    } catch (err) {
      console.error('Erro no login:', err);
      const msg = err?.payload?.error || err?.payload?.message || err?.message || 'Falha ao conectar ao servidor.';
      setMessage(msg, true);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("deleteForm");
  const messageEl = document.getElementById("message");
  const nameInput = document.getElementById("name");
  const cpfInput = document.getElementById("cpf");

  // Verificar autenticação e permissão
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    setMessage('Você precisa estar logado para acessar esta página.', true);
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente') {
    setMessage('Apenas funcionários e gerentes podem excluir usuários.', true);
    setTimeout(() => window.history.back(), 2000);
    return;
  }

  function setMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.className = isError ? 'message error' : 'message success';
    messageEl.style.display = 'block';
  }

  function hideMessage() {
    messageEl.style.display = 'none';
  }

  form.addEventListener("submit", async function(event) {
    event.preventDefault();
    hideMessage();

    const nome = nameInput.value.trim();
    const cpf = cpfInput.value.replace(/\D/g, '').trim();

    // Validações
    if (!cpf || !nome) {
      setMessage('Por favor, preencha todos os campos.', true);
      return;
    }

    if (cpf.length !== 11) {
      setMessage('CPF deve ter 11 dígitos.', true);
      return;
    }

    // Confirmar exclusão
    if (!confirm(`Tem certeza que deseja excluir o usuário ${nome} (CPF: ${cpf})?`)) {
      return;
    }

    try {
      // Verificar se usuário existe
      const usuarioExiste = await API.get(`/usuarios/${cpf}`);
      
      if (!usuarioExiste) {
        setMessage('Usuário não encontrado.', true);
        return;
      }

      // Verificar se o nome confere
      if (usuarioExiste.nome.toLowerCase() !== nome.toLowerCase()) {
        setMessage('O nome não confere com o CPF informado.', true);
        return;
      }

      // Excluir usuário
      await API.delete(`/usuarios/${cpf}`);

      setMessage('✅ Usuário excluído com sucesso!');
      
      // Limpar formulário
      form.reset();

      setTimeout(() => {
        window.history.back();
      }, 1500);

    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      const msg = error?.payload?.error || error?.message || 'Erro ao excluir usuário.';
      setMessage(msg, true);
    }
  });
});

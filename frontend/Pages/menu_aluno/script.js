document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const userNameEl = document.getElementById("userName");

    // Verificar se o usuário está logado
    const usuario = API.getUsuarioLogado();
    
    if (!usuario) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "../Login/";
        return;
    }

    // Verificar se é aluno
    const tipo = (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '').toString().toLowerCase();
    if (tipo !== 'aluno') {
        alert("Esta área é exclusiva para alunos.");
        // Redirecionar para o menu correto
        if (tipo === 'docente') {
            window.location.href = "../menu_docente/";
        } else if (tipo === 'funcionario' || tipo === 'gerente') {
            window.location.href = "../menu_adm/";
        } else {
            window.location.href = "../Login/";
        }
        return;
    }

    // Exibir nome do aluno
    if (userNameEl) {
        userNameEl.textContent = usuario.nome || usuario.name || 'Aluno';
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const confirmar = confirm("Você tem certeza que deseja sair?");

            if (confirmar) {
                try {
                    // Chamar logout no backend
                    await API.logout(true);
                    console.log("Usuário deslogado com sucesso.");
                } catch (error) {
                    console.error("Erro ao fazer logout:", error);
                    // Mesmo com erro, fazer logout local
                    API.setUsuarioLogado(null);
                }
                
                window.location.href = "../Login/";
            }
        });
    }
});
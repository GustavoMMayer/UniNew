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

    // Verificar se é docente
    const tipo = (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '').toString().toLowerCase();
    if (tipo !== 'docente') {
        alert("Esta área é exclusiva para docentes.");
        // Redirecionar para o menu correto
        if (tipo === 'aluno') {
            window.location.href = "../menu_aluno/";
        } else if (tipo === 'funcionario' || tipo === 'gerente') {
            window.location.href = "../menu_adm/";
        } else {
            window.location.href = "../Login/";
        }
        return;
    }

    // Exibir nome do docente
    if (userNameEl) {
        userNameEl.textContent = usuario.nome || usuario.name || 'Docente';
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const confirmar = confirm("Você tem certeza que deseja sair?");

            if (confirmar) {
                try {
                    await API.logout(true);
                    console.log("Usuário deslogado com sucesso.");
                } catch (error) {
                    console.error("Erro ao fazer logout:", error);
                    API.setUsuarioLogado(null);
                }
                
                window.location.href = "../Login/";
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const userNameEl = document.getElementById("userName");
    const btnExcluir = document.getElementById("excluir");

    // Verificar se o usuário está logado
    const usuario = API.getUsuarioLogado();
    
    if (!usuario) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "../Login/";
        return;
    }

    // Verificar se é funcionário ou gerente
    const tipo = (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '').toString().toLowerCase();
    if (tipo !== 'funcionario' && tipo !== 'gerente') {
        alert("Esta área é exclusiva para administradores.");
        // Redirecionar para o menu correto
        if (tipo === 'aluno') {
            window.location.href = "../menu_aluno/";
        } else if (tipo === 'docente') {
            window.location.href = "../menu_docente/";
        } else {
            window.location.href = "../Login/";
        }
        return;
    }

    // Exibir nome do usuário
    if (userNameEl) {
        userNameEl.textContent = usuario.nome || usuario.name || 'Administrador';
    }

    // Controle de acesso: botão de excluir apenas para gerente
    if (btnExcluir && tipo !== "gerente") {
        btnExcluir.style.display = "none";
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

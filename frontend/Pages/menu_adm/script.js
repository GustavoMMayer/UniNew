document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const userNameEl = document.getElementById("userName");
    const btnExcluir = document.getElementById("excluir");
    const btnFuncionario = document.getElementById("btnFuncionario");

    const usuario = API.getUsuarioLogado();
    
    if (!usuario) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "../Login/";
        return;
    }

    const tipo = (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '').toString().toLowerCase();
    if (tipo !== 'funcionario' && tipo !== 'gerente') {
        alert("Esta área é exclusiva para administradores.");
        if (tipo === 'aluno') {
            window.location.href = "../menu_aluno/";
        } else if (tipo === 'docente') {
            window.location.href = "../menu_docente/";
        } else {
            window.location.href = "../Login/";
        }
        return;
    }

    if (userNameEl) {
        userNameEl.textContent = usuario.nome || usuario.name || 'Administrador';
    }

    if (tipo !== "gerente") {
        if (btnExcluir) btnExcluir.style.display = "none";
        if (btnFuncionario) btnFuncionario.style.display = "none";
    }

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

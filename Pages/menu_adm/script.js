document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const btnExcluir = document.getElementById("excluir");

    // 🔹 Obtem o tipo de usuário logado
    // Supondo que você salvou no login algo como:
    // localStorage.setItem("usuario_logado", JSON.stringify(usuario))
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario_logado") || "{}");

    // 🔹 Se não for gerente, esconde o botão
    if (usuarioLogado.tipo_conta !== "gerente") {
        btnExcluir.style.display = "none";
    }

    // 🔹 Controle de logout
    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        const confirmar = confirm("Você tem certeza que deseja sair?");
        if (confirmar) {
            // limpa os dados de sessão
            localStorage.removeItem("usuario_logado");
            console.log("Usuário deslogado.");
            window.location.href = "../login/"; 
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const btnExcluir = document.getElementById("excluir");

    
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario_logado") || "{}");

   
    if (usuarioLogado.tipo_conta !== "gerente") {
        btnExcluir.style.display = "none";
    }

    
    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        const confirmar = confirm("Você tem certeza que deseja sair?");
        if (confirmar) {
           
            localStorage.removeItem("usuario_logado");
            console.log("Usuário deslogado.");
            window.location.href = "../login/"; 
        }
    });
});

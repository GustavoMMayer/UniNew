
   
document.addEventListener("DOMContentLoaded", () => {
    
    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); 

       
        const confirmar = confirm("Você tem certeza que deseja sair?");

        if (confirmar) {
            // 2. Limpa os dados de sessão (ex: token salvo no login)
            // localStorage.removeItem("authToken");
            // sessionStorage.removeItem("userData");
            
            console.log("Usuário deslogado.");

            // 3. Redireciona para a página de login
            // A página de login está duas pastas "acima" e depois "abaixo"
            window.location.href = "../login/"; 
        }
    });

});
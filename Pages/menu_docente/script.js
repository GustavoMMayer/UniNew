
   
document.addEventListener("DOMContentLoaded", () => {
    
    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault(); 

       
        const confirmar = confirm("Você tem certeza que deseja sair?");

        if (confirmar) {
            
            
            console.log("Usuário deslogado.");

            
            window.location.href = "../login/"; 
        }
    });

});
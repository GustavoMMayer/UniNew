   
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    
    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;
    const messageEl = document.getElementById("message");

    
    if (login === "" || senha === "") {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    
    const data = {
        username: login,
        password: senha
    };

    
    try {
        
        const response = await fetch("https://sua-api.com/api/v1/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            
            messageEl.textContent = "Login bem-sucedido! Redirecionando...";
            messageEl.className = "message success";
            
            
            
            
            setTimeout(() => {
                
                window.location.href = "../menu_adm/";
            }, 2000);

        } else {
            
            messageEl.textContent = result.message || "Login ou senha inválidos.";
            messageEl.className = "message";
        }

    } catch (error) {
        
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});
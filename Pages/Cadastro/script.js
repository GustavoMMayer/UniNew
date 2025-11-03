

document.getElementById("cadastroForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 


    const nome = document.getElementById("name").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const messageEl = document.getElementById("message");
    

    
    if (!nome || !cpf || !email || !telefone) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    I
    const data = {
        nome:nome,
        cpf: cpf,
        email: email,
        telefone:telefone
        
    };

    
    try {
        
        const response = await fetch("https://sua-api.com/api/v1/docentes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            
            messageEl.textContent = "Docente salvo com sucesso!";
            messageEl.className = "message success";
            
            
            event.target.reset();

        } else {
            
            messageEl.textContent = result.message || "Erro ao salvar docente.";
            messageEl.className = "message";
        }

    } catch (error) {
        
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});
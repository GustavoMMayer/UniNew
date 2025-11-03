

document.getElementById("fornecedorForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 


    const cpf = document.getElementById("cpf").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;
    const messageEl = document.getElementById("message");

    
    if (!cpf || !nome || !email || !tel) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        cpf: cpf,
        nome: nome,
        email: email,
        tel: parseInt(tel) 
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
            
            messageEl.textContent = "Fornecedor salvo com sucesso!";
            messageEl.className = "message success";
            
            
            event.target.reset();

        } else {
            
            messageEl.textContent = result.message || "Erro ao salvar fornecedor.";
            messageEl.className = "message";
        }

    } catch (error) {
       
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});
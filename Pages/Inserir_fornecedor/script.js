

document.getElementById("fornecedorForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    
    const cnpj = document.getElementById("cnpj").value;
    const razao = document.getElementById("razao").value;
    const contratos = document.getElementById("contratos").value;
    const servicos = document.getElementById("servicos").value;
    const messageEl = document.getElementById("message");

    
    if (!cnpj || !razao || !contratos || !servicos) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        cnpj: parseInt(cnpj),
        razao: razao,
        contratos: contratos,
        servicos: servicos
    };

    
    try {
        
        const response = await fetch("https://sua-api.com/api/v1/docentes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + localStorage.getItem("authToken") // Se precisar de token
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            
            messageEl.textContent = "Docente salvo com sucesso!";
            messageEl.className = "message success";
            
            // Limpa o formulário
            event.target.reset();

        } else {
            
            messageEl.textContent = result.message || "Erro ao salvar docente.";
            messageEl.className = "message";
        }

    } catch (error) {
        // Erro de rede
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});
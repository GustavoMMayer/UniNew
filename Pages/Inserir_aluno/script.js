

document.getElementById("alunoForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

   
    const cpf = document.getElementById("cpf").value;
    const curso = document.getElementById("curso").value;
    const situacao = document.getElementById("situacao").value;
    const messageEl = document.getElementById("message");

    
    if (!cpf || !curso || !situacao ) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        cpf: cpf,
        curso: curso,
        situacao: situacao,
        
    };

    
    try {
        
        const response = await fetch("https://sua-api.com/api/v1/Aluno", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            
            messageEl.textContent = "Aluno salvo com sucesso!";
            messageEl.className = "message success";
            
            
            event.target.reset();

        } else {
            
            messageEl.textContent = result.message || "Erro ao salvar aluno.";
            messageEl.className = "message";
        }

    } catch (error) {
        
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});
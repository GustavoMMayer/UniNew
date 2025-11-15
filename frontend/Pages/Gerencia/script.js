

document.getElementById("gerenciaForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    
    const pessoas = document.getElementById("pessoas").value;
    const docentes = document.getElementById("docentes").value;
    const fornecedores = document.getElementById("fornecedores").value;
    const alunos = document.getElementById("alunos").value;
    const messageEl = document.getElementById("message");

   
    if (!pessoas || !docentes || !fornecedores || !alunos) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        pessoas,
        docentes,
        fornecedores,
        alunos
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

document.getElementById("notaForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    
    const matricula = document.getElementById("matricula").value;
    const disciplina = document.getElementById("disciplina").value;
    const nota =pardefloat( document.getElementById("nota").value.replace(",", "."));
    const messageEl = document.getElementById("message");

    
    if (!matricula || !disciplina || !nota) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        matricula: matricula,
        disciplina: disciplina,
        nota: nota
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
            
            messageEl.textContent = "Nota salva com sucesso!";
            messageEl.className = "message success";
            
            
            event.target.reset();

        } else {
            
            messageEl.textContent = result.message || "Erro ao inserir nota.";
            messageEl.className = "message";
        }

    } catch (error) {
        
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});


document.getElementById("disciplinaForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    
    const disciplina = document.getElementById("disciplina").value;
    const carga = document.getElementById("carga").value;
    const messageEl = document.getElementById("message");

    
    if (!disciplina || !carga) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        disciplina: disciplina,
        cargaHoraria: parseInt(carga) 
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
            
            messageEl.textContent = "Disciplina salva com sucesso!";
            messageEl.className = "message success";
            
            
            event.target.reset();

        } else {
            
            messageEl.textContent = result.message || "Erro ao salvar disciplina.";
            messageEl.className = "message";
        }

    } catch (error) {
       
        console.error("Erro na requisição:", error);
        messageEl.textContent = "Erro de conexão com o servidor.";
        messageEl.className = "message";
    }
});
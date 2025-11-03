

document.getElementById("docenteForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    
    const cpf = document.getElementById("cpf").value;
    const grau = document.getElementById("grau").value;
    const disciplina = document.getElementById("disciplina").value;
    const carga = document.getElementById("carga").value;
    const messageEl = document.getElementById("message");

    
    if (!cpf || !grau || !disciplina || !carga) {
        messageEl.textContent = "Por favor, preencha todos os campos.";
        messageEl.className = "message";
        return;
    }

    
    const data = {
        cpf: cpf,
        grauAcademico: grau,
        disciplina: disciplina,
        cargaHoraria: parseInt(carga) 
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
document.getElementById("deleteForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    
    const messageEl = document.getElementById("message");

    
    const nome = document.getElementById("name").value.trim();
    const cpf = document.getElementById("cpf").value.trim();

    
    if (!cpf || !nome) {
        messageEl.textContent = "⚠️ Por favor, preencha todos os campos.";
        messageEl.className = "message error"; 
        return;
    }

    const data = {
        nome: nome,
        cpf: parseInt(cpf)
    };

    try {
        const response = await fetch("https://sua-api.com/api/v1/docentes", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Erro ao excluir docente (HTTP ${response.status})`);
        }

        console.log("Docente excluído com sucesso!");
        messageEl.textContent = "✅ Docente excluído com sucesso!";
        messageEl.className = "message success";

       
        setTimeout(() => {
            window.location.href = "/menu_adm";
        }, 1500);

    } catch (error) {
        console.error("Erro:", error);
        messageEl.textContent = "❌ Ocorreu um erro ao tentar excluir o cadastro.";
        messageEl.className = "message error";
    }
});

// Função para carregar e mostrar os visitantes
function carregarVisitantes() {
    fetch('/visitas')
      .then(res => res.json())
      .then(data => {
        const ul = document.getElementById('visitantes');
        ul.innerHTML = ''; // limpa lista antes de preencher
  
        data.forEach(visitante => {
          const li = document.createElement('li');
  
          // Cria span para horário estilizado
          const spanHorario = document.createElement('span');
          spanHorario.className = 'horario';
          spanHorario.textContent = visitante.horario;
  
          li.textContent = visitante.nome + ' ';
          li.appendChild(spanHorario);
  
          ul.appendChild(li);
        });
      })
      .catch(err => {
        console.error('Erro ao carregar visitantes:', err);
      });
  }
  
  // Função para registrar um visitante e atualizar a lista
  function registrarVisita() {
    const nome = document.getElementById("nome").value.trim();
  
    if (!nome) {
      document.getElementById("mensagem").innerText = "Digite seu nome antes de enviar.";
      return;
    }
  
    fetch('/registrar-visita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome,
        horario: new Date().toLocaleString()
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta do servidor');
        return res.json();
      })
      .then(data => {
        document.getElementById("mensagem").innerText = data.mensagem;
        document.getElementById("nome").value = "";
        carregarVisitantes(); // Atualiza a lista depois de registrar
      })
      .catch(err => {
        console.error("Erro ao registrar:", err);
        document.getElementById("mensagem").innerText = "Erro ao registrar visita. Tente novamente.";
      });
  }
  
  // Carrega visitantes quando a página abrir
  window.onload = carregarVisitantes;
  
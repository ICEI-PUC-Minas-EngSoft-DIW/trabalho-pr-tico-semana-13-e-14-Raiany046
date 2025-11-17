
const API_URL = "http://localhost:3000/obras";

async function carregarGrafico() {
  const res = await fetch(API_URL);
  const dados = await res.json();

  // Pegando apenas os títulos das obras
  const labels = dados.map(item => item.titulo);

  // Pegando tamanho do conteúdo (exemplo)
  const valores = dados.map(item => item.conteudo?.length || 10);

  const ctx = document.getElementById("graficoObras");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Tamanho do conteúdo das obras",
        data: valores
      }]
    }
  });
}

carregarGrafico();

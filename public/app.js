const container = document.getElementById("container");
const detalhesDiv = document.getElementById("detalhes");
const API_URL = "http://localhost:3000/obras";

// -------------------- GET: Carregar todas as obras --------------------
async function carregarObras() {
  if (!container) return;

  try {
    const res = await fetch(API_URL);
    const dados = await res.json();

    container.innerHTML = "";

    dados.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card", "text-center");

      card.innerHTML = `
        <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
        <div class="card-body">
          <h5 class="card-title">${item.titulo}</h5>
          <p class="card-text">${item.descricao}</p>
          <a href="detalhes.html?id=${item.id}" class="btn btn-dark">Ver detalhes</a>
          <button class="btn btn-warning btn-editar" data-id="${item.id}">Editar</button>
          <button class="btn btn-danger btn-deletar" data-id="${item.id}">Deletar</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Adiciona eventos de edição e exclusão
    document.querySelectorAll(".btn-deletar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("Deseja realmente deletar esta obra?")) {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          carregarObras();
        }
      });
    });

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        window.location.href = `cadastrodaobra.html?id=${id}`;
      });
    });

  } catch (error) {
    console.error("Erro ao carregar obras:", error);
  }
}

// -------------------- GET: Carregar detalhes de uma obra --------------------
async function carregarDetalhes() {
  if (!detalhesDiv) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detalhesDiv.innerHTML = "<p>Obra não encontrada.</p>";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Obra não encontrada");

    const item = await res.json();
    detalhesDiv.innerHTML = `
      <div class="card mx-auto" style="max-width: 700px;">
        <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
        <div class="card-body">
          <h2>${item.titulo}</h2>
          <p>${item.conteudo}</p>
          <a href="index.html" class="btn btn-secondary mt-3">← Voltar</a>
        </div>
      </div>
    `;
  } catch (error) {
    detalhesDiv.innerHTML = `<p class='text-center'>Erro ao carregar detalhes: ${error.message}</p>`;
  }
}

// -------------------- POST / PUT: Cadastro ou edição de obra --------------------
async function salvarObra(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // se existir, será PUT

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const obra = Object.fromEntries(formData);

    try {
      const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obra)
      });

      if (res.ok) {
        alert(`Obra ${id ? "atualizada" : "cadastrada"} com sucesso!`);
        window.location.href = "index.html";
      } else {
        alert("Erro ao salvar obra");
      }
    } catch (error) {
      console.error("Erro ao salvar obra:", error);
    }
  });

  // Se for edição, preencher o formulário
  if (id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Obra não encontrada");

      const obra = await res.json();
      for (const key in obra) {
        if (form.elements[key]) form.elements[key].value = obra[key];
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// -------------------- Chamadas automáticas --------------------
carregarObras();
carregarDetalhes();

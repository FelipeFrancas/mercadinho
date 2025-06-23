let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// LOGIN - permite qualquer usuário e senha
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user && pass) {
    localStorage.setItem("logado", "true");
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("catalogoContainer").style.display = "block";
    carregarCatalogo();
    atualizarCarrinho();
  } else {
    alert("Por favor, preencha usuário e senha.");
  }
}

// VERIFICA LOGIN AO ABRIR A PÁGINA
window.onload = () => {
  if (localStorage.getItem("logado") === "true") {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("catalogoContainer").style.display = "block";
    carregarCatalogo();
    atualizarCarrinho();
  }
};

// CARREGA CATÁLOGO
function carregarCatalogo() {
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(produtos => {
      const divProdutos = document.getElementById("produtos");
      divProdutos.innerHTML = "";
      produtos.forEach(prod => {
        const div = document.createElement("div");
        div.className = "produto";
        div.innerHTML = `
          <img src="${prod.image}" width="100"><br>
          <strong>${prod.title}</strong><br>
          R$ ${prod.price.toFixed(2)}<br>
          <button>Adicionar</button>
        `;
        div.querySelector("button").onclick = () => adicionarAoCarrinho(prod);
        divProdutos.appendChild(div);
      });
    });
}

// ADICIONA AO CARRINHO
function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  salvarCarrinho();
  atualizarCarrinho();
}

// ATUALIZA CARRINHO
function atualizarCarrinho() {
  const carrinhoDiv = document.getElementById("carrinho");
  const totalSpan = document.getElementById("total");
  carrinhoDiv.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = `${item.title} - R$ ${item.price.toFixed(2)}`;
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.onclick = () => {
      carrinho.splice(index, 1);
      salvarCarrinho();
      atualizarCarrinho();
    };
    itemDiv.appendChild(btnRemover);
    carrinhoDiv.appendChild(itemDiv);
    total += item.price;
  });

  totalSpan.textContent = total.toFixed(2);
}

// SALVA CARRINHO
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// FINALIZA COMPRA
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  if (confirm("Confirmar pedido e prosseguir com o pagamento?")) {
    localStorage.removeItem("carrinho");
    carrinho = [];
    atualizarCarrinho();
    alert("Compra finalizada com sucesso!");
  }
}

// BOTÃO SAIR
function logout() {
  localStorage.clear();
  location.reload();
}

const formTarefa = document.getElementById("formTarefa");
const inputTarefa = document.getElementById("inputTarefa");
const listaTarefas = document.getElementById("listaTarefas");
const contador = document.getElementById("contador");
const btnLimparTudo = document.getElementById("limparTudo");
const btnTemaClaro = document.getElementById("temaClaro");
const btnTemaEscuro = document.getElementById("temaEscuro");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  if (tarefas.length === 0) {
    listaTarefas.innerHTML = "<li>Nenhuma tarefa salva ainda.</li>";
  }

  tarefas.forEach((tarefa, index) => {
    const item = document.createElement("li");

    if (tarefa.concluida) {
      item.classList.add("concluida");
    }

    item.innerHTML = `
      <span>${tarefa.texto}</span>
      <div class="acoes">
        <button class="concluir" type="button" onclick="alternarTarefa(${index})">
          ${tarefa.concluida ? "Desfazer" : "Concluir"}
        </button>
        <button class="remover" type="button" onclick="removerTarefa(${index})">
          Remover
        </button>
      </div>
    `;

    listaTarefas.appendChild(item);
  });

  contador.textContent = `${tarefas.length} ${tarefas.length === 1 ? "tarefa salva" : "tarefas salvas"}`;
}

function adicionarTarefa(texto) {
  tarefas.push({
    texto,
    concluida: false
  });

  salvarTarefas();
  renderizarTarefas();
}

function alternarTarefa(index) {
  tarefas[index].concluida = !tarefas[index].concluida;
  salvarTarefas();
  renderizarTarefas();
}

function removerTarefa(index) {
  tarefas.splice(index, 1);
  salvarTarefas();
  renderizarTarefas();
}

formTarefa.addEventListener("submit", (event) => {
  event.preventDefault();

  const texto = inputTarefa.value.trim();

  if (texto === "") {
    alert("Digite uma tarefa antes de adicionar.");
    return;
  }

  adicionarTarefa(texto);
  inputTarefa.value = "";
  inputTarefa.focus();
});

btnLimparTudo.addEventListener("click", () => {
  tarefas = [];
  salvarTarefas();
  renderizarTarefas();
});

function criarCookie(nome, valor, dias) {
  const data = new Date();
  data.setTime(data.getTime() + dias * 24 * 60 * 60 * 1000);
  document.cookie = `${nome}=${valor}; expires=${data.toUTCString()}; path=/`;
}

function lerCookie(nome) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();

    if (cookie.startsWith(nome + "=")) {
      return cookie.substring(nome.length + 1);
    }
  }

  return null;
}

function aplicarTema(tema) {
  if (tema === "escuro") {
    document.body.classList.add("tema-escuro");
  } else {
    document.body.classList.remove("tema-escuro");
  }
}

btnTemaClaro.addEventListener("click", () => {
  criarCookie("tema", "claro", 30);
  aplicarTema("claro");
});

btnTemaEscuro.addEventListener("click", () => {
  criarCookie("tema", "escuro", 30);
  aplicarTema("escuro");
});

const temaSalvo = lerCookie("tema") || "claro";
aplicarTema(temaSalvo);
renderizarTarefas();

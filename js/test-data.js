/* ==== TURNYX - test-data.js ==== */
/* 
   Arquivo para testes rápidos sem precisar cadastrar motoboys.
   Basta carregar qualquer página que use a fila e ele preenche nomes.
*/

function carregarDadosDeTeste() {
  const exemplo = ["TH", "JP", "Vini", "Rafa", "Coringa", "Faísca"];

  // Só preenche se a fila estiver vazia
  const filaAtual = JSON.parse(localStorage.getItem("turnyx_fila")) || [];

  if (filaAtual.length === 0) {
    localStorage.setItem("turnyx_fila", JSON.stringify(exemplo));
    console.log("Fila de teste carregada:", exemplo);
  } else {
    console.log("Fila já contém itens, teste não sobrescreveu.");
  }
}

document.addEventListener("DOMContentLoaded", carregarDadosDeTeste);

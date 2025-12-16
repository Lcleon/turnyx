/* fila.js - mostra a fila para a unidade passada em ?unit=... (ou padrão) */

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function storageKeyForUnit(unit){
  return "turnyx_fila_" + unit;
}

function carregarFila() {
  const unit = getQueryParam("unit") || getQueryParam("u") || "Jacarepaguá";
  const key = storageKeyForUnit(unit);

  const fila = JSON.parse(localStorage.getItem(key) || "[]");
  const currentTurn = document.getElementById("currentTurn");
  const lista = document.getElementById("listaFila");

  if (!currentTurn || !lista) return;

  currentTurn.innerText = fila.length > 0 ? fila[0] : "Nenhum motoboy na fila";
  // opcional: mostrar unidade no header
  const header = document.querySelector(".header");
  if (header) header.innerText = `Fila — ${unit}`;

  lista.innerHTML = "";
  for (let i = 1; i < fila.length; i++) {
    const li = document.createElement("li");
    li.textContent = fila[i];
    lista.appendChild(li);
  }
}

function proximo() {
  const unit = getQueryParam("unit") || "Jacarepaguá";
  const key = storageKeyForUnit(unit);
  const fila = JSON.parse(localStorage.getItem(key) || "[]");

  if (fila.length > 0) {
    fila.shift();
    localStorage.setItem(key, JSON.stringify(fila));
  }
  carregarFila();
}

document.addEventListener("DOMContentLoaded", function(){
  carregarFila();
  setInterval(carregarFila, 1000);
});

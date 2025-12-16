function entrarFila() {
let apelido = document.getElementById("apelido").value.trim();


if (apelido === "") {
alert("Digite seu apelido!");
return;
}


let fila = JSON.parse(localStorage.getItem("turnyx_fila")) || [];


if (fila.includes(apelido)) {
alert("Você já está na fila!");
return;
}


fila.push(apelido);
localStorage.setItem("turnyx_fila", JSON.stringify(fila));


alert(apelido + " entrou na fila!");
window.location.href = "fila.html";
}
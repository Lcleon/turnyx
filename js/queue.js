/* queue.js - QR Code dinâmico usando QRCode.js */
const TURNYX_SECRET = "turnyx_local_secret_2025_v1";
const QR_INTERVAL_MS = 15000;
const VALID_SECONDS = 15;
const LOJAS = ["Jacarepaguá","Tijuca"];

const btnJac = document.getElementById("btnJac");
const btnTij = document.getElementById("btnTij");
const qrImg  = document.getElementById("qrImage");
const qrText = document.getElementById("qrText");

let selectedUnit = LOJAS[0];
let qrTimer = null;

function setActiveButton() {
  btnJac.classList.toggle("active", selectedUnit === LOJAS[0]);
  btnTij.classList.toggle("active", selectedUnit === LOJAS[1]);
}

btnJac.onclick = () => { selectedUnit = LOJAS[0]; setActiveButton(); generateAndShowToken(); };
btnTij.onclick = () => { selectedUnit = LOJAS[1]; setActiveButton(); generateAndShowToken(); };

setActiveButton();

function randomSalt(len=10){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].map(()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

async function createTokenForUnit(unit){
  const t = Math.floor(Date.now()/1000);
  const r = randomSalt(12);
  const payload = { u: unit, t: t, r: r };
  const raw = JSON.stringify(payload) + "|" + TURNYX_SECRET;
  const s = await sha256Hex(raw);
  return btoa(JSON.stringify({ ...payload, s }));
}

function getEntrarURL(){
  const base = window.location.href.replace(/\/[^\/]*$/, "/");
  return base + "entrar.html?token=";
}

async function generateAndShowToken(){
  const token = await createTokenForUnit(selectedUnit);
  const entrarURL = getEntrarURL() + encodeURIComponent(token);

  // GERA QR CODE com QRCode.js
  qrImg.src = "";
  QRCode.toDataURL(entrarURL, { width: 260, margin: 1 })
    .then(url => {
      qrImg.src = url;
    })
    .catch(err => {
      console.error("Erro gerando QR:", err);
    });

  qrText.innerText = `QR para: ${selectedUnit} — válido ~ ${VALID_SECONDS}s`;
}

function startQR(){
  generateAndShowToken();
  if (qrTimer) clearInterval(qrTimer);
  qrTimer = setInterval(generateAndShowToken, QR_INTERVAL_MS);
}

startQR();

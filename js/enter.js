/* enter.js - valida token contido no QR e entra o motoboy na fila da unidade */
const TURNYX_SECRET = "turnyx_local_secret_2025_v1"; // deve ser igual ao usado no queue.js
const VALID_SECONDS = 15; // validade do token

function showMessage(title, msg, isError=false){
  document.getElementById("msgTitle").innerText = title;
  const el = document.getElementById("msg");
  el.innerText = msg;
  el.className = isError ? "error" : "status";
}

// util sha256 (hex)
async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const h = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,"0")).join("");
}

// get query param
function getQueryParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// chave do storage por unidade
function storageKeyForUnit(unit){
  return "turnyx_fila_" + unit;
}

async function processTokenFlow(){
  const tokenParam = getQueryParam("token");
  if (!tokenParam) {
    showMessage("QR inválido","Nenhum token fornecido.", true);
    return;
  }

  let decoded;
  try {
    decoded = JSON.parse(atob(tokenParam));
  } catch(e){
    showMessage("QR inválido","Token malformado.", true);
    return;
  }

  // checar campos
  const { u: unit, t: ts, r: salt, s: signature } = decoded || {};
  if (!unit || !ts || !salt || !signature) {
    showMessage("QR inválido","Token incompleto.", true);
    return;
  }

  // checar validade temporal
  const now = Math.floor(Date.now()/1000);
  if (Math.abs(now - ts) > VALID_SECONDS) {
    showMessage("QR expirado","Esse QR expirou. Peça outro no balcão.", true);
    return;
  }

  // recomputar assinatura
  const raw = JSON.stringify({ u: unit, t: ts, r: salt }) + "|" + TURNYX_SECRET;
  const expected = await sha256Hex(raw);
  if (expected !== signature) {
    showMessage("QR inválido","Assinatura do token inválida.", true);
    return;
  }

  // token válido: agora buscar motoboy salvo no aparelho
  const saved = JSON.parse(localStorage.getItem("motoboy") || "null");
  if (!saved || !saved.apelido || !saved.unidade) {
    showMessage("Cadastro não encontrado","Você precisa se cadastrar primeiro.", true);
    // opcional: redirecionar para index.html após 3s
    setTimeout(()=> window.location.href = "index.html", 3000);
    return;
  }

  // verificar unidade do cadastro bate com unidade do token
  if (saved.unidade !== unit) {
    showMessage("Unidade incompatível", `Seu cadastro é para "${saved.unidade}". Este QR é para "${unit}". Procure o líder.`, true);
    return;
  }

  // inserir apelido na fila da unidade
  const key = storageKeyForUnit(unit);
  const fila = JSON.parse(localStorage.getItem(key) || "[]");

  // evitar duplicados — se já houver, não insere novamente
  if (!fila.includes(saved.apelido)) {
    fila.push(saved.apelido);
    localStorage.setItem(key, JSON.stringify(fila));
  }

  showMessage("Entrando na fila", `Você (${saved.apelido}) foi adicionado na fila de ${unit}. Redirecionando...`);
  // redireciona para fila da unidade após 1.2s
  setTimeout(()=> window.location.href = "fila.html?unit=" + encodeURIComponent(unit), 1200);
}

// roda ao carregar
document.addEventListener("DOMContentLoaded", processTokenFlow);

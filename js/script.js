function salvarCadastro() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const unidade = document.getElementById('unidade').value;
  const apelido = document.getElementById('apelido').value.trim();

  if (!apelido || !nome) {
    alert('Nome e apelido são obrigatórios.');
    return;
  }

  const user = { nome, email, unidade, apelido };
  localStorage.setItem('motoboy', JSON.stringify(user));

  alert('Cadastro salvo!');
  // redireciona para a fila da unidade cadastrada (opcional)
  window.location.href = "fila.html?unit=" + encodeURIComponent(unidade);
}

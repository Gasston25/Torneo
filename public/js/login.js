// login.js
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === '' || password === '') {
    errorMsg.textContent = 'Por favor completa todos los campos.';
    errorMsg.style.display = 'block';
    return;
  }

  const validUser = 'Admin';
  const validPass = 'CnumTorneoPromo2025';

  if (username === validUser && password === validPass) {
    window.location.href = '../view/admin.html';
  } else {
    errorMsg.textContent = 'Usuario o contraseña incorrectos.';
    errorMsg.style.display = 'block';
  }
});

usernameInput.addEventListener('input', () => errorMsg.style.display = 'none');
passwordInput.addEventListener('input', () => errorMsg.style.display = 'none');

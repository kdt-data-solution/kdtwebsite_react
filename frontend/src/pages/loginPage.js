import '../styles/style.css';
import { login, isAuthenticated } from '../utils/auth.js';
import { toastSuccess, toastError } from '../utils/toast.js';

if (isAuthenticated()) {
  window.location.href = `${import.meta.env.BASE_URL}admin.html`;
}

const form = document.getElementById('login-form');

document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.querySelector('.eye-open').classList.toggle('hidden', !isPassword);
    btn.querySelector('.eye-closed').classList.toggle('hidden', isPassword);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const data = Object.fromEntries(new FormData(form).entries());
    await login(data);
    toastSuccess('Signed in. Redirecting...');
    setTimeout(() => { window.location.href = `${import.meta.env.BASE_URL}admin.html`; }, 800);
  } catch (err) {
    toastError(err.message);
  } finally {
    submit.disabled = false;
  }
});

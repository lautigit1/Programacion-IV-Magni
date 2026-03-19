'use strict';

/**
 * Login Page Controller
 *
 * Responsibilities:
 * - Client-side validation BEFORE any network call
 * - Call API and handle success/error responses
 * - Manage UI state (loading, error messages)
 * - Navigate to user list on success
 *
 * No inline HTML. No global state pollution.
 */

// ── DOM references ───────────────────────────────────────────
const form          = document.getElementById('loginForm');
const usuarioInput  = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const submitBtn     = document.getElementById('submitBtn');
const btnText       = document.getElementById('btnText');
const btnSpinner    = document.getElementById('btnSpinner');
const loginAlert    = document.getElementById('loginAlert');
const usuarioError  = document.getElementById('usuarioError');
const passwordError = document.getElementById('passwordError');

// ── Validation rules ─────────────────────────────────────────
const validators = {
  usuario: (value) => {
    if (!value.trim())         return 'El usuario es obligatorio';
    if (value.length > 50)     return 'El usuario no puede superar 50 caracteres';
    return null;
  },
  password: (value) => {
    if (!value)                return 'La contraseña es obligatoria';
    if (value.length < 6)      return 'La contraseña debe tener al menos 6 caracteres';
    if (value.length > 100)    return 'La contraseña no puede superar 100 caracteres';
    return null;
  },
};

// ── UI helpers ───────────────────────────────────────────────
function setFieldError(input, errorEl, message) {
  errorEl.textContent = message || '';
  if (message) {
    input.classList.add('input-error');
  } else {
    input.classList.remove('input-error');
  }
}

function showAlert(message) {
  loginAlert.textContent = message;
  loginAlert.classList.remove('hidden');
}

function hideAlert() {
  loginAlert.classList.add('hidden');
  loginAlert.textContent = '';
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.textContent = isLoading ? 'Iniciando sesión…' : 'Iniciar sesión';
  btnSpinner.classList.toggle('hidden', !isLoading);
}

// ── Validation ───────────────────────────────────────────────
function validateForm() {
  const usuarioErr  = validators.usuario(usuarioInput.value);
  const passwordErr = validators.password(passwordInput.value);

  setFieldError(usuarioInput,  usuarioError,  usuarioErr);
  setFieldError(passwordInput, passwordError, passwordErr);

  return !usuarioErr && !passwordErr;
}

// Clear field errors on input (progressive validation UX)
usuarioInput.addEventListener('input', () => {
  const err = validators.usuario(usuarioInput.value);
  setFieldError(usuarioInput, usuarioError, err);
  hideAlert();
});

passwordInput.addEventListener('input', () => {
  const err = validators.password(passwordInput.value);
  setFieldError(passwordInput, passwordError, err);
  hideAlert();
});

// ── Form submission ──────────────────────────────────────────
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideAlert();

  // 1. Validate client-side first
  if (!validateForm()) return;

  setLoading(true);

  try {
    // 2. Call API
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        usuario:  usuarioInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    // 3. Success — navigate to the user list
    if (data.success) {
      // Store minimal session info (no sensitive data)
      sessionStorage.setItem('currentUser', JSON.stringify(data.data.user));
      window.location.href = 'lista.html';
    }

  } catch (err) {
    showAlert(err.message);
  } finally {
    setLoading(false);
  }
});

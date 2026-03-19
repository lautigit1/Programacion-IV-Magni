'use strict';

/**
 * Lista de Usuarios Page Controller
 *
 * Responsibilities:
 * - Load and render users from the API
 * - Handle search (filter by username)
 * - Handle block/unblock actions with optimistic UI
 * - Show toast notifications for feedback
 * - Manage distinct page states: loading, error, empty, data
 */

// ── DOM references ───────────────────────────────────────────
const tableBody      = document.getElementById('tableBody');
const searchInput    = document.getElementById('searchInput');
const searchBtn      = document.getElementById('searchBtn');
const clearBtn       = document.getElementById('clearBtn');
const totalCount     = document.getElementById('totalCount');
const activeCount    = document.getElementById('activeCount');
const blockedCount   = document.getElementById('blockedCount');
const toastContainer = document.getElementById('toastContainer');
const logoutBtn      = document.getElementById('logoutBtn');
const welcomeUser    = document.getElementById('welcomeUser');

// ── Session check ────────────────────────────────────────────
const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
if (!currentUser) {
  window.location.href = 'login.html';
}

if (welcomeUser && currentUser) {
  welcomeUser.textContent = `${currentUser.nombre} ${currentUser.apellido}`;
}

// ── State ────────────────────────────────────────────────────
let allUsers = [];      // Full list from last API call
let pendingIds = new Set(); // Track in-flight block/unblock requests

// ── Toast notifications ──────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Table rendering ──────────────────────────────────────────
/**
 * Renders the state containers (loading / error / empty).
 * @param {'loading'|'error'|'empty'} state
 * @param {string} [message] - Optional override message for error state
 */
function renderState(state, message = '') {
  const states = {
    loading: `
      <tr>
        <td colspan="6">
          <div class="state-container">
            <div class="spinner spinner-primary" style="width:36px;height:36px;margin:0 auto var(--space-4);"></div>
            <p class="state-desc">Cargando usuarios…</p>
          </div>
        </td>
      </tr>`,
    error: `
      <tr>
        <td colspan="6">
          <div class="state-container">
            <div class="state-icon">⚠️</div>
            <p class="state-title">Error al cargar</p>
            <p class="state-desc">${message || 'Ocurrió un error. Intentá de nuevo.'}</p>
          </div>
        </td>
      </tr>`,
    empty: `
      <tr>
        <td colspan="6">
          <div class="state-container">
            <div class="state-icon">🔍</div>
            <p class="state-title">Sin resultados</p>
            <p class="state-desc">No se encontraron usuarios con ese criterio.</p>
          </div>
        </td>
      </tr>`,
  };
  tableBody.innerHTML = states[state] || '';
}

/**
 * Builds a single table row for a user.
 * Creates DOM elements programmatically — no innerHTML for rows
 * (avoids XSS if usernames contain special characters).
 *
 * @param {object} user
 * @returns {HTMLTableRowElement}
 */
function buildUserRow(user) {
  const tr = document.createElement('tr');
  tr.id = `row-${user.id}`;
  tr.className = user.bloqueado ? 'row-blocked' : 'row-active';

  // Nombre + Email cell
  const tdUser = document.createElement('td');
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  const userName = document.createElement('span');
  userName.className = 'user-name';
  userName.textContent = `${user.nombre} ${user.apellido}`;
  const userEmail = document.createElement('span');
  userEmail.className = 'user-email';
  userEmail.textContent = user.email;
  userInfo.appendChild(userName);
  userInfo.appendChild(userEmail);
  tdUser.appendChild(userInfo);

  // Username cell
  const tdUsuario = document.createElement('td');
  tdUsuario.textContent = `@${user.usuario}`;
  tdUsuario.style.fontFamily = 'monospace';
  tdUsuario.style.color = 'var(--color-text-muted)';

  // Role cell
  const tdRol = document.createElement('td');
  const roleBadge = document.createElement('span');
  roleBadge.className = `role-badge role-${user.rol}`;
  roleBadge.textContent = user.rol === 'admin' ? 'Admin' : 'Usuario';
  tdRol.appendChild(roleBadge);

  // Status cell
  const tdEstado = document.createElement('td');
  const statusBadge = document.createElement('span');
  statusBadge.id = `badge-${user.id}`;
  statusBadge.className = user.bloqueado ? 'badge badge-blocked' : 'badge badge-active';
  statusBadge.textContent = user.bloqueado ? 'Bloqueado' : 'Activo';
  tdEstado.appendChild(statusBadge);

  // Created at cell
  const tdFecha = document.createElement('td');
  tdFecha.style.color = 'var(--color-text-muted)';
  tdFecha.style.fontSize = 'var(--font-size-xs)';
  tdFecha.textContent = new Date(user.createdAt).toLocaleDateString('es-AR', {
    year: 'numeric', month: 'short', day: '2-digit',
  });

  // Actions cell
  const tdAcciones = document.createElement('td');
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'actions-cell';

  const btn = document.createElement('button');
  btn.id = `btn-${user.id}`;
  btn.className = user.bloqueado ? 'btn btn-unblock' : 'btn btn-block';
  btn.textContent = user.bloqueado ? 'Desbloquear' : 'Bloquear';
  
  // Usar el estado más reciente guardado en allUsers para evitar closures con datos viejos
  btn.addEventListener('click', () => {
    const currentState = allUsers.find(u => u.id === user.id);
    if (currentState) {
      handleBlockToggle(currentState.id, !currentState.bloqueado);
    }
  });

  actionsDiv.appendChild(btn);
  tdAcciones.appendChild(actionsDiv);

  tr.append(tdUser, tdUsuario, tdRol, tdEstado, tdFecha, tdAcciones);
  return tr;
}

/**
 * Renders a list of users into the table.
 * Updates the stats bar.
 *
 * @param {object[]} users
 */
function renderUsers(users) {
  // Update stats
  const blocked = users.filter(u => u.bloqueado).length;
  totalCount.textContent   = users.length;
  activeCount.textContent  = users.length - blocked;
  blockedCount.textContent = blocked;

  if (!users.length) {
    renderState('empty');
    return;
  }

  // Build fragment to minimise reflows
  const fragment = document.createDocumentFragment();
  users.forEach(user => fragment.appendChild(buildUserRow(user)));
  tableBody.innerHTML = '';
  tableBody.appendChild(fragment);
}

// ── API calls ────────────────────────────────────────────────
/**
 * Fetches users from the API, optionally filtered by username.
 * @param {string} [filter]
 */
async function fetchUsers(filter = '') {
  renderState('loading');
  totalCount.textContent = activeCount.textContent = blockedCount.textContent = '—';

  try {
    const endpoint = filter
      ? `/users?usuario=${encodeURIComponent(filter)}`
      : '/users';

    const data = await apiFetch(endpoint);
    allUsers = data.data.users;
    renderUsers(allUsers);
  } catch (err) {
    renderState('error', err.message);
    showToast(err.message, 'error');
  }
}

/**
 * Handles block/unblock for a user.
 * Updates the specific row in-place without a full table re-render.
 *
 * @param {number}  userId
 * @param {boolean} newBlockedState
 */
async function handleBlockToggle(userId, newBlockedState) {
  // Prevent double-click spamming on same user
  if (pendingIds.has(userId)) return;
  pendingIds.add(userId);

  const btn   = document.getElementById(`btn-${userId}`);
  const badge = document.getElementById(`badge-${userId}`);
  const row   = document.getElementById(`row-${userId}`);

  // ── Optimistic UI update ──────────────────────────────────
  if (btn)   btn.disabled = true;
  if (btn)   btn.textContent = '…';

  try {
    const data = await apiFetch(`/users/${userId}/block`, {
      method: 'PATCH',
      body:   JSON.stringify({ bloqueado: newBlockedState }),
    });

    const updatedUser = data.data.user;

    // Update row state in-place
    if (row) {
      row.className = updatedUser.bloqueado ? 'row-blocked' : 'row-active';
    }
    if (badge) {
      badge.className = updatedUser.bloqueado ? 'badge badge-blocked' : 'badge badge-active';
      badge.textContent = updatedUser.bloqueado ? 'Bloqueado' : 'Activo';
    }
    if (btn) {
      btn.className = updatedUser.bloqueado ? 'btn btn-unblock' : 'btn btn-block';
      btn.textContent = updatedUser.bloqueado ? 'Desbloquear' : 'Bloquear';
      btn.disabled = false;
    }

    // Update local cache
    const idx = allUsers.findIndex(u => u.id === userId);
    if (idx !== -1) allUsers[idx] = updatedUser;

    // Update stats bar
    const blocked = allUsers.filter(u => u.bloqueado).length;
    activeCount.textContent  = allUsers.length - blocked;
    blockedCount.textContent = blocked;

    const action = updatedUser.bloqueado ? 'bloqueado' : 'desbloqueado';
    showToast(`Usuario ${action} correctamente ✓`, 'success');

  } catch (err) {
    // Revert button on failure
    if (btn) {
      btn.disabled = false;
      btn.textContent = newBlockedState ? 'Bloquear' : 'Desbloquear';
    }
    showToast(err.message, 'error');
  } finally {
    pendingIds.delete(userId);
  }
}

// ── Search events ────────────────────────────────────────────
searchBtn.addEventListener('click', () => {
  const filter = searchInput.value.trim();
  fetchUsers(filter);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const filter = searchInput.value.trim();
    fetchUsers(filter);
  }
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  fetchUsers();
});

// ── Logout ───────────────────────────────────────────────────
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
});

// ── Init ─────────────────────────────────────────────────────
fetchUsers();

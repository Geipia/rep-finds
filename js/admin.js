// Identifiants d'administration (modifiables ici)
const ADMIN_USER = "admin";
const ADMIN_PASS = "Eraz2026!";

const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Vérification de session locale
if (sessionStorage.getItem('eraz_admin_logged') === 'true') {
  showDashboard();
}

// Gestion de la connexion
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('eraz_admin_logged', 'true');
    loginError.classList.add('d-none');
    showDashboard();
  } else {
    loginError.classList.remove('d-none');
  }
});

// Déconnexion
logoutBtn.addEventListener('click', function() {
  sessionStorage.removeItem('eraz_admin_logged');
  adminDashboard.classList.add('d-none');
  loginScreen.classList.remove('d-none');
  loginForm.reset();
});

function showDashboard() {
  loginScreen.classList.add('d-none');
  adminDashboard.classList.remove('d-none');
  fetchAdminItems();
}

// Chargement des articles
async function fetchAdminItems() {
  const { data, error } = await _supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur de chargement :", error.message);
    return;
  }

  renderAdminTable(data || []);
}

// Affichage du tableau
function renderAdminTable(items) {
  const tbody = document.getElementById('adminItemsTable');
  tbody.innerHTML = '';

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-secondary">Aucun article dans la base.</td></tr>`;
    return;
  }

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <img src="${item.image_url}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
      </td>
      <td class="fw-bold">${item.title}</td>
      <td><span class="badge bg-primary">${item.brand || 'N/A'}</span></td>
      <td class="text-success fw-bold">${item.price ? item.price + ' €' : 'N/C'}</td>
      <td class="small text-secondary">${item.agent_provider || 'N/A'}</td>
      <td>
        <button onclick="deleteItem('${item.id}', '${item.title.replace(/'/g, "\\'")}')" class="btn btn-outline-danger btn-sm">
          <i class="bi bi-trash me-1"></i> Supprimer
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Suppression d'un article
async function deleteItem(id, title) {
  if (!confirm(`Es-tu sûr de vouloir supprimer l'article "${title}" ?`)) {
    return;
  }

  const { error } = await _supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) {
    alert("Erreur lors de la suppression : " + error.message);
  } else {
    fetchAdminItems();
  }
}
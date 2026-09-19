let allItems = [];

async function fetchItems() {
  const { data, error } = await _supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur de chargement:', error.message);
    return;
  }

  allItems = data || [];
  renderItems(allItems);
}

function renderItems(items) {
  const grid = document.getElementById('itemsGrid');
  const noResults = document.getElementById('noResults');
  grid.innerHTML = '';

  if (items.length === 0) {
    noResults.classList.remove('d-none');
    return;
  }
  noResults.classList.add('d-none');

  const shippingBadges = {
    'Bas': 'Port: 0-15€',
    'Moyen': 'Port: 15-35€',
    'Élevé': 'Port: >35€'
  };

  items.forEach(item => {
    const shippingClass = item.shipping_cost ? `badge-shipping-${item.shipping_cost.toLowerCase()}` : 'bg-secondary';
    const shippingText = shippingBadges[item.shipping_cost] || `Port: ${item.shipping_cost || 'N/A'}`;

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 bg-dark border-secondary text-white shadow-sm">
        <img src="${item.image_url}" class="card-img-top" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Pas+d%27image'">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-primary">${item.brand || 'Marque'}</span>
            <span class="badge ${shippingClass}">${shippingText}</span>
          </div>
          <h5 class="card-title text-truncate fw-bold mb-1">${item.title}</h5>
          <p class="card-text text-secondary small mb-3">${item.category || ''} • <i class="bi bi-shop"></i> ${item.agent_provider || ''}</p>
          <a href="${item.item_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light mt-auto w-100">
            Voir le produit <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function filterItems() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;
  const brand = document.getElementById('filterBrand').value;
  const agent = document.getElementById('filterAgent').value;
  const shipping = document.getElementById('filterShipping').value;

  const filtered = allItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search) || (item.brand && item.brand.toLowerCase().includes(search));
    const matchCategory = !category || item.category === category;
    const matchBrand = !brand || item.brand === brand;
    const matchAgent = !agent || item.agent_provider === agent;
    const matchShipping = !shipping || item.shipping_cost === shipping;

    return matchSearch && matchCategory && matchBrand && matchAgent && matchShipping;
  });

  renderItems(filtered);
}

document.getElementById('searchInput').addEventListener('input', filterItems);
document.getElementById('filterCategory').addEventListener('change', filterItems);
document.getElementById('filterBrand').addEventListener('change', filterItems);
document.getElementById('filterAgent').addEventListener('change', filterItems);
document.getElementById('filterShipping').addEventListener('change', filterItems);

document.addEventListener('DOMContentLoaded', fetchItems);
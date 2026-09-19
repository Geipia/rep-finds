document.getElementById('addItemForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Publication en cours...';

  const newItem = {
    title: document.getElementById('itemTitle').value,
    brand: document.getElementById('itemBrand').value,
    category: document.getElementById('itemCategory').value,
    agent_provider: document.getElementById('itemAgent').value,
    shipping_cost: document.getElementById('itemShipping').value,
    item_url: document.getElementById('itemUrl').value,
    image_url: document.getElementById('imageUrl').value
  };

  const { data, error } = await _supabase
    .from('items')
    .insert([newItem]);

  submitBtn.disabled = false;
  submitBtn.textContent = 'Publier l\'article';

  if (error) {
    alert('Erreur lors de l\'ajout : ' + error.message);
  } else {
    document.getElementById('addItemForm').reset();
    const modalEl = document.getElementById('addItemModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    fetchItems();
  }
});
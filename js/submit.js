document.getElementById('addItemForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const imageFile = document.getElementById('itemImage').files[0];

  if (!imageFile) {
    alert("Veuillez choisir une image.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi de l\'image...';

  try {
    // 1. Génération d'un nom de fichier unique
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    // 2. Upload de la photo dans Supabase Storage
    const { error: uploadError } = await _supabase.storage
      .from('item-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      throw new Error("Erreur téléversement image : " + uploadError.message);
    }

    // 3. Récupération de l'URL publique de l'image
    const { data: publicUrlData } = _supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 4. Enregistrement de l'article dans la base
    submitBtn.textContent = 'Publication en cours...';

    const newItem = {
      title: document.getElementById('itemTitle').value,
      brand: document.getElementById('itemBrand').value,
      category: document.getElementById('itemCategory').value,
      agent_provider: document.getElementById('itemAgent').value,
      shipping_cost: document.getElementById('itemShipping').value,
      item_url: document.getElementById('itemUrl').value,
      image_url: imageUrl
    };

    const { error: insertError } = await _supabase
      .from('items')
      .insert([newItem]);

    if (insertError) {
      throw new Error("Erreur base de données : " + insertError.message);
    }

    // Réinitialisation et fermeture
    document.getElementById('addItemForm').reset();
    const modalEl = document.getElementById('addItemModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    fetchItems();

  } catch (err) {
    alert(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Publier l\'article';
  }
});
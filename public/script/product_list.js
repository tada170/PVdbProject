let allergensList = [];
let selectedAllergens = [];
let initialAllergens = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadAllergens();
});

async function fetchProducts() {
    try {
        const products = await fetchProductData();
        const productMap = mapProducts(products);
        renderProductTable(productMap);
    } catch (error) {
        displayMessage('Error fetching products: ' + error.message, 'error');
    }
}

async function fetchProductData() {
    const response = await fetch('/product-list');

    return response.json();
}

function mapProducts(products) {
    const productMap = {};
    products.forEach(product => {
        const { ProductID, Name, Price, AllergenName, AllergenID } = product;
        if (!productMap[ProductID]) {
            productMap[ProductID] = {
                ProductID,
                Name,
                Price,
                Allergens: []
            };
        }
        if (AllergenName && AllergenID) {
            productMap[ProductID].Allergens.push({ name: AllergenName, id: AllergenID });
        }
    });
    return productMap;
}

function renderProductTable(productMap) {
    const tableBody = document.querySelector('#product-table tbody');
    tableBody.innerHTML = '';
    Object.values(productMap).forEach(product => {
        const row = createProductRow(product);
        tableBody.appendChild(row);
    });
}

function createProductRow(product) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const priceCell = document.createElement('td');
    const allergensCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    nameCell.textContent = product.Name;
    priceCell.textContent = product.Price;
    allergensCell.innerHTML = product.Allergens.length > 0
        ? product.Allergens.map(allergen => `${allergen.name} <span class="allergen-icon" title="Edit" onclick="addAllergenToEdit('${allergen.name}')"></span>`).join(', ')
        : 'No allergens';

    const deleteButton = createDeleteButton(product.ProductID);
    const editButton = createEditButton(product);

    actionsCell.appendChild(deleteButton);
    actionsCell.appendChild(editButton);

    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(allergensCell);
    row.appendChild(actionsCell);

    return row;
}

function createDeleteButton(productId) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn-delete';
    deleteButton.onclick = () => deleteProduct(productId);
    return deleteButton;
}

function createEditButton(product) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'btn-edit';
    editButton.onclick = () => openEditModal(product);
    return editButton;
}

async function loadAllergens() {
    try {
        const response = await axios.get('/allergens_list');
        allergensList = response.data;

        console.log(allergensList)
        populateAllergenDropdown();
    } catch (error) {
        displayMessage('Error loading allergens: ' + error.message, 'error');
    }
}

function populateAllergenDropdown() {
    const allergenDropdown = document.getElementById('allergen-dropdown');
    allergenDropdown.innerHTML = '<option value="">-- Choose an allergen --</option>';
    allergensList.forEach(allergen => {
        const option = document.createElement('option');
        option.value = allergen.AllergenID;
        option.textContent = allergen.Name;
        allergenDropdown.appendChild(option);
    });
    allergenDropdown.onchange = function () {
        const selectedOptions = Array.from(allergenDropdown.selectedOptions);
        selectedOptions.forEach(option => {
            addAllergenToEdit({ id: option.value, name: option.textContent });
            allergenDropdown.value = '';
        });
    };
}

function addAllergenToEdit(allergen) {
    if (allergen.AllergenID && allergen.Name && !selectedAllergens.find(a => a.id === allergen.AllergenID)) {
        selectedAllergens.push(allergen);
        renderSelectedAllergens();
    }
}

function renderSelectedAllergens() {
    const selectedAllergenContainer = document.getElementById('selected-allergens');
    selectedAllergenContainer.innerHTML = '';
    selectedAllergens.forEach(allergen => {
        if (allergen.Name) {
            const allergenItem = document.createElement('div');
            allergenItem.className = 'allergen-item';
            allergenItem.textContent = allergen.Name;
            const removeButton = document.createElement('span');
            removeButton.className = 'remove-allergen';
            removeButton.textContent = '×';
            removeButton.onclick = () => removeAllergen(allergen.AllergenID);
            allergenItem.appendChild(removeButton);
            selectedAllergenContainer.appendChild(allergenItem);
        }
    });
}

function removeAllergen(allergenId) {
    selectedAllergens = selectedAllergens.filter(a => a.id !== allergenId);
    renderSelectedAllergens();
}

function openEditModal(product) {
    document.getElementById('productName').value = product.Name;
    document.getElementById('productPrice').value = product.Price;
    document.getElementById('productId').value = product.ProductID;

    initialAllergens = product.Allergens.map(allergen => ({
        AllergenID: allergen.id,
        Name: allergen.name
    })).filter(allergen => allergen.id && allergen.name);

    selectedAllergens = [...initialAllergens];
    renderSelectedAllergens();
    document.getElementById('editModal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function () {
    closeModal();
};

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    selectedAllergens = [...initialAllergens];
    renderSelectedAllergens();
}

window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
};

document.getElementById('editForm').onsubmit = async function (event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const allergenIds = selectedAllergens.map(allergen => allergen.id).filter(id => id);

    try {
        await axios.put(`/product/${productId}`, {
            Name: productName,
            Price: productPrice,
            Allergens: allergenIds
        });
        displayMessage('Product updated successfully!', 'success');
        fetchProducts();
        closeModal();
    } catch (error) {
        displayMessage('Error updating product: ' + error.message, 'error');
    }
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await axios.delete(`/product/${productId}`);
            displayMessage('Product deleted successfully!', 'success');
            fetchProducts();
        } catch (error) {
            displayMessage('Error deleting product: ' + error.message, 'error');
        }
    }
}

function displayMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + (type === 'success' ? 'success' : 'error');
    messageContainer.appendChild(messageDiv);
    setTimeout(() => {
        messageContainer.removeChild(messageDiv);
    }, 3000);
}

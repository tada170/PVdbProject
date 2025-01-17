const categoryList = document.getElementById("category-list-container");
const productList = document.getElementById("product-list-container");
let currentOrderId = '';
let selectedItems = [];

function goBack() {
    categoryList.style.display = 'flex';
    productList.style.display = 'none';
}

function openModal() {
    document.getElementById('order-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById("order-modal").style.display = "none";
}

function openItemModal() {
    document.getElementById('add-item-modal').style.display = 'block';
    categoryList.style.display = 'flex';
    productList.style.display = 'none';
    getCategories();
    selectedItems = [];
}

function closeItemModal() {
    document.getElementById('add-item-modal').style.display = "none";
}

function saveOrder() {
    const orderName = document.getElementById("order-name").value;

    fetch('/order-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orderName })
    })
        .then(response => response.json())
        .then(data => {
                currentOrderId = data.TransactionID;
                console.log("Vytvořená objednávka má ID:", currentOrderId);
                getOrders();
        })
        .catch(error => {
            console.error("Chyba při vytváření objednávky:", error);
            alert("Chyba při vytváření objednávky.");
        })
        .finally(() => closeModal());
}

window.onclick = function (event) {
    if (event.target === document.getElementById("order-modal")) {
        closeModal();
    }
    if (event.target === document.getElementById("add-item-modal")) {
        closeItemModal();
    }
};

function saveOrderItem() {
    if (selectedItems.length === 0) {
        alert("Please select at least one product.");
        return;
    }

    axios.post('/order-save/' + currentOrderId, selectedItems)
        .then(() => {
            closeItemModal();
            getOrders();
        })
        .catch(() => {
            alert('Failed to save the order items.');
        });
}

function handleCheckboxChange(event) {
    const checkbox = event.target;
    const productId = checkbox.id;
    const price = checkbox.value;

    if (checkbox.checked) {
        selectedItems.push({
            productId: productId,
            quantity: 1,
            price: price
        });
    } else {
        selectedItems = selectedItems.filter(item => item.productId !== productId);
    }
}

function fetchOrders() {
    return fetch('/order_list')
        .then(response => response.json())
        .catch(() => []);
}

function renderOrders(orders) {
    const orderList = document.getElementById("order-list-container");
    orderList.innerHTML = '';

    Object.values(orders).forEach(order => {
        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.dataset.transakceId = order.TransactionID;

        const titleContainer = document.createElement("div");
        titleContainer.className = "title-container";

        const orderTitle = document.createElement("span");
        orderTitle.textContent = `Order: ${order.Name} (${order.TransactionDate})`;

        const dropDown = document.createElement("span");
        dropDown.className = "drop-down-btn";
        dropDown.textContent = '▼';

        titleContainer.appendChild(orderTitle);
        titleContainer.appendChild(dropDown);
        orderItem.appendChild(titleContainer);

        const itemList = renderOrderItems(order);
        dropDown.onclick = () => {
            itemList.style.display = itemList.style.display === "none" ? "block" : "none";
        };

        orderItem.appendChild(itemList);
        orderList.appendChild(orderItem);
    });
}

function groupOrders(data) {
    return data.reduce((acc, item) => {
        const TransactionID = item.TransactionID;
        if (!acc[TransactionID]) {
            acc[TransactionID] = {
                TransactionID: TransactionID,
                Name: item.TransactionName || "Unknown Order",
                TransactionDate: item.TransactionDate || "Unknown Date",
                Items: []
            };
        }
        if (item.Items.length > 0) {
            item.Items.forEach(
                item => acc[TransactionID].Items.push({
                ProductID: item.ProductID,
                ProductName: item.ProductName || "Unnamed Product",
                Quantity: item.Quantity || 0,
                Price: item.Price || 0,
                Paid: item.Paid || false,
                Allergens: item.Allergens || []
            })
        )
        }
        return acc;
    }, {});
}
function renderOrderItems(order) {
    const itemList = document.createElement("div");
    itemList.className = "item-list";
    itemList.style.display = "none";
    itemList.id = order.TransactionID;

    if (!order.Items || order.Items.length === 0) {
        const noItemsMessage = document.createElement("p");
        noItemsMessage.textContent = "This order has no items.";
        itemList.appendChild(noItemsMessage);
    } else {
        const productMap = new Map();

        order.Items.forEach(item => {
            if (productMap.has(item.ProductName)) {
                productMap.set(item.ProductName, productMap.get(item.ProductName) + item.Quantity);
            } else {
                productMap.set(item.ProductName, item.Quantity);
            }
        });
        productMap.forEach((quantity, productName) => {
            const item = order.Items.find(i => i.ProductName === productName);
            const itemDetail = document.createElement("p");
            const allergens = item.Allergens.length > 0 ? item.Allergens.join(", ") : "None";
            itemDetail.textContent = `${productName}: ${quantity}x ${item.Price.toFixed(2)} EUR (Allergens: ${allergens})`;
            itemList.appendChild(itemDetail);
        });

    }
    const button = document.createElement('button');
    button.textContent = 'Add Order Item';
    button.id = itemList.id;
    button.onclick = () => {
        currentOrderId = button.id;
        openItemModal();
    };
    itemList.appendChild(button);
    return itemList;
}


function getOrders() {
    fetchOrders()
        .then(data => {

            return groupOrders(data);
        })
        .then(orders => renderOrders(orders))
        .catch(error => {
            console.error('Error processing orders:', error);
        });
}

function getCategories() {
    fetch('/category_list')
        .then(response => response.json())
        .then(data => {
            categoryList.innerHTML = '';
            data.forEach(category => {
                const categoryItem = document.createElement("div");
                categoryItem.className = "category-item";
                categoryItem.innerHTML = `<h2>${category.Name}</h2>`;
                categoryList.appendChild(categoryItem);
                categoryItem.onclick = () => {
                    productList.innerHTML = '';
                    categoryList.style.display = 'none';
                    productList.style.display = 'flex';
                    getProducts(category.CategoryID);
                };
            });
        });
}

function getProducts(categoryId) {
    fetch('/products/' + categoryId)
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = '';
            data.forEach(product => {
                const productItem = document.createElement("div");
                productItem.className = "product-item";
                productItem.innerHTML = `<h3>${product.Name}</h3>`;
                const price = document.createElement("p");
                price.textContent = `Price: ${product.Price} EUR`;
                productItem.appendChild(price);

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = product.Price;
                checkbox.id = product.ProductID;
                checkbox.onchange = handleCheckboxChange;

                productItem.appendChild(checkbox);
                productList.appendChild(productItem);
            });
        });
}

document.addEventListener("DOMContentLoaded", getOrders);

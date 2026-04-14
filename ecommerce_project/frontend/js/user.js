const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "login.html";
}

let cart = [];

// 📦 Load products
async function loadProducts() {
    const response = await fetch("http://127.0.0.1:8000/api/products/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();

    const list = document.getElementById("product-list");
    list.innerHTML = "";

    data.results.forEach(product => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${product.name} - ₹${product.price}
            <input type="number" min="1" value="1" id="qty-${product.id}">
            <button onclick="addToCart(${product.id}, '${product.name}')">Add</button>
        `;

        list.appendChild(li);
    });
}

// 🛒 Add to cart
function addToCart(id, name) {
    const qty = document.getElementById(`qty-${id}`).value;

    const existing = cart.find(item => item.product === id);

    if (existing) {
        existing.quantity += parseInt(qty);
    } else {
        cart.push({
            product: id,
            name: name,
            quantity: parseInt(qty)
        });
    }

    renderCart();
}

// 📋 Show cart
function renderCart() {
    const list = document.getElementById("cart-list");
    list.innerHTML = "";

    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.name} - Qty: ${item.quantity}`;
        list.appendChild(li);
    });
}

// 🚀 Place order
async function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const items = cart.map(item => ({
        product: item.product,
        quantity: item.quantity
    }));

    const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ items })
    });

    if (response.ok) {
        alert("Order placed successfully!");
        cart = [];
        renderCart();
    } else {
        alert("Error placing order");
    }
}

// 🚀 Load products
loadProducts();
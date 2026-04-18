const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "login.html";
}

// 🍞 Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const icon = type === 'success' 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

let cart = [];

// 📦 Load products
async function loadProducts(url = "http://127.0.0.1:8000/api/products/") {
    try {
        const response = await fetch(url, {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await response.json();
        const list = document.getElementById("product-list");
        list.innerHTML = "";

        // Setup Pagination Buttons
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        
        if (prevBtn && nextBtn) {
            prevBtn.disabled = !data.previous;
            nextBtn.disabled = !data.next;
            
            prevBtn.onclick = () => { if(data.previous) loadProducts(data.previous); };
            nextBtn.onclick = () => { if(data.next) loadProducts(data.next); };
        }

        if (data.results && data.results.length > 0) {
            data.results.forEach(product => {
                const li = document.createElement("li");
                li.className = "product-card";

                li.innerHTML = `
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <div class="product-price">₹${product.price}</div>
                        ${product.category_name ? `<span class="product-meta">${product.category_name}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <input type="number" min="1" value="1" id="qty-${product.id}">
                        <button onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}')">Add</button>
                    </div>
                `;

                list.appendChild(li);
            });
        } else {
            list.innerHTML = `<p style="color: var(--text-muted);">No products found.</p>`;
        }
    } catch(err) {
        showToast("Failed to load products", "error");
    }
}

// 🛒 Add to cart
function addToCart(id, name) {
    const qty = parseInt(document.getElementById(`qty-${id}`).value);
    const existing = cart.find(item => item.product === id);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ product: id, name: name, quantity: qty });
    }

    showToast(`Added ${qty} ${name} to cart`);
    renderCart();
}

// 📋 Show cart
function renderCart() {
    const list = document.getElementById("cart-list");
    list.innerHTML = "";

    if (cart.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Cart is empty.</p>`;
        return;
    }

    cart.forEach(item => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
        `;
        list.appendChild(li);
    });
}

// 🚀 Place order
async function placeOrder() {
    if (cart.length === 0) {
        showToast("Cart is empty", "error");
        return;
    }

    const items = cart.map(item => ({
        product: item.product,
        quantity: item.quantity
    }));

    try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ items })
        });

        if (response.ok) {
            showToast("Order placed successfully!");
            cart = [];
            renderCart();
        } else {
            showToast("Error placing order", "error");
        }
    } catch(err) {
        showToast("Network error", "error");
    }
}

// 🚀 Initial Load
renderCart();
loadProducts();
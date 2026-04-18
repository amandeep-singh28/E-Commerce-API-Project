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
    
    const icon = type === 'success' 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 📦 Load Products
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

        if(data.results) {
            data.results.forEach(product => {
                const li = document.createElement("li");
                
                const categoryText = product.category_name 
                    ? `<span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 0.5rem;">(${product.category_name})</span>` 
                    : "";

                li.innerHTML = `
                    <div style="flex:1;">
                        <span style="font-weight: 500;">${product.name}</span>
                        <span style="color: var(--accent); font-weight: 600; margin-left: 0.5rem;">₹${product.price}</span>
                        ${categoryText}
                    </div>
                    <button class="logout-btn" style="padding: 0.4rem 0.8rem;" onclick="deleteProduct(${product.id})">Delete</button>
                `;

                list.appendChild(li);
            });
        }
    } catch(e) {
        showToast("Error loading products", "error");
    }
}

// ➕ Add Category
async function addCategory() {
    const name = document.getElementById("category-name").value;

    if (!name) {
        showToast("Enter category name", "error");
        return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name })
    });

    if (response.ok) {
        showToast("Category added!");
        document.getElementById("category-name").value = "";
        loadCategories(); // refresh dropdown
    } else {
        showToast("Error adding category", "error");
    }
}

// ➕ Add Product
async function addProduct() {
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const description = document.getElementById("product-description").value;
    const selectedCategory = document.getElementById("product-category").value;
    const newCategory = document.getElementById("new-category").value.trim();

    if(!name || !price) {
        showToast("Name and Price are required", "error");
        return;
    }

    let categoryId = selectedCategory;

    // 🔥 If new category entered → create it first
    if (newCategory !== "") {
        const categoryResponse = await fetch("http://127.0.0.1:8000/api/categories/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name: newCategory })
        });

        if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            categoryId = categoryData.id;
            showToast("New category created!");
            await loadCategories();
        } else {
            showToast("Error creating category", "error");
            return;
        }
    }

    // 🔥 Now create product
    const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            name,
            price: parseFloat(price),
            description,
            category: parseInt(categoryId)
        })
    });

    if (response.ok) {
        showToast("Product added successfully!");

        // clear fields
        document.getElementById("product-name").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("new-category").value = "";

        loadProducts();
    } else {
        showToast("Error adding product", "error");
    }
}

// ❌ Delete Product
async function deleteProduct(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        showToast("Deleted product");
        loadProducts();
    } else {
        showToast("Error deleting", "error");
    }
}

// 📂 Load Categories
async function loadCategories() {
    const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();
    const dropdown = document.getElementById("product-category");
    dropdown.innerHTML = "";

    if (data.results) {
        data.results.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            dropdown.appendChild(option);
        });
    }
}

// 🚀 Initial Load
loadProducts();
loadCategories();
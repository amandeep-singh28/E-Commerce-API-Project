const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "login.html";
}

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
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;

        list.appendChild(li);
    });
}

// ➕ Add category
async function addCategory() {
    const name = document.getElementById("category-name").value;

    const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name })
    });

    if (response.ok) {
        alert("Category added");
    } else {
        alert("Error adding category");
    }
}

// ➕ Add product
async function addProduct() {
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const description = document.getElementById("product-description").value;
    const category = document.getElementById("product-category").value;

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
            category: parseInt(category)
        })
    });

    if (response.ok) {
        alert("Product added");
        loadProducts();
    } else {
        alert("Error adding product");
    }
}

// ❌ Delete product
async function deleteProduct(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("Deleted");
        loadProducts();
    } else {
        alert("Error deleting");
    }
}

// 🚀 Load data
loadProducts();
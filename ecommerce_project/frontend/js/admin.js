const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "login.html";
}

// 📦 Load Products
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

        // ✅ FIX: only show category if exists
        const categoryText = product.category_name 
            ? ` (${product.category_name})` 
            : "";

        li.innerHTML = `
            ${product.name} - ₹${product.price}${categoryText}
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;

        list.appendChild(li);
    });
}

// ➕ Add Category
async function addCategory() {
    const name = document.getElementById("category-name").value;

    if (!name) {
        alert("Enter category name");
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
        alert("Category added");
        document.getElementById("category-name").value = "";
        loadCategories(); // refresh dropdown
    } else {
        alert("Error adding category");
    }
}

// ➕ Add Product
async function addProduct() {
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const description = document.getElementById("product-description").value;
    const selectedCategory = document.getElementById("product-category").value;
    const newCategory = document.getElementById("new-category").value.trim();

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

            alert("New category created!");

            // refresh dropdown
            await loadCategories();
        } else {
            alert("Error creating category");
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
        alert("Product added successfully!");

        // clear fields
        document.getElementById("product-name").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("new-category").value = "";

        loadProducts();
    } else {
        alert("Error adding product");
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
        alert("Deleted");
        loadProducts();
    } else {
        alert("Error deleting");
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

    data.results.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        dropdown.appendChild(option);
    });
}

// 🚀 Initial Load
loadProducts();
loadCategories();
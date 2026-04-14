// 🔐 Check login
const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "login.html";
}

// 📦 Fetch products
async function loadProducts() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/products/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        const list = document.getElementById("product-list");
        list.innerHTML = "";

        // ✅ FIX HERE
        data.results.forEach(product => {
            const li = document.createElement("li");
            li.innerText = `${product.name} - ₹${product.price}`;
            list.appendChild(li);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

// 🚀 Call function
loadProducts();
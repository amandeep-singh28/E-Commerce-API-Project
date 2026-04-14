document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("error").innerText = "Invalid credentials";
            return;
        }

        // ✅ Store tokens
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // ✅ TEMP: redirect to user page (we'll improve later)
        window.location.href = "user.html";

    } catch (error) {
        document.getElementById("error").innerText = "Something went wrong";
    }
});
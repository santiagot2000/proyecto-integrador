document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("main");

    signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });

    // REGISTRO
    document.querySelector(".sign-up form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("registrar.php", {
            method: "POST",
            body: formData
        });

        const text = await res.text();
        alert(text);
        e.target.reset();
    });

    // LOGIN
    document.querySelector(".sign-in form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("login.php", {
            method: "POST",
            body: formData
        });

        const text = await res.text();
        alert(text);
    });
});

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

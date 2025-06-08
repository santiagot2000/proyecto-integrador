
/* 
document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById("seccionRegistro");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("main");

    signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });
}); */

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}


function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

let indice = 0;
const slides = document.getElementById('slides');
const total = slides.children.length;
const indicadores = document.getElementById('indicadores');
const carrusel = document.getElementById('carrusel');

// Crear indicadores dinámicamente
for (let i = 0; i < total; i++) {
    const punto = document.createElement('span');
    punto.addEventListener('click', () => {
    indice = i;
    actualizarCarrusel();
    });
    indicadores.appendChild(punto);
}

function moverSlide(direccion) {
    indice = (indice + direccion + total) % total;
    actualizarCarrusel();
}

function actualizarCarrusel() {
  slides.style.transform = `translateX(-${indice * 100}%)`;

  // Actualizar indicadores
    const puntos = indicadores.children;
    for (let i = 0; i < puntos.length; i++) {
        puntos[i].classList.toggle('activo', i === indice);
    }
}

// Auto slide
let intervalo = setInterval(() => moverSlide(1), 5000);

// Pausar en hover
carrusel.addEventListener('mouseenter', () => clearInterval(intervalo));
carrusel.addEventListener('mouseleave', () => {
    intervalo = setInterval(() => moverSlide(1), 3000);
});

// Inicializar
actualizarCarrusel();

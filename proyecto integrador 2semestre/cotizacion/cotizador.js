// Datos de ejemplo: cada imagen tiene un valor único por m²
const servicios = [
  { id: 1, nombre: "Pulgas", imagen: 'imagenes/pulga.png', valor: 30000 },
  { id: 2, nombre: "Arañas", imagen: 'imagenes/araña.png', valor: 15000 },
  { id: 3, nombre: "Chinches", imagen: 'imagenes/chinches.png', valor: 30000 },
  { id: 4, nombre: "Cucarachas", imagen: 'imagenes/cucaracha.png', valor: 18000 },
  { id: 5, nombre: "Garrapatas", imagen: 'imagenes/garrapata.png', valor: 20000 },
  { id: 6, nombre: "Hormigas", imagen: 'imagenes/hormigas.png', valor: 12000 },
  { id: 7, nombre: "Moscas", imagen: 'imagenes/mosca.png', valor: 25000 },
  { id: 8, nombre: "Ratones", imagen: 'imagenes/raton.png', valor: 28000 },
  { id: 9, nombre: "Mosquitos", imagen: 'imagenes/mosquito.png', valor: 15000 },
];

  
  let seleccion = null;
  
  // Insertar imágenes en la galería
  const galeria = document.getElementById('galeria');
servicios.forEach(servicio => {
  // Crear contenedor
  const contenedor = document.createElement('div');
  contenedor.classList.add('item-servicio');

  // Crear imagen
  const img = document.createElement('img');
  img.src = servicio.imagen;
  img.dataset.id = servicio.id;
  img.alt = servicio.nombre;
  img.addEventListener('click', () => seleccionarServicio(servicio.id));

  // Crear texto
  const texto = document.createElement('p');
  texto.textContent = servicio.nombre;

  // Agregar todo al contenedor
  contenedor.appendChild(img);
  contenedor.appendChild(texto);

  // Agregar contenedor a la galería
  galeria.appendChild(contenedor);
});

  
  function seleccionarServicio(id) {
    seleccion = servicios.find(s => s.id === id);
    // Quitar selección previa
    document.querySelectorAll('.galeria img').forEach(img => {
      img.classList.remove('seleccionada');
    });
    // Marcar la nueva selección
    const imgSeleccionada = document.querySelector(`img[data-id="${id}"]`);
    imgSeleccionada.classList.add('seleccionada');
  }
  
  // Lógica de cotización
  document.getElementById('cotizar').addEventListener('click', () => {
    const metros = parseFloat(document.getElementById('metros').value);
    const resultado = document.getElementById('resultado');
  
    if (!seleccion) {
      resultado.textContent = "Por favor selecciona un servicio.";
      return;
    }
  
    if (isNaN(metros) || metros <= 0) {
      resultado.textContent = "Ingresa un número válido de metros cuadrados.";
      return;
    }
  
    const total = seleccion.valor * metros;
    resultado.textContent = `Total: ${pesos(total)} COP`;
  });
  
  function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
//
function pesos(total){
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total);
    };
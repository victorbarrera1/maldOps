/* Funcion para activar el link cuando pase el cursor por encima de la opcion del menu */

var lista = document.querySelectorAll('.nav li');
function activarLink() {
    lista.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
}

lista.forEach((item) =>
    item.addEventListener('mouseover', activarLink));

/* Función para mostrar/ocultar el menu */

var toggle = document.querySelector('.toggle');
var nav = document.querySelector('.nav');
var container = document.querySelector('.container');

toggle.onclick = function () {
    nav.classList.toggle('active');
    container.classList.toggle('active');
}



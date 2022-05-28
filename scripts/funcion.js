document.addEventListener('DOMContentLoaded', () => {
    // Se cargan las imagenes de las tortas
    const listaDeTortas = [
        {
            id: 1,
            nombre: 'Cake Surtido',
            precio: 42.0,
            imagen: 'images/torta1.jpg'
        },
        {
            id: 2,
            nombre: 'Torta de Frutas',
            precio: 38.0,
            imagen: 'images/torta2.jpg'
        },
        {
            id: 3,
            nombre: 'Combo Cupcakes',
            precio: 40.0,
            imagen: 'images/torta7.jpg'
        },
        {
            id: 4,
            nombre: 'Cake de Bautizo',
            precio: 35.0,
            imagen: 'images/torta8.jpg'
        },
        {
            id: 5,
            nombre: 'Cake de Flores',
            precio: 26.0,
            imagen: 'images/torta5.jpg'
        },
        {
            id: 6,
            nombre: 'Doble Cupcakes',
            precio: 25.0,
            imagen: 'images/torta6.jpg'
        }
    ];

    let carrito = [];
    const moneda = 'S/.';
    const DOMtortas = document.querySelector('#tortas');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonLimpiar = document.querySelector('#boton-limpiar');
    const miLocalStorage = window.localStorage;

    /**
    * Dibuja las tortas a partir de la base de datos. 
    * Estas serían imagenes fijas. El mantenimiento se realiza al carrito
    */
    function dibujarTortas() {
        listaDeTortas.forEach((torta) => {
            // Creamos la estructura del card de bootstrap
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Creamos el Body del card
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Creamos la imagen de la torta
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', torta.imagen);
            // Creamos el titulo de la torta
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = torta.nombre;
            // Creamos el precio de la torta
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${moneda}${torta.precio}`;
            // Creamos el botón + para la torta 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-success');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('identificador', torta.id);
            miNodoBoton.addEventListener('click', agregarTortaAlCarrito);
            // Insertamos las tortas
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMtortas.appendChild(miNodo);
        });
    }

    /**
    * Evento para añadir una torta al carrito de compras
    */
    function agregarTortaAlCarrito(evento) {
        // Agregamos el Nodo al carrito
        carrito.push(evento.target.getAttribute('identificador'))
        // Actualizamos el carrito 
        dibujarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function dibujarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = listaDeTortas.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${moneda}${miItem[0].precio}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
       // Renderizamos el precio total en el HTML
       DOMtotal.textContent = calcularTotal();
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        dibujarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = listaDeTortas.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /**
    * Vacia el carrito y vuelve a dibujarlo
    */
    function limpiarCarrito() {
        // Limpiamos el arreglo del carrito
        carrito = [];
        // Dibujamos de nuevo al carrito
        dibujarCarrito();
        // Borra LocalStorage
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
        //miLocalStorage.setItem('carrito', carrito);
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            //carrito = miLocalStorage.getItem('carrito');
        }
    }

    // Eventos
    DOMbotonLimpiar.addEventListener('click', limpiarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    dibujarTortas();
    dibujarCarrito();
  });
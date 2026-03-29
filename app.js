// VARIABLES GLOBALES Y CONEXIÓN
// La URL real queda comentada por ahora
// const urlAPI = 'https://localhost:7117/api/productos'; 
let inventarioLocal = []; 
let carrito = []; 

const carritoLateral = document.getElementById('carrito-lateral');
const overlayCarrito = document.getElementById('overlay-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalPrecioElement = document.getElementById('total-precio');
const btnPagar = document.getElementById('btn-pagar');
const iconoCarritoHeader = document.querySelector('.cart'); 

// FETCH DE PRODUCTOS
async function cargarProductos() {
    // BLOQUE 1: CÓDIGO DE PRODUCCIÓN (API REAL EN C#) - COMENTADO
    /*
    try {
        const respuesta = await fetch(urlAPI);
        inventarioLocal = await respuesta.json(); 
        
        const gridProductos = document.querySelector('.grid-productos');
        gridProductos.innerHTML = ''; 

        inventarioLocal.forEach(prod => {
            const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(prod.precio);
            
            gridProductos.innerHTML += `
                <article class="tarjeta-producto">
                    <div class="contenedor-imagen">
                        <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img">
                    </div>
                    <div class="info-producto">
                        <h3>${prod.nombre}</h3>
                        <p class="precio">${precioFormateado}</p>
                        <button class="btn-comprar" id="btn-comprar-${prod.id}" onclick="agregarAlCarrito(${prod.id}, this)">Agregar al carrito</button>
                    </div>
                </article>
            `;
        });
    } catch (error) {
        console.error("Error conectando con la API:", error);
    }
    */

    // MOCK DATA PARA LA DEMO DEL CLIENTE (ACTIVO)
    const mockProductos = [
        { 
            id: 1, 
            nombre: 'Buzo Oversize Urban Deep', 
            precio: 28900, 
            categoria: 'Buzos', 
            imagen: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 2, 
            nombre: 'Remera Basic Cotton White', 
            precio: 14500, 
            categoria: 'Remeras', 
            imagen: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 3, 
            nombre: 'Pantalon Cargo Techwear Black', 
            precio: 35000, 
            categoria: 'Pantalones', 
            imagen: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 4, 
            nombre: 'Gorra Trucker Urban Patch', 
            precio: 9800, 
            categoria: 'Accesorios', 
            imagen: 'https://images.unsplash.com/photo-1588850453982-f7560a66d03d?q=80&w=400&auto=format&fit=crop' 
        }
    ];

    inventarioLocal = mockProductos;
    
    const gridProductos = document.querySelector('.grid-productos');
    gridProductos.innerHTML = ''; 

    inventarioLocal.forEach(prod => {
        const precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(prod.precio);
        
        gridProductos.innerHTML += `
            <article class="tarjeta-producto">
                <div class="contenedor-imagen">
                    <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img">
                </div>
                <div class="info-producto">
                    <h3>${prod.nombre}</h3>
                    <p class="precio">${precioFormateado}</p>
                    <button class="btn-comprar" id="btn-comprar-${prod.id}" onclick="agregarAlCarrito(${prod.id}, this)">Agregar al carrito</button>
                </div>
            </article>
        `;
    });
}

// LÓGICA DEL CARRITO DE COMPRAS
function agregarAlCarrito(idProducto, boton) {
    boton.disabled = true;
    const textoOriginal = boton.innerText;
    boton.innerText = "Procesando...";

    setTimeout(() => {
        const productoSeleccionado = inventarioLocal.find(p => p.id === idProducto);
        
        carrito.push(productoSeleccionado);
        mostrarToast(`¡${productoSeleccionado.nombre} agregado al carrito!`, 'exito');
        
        document.getElementById('contador-carrito').innerText = carrito.length;
        actualizarPanelCarrito();
        
        boton.classList.add('exito');
        boton.innerText = "¡Agregado!";
        
        setTimeout(() => {
            boton.disabled = false;
            boton.classList.remove('exito');
            boton.innerText = textoOriginal;
        }, 1500);
        
    }, 500);
}

function actualizarPanelCarrito() {
    const btnVaciar = document.getElementById('btn-vaciar-carrito');

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
        totalPrecioElement.innerText = "$0,00";
        btnPagar.disabled = true;
        btnVaciar.style.display = 'none';
        return;
    }

    btnVaciar.style.display = 'block';
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach((prod, index) => {
        total += prod.precio;
        const precioFmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(prod.precio);
        
        listaCarrito.innerHTML += `
            <div class="item-carrito">
                <div>
                    <strong>${prod.nombre}</strong>
                    <p style="color:#666; font-size:0.9rem;">${precioFmt}</p>
                </div>
                <button class="btn-eliminar-item" onclick="eliminarItem(${index})" title="Eliminar producto">🗑️</button>
            </div>
        `;
    });

    totalPrecioElement.innerText = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
    btnPagar.disabled = false;
}

function eliminarItem(indice) {
    carrito.splice(indice, 1);
    document.getElementById('contador-carrito').innerText = carrito.length;
    actualizarPanelCarrito();
}

function vaciarCarrito() {
    carrito = [];
    document.getElementById('contador-carrito').innerText = carrito.length;
    actualizarPanelCarrito();
}

iconoCarritoHeader.addEventListener('click', () => {
    carritoLateral.classList.remove('carrito-oculto');
    overlayCarrito.classList.remove('oculto');
});

document.getElementById('btn-cerrar-carrito').addEventListener('click', cerrarCarrito);
overlayCarrito.addEventListener('click', cerrarCarrito);

function cerrarCarrito() {
    carritoLateral.classList.add('carrito-oculto');
    overlayCarrito.classList.add('oculto');
}

cargarProductos();

// SISTEMA DE NOTIFICACIONES (TOASTS)
function mostrarToast(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = `toast toast-${tipo}`;
    toast.innerText = mensaje;
    
    contenedor.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('ocultar');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// INTEGRACIÓN CON MERCADO PAGO
btnPagar.addEventListener('click', async () => {
    btnPagar.disabled = true;
    const textoOriginal = btnPagar.innerText;
    btnPagar.innerText = "Conectando con Mercado Pago...";

    try {
        const itemsAgrupados = [];
        carrito.forEach(prod => {
            const itemExistente = itemsAgrupados.find(i => i.ProductoId === prod.id);
            if (itemExistente) {
                itemExistente.Cantidad += 1; 
            } else {
                itemsAgrupados.push({ ProductoId: prod.id, Cantidad: 1 }); 
            }
        });

        // NOTA: Esta URL de Mercado Pago sigue apuntando a localhost. 
        // Si el cliente presiona pagar desde su celular, esto fallará, 
        // pero para la demo visual del catálogo es irrelevante.
        const urlPagos = 'https://localhost:7117/api/pagos/crear-preferencia'; 
        
        const respuesta = await fetch(urlPagos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Items: itemsAgrupados })
        });

        if (!respuesta.ok) throw new Error("El backend rechazó la solicitud de pago.");

        const datos = await respuesta.json();
        window.location.href = datos.urlPago; 

    } catch (error) {
        console.error("Error procesando el pago:", error);
        mostrarToast("Hubo un problema al contactar con la pasarela de pagos. Por favor, intenta de nuevo.", "error");
        btnPagar.disabled = false;
        btnPagar.innerText = textoOriginal;
    }
});

// LÓGICA DEL CHATBOT VIRTUAL
const btnChatbot = document.getElementById('btn-chatbot');
const ventanaChat = document.getElementById('ventana-chat');
const btnCerrarChat = document.getElementById('btn-cerrar-chat');
const chatMensajes = document.getElementById('chat-mensajes');
const inputChat = document.getElementById('input-chat');
const btnEnviarChat = document.getElementById('btn-enviar-chat');

btnChatbot.addEventListener('click', () => ventanaChat.classList.remove('chat-oculto'));
btnCerrarChat.addEventListener('click', () => ventanaChat.classList.add('chat-oculto'));

function agregarMensajeAlChat(mensaje, emisor, esHTML = false) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add(`msg-${emisor}`);
    
    if (esHTML) {
        divMensaje.innerHTML = mensaje;
    } else {
        divMensaje.innerText = mensaje;
    }
    
    chatMensajes.appendChild(divMensaje);
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

function procesarMensajeUsuario() {
    const textoUsuario = inputChat.value.trim();
    if (textoUsuario === "") return; 

    agregarMensajeAlChat(textoUsuario, 'usuario');
    inputChat.value = ''; 

    setTimeout(() => {
        generarRespuestaBot(textoUsuario);
    }, 600);
}

function generarRespuestaBot(mensaje) {
    const texto = mensaje.toLowerCase();
    
    let respuesta = "Disculpa, no entendí bien. ¿Puedes preguntarme sobre envíos, pagos o precios?";
    let esHTML = false;

    if (texto.includes("envio") || texto.includes("envío") || texto.includes("demora") || texto.includes("llega")) {
        respuesta = "📦 Hacemos envíos a todo el país. La demora es de 3 a 5 días hábiles.";
    } 
    else if (texto.includes("pago") || texto.includes("pagar") || texto.includes("tarjeta")) {
        respuesta = "💳 Aceptamos Mercado Pago, tarjetas de crédito, débito y transferencias.";
    } 
    else if (texto.includes("precio") || texto.includes("costo")) {
        respuesta = "🏷️ Todos los precios están actualizados en nuestro catálogo web.";
    } 
    else if (texto.includes("humano") || texto.includes("contacto") || texto.includes("asesor") || texto.includes("problema")) {
        const telefono = "5491123456789"; 
        const msjWa = "Hola, necesito hablar con un asesor desde la tienda web.";
        const linkWa = `https://wa.me/${telefono}?text=${encodeURIComponent(msjWa)}`;
        
        respuesta = `
            <p>Entiendo. Te derivo con nuestro equipo técnico ahora mismo.</p>
            <a href="${linkWa}" target="_blank" style="display:inline-block; margin-top:10px; padding:8px 12px; background:#25D366; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">Abrir WhatsApp</a>
        `;
        esHTML = true;
    }
    else if (texto.includes("hola") || texto.includes("buenas")) {
        respuesta = "¡Hola! Qué gusto saludarte. ¿En qué te puedo ayudar?";
    }

    agregarMensajeAlChat(respuesta, 'bot', esHTML);
}

btnEnviarChat.addEventListener('click', procesarMensajeUsuario);
inputChat.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        procesarMensajeUsuario();
    }
});
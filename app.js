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

    // BLOQUE 2: MOCK DATA PARA LA DEMO DEL CLIENTE (ACTIVO)
    const mockProductos = [
        { 
            id: 1, 
            nombre: 'Gift Card Steam $20 USD', 
            precio: 25000, 
            categoria: 'Gift Cards', 
            imagen: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 2, 
            nombre: 'Tarjeta Google Play $5000', 
            precio: 5500, 
            categoria: 'Gift Cards', 
            imagen: 'https://images.unsplash.com/photo-1588508065123-287b28e0131b?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 3, 
            nombre: 'Auriculares Inalámbricos Gaming Pro', 
            precio: 45000, 
            categoria: 'Tecnología', 
            imagen: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 4, 
            nombre: 'Mouse Gamer RGB Ultraligero', 
            precio: 18500, 
            categoria: 'Tecnología', 
            imagen: 'https://images.unsplash.com/photo-1527814050087-379381547339?q=80&w=400&auto=format&fit=crop' 
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

// SISTEMA DE NOTIFICACIONES (TOAST)
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

// =========================================
// GESTIÓN DE USUARIOS, LOGIN Y CHECKOUT
// =========================================
const overlayCheckout = document.getElementById('overlay-checkout');
const formCheckout = document.getElementById('form-checkout');
const btnCerrarCheckout = document.getElementById('btn-cerrar-checkout');
const btnConfirmarDatos = document.getElementById('btn-confirmar-datos');
const btnLoginHeader = document.getElementById('btn-login-header');
const spanNombreUsuario = document.getElementById('nombre-usuario-header');
const btnLogout = document.getElementById('btn-logout');

// Elementos de las pestañas
const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const camposRegistro = document.querySelectorAll('.campo-registro');

// Base de datos simulada y Sesión
let baseDatosUsuarios = JSON.parse(localStorage.getItem('bdUsuariosDRVentas')) || [];
let usuarioActivo = JSON.parse(localStorage.getItem('sesionActivaDRVentas')) || null;
let modoLogin = true; // true = Login, false = Registro

// 1. Inicializar la UI si hay sesión
function actualizarUIUsuario() {
    if (usuarioActivo) {
        spanNombreUsuario.innerText = usuarioActivo.nombre.split(' ')[0];
        btnLogout.classList.remove('oculto');
    } else {
        spanNombreUsuario.innerText = "Ingresar";
        btnLogout.classList.add('oculto');
    }
}
actualizarUIUsuario(); // Ejecutar al cargar la página

// 2. Lógica de Pestañas (Cambiar entre Login y Registro)
function cambiarModoAuth(esLogin) {
    modoLogin = esLogin;
    
    if (esLogin) {
        tabLogin.classList.add('activa');
        tabRegistro.classList.remove('activa');
        camposRegistro.forEach(campo => campo.style.display = 'none');
        document.getElementById('nombre').removeAttribute('required');
        document.getElementById('direccion').removeAttribute('required');
        btnConfirmarDatos.innerText = "Ingresar a mi cuenta";
    } else {
        tabRegistro.classList.add('activa');
        tabLogin.classList.remove('activa');
        camposRegistro.forEach(campo => campo.style.display = 'block');
        document.getElementById('nombre').setAttribute('required', 'true');
        document.getElementById('direccion').setAttribute('required', 'true');
        btnConfirmarDatos.innerText = "Crear Cuenta";
    }
}

tabLogin.addEventListener('click', () => cambiarModoAuth(true));
tabRegistro.addEventListener('click', () => cambiarModoAuth(false));

// 3. Abrir modal desde el botón "Ingresar" del Header
btnLoginHeader.addEventListener('click', () => {
    if (usuarioActivo) {
        mostrarToast(`Ya estás conectado como ${usuarioActivo.nombre}`, "info");
        return;
    }
    cambiarModoAuth(true); // Abrir por defecto en Login
    formCheckout.reset();
    overlayCheckout.classList.remove('oculto');
});

// 4. Salir (Logout)
btnLogout.addEventListener('click', () => {
    usuarioActivo = null;
    localStorage.removeItem('sesionActivaDRVentas');
    actualizarUIUsuario();
    mostrarToast("Has cerrado sesión exitosamente.", "info");
});

// 5. Flujo del Carrito a Pago
btnPagar.addEventListener('click', async () => {
    cerrarCarrito(); 

    if (!usuarioActivo) {
        mostrarToast("Inicia sesión o regístrate para comprar.", "info");
        cambiarModoAuth(true);
        overlayCheckout.classList.remove('oculto');
    } else {
        mostrarToast(`Preparando tu pago, ${usuarioActivo.nombre.split(' ')[0]}...`, "exito");
        btnPagar.disabled = true;
        btnPagar.innerText = "Conectando...";
        await procesarPagoMercadoPago();
    }
});

btnCerrarCheckout.addEventListener('click', () => overlayCheckout.classList.add('oculto'));

// =========================================
// MOTOR DE AUTENTICACIÓN (FORMULARIO)
// =========================================
let peticionEnCurso = false; 

formCheckout.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    if (peticionEnCurso) return; 

    peticionEnCurso = true;
    btnConfirmarDatos.disabled = true;
    const textoOriginal = btnConfirmarDatos.innerText;
    btnConfirmarDatos.innerText = "Procesando...";

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        if (modoLogin) {
            // PROCESO DE LOGIN
            const usuarioEncontrado = baseDatosUsuarios.find(u => u.email === email && u.password === password);
            
            if (!usuarioEncontrado) {
                mostrarToast("Correo o contraseña incorrectos.", "error");
                throw new Error("Credenciales inválidas");
            }
            
            usuarioActivo = usuarioEncontrado;
            mostrarToast(`¡Bienvenido de nuevo, ${usuarioActivo.nombre.split(' ')[0]}!`, "exito");

        } else {
            // PROCESO DE REGISTRO
            const existeEmail = baseDatosUsuarios.some(u => u.email === email);
            if (existeEmail) {
                mostrarToast("Este correo ya está registrado.", "error");
                throw new Error("Email duplicado");
            }

            const nuevoUsuario = {
                nombre: document.getElementById('nombre').value.trim(),
                email: email,
                password: password,
                direccion: document.getElementById('direccion').value.trim()
            };
            
            baseDatosUsuarios.push(nuevoUsuario);
            localStorage.setItem('bdUsuariosDRVentas', JSON.stringify(baseDatosUsuarios));
            
            usuarioActivo = nuevoUsuario;
            mostrarToast("¡Cuenta creada con éxito!", "exito");
        }
        
        // Guardamos la sesión activa
        localStorage.setItem('sesionActivaDRVentas', JSON.stringify(usuarioActivo));
        actualizarUIUsuario();
        
        // Si venía desde el carrito queriendo pagar, lo enviamos a Mercado Pago
        if (carrito.length > 0) {
            btnConfirmarDatos.innerText = "Conectando con Mercado Pago...";
            await procesarPagoMercadoPago();
        } else {
            overlayCheckout.classList.add('oculto');
        }

    } catch (error) {
        // En caso de error (credenciales malas), destrabamos el botón
        console.warn(error.message);
    } finally {
        if (carrito.length === 0 || !usuarioActivo) {
            peticionEnCurso = false;
            btnConfirmarDatos.disabled = false;
            btnConfirmarDatos.innerText = textoOriginal;
        }
    }
});

// =========================================
// INTEGRACIÓN CON MERCADO PAGO
// =========================================
async function procesarPagoMercadoPago() {
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
        btnPagar.disabled = false;
        btnPagar.innerText = "Ir a Pagar";
        overlayCheckout.classList.add('oculto');
        throw error; 
    }
}

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
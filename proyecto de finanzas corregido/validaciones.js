
// 1. FUNCIONES GLOBALES CORE FINANCIERO Y UTILIDADES================================================================================================================
function confirmarCerrarSesion() {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioRegistrado')); //guardamos los datos en almacenamiento local
    if (usuarioGuardado) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioGuardado)); // si hay un usuario guardado, lo guardamos
    }
    
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) { // si el usuario confirma que desea cerrar sesion, elimina el usuario actual
        localStorage.removeItem('usuarioActual'); 
        return true; //true significa que se cerro la sesion
    }
    return false; //false significa que no se cerro la sesion, en caso de errores
}

// Función para obtener el usuario actual
function obtenerUsuarioActual() {
    const usuarioJSON = localStorage.getItem('usuarioActual');
    if (usuarioJSON) {
        return JSON.parse(usuarioJSON);
    }
    return null;
}

// Funciones para Transacciones
function obtenerTransacciones() {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return [];
    
    // CORREGIDO: Usando template literal para la clave
    const clave = `transacciones_${usuario.email}`;
    const transaccionesJSON = localStorage.getItem(clave);
    
    if (transaccionesJSON) {
        return JSON.parse(transaccionesJSON);
    }
    return [];
}

function guardarTransacciones(transacciones) {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return false;
    
    const clave = `transacciones_${usuario.email}`;
    localStorage.setItem(clave, JSON.stringify(transacciones));
    return true;
}

// Funciones para Categorías
function obtenerCategorias() {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return { ingresos: [], gastos: [] };
    
    const clave = `categorias_${usuario.email}`;
    const categoriasJSON = localStorage.getItem(clave);
    
    if (categoriasJSON) {
        return JSON.parse(categoriasJSON);
    }
    
    // Categorías por defecto
    return {
        ingresos: ['Salario', 'Freelance', 'Inversiones', 'Otros'],
        gastos: ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Otros']
    };
}

function guardarCategorias(categorias) {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return false;
    
    const clave = `categorias_${usuario.email}`;
    localStorage.setItem(clave, JSON.stringify(categorias));
    return true;
}

// Funciones de Formato
function formatearMonto(monto) {
    return '$' + parseFloat(monto).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatearFecha(fecha) {
    const f = new Date(fecha + 'T00:00:00');
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return f.toLocaleDateString('es-EC', opciones);
}


// 2. FUNCIONES DEL DASHBOARD==============================================================================================================================

function cargarDashboard() {
    const usuario = obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'login.html'; // Cambiado de 'inicio.html' a 'login.html' para forzar el acceso
        return;
    }
    
    // Mostrar nombre del usuario
    const nombreUsuarioEl = document.getElementById('nombreUsuario');
    if (nombreUsuarioEl) {
        nombreUsuarioEl.textContent = usuario.nombre;
    }
    
    calcularResumen();
    cargarTransaccionesRecientes();
}

function calcularResumen() {
    const transacciones = obtenerTransacciones();
    
    let totalIngresos = 0;
    let totalGastos = 0;
    
    transacciones.forEach(t => {
        const monto = parseFloat(t.monto);
        if (t.tipo === 'ingreso') {
            totalIngresos += monto;
        } else {
            totalGastos += monto;
        }
    });
    
    const balance = totalIngresos - totalGastos;
    
    // Actualizar UI
    const totalIngresosEl = document.getElementById('totalIngresos');
    const totalGastosEl = document.getElementById('totalGastos');
    const balanceEl = document.getElementById('balance');
    
    if (totalIngresosEl) totalIngresosEl.textContent = formatearMonto(totalIngresos);
    if (totalGastosEl) totalGastosEl.textContent = formatearMonto(totalGastos);
    if (balanceEl) {
        balanceEl.textContent = formatearMonto(balance);
        balanceEl.className = 'monto ' + (balance >= 0 ? 'positivo' : 'negativo');
    }
}

function cargarTransaccionesRecientes() {
    const transacciones = obtenerTransacciones();
    const tbody = document.getElementById('tablaTransacciones');
    
    if (!tbody) return;
    
    transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    const recientes = transacciones.slice(0, 10);
    
    if (recientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:#999;">
                    No hay transacciones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    recientes.forEach(t => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${formatearFecha(t.fecha)}</td>
            <td>${t.descripcion}</td>
            <td>${t.categoria}</td>
            <td class="${t.tipo}">${formatearMonto(t.monto)}</td>
            <td>
                <span class="badge ${t.tipo}">
                    ${t.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                </span>
            </td>
            <td>
                <button onclick="eliminarTransaccion('${t.id}')" class="btn-eliminar" title="Eliminar">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function eliminarTransaccion(id) {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) {
        return;
    }
    
    let transacciones = obtenerTransacciones();
    transacciones = transacciones.filter(t => t.id !== id);
    
    guardarTransacciones(transacciones);
    cargarDashboard();
    alert('Transacción eliminada correctamente');
}

// 3. FUNCIONES PARA AGREGAR TRANSACCIÓN=============================================================================================================

function cargarFormularioTransaccion() {
    const usuario = obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'login.html'; // Cambiado de 'inicio.html' a 'login.html'
        return;
    }
    
    cargarCategoriasEnSelect();
}

function cargarCategoriasEnSelect() {
    const categorias = obtenerCategorias();
    const tipoSelect = document.getElementById('tipoTransaccion'); 
    const categoriaSelect = document.getElementById('categoria');
    
    if (!tipoSelect || !categoriaSelect) return;
    actualizarCategoriasSegunTipo();
}

function actualizarCategoriasSegunTipo() {
    const categorias = obtenerCategorias();
    const tipoSelect = document.getElementById('tipoTransaccion');
    const categoriaSelect = document.getElementById('categoria');
    
    if (!tipoSelect || !categoriaSelect) return;
    
    const tipo = tipoSelect.value;
    const listaCategorias = tipo === 'ingreso' ? categorias.ingresos : categorias.gastos;
    
    categoriaSelect.innerHTML = '<option value="">Selecciona una categoría</option>';
    
    listaCategorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoriaSelect.appendChild(option);
    });
}

function guardarTransaccion(event) {
    event.preventDefault();
    
    const fecha = document.getElementById('fecha').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const monto = document.getElementById('monto').value;
    const tipo = document.getElementById('tipoTransaccion').value;
    const categoria = document.getElementById('categoria').value;
    
    // Validaciones
    if (!fecha || !descripcion || !monto || !tipo || !categoria) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (parseFloat(monto) <= 0) {
        alert('El monto debe ser mayor a 0');
        return;
    }
    
    // Crear transacción
    const transaccion = {
        id: Date.now().toString(),
        fecha: fecha,
        descripcion: descripcion,
        monto: parseFloat(monto),
        tipo: tipo,
        categoria: categoria
    };
    
    // Guardar
    const transacciones = obtenerTransacciones();
    transacciones.push(transaccion);
    guardarTransacciones(transacciones);
    
    alert('Transacción guardada correctamente');
    window.location.href = 'dashboard.html';
}

// 4. FUNCIONES PARA CATEGORÍAS=====================================================================================================================================================================================================================================================

function cargarCategorias() {
    const usuario = obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'login.html'; 
        return;
    }
    
    mostrarCategorias();
}

function mostrarCategorias() {
    const categorias = obtenerCategorias();
    const listaContenedor = document.getElementById('listaCategorias');
    const totalCategoriasEl = document.getElementById('totalCategorias');

    if (!listaContenedor) return;

    listaContenedor.innerHTML = `
        <div class="categoria-grupo">
            <h4>Ingresos (${categorias.ingresos.length})</h4>
            <ul id="listaIngresos"></ul>
        </div>
        <div class="categoria-grupo">
            <h4>Gastos (${categorias.gastos.length})</h4>
            <ul id="listaGastos"></ul>
        </div>
    `;

    const listaIngresos = document.getElementById('listaIngresos');
    const listaGastos = document.getElementById('listaGastos');
    
    // Renderizar Ingresos
    categorias.ingresos.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${cat}
            <button onclick="eliminarCategoria('ingreso', '${cat}')" class="btn-eliminar-cat">Eliminar</button>
        `;
        listaIngresos.appendChild(li);
    });
    
    // Renderizar Gastos
    categorias.gastos.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${cat}
            <button onclick="eliminarCategoria('gasto', '${cat}')" class="btn-eliminar-cat">Eliminar</button>
        `;
        listaGastos.appendChild(li);
    });

    if (totalCategoriasEl) {
        totalCategoriasEl.textContent = categorias.ingresos.length + categorias.gastos.length;
    }
}

function agregarCategoria(event) {
    event.preventDefault(); // Evita el envío por defecto del formulario

    const input = document.getElementById('nombreCat');
    const tipoSelect = document.getElementById('tipoCat');
    
    if (!input || !tipoSelect) return;
    
    const nombreCategoria = input.value.trim();
    const tipo = tipoSelect.value;
    
    if (!nombreCategoria) {
        alert('Ingresa un nombre para la categoría');
        return;
    }
    
    const categorias = obtenerCategorias();
    let lista = [];

    if (tipo === 'ingreso' || tipo === 'ambos') {
        lista = categorias.ingresos;
    }
    if (tipo === 'gasto' || tipo === 'ambos') {
        lista = tipo === 'gasto' ? categorias.gastos : lista.concat(categorias.gastos);
    }
    
    // Validar si ya existe en la lista que se va a agregar
    if (lista.includes(nombreCategoria)) {
        alert('Esta categoría ya existe');
        return;
    }

    if (tipo === 'ingreso' || tipo === 'ambos') {
        categorias.ingresos.push(nombreCategoria);
    }
    if (tipo === 'gasto' || tipo === 'ambos') {
        categorias.gastos.push(nombreCategoria);
    }
    
    guardarCategorias(categorias);
    
    input.value = '';
    mostrarCategorias();
    alert('Categoría agregada correctamente');
}

function eliminarCategoria(tipo, nombre) {
    // CORREGIDO: Uso de template literal y backticks para el string de confirmación
    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) { 
        return;
    }
    
    const categorias = obtenerCategorias();
    const lista = tipo === 'ingreso' ? categorias.ingresos : categorias.gastos;
    
    const index = lista.indexOf(nombre);
    if (index > -1) {
        lista.splice(index, 1);
        guardarCategorias(categorias);
        mostrarCategorias();
        alert('Categoría eliminada correctamente');
    }
}


// 5. FUNCIONES AUXILIARES DE VALIDACIÓN=====================================================================================================================================================================================

// Funciones para calcular la fuerza de la contraseña
function calcularFuerza(password) {
    let fuerza = 0;
    if (password.length >=8) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    return fuerza; // de 0 a 4
}

function actualizarStrengthBar(fuerza) {
    const niveles = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const colores = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff'];

    const strengthBar = document.querySelector('.strength-bar'); 
    const strengthText = document.getElementById('strengthText'); 

    if (strengthBar && strengthText) {
        const porcentaje = (fuerza/4)*100;
        strengthBar.style.width = porcentaje + '%';
        strengthBar.style.backgroundColor = colores[fuerza];
        strengthText.textContent = niveles[fuerza]; 
        strengthText.style.color = colores[fuerza]; 
    }
}

// Funciones auxiliares de error (para registro y login)    
function mostrarError(idError, mensaje, input) {
    const error = document.getElementById(idError);
    if(error) error.textContent = mensaje;
    input.classList.add('invalido');
    input.classList.remove('valido');
}  

function limpiarError(idError, input) {
    const error = document.getElementById(idError);
    if(error) error.textContent = '';
    input.classList.remove('invalido');
    input.classList.add('valido');
}

// 6. LÓGICA DE INICIALIZACIÓN registro,login.etc============================================================================================================================0

document.addEventListener('DOMContentLoaded', () => {
    
    //Formulario del registro
    const formRegistro = document.getElementById('formularioRegistro');
    if (formRegistro){
        const nombre= document.getElementById('nombre');
        const emailReg = document.getElementById('emailReg');
        const passwordReg = document.getElementById('passwordReg');
        const passwordConfirm = document.getElementById('passwordConfirm'); 
        const botonregistrar = document.getElementById('botonregistrar');

        // Detectar fuerza de contraseña en tiempo real
        passwordReg.addEventListener('input', () => {
            const fuerza = calcularFuerza(passwordReg.value);
            actualizarStrengthBar(fuerza);
        });

        // Evento click de registro
        botonregistrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (validarRegistro()) {
                const usuario ={
                    nombre: nombre.value,
                    email: emailReg.value,
                    password: passwordReg.value
                };

                localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
                alert('Registro exitoso :D'); 
                window.location.href = 'login.html';
            }
        });

        // Validar el registro
        function validarRegistro() {
            let valido = true;

            if(nombre.value.trim()==="") {
                mostrarError('errorNombre', 'El nombre es obligatorio', nombre);
                valido = false;
            } else {
                limpiarError('errorNombre', nombre);
            }

            if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailReg.value)) {
                mostrarError('errorEmailReg', 'Ingrese un email válido', emailReg);
                valido = false;
            } else {
                limpiarError('errorEmailReg', emailReg);
            }

            if(passwordReg.value.length<8) {
                mostrarError('errorPasswordReg', 'La contraseña debe tener al menos 8 caracteres', passwordReg);
                valido = false;
            } else {
                limpiarError('errorPasswordReg', passwordReg);
            }

            if(passwordReg.value !== passwordConfirm.value) { 
                mostrarError('errorPasswordConfirm', 'Las contraseñas no coinciden', passwordConfirm); 
                valido = false;
            } else {
                limpiarError('errorPasswordConfirm', passwordConfirm); 
            }
            
            return valido;
        }
        // ----------------------------------------------
        // FIN: LÓGICA DE VALIDACIÓN DE REGISTRO
        // ----------------------------------------------
    } 

    // --- Lógica de Login ---
    const formLogin = document.getElementById('formularioLogin');
    if (formLogin){
        const emailLogin = document.getElementById('emailLogin'); 
        const passwordLogin = document.getElementById('passwordLogin');
        const botonlogin = document.getElementById('botonlogin');

        botonlogin.addEventListener('click', (e) => {
            e.preventDefault();
            validarLogin();
        });

        // ----------------------------------------------
        // INICIO: LÓGICA DE VALIDACIÓN DE LOGIN
        // ----------------------------------------------
        function validarLogin() {
            let valido = true;

            limpiarError('errorEmailLogin', emailLogin);
            limpiarError('errorPasswordLogin', passwordLogin); 

            if(emailLogin.value.trim() === "") { 
                mostrarError('errorEmailLogin', 'El email es obligatorio', emailLogin);
                valido = false;
            } else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailLogin.value)) {
                mostrarError('errorEmailLogin', 'Ingrese un email válido', emailLogin);
                valido = false;
            } else {
                limpiarError('errorEmailLogin', emailLogin);
            }
            
            if (passwordLogin.value.trim() === "") {
                mostrarError('errorPasswordLogin', 'La contraseña es obligatoria', passwordLogin);
                valido = false;
            } else {
                limpiarError('errorPasswordLogin', passwordLogin);
            }

            if (valido) {
                const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioRegistrado'));

                if (
                    usuarioGuardado &&
                    usuarioGuardado.email === emailLogin.value &&
                    usuarioGuardado.password === passwordLogin.value
                ) {
                    // GUARDAR USUARIO ACTUAL EN SESIÓN (CORRECCIÓN CLAVE)
                    localStorage.setItem('usuarioActual', JSON.stringify(usuarioGuardado)); 
                    alert('✅ Login exitoso'); 
                    window.location.href = 'dashboard.html';
                } else {
                    alert('❌ Correo o contraseña no existen');
                    emailLogin.classList.add('invalido');
                    passwordLogin.classList.add('invalido');
                }
            }
        }
        // ----------------------------------------------
        // FIN: LÓGICA DE VALIDACIÓN DE LOGIN
        // ----------------------------------------------
    }
    
    // --- Lógica de Transacción ---
    const formTransaccion = document.getElementById('formTransaccion');
    if (formTransaccion) {
        // Evento de click en guardar transacción
        formTransaccion.addEventListener('submit', guardarTransaccion);
        
        // Listener para actualizar categorías cuando cambia el tipo
        const tipoSelect = document.getElementById('tipoTransaccion');
        if (tipoSelect) {
            tipoSelect.addEventListener('change', actualizarCategoriasSegunTipo);
        }
    }

    // --- Lógica de Categoría ---
    const formCategoria = document.getElementById('formCategoria');
    if (formCategoria) {
        // Evento de click en crear categoría
        formCategoria.addEventListener('submit', agregarCategoria);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    
    //Formulario del Registro
    const formRegistro = document.getElementById('formularioRegistro');
    if (formRegistro){
        const nombre= document.getElementById('nombre');
        const emailReg = document.getElementById('emailReg');
        const passwordReg = document.getElementById('passwordReg');
        const passwordConfirm = document.getElementById('passwordConfirm'); 
        
        // Variables para la barra de fuerza y botón
        const botonregistrar = document.getElementById('botonregistrar');
        const strengthBar = document.querySelector('.strength-bar'); 
        const strengthText = document.getElementById('strengthText'); 

        passwordReg.addEventListener('input', () => {
            const fuerza = calcularFuerza(passwordReg.value);
            actualizarStrengthBar(fuerza);
        });

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

        //funciones para calcular la fuerza de la contraseña
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

            const porcentaje = (fuerza/4)*100;
            strengthBar.style.width = porcentaje + '%';
            strengthBar.style.backgroundColor = colores[fuerza];
            strengthText.textContent = niveles[fuerza]; 
            strengthText.style.color = colores[fuerza]; 
        }
    } 

    //Formulario del Login
    const formLogin = document.getElementById('formularioLogin');
    if (formLogin){
        const emailLogin = document.getElementById('emailLogin'); 
        const passwordLogin = document.getElementById('passwordLogin');
        const botonlogin = document.getElementById('botonlogin');

        botonlogin.addEventListener('click', (e) => {
            e.preventDefault();
            validarLogin();
        });

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
                    alert('Login exitoso :D'); 
                    window.location.href = 'dashboard.html';
                } else {
                    alert('❌ Correo o contraseña no existen');
                    emailLogin.classList.add('invalido');
                    passwordLogin.classList.add('invalido');
                }
            }
        }
    }
    

    // Funciones auxiliares    
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
    
}); 
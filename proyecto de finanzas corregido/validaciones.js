document.addEventListener('DOMContentLoaded', () => {
    
    //Formulario del Registro
    const formRegistro = document.getElementById('formularioRegistro');
    if (formRegistro){
        const nombre= document.getElementById('nombre');
        const emailReg = document.getElementById('emailReg');
        const passwordReg = document.getElementById('passwordReg');
        const passwordConfReg = document.getElementById('passwordConfReg');
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

            if(passwordReg.value !== passwordConfReg.value) { 
                mostrarError('errorPasswordConfReg', 'Las contraseñas no coinciden', passwordConfReg);
                valido = false;
            } else {
                limpiarError('errorPasswordConfReg', passwordConfReg); 
            }
            
            return valido;
        }

        //Funciones para la barra de fuerza y botón
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
        const emailLog = document.getElementById('emailLog');
        const passwordLog = document.getElementById('passwordLog');
        const botonlogin = document.getElementById('botonlogin');

        botonlogin.addEventListener('click', (e) => {
            e.preventDefault();
            validarLogin();
        });

        function validarLogin() {
            let valido = true;

            limpiarError('errorEmailLog', emailLog);
            limpiarError('errorPasswordLog', passwordLog); 

            if(emailLog.value.trim() === "") { 
                mostrarError('errorEmailLog', 'El email es obligatorio', emailLog);
                valido = false;
            } else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailLog.value)) {
                mostrarError('errorEmailLog', 'Ingrese un email válido', emailLog);
                valido = false;
            } else {
                limpiarError('errorEmailLog', emailLog);
            }
            
            if (passwordLog.value.trim() === "") {
                mostrarError('errorPasswordLog', 'La contraseña es obligatoria', passwordLog);
                valido = false;
            } else {
                limpiarError('errorPasswordLog', passwordLog);
            }

            if (valido) {
                const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioRegistrado'));

                if (
                    usuarioGuardado &&
                    usuarioGuardado.email === emailLog.value &&
                    usuarioGuardado.password === passwordLog.value
                ) {
                    alert('Login exitoso :D');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('❌ Correo o contraseña no existen');
                    emailLog.classList.add('invalido');
                    passwordLog.classList.add('invalido');
                }
            }
        }
    } 
    
    //funciones auxiliares
    
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
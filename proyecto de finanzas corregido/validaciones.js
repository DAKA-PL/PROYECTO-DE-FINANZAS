document.addEventListener('DOMContentLoaded', () => {

    const formRegistro = document.getElementById('formularioRegistro');
    if (formRegistro) {
        const nombre = document.getElementById('nombre');
        const emailReg = document.getElementById('emailReg');
        const passwordReg = document.getElementById('passwordReg');
        const passwordConfirm = document.getElementById('passwordConfirm');
        const botonregistrar = document.getElementById('botonregistrar');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.getElementById('strengthText');

        // Detectar fuerza de contraseña en tiempo real
        passwordReg.addEventListener('input', () => {
            const fuerza = calcularFuerza(passwordReg.value);
            actualizarStrengthBar(fuerza);
        });

        botonregistrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (validarRegistro()) {
                const usuario = {
                    nombre: nombre.value,
                    email: emailReg.value,
                    password: passwordReg.value
                };

                localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
                alert('✅ Registro exitoso');
                window.location.href = 'login.html';
            }
        });

        function validarRegistro() {
            let valido = true;

            if (nombre.value.trim() === '') {
                mostrarError('errorNombre', 'El nombre es obligatorio', nombre);
                valido = false;
            } else {
                limpiarError('errorNombre', nombre);
            }

            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailReg.value)) {
                mostrarError('errorEmailReg', 'Ingrese un email válido', emailReg);
                valido = false;
            } else {
                limpiarError('errorEmailReg', emailReg);
            }

            if (passwordReg.value.length < 8) {
                mostrarError('errorPasswordReg', 'La contraseña debe tener al menos 8 caracteres', passwordReg);
                valido = false;
            } else {
                limpiarError('errorPasswordReg', passwordReg);
            }

            if (passwordConfirm.value !== passwordReg.value) {
                mostrarError('errorPasswordConfirm', 'Las contraseñas no coinciden', passwordConfirm);
                valido = false;
            } else {
                limpiarError('errorPasswordConfirm', passwordConfirm);
            }

            return valido;
        }

        // ======= Funciones para la barra de fuerza =======
        function calcularFuerza(password) {
            let fuerza = 0;
            if (password.length >= 8) fuerza++;
            if (/[A-Z]/.test(password)) fuerza++;
            if (/[0-9]/.test(password)) fuerza++;
            if (/[^A-Za-z0-9]/.test(password)) fuerza++;
            return fuerza; // 0 a 4
        }

        function actualizarStrengthBar(fuerza) {
            const niveles = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
            const colores = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2e7d32'];

            const porcentaje = (fuerza / 4) * 100;
            strengthBar.style.width = porcentaje + '%';
            strengthBar.style.backgroundColor = colores[fuerza];
            strengthText.textContent = niveles[fuerza];
            strengthText.style.color = colores[fuerza];
        }
    }

    // ======= FORMULARIO DE LOGIN =======
    const formLogin = document.getElementById('formularioLogin');
    if (formLogin) {
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

            if (emailLogin.value.trim() === '') {
                mostrarError('errorEmailLogin', 'El correo es obligatorio', emailLogin);
                valido = false;
            } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailLogin.value)) {
                mostrarError('errorEmailLogin', 'Formato de correo no válido', emailLogin);
                valido = false;
            } else {
                limpiarError('errorEmailLogin', emailLogin);
            }

            if (passwordLogin.value.trim() === '') {
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
                    alert('✅ Inicio de sesión exitoso');
                    window.location.href = 'inicio.html';
                } else {
                    alert('❌ Correo o contraseña no existen');
                    emailLogin.classList.add('invalido');
                    passwordLogin.classList.add('invalido');
                }
            }
        }
    }

    // ======= FUNCIONES AUXILIARES =======
        function mostrarError(idError, mensaje, input) {
            const error = document.getElementById(idError);
            if (error) error.textContent = mensaje;
            input.classList.add('invalido');
            input.classList.remove('valido');
     }

        function limpiarError(idError, input) {
            const error = document.getElementById(idError);
            if (error) error.textContent = '';
            input.classList.remove('invalido');
            input.classList.add('valido');
    }
});
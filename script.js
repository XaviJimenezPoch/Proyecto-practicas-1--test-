// Elementos del DOM
const acceptTermsCheckbox = document.getElementById('acceptTerms');
const beginTestBtn = document.getElementById('beginTestBtn');
const acceptanceSection = document.getElementById('acceptanceSection');
const testSection = document.getElementById('testSection');

// Escuchar cambios en el checkbox de aceptación
acceptTermsCheckbox.addEventListener('change', function() {
    // Habilitar o deshabilitar el botón según el estado del checkbox
    beginTestBtn.disabled = !this.checked;
});

// Escuchar click en el botón de comenzar
beginTestBtn.addEventListener('click', function() {
    // Ocultar la sección de aceptación
    acceptanceSection.style.display = 'none';
    
    // Mostrar la sección del test
    testSection.style.display = 'block';
    
    // Scroll hacia el inicio del test
    testSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Evitar que el formulario se envíe con Enter si no está completo
const form = document.getElementById('driveSyncTestForm');
if (form) {
    form.addEventListener('submit', function(e) {
        // Aquí puedes agregar validaciones adicionales si lo deseas
        console.log('Formulario enviado');
    });
}

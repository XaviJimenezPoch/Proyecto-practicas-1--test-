// Elementos del DOM
const acceptTermsCheckbox = document.getElementById('acceptTerms');
const beginTestBtn = document.getElementById('beginTestBtn');
const acceptanceSection = document.getElementById('acceptanceSection');
const form = document.getElementById('driveSyncTestForm');
const resultsSection = document.getElementById('resultsSection');
const restartBtn = document.getElementById('restartBtn');

// ==========================================
// 1. LÓGICA DE LA PANTALLA DE INICIO
// ==========================================

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
    form.style.display = 'block';
    
    // Scroll hacia el inicio del test
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


// ==========================================
// 2. LÓGICA DE PROCESAMIENTO Y RESULTADOS
// ==========================================

// Perfiles según la documentación Nexus 2026
const PROFILES = {
    "Intrinsic Builder": "Motivación por crecimiento interno e innovación.",
    "Continuous Learner": "Fuerte orientación al aprendizaje y desarrollo continuo.",
    "Autonomous Performer": "Necesidad de libertad operativa e independencia.",
    "Purpose Driven": "Búsqueda de significado e impacto profesional.",
    "Competitive Achiever": "Orientación a la superación, rendimiento y logro.",
    "Stability Seeker": "Preferencia por la seguridad y la previsibilidad.",
    "Recognition Oriented": "Alta valoración de la validación externa y visibilidad.",
    "Ambitious Strategist": "Enfoque en el progreso, liderazgo y crecimiento estratégico."
};

// Función para invertir valores de escala (1->5, 2->4, 3->3, 4->2, 5->1)
const invertScore = (score) => 6 - parseInt(score);

// Escuchar envío del formulario
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evitar recarga de la página
        
        const formData = new FormData(form);
        const answers = Object.fromEntries(formData.entries());

        procesarResultados(answers);
    });
}

function procesarResultados(answers) {
    // 1. CÁLCULO DE COHERENCIA (Fórmula de diferencias absolutas)
    const mirrorPairs = [
        { main: 'p24', mirror: 'p36' }, // Motivación Intrínseca
        { main: 'p37', mirror: 'p38' }, // Autonomía
        { main: 'p39', mirror: 'p40' }, // Aprendizaje
        { main: 'p41', mirror: 'p42' }, // Competitividad
        { main: 'p43', mirror: 'p44' }, // Propósito
        { main: 'p45', mirror: 'p46' }  // Reconocimiento
    ];

    let totalDifference = 0;
    let pairsCalculated = 0;

    mirrorPairs.forEach(pair => {
        const valMain = parseInt(answers[pair.main]);
        const valMirror = parseInt(answers[pair.mirror]);
        
        if (!isNaN(valMain) && !isNaN(valMirror)) {
            const invertedMirror = invertScore(valMirror);
            const diff = Math.abs(valMain - invertedMirror);
            totalDifference += diff;
            pairsCalculated++;
        }
    });

    // Score de consistencia base 100
    const maxPossibleDiff = pairsCalculated * 4;
    let consistencyScore = 100;
    if (maxPossibleDiff > 0) {
        consistencyScore = Math.round(100 - ((totalDifference / maxPossibleDiff) * 100));
    }

    // 2. INTERPRETACIÓN DE COHERENCIA
    let consistencyText = "";
    if (consistencyScore >= 90) consistencyText = "Muy consistente";
    else if (consistencyScore >= 75) consistencyText = "Consistencia adecuada";
    else if (consistencyScore >= 60) consistencyText = "Ambivalencia moderada";
    else if (consistencyScore >= 40) consistencyText = "Inconsistencia relevante";
    else consistencyText = "Posible fake/random";

    // 3. ÍNDICE DE MOTIVACIÓN Y PERFIL
    let profileScores = {
        "Intrinsic Builder": parseInt(answers.p24 || 3) + (answers.p1 === 'A' ? 2 : 0),
        "Continuous Learner": parseInt(answers.p39 || 3) + (answers.p4 === 'B' ? 2 : 0),
        "Autonomous Performer": parseInt(answers.p37 || 3) + (answers.p2 === 'A' ? 2 : 0),
        "Purpose Driven": parseInt(answers.p43 || 3) + (answers.p8 === 'D' ? 2 : 0),
        "Competitive Achiever": parseInt(answers.p41 || 3) + (answers.p5 === 'B' ? 2 : 0),
        "Stability Seeker": parseInt(answers.p32 || 3) + (answers.p3 === 'B' ? 2 : 0),
        "Recognition Oriented": parseInt(answers.p45 || 3) + (answers.p6 === 'C' ? 2 : 0),
        "Ambitious Strategist": parseInt(answers.p16 || 3) + (answers.p28 === 'A' ? 2 : 0)
    };

    // Encontrar el perfil dominante
    let topProfile = Object.keys(profileScores).reduce((a, b) => profileScores[a] > profileScores[b] ? a : b);
    
    // WMI (Work Motivation Index)
    let wmiBase = 50 + (profileScores[topProfile] * 5); 
    const finalWMI = Math.min(100, Math.max(0, wmiBase));

    // 4. ACTUALIZAR INTERFAZ
    document.getElementById('resConsistency').innerText = `${consistencyScore}/100`;
    document.getElementById('resConsistencyText').innerText = consistencyText;
    document.getElementById('resWMI').innerText = `${finalWMI}/100`;
    document.getElementById('resProfile').innerText = topProfile;
    document.getElementById('resProfileDesc').innerText = PROFILES[topProfile];

    // Animación de transición hacia los resultados
    form.style.display = 'none';
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Lógica de reinicio para hacer el test de nuevo
if(restartBtn) {
    restartBtn.addEventListener('click', () => {
        form.reset();
        acceptTermsCheckbox.checked = false;
        beginTestBtn.disabled = true;
        
        resultsSection.style.display = 'none';
        acceptanceSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
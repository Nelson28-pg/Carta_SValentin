const envelope = document.getElementById('envelope');
const heartSeal = document.querySelector('.heart-seal');
const recipient = document.querySelector('.envelope-recipient');
const typewriterLines = document.querySelectorAll('.typewriter-line');
const cardBody = document.querySelector('.card-body');

// Guardar el texto original de cada línea
const originalTexts = [];
typewriterLines.forEach(line => {
    originalTexts.push(line.textContent);
});

// Estado de la animación (0: cerrado, 1: tapa abierta, 2: carta sacada, 3: portada abierta + expandida, 4: cerrar todo)
let animationState = 0;
let isAnimating = false;
let isTypewriterRunning = false; // Bandera para prevenir múltiples ejecuciones del typewriter

// Función para el efecto de máquina de escribir (retorna una promesa)
function typewriterEffect(element, text, speed = 70) {
    element.textContent = '';
    element.style.opacity = '1';
    let i = 0;
    
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            // Verificar si debemos cancelar
            if (!isTypewriterRunning) {
                clearInterval(interval);
                resolve();
                return;
            }
            
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// Función para iniciar el efecto de escritura SECUENCIAL (una línea termina, comienza la siguiente)
async function startTypewriterEffect() {
    // Prevenir múltiples ejecuciones simultáneas
    if (isTypewriterRunning) {
        console.log('Typewriter ya está corriendo, ignorando nueva llamada');
        return;
    }
    
    isTypewriterRunning = true;
    
    try {
        for (let index = 0; index < typewriterLines.length; index++) {
            // Verificar si debemos cancelar
            if (!isTypewriterRunning) {
                break;
            }
            
            const line = typewriterLines[index];
            const originalText = originalTexts[index];
            
            // Ocultar y limpiar inicialmente
            line.style.opacity = '0';
            line.textContent = '';
            
            // Pequeña pausa antes de cada línea
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // Escribir la línea completa antes de continuar con la siguiente
            await typewriterEffect(line, originalText, 40);
        }
    } finally {
        isTypewriterRunning = false;
    }
}

// Función para cancelar el typewriter
function cancelTypewriter() {
    isTypewriterRunning = false;
}

// Función para ocultar todo el contenido (dejar en blanco)
function hideCardContent() {
    cancelTypewriter(); // Cancelar cualquier animación en curso
    typewriterLines.forEach(line => {
        line.style.opacity = '0';
        line.textContent = '';
    });
}

// Función para resetear el texto (para cuando se cierra)
function resetTypewriter() {
    cancelTypewriter(); // Cancelar cualquier animación en curso
    typewriterLines.forEach((line, index) => {
        line.textContent = originalTexts[index];
        line.style.opacity = '1';
    });
}

// Función para manejar el toque/click
function handleInteraction(e) {
    e.preventDefault();
    
    // Evitar múltiples toques mientras se anima
    if (isAnimating) return;
    
    isAnimating = true;
    animationState++;
    
    // Aplicar la clase correspondiente según el estado
    switch(animationState) {
        case 1:
            // Touch 1: Abrir la tapa del sobre
            envelope.classList.add('step-1');
            heartSeal.style.opacity = 0;
            recipient.style.opacity = 0;
            setTimeout(() => isAnimating = false, 600);
            break;
            
        case 2:
            // Touch 2: Sacar y posicionar la carta verticalmente
            envelope.classList.add('step-2');
            setTimeout(() => isAnimating = false, 1200);
            break;
            
        case 3:
            // Touch 3: Abrir la portada (primero se ve en blanco)
            hideCardContent(); // Ocultar contenido ANTES de abrir
            envelope.classList.add('step-3');
            
            setTimeout(() => {
                // Expandir la carta
                envelope.classList.add('step-4-expanded');
                
                // Esperar un poco más antes de iniciar el typewriter
                setTimeout(() => {
                    startTypewriterEffect();
                }, 600); // Delay antes de empezar a escribir
                
                isAnimating = false;
            }, 500);
            break;
            
        case 4:
            // Touch 4: Cerrar todo automáticamente (animación inversa fluida)
            closeAll();
            break;
    }
}

// Función para cerrar todo automáticamente
function closeAll() {
    // Resetear el texto
    resetTypewriter();
    
    // Contraer la carta expandida
    envelope.classList.remove('step-4-expanded');
    
    setTimeout(() => {
        // Cerrar la portada
        envelope.classList.remove('step-3');
    }, 400);
    
    setTimeout(() => {
        // Guardar la carta (rotación inversa a horizontal y meter en sobre)
        envelope.classList.remove('step-2');
    }, 900);
    
    setTimeout(() => {
        // Cerrar la tapa del sobre
        envelope.classList.remove('step-1');
        heartSeal.style.opacity = 1;
        recipient.style.opacity = 1;
    }, 2200);
    
    setTimeout(() => {
        // Reiniciar el estado
        animationState = 0;
        isAnimating = false;
    }, 2800);
}

// Agregar event listeners para touch y click
envelope.addEventListener('click', handleInteraction);
envelope.addEventListener('touchstart', handleInteraction);

// Transición suave para el sello y el destinatario
heartSeal.style.transition = 'opacity 0.4s ease';
recipient.style.transition = 'opacity 0.4s ease';
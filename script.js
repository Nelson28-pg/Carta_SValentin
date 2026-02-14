const envelope = document.getElementById('envelope');
const heartSeal = document.querySelector('.heart-seal');

// Estado de la animación (0: cerrado, 1: tapa abierta, 2: carta sacada, 3: portada abierta, 4: cerrar todo)
let animationState = 0;
let isAnimating = false;

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
            setTimeout(() => isAnimating = false, 600);
            break;
            
        case 2:
            // Touch 2: Sacar y posicionar la carta verticalmente
            envelope.classList.add('step-2');
            setTimeout(() => isAnimating = false, 1000);
            break;
            
        case 3:
            // Touch 3: Abrir la portada de la carta
            envelope.classList.add('step-3');
            setTimeout(() => isAnimating = false, 750);
            break;
            
        case 4:
            // Touch 4: Cerrar todo automáticamente (animación inversa)
            closeAll();
            break;
    }
}

// Función para cerrar todo automáticamente
function closeAll() {
    // Quitar la clase step-3 (cerrar portada)
    envelope.classList.remove('step-3');
    
    setTimeout(() => {
        // Quitar la clase step-2 (meter la carta)
        envelope.classList.remove('step-2');
    }, 500);
    
    setTimeout(() => {
        // Quitar la clase step-1 (cerrar tapa)
        envelope.classList.remove('step-1');
        heartSeal.style.opacity = 1;
    }, 1500);
    
    setTimeout(() => {
        // Reiniciar el estado
        animationState = 0;
        isAnimating = false;
    }, 2500);
}

// Agregar event listeners para touch y click
envelope.addEventListener('click', handleInteraction);
envelope.addEventListener('touchstart', handleInteraction);

// Transición suave para el sello
heartSeal.style.transition = 'opacity 0.3s ease';
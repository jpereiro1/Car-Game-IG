var movementCar = 0;

export function addListeners(){


    // Agrega un listener de clic al documento
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup',onKeyUp,false);

    function onKeyDown(key){
        switch(key.keyCode){
        case 39:
            movementCar = +0.03;
            break;
        case 37:
            movementCar = -0.03;
            break;
        }
    }

    function onKeyUp(key){
        movementCar = 0;
    }

 

    // Agrega un listener de eventos táctiles al documento
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);



    // Función para manejar el inicio de eventos táctiles en el documento
    function onDocumentTouchStart(event) {
        // Verifica si hay al menos un toque
        if (event.touches.length > 0) {
            // Obtiene la posición del primer toque en el eje X
            var touchX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;

            // Determina si el toque fue en la izquierda o la derecha de la pantalla
            if (touchX < 0) {
                // Toque en la izquierda, mueve el coche a la izquierda
                movementCar = -0.03;
            } else {
                // Toque en la derecha, mueve el coche a la derecha
                movementCar = +0.03;
            }
        }
    }

    function onDocumentTouchEnd(event){
        movementCar = 0;
    }

}

export function getMovementCar(){
    return movementCar;
}
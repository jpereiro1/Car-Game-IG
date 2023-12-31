# Car-Game-IG

Práctica final/opcional de la asignatura de Informática Gráfica del Grado de Ingeniería Informática de la ULPGC. Se trata de un juego muy básico implementado con three.js.

## Objetivo del juego
En el juego tendremos que conducir un vehículo por una carretera, durante el trayecto, el límite de velocidad irá cambiando, haciendo ir nuestro coche más rápido o lento. El principal objetivo del juego consiste en alcanzar la máxima puntuación posible sin chocarse con la furgoneta.

## Para jugar
Para jugar tendrá que acceder al siguiente [Link](https://jpereiro1.github.io/Car-Game-IG/ "enlace"). Los controles para desplazarte de lado a lado y cambiarte de carril son:
### Para el ordenador
Flechas <- y ->
### Para el móvil
Pantalla táctil ( parte de la izquierda de la pantalla y parte derecha de la pantalla )

![imágen](/public/readmeImage0.png)

# Creación del juego

## Creación del escenario
Para el suelo del escenario uso la PlaneGeometry de three.js, de esta manera contruyo el suelo (simulando un prado), la carretera de color más oscuro, y las líneas que conforman la carretera. En la siguiente podemos ver la composición de la escena desde otro ángulo (el cúal no es la cámara principal del juego).

![imágen](/public/readmeImage1.png)

## Mecánica de los objetos
Los objetos se mueven por el eje z, se crean al final de la carretera (en frente de nuestro vehículo) y se borran cuando pasan nuestro vehículo y se salen del plano (suelo). La velocidad de los objetos cambia dependiendo del tramo con el límite de velocidad en el que estemos, nuestro vehículo (el cual está estático en el eje z) irá visualizando como se le acercan los objetos, de esta manera, le añadimos una veracidad a la circulación y a la velocidad de la escena.

Hay tres tipos de agrupaciones de objetos que se van creando:
- La decoración: Estos objetos aparecen de forma aleatoria, van apareciendo cada vez que un objeto desaparece.
- Las señales de límite de velocidad: Las señales son también aleatorias y salen cada 500 fotogramas o puntos.
- Las furgonetas: Estas van saliendo al igual que la decoración, en cada fotograma calcula si hay colisión entre la furgoneta y el vehículo nuestro, si es el caso, el juego se detiene. Consigo conocer la colisión mediante los objetos Box3 (caja) de Three.js.

A los vehículos (el nuestro y la furgoneta), le añadimos un pequeño movimiento en el eje Y para simular la circulación del objeto. Esto se consigue con una función sinusoidal. 

El vehículo principal se podrá mover de izquierda a derecha sin salirse de la carretera, de esta manera conseguirá esquivar la furgoneta.

## Luces
Uso las siguientes luces:
- Una luz hemisferio: Con esta luz consigo simular el día o la noche.
- Una luz direccional: El objetivo es añadirle una sombra a los objetos y simular el sol.
- Luces spot para farolas: Estas luces irán en los postes de luz para iluminar las señales cuando se juegue de noche (SOLO NOCHE)
- Luces spot para el coche: Estas luces irán en frente del coche para simular los faros del mismo (SOLO NOCHE).

![imágen](/public/readmeImage3.png)

## Composición de la escena
La escena como la verá el jugador está compuesta por una cámara que se encuentra detrás y un pelín más alto que nuestro vehículo. Además, se le ha añadido una niebla del mismo color que el fondo para así no ver el final del plano y simular un horizonte. Por último, tenemos el sol o luna que estará en la diagonal con la luz direccional que simulará el sol.

![imágen](/public/background_menu.png)

## De noche
Para el juego de noche oscurecemos el fondo y la niebla, bajamos la intensidad de la luz hemisferio y apagamos la luz direccional. Cuando mostramos las señales de tráfico a estas se les añade unas farolas con luces de tipo spot para conseguir visualizarlas. El coche se le añaden dos luces spots que se irán desplazando de derecha a izquierda junto con el coche.

![imágen](/public/readmeImage2.png)


## Los modelos 3d
Para los modelos 3d existentes en la escena, he usado un asset pack de una ciudad urbana descargada desde el siguiete [Link](https://sketchfab.com/3d-models/free-low-poly-simple-urban-city-3d-asset-pack-310c806355814c3794f5e3022b38db85 "enlace"). Para exportar cada uno de los modelos por separado he usado el programa Maxon Cinema 4D. Los modelos usados son los siguientes:
- Coches (furgoneta, taxi, coche, coche de policía)
- Objetos de decoración (arboles, parada de bus, una casa...)
- Señales de límite de velocidad (40, 60, 80, 100km/h). Para estas señales he tenido que añadir un texto spline con una extrusión para escribir los números.

![imágen](/public/readmeImage4.png)

# Estimación de tiempo y complicaciones
Teniendo algunos conocimientos en three.js calculo que este proyecto me ha llevado unas 15 horas aproximadamente. Algunas complicaciones que he tenido han sido con los modelos 3d y el programa Maxon Cinema 4D con el que no estaba muy familiarizado.  

# Posibles mejoras
Posibles implementaciones para mejorar el juego:
- Añadir mas complicaciones al mismo, ej: Añadir más vehículos u otros obstaculos.
- Añadir luces al vehiculo por dentro. (Para la noche).
- Añadir más carriles.
- Añadir otra cámara de primera persona (muy fácil de implementar)
- Añadir una lógica del juego más compleja. Ej: que haya un orden de cambio de velocidad y que no sea aleatorio, para ir ajustando la dificultad del juego de una manera incremental.

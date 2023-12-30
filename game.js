import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { addListeners, getMovementCar  } from '/js/eventListeners.js';




let scene, camera, renderer,stats;

let floor,road, car, streetlight, sunMoon, carEnemy;
let score = 0;
let cars = new Map();

let targetLightFront, targetLightBack;

let isNight,endedGame = false;
let hemiLight, direcLight;
let roadLines = [];
let signals = [];
let decorationWithMovement = [];
let actualDecoration,actualSignal;
let modelsLoaded = false;

let speed = 0.2;


document.getElementById('startGame').addEventListener('click',startAnimation);
document.getElementById('restartGame').addEventListener('click',reload/*window.location.reload()*/);
document.getElementById('buttonInstructions').addEventListener('click',showInstructions);
document.getElementById('buttonLeaveInstructions').addEventListener('click',showMenu);


function startAnimation(){

    if(!modelsLoaded) {
        alert("Los modelos aún no se han cargado");
        return;
    }

    document.getElementById('menu').style.display = 'none';
    document.getElementById('score').style.display = 'unset';

    let cocheSeleccionado = document.querySelector('input[name="car"]:checked').value;
    let tiempoSeleccionado = document.querySelector('input[name="time"]:checked').value;

    car = cars.get(cocheSeleccionado);
    scene.add(car);

    if(tiempoSeleccionado=="night") makeNight();
    


    stats = new Stats();
    document.body.appendChild(stats.dom);

    document.body.appendChild(renderer.domElement);

    //setInterval(throwRandomSignal,10000);

    requestAnimationFrame(animate);

}

function reload(){
    window.location.reload();
}

function endGame(){
    endedGame = true;
    document.getElementById("endGame").style.display = "flex";
    document.getElementById("scoreEndGame").innerHTML = score;
    console.log("El juego ha finalizado");
}

function showInstructions(){
    document.getElementById('menu').style.display = 'none';
    document.getElementById("instructionsSection").style.display = "flex";
}

function showMenu(){
    document.getElementById('menu').style.display = 'flex';
    document.getElementById("instructionsSection").style.display = "none";
}

function makeNight(){
    isNight = true;
    scene.background = new THREE.Color(0x001f3f);
    sunMoon.material = new THREE.MeshBasicMaterial({color:0x999999});
    hemiLight.intensity = 0.005;
    direcLight.intensity = 0;
    scene.fog = new THREE.Fog( scene.background, 20, 50 );

    document.getElementById("score").style.color = 'white';

    //Encendemos las luces del coche
    car.children[1].intensity = 0.5;
    car.children[2].intensity = 0.5;
}

init();


async function init(){
    scene = new THREE.Scene();
    //scene.shadowMap.enabled = true;
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0,1,6);
    camera.lookAt(new THREE.Vector3(0,0.8,0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    

    /*const ambientLight = new THREE.AmbientLight(0xffffff,2);
    scene.add(ambientLight);*/
    

    hemiLight = new THREE.HemisphereLight( 0x87CEEB , 0xFFFFFF , 3 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    scene.add( hemiLightHelper );




    direcLight  = new THREE.DirectionalLight(0xFFFFFF, 1);
    direcLight.position.set(10, 12, -45);
    scene.add(direcLight);

    direcLight.castShadow = true;

    const dirLightHelper = new THREE.DirectionalLightHelper( direcLight , 1 );
    //scene.add( dirLightHelper );

    /*const light2  = new THREE.DirectionalLight(0xffffff,2,0,2);
    light2.position.set(0, 1, 2);
    scene.add(light2);
    const dirLightHelper2 = new THREE.DirectionalLightHelper( light2 , 1 );
    scene.add( dirLightHelper2 );*/




    /*const controls = new OrbitControls( camera, renderer.domElement );
    controls.screenSpacePanning = true;
    controls.update();*/

    targetLightFront = new THREE.Object3D();
    targetLightBack = new THREE.Object3D();

    targetLightFront.position.set(0,1,-50);
    targetLightBack.position.set(0,1,50);
    
    addListeners();

    initDecoration();

    //Cargamos los modelos3D
    const loader = new FBXLoader();
    try {
        await Promise.all([
            loadCar(loader, '/public/car_red.fbx','normal_car'),
            loadCar(loader, '/public/Taxi.fbx','taxi'),
            loadCar(loader, '/public/Police.fbx','police'),
            loadCar(loader, '/public/pickup.fbx','pickup'),
            loadModel(loader, '/public/tree.fbx', 0.2,[0,+Math.PI/2,0], new THREE.Vector3(2.5, 0, 0),false),
            loadModel(loader, '/public/tree2.fbx', 0.2,[0,+Math.PI/2,0], new THREE.Vector3(3.5, 0, 0),true),
            loadModel(loader, '/public/Bus_Stop.fbx', 0.2,[0,0,0], new THREE.Vector3(2, 0, 0),false),
            loadModel(loader, '/public/fence.fbx', 0.2,[0,+Math.PI/2,0], new THREE.Vector3(-1.2, 0, 0),true),
            loadModel(loader, '/public/big_road_sing.fbx', 0.25,[0,+Math.PI/2,0], new THREE.Vector3(0, 0, 0),false),
            loadModel(loader, '/public/building.fbx', 0.2,[0,+Math.PI/2,0], new THREE.Vector3(6, 0, 0),false),
            loadSignals(loader, '/public/40_speed_sign.fbx'),
            loadSignals(loader, '/public/60_speed_sign.fbx'),
            loadSignals(loader, '/public/80_speed_sign.fbx'),
            loadSignals(loader, '/public/100_speed_sign.fbx'),
            loadStreetLight(loader, '/public/streetlight.fbx',[0,+Math.PI/2,0] , new THREE.Vector3(1.5, 0, -0.5),true,new THREE.SpotLight(0xffffff,100))
        ]);
        modelsLoaded = true;
        console.log("Models loaded successfully");
    } catch (error) {
        console.error("Error loading models:", error);
    }
    
    console.log(decorationWithMovement);

    

    
}

function loadCar(loader,path,id){
    return new Promise((resolve, reject) => {
        loader.load(path, (model) => {

            let mesh = new THREE.Mesh();
            let object = model.children[0];
            object.scale.set(0.2, 0.2, 0.2);
            object.position.copy(new THREE.Vector3(0, 0, 0.5));
            object.rotation.set(0,-Math.PI/2,0);

            let light = new THREE.SpotLight(0xffffff);
            light.position.set(0.2,0.2,-0.2);
            light.castShadow = true;
            //light.decay = 1;
            light.target = targetLightFront;
            light.intensity = 0;

            
            let lightDuplicate = light.clone();
            lightDuplicate.position.x = -0.2;
            const spotLightHelper = new THREE.SpotLightHelper( lightDuplicate );
            //scene.add( spotLightHelper );
            const spotLightHelper2 = new THREE.SpotLightHelper( light );
            //scene.add( spotLightHelper2 );

            
            mesh.add(object,light,lightDuplicate);

            cars.set(id,mesh);

            
            resolve();
        }, undefined, reject);
    });
}

function loadSignals(loader, path, id) {
    return new Promise((resolve, reject) => {
        loader.load(path, (model) => {

            let mesh = new THREE.Mesh();
            let object = model.children[0];
            mesh.name = path;

            object.scale.set(0.4, 0.4, 0.4);
            object.castShadow = true;
            object.receiveShadow = false;
            object.position.set(1.5, 0, -0.5);
            //object.rotation.set(rotation[0],rotation[1],rotation[2]);

            let duplicateObject = object.clone();
            duplicateObject.position.x *= -1;
            mesh.add(duplicateObject);
            
            
            mesh.add(object);
            //scene.add(mesh);
            
            signals.push(mesh);
            resolve();
        }, undefined, reject);
    });
}

function loadStreetLight(loader, path){
    return new Promise((resolve, reject) => {
        loader.load(path, (model) => {

            let mesh = new THREE.Mesh();
            let object = model.children[0];
            
            object.scale.set(0.3, 0.3, 0.3);
            object.castShadow = true;
            object.receiveShadow = false;
            object.position.copy(new THREE.Vector3(-1.8, 0, 0.5));
            object.rotation.set(0,+Math.PI,0);

            let light = new THREE.SpotLight(0xffffff);
            light.position.set(-1,7.4,0);
            light.castShadow = true;
            light.decay = 1;
            light.penumbra = 0.1;
            light.intensity = 0.3;

            /*const spotLightHelper = new THREE.SpotLightHelper( light );
            scene.add( spotLightHelper );*/
            
            object.add(light);
    
            let duplicateObject = object.clone();
            duplicateObject.position.x = 1.8;
            duplicateObject.rotation.set(0,0,0);
            
            mesh.add(object);
            mesh.add(duplicateObject);
            
            streetlight = mesh;
            //scene.add(mesh);
            
            resolve();
        }, undefined, reject);
    });
}





function loadModel(loader, path, scale,rotation, position,duplicate) {
    return new Promise((resolve, reject) => {
        loader.load(path, (model) => {

            let mesh = new THREE.Mesh();
            let object = model.children[0];
            mesh.name = path;

            object.scale.set(scale, scale, scale);
            object.castShadow = true;
            object.receiveShadow = false;
            object.position.copy(position);
            object.rotation.set(rotation[0],rotation[1],rotation[2]);

            if(duplicate){
                let duplicateObject = object.clone();
                duplicateObject.position.x *= -1;
                mesh.add(duplicateObject);
            } 
            
            mesh.add(object);
            //scene.add(mesh);
            
            decorationWithMovement.push(mesh);
            resolve();
        }, undefined, reject);
    });
}


function initDecoration(){
    
    //Background
    scene.background = new THREE.Color(0x87CEEB);
	scene.fog = new THREE.Fog( scene.background, 20, 50 );

    let geometry, material;

    //Floor
    geometry = new THREE.PlaneGeometry(70,50);
    material = new THREE.MeshLambertMaterial( { color:0x7cfc00, side:THREE.DoubleSide});
    floor = new THREE.Mesh(geometry,material);
    floor.rotation.x = Math.PI / 2;
    floor.position.z -= 20;
    floor.receiveShadow = true;
    //floor.castShadow = true;
    scene.add(floor);



    drawRoad();

    function drawRoad(){
        //Road
        geometry = new THREE.PlaneGeometry(2,50);
        material = new THREE.MeshLambertMaterial( { color:0x333333, side:THREE.DoubleSide});
        road = new THREE.Mesh(geometry,material);
        road.rotation.x = Math.PI / 2;
        road.position.y += 0.0001;
        road.position.z -= 20;
        road.receiveShadow = true;
        scene.add(road);

        //Central line
        let height = 2;
        for(var i=0; i<15 ; i++){
            let line = drawLine(0.1,height,-i*(height+2),0);
            roadLines.push(line);
        }

        drawLine(0.1,50,-20,1);
        drawLine(0.1,50,-20,-1);

        function drawLine(width,height,positionZ,positionX){
            geometry = new THREE.PlaneGeometry(width,height);
            material = new THREE.MeshLambertMaterial( { color:0xffffff, side:THREE.DoubleSide});
            let line = new THREE.Mesh(geometry,material);
            line.rotation.x = Math.PI / 2;
            line.position.set(positionX,0.01,positionZ);
            scene.add(line);
            return line;
        }
    }

    //Sun or moon
    geometry = new THREE.CircleGeometry(0.5,10);
    material = new THREE.MeshStandardMaterial({color:0xffff00, metalness: 0.5, roughness: 0.5});
    sunMoon = new THREE.Mesh(geometry,material);
    sunMoon.position.set(10/2, 12/2, -45/2);
    scene.add(sunMoon);

}




let limitViewZ = 6;
let minLimitCarX = -0.5;
let maxLimitCarX = 0.5;



function throwRandomSignal(){
    actualSignal = signals[getRandomInt(0,signals.length+1)];
    try{
        actualSignal.position.z = -45;
        if(isNight){
            //console.log(streetlight);
            streetlight.children[0].children[0].target = actualSignal.children[0];
            streetlight.children[1].children[0].target = actualSignal.children[1];
            actualSignal.add(streetlight);
        }
        scene.add(actualSignal);
    }catch(err){
        //console.log(err);
    }
    
}



function animate(){
    
    if(!endedGame) requestAnimationFrame(animate);

    score += 1;
    document.getElementById("score").innerHTML = score;

    if(score%500==0 && actualSignal==null) throwRandomSignal();

    stats.update();

    //ANIMACION LINEAS DE LA CARRETERA
    roadLines.forEach(line => {
        line.position.z += speed;
        if(line.position.z>limitViewZ){
            line.position.z = -50; 
        }
    });

    

    //COCHE ENEMIGO
    if(carEnemy==null){
        carEnemy = cars.get("pickup");
        try{
            carEnemy.position.z = -50;
            getRandomInt(0,2)>0 ? carEnemy.position.x = 0.5 : carEnemy.position.x = -0.5;
            scene.add(carEnemy);
        }catch(err){
            
        }
    }else{
        carEnemy.position.z += speed/1.5;
        carMovementY(carEnemy);
        if(detectCollision(car,carEnemy)) endGame();

        if(carEnemy.position.z > limitViewZ){
            scene.remove(carEnemy);
            carEnemy = null;
        }

    }


    carMovementY(car);
    let movementCar = getMovementCar();
    if(movementCar <0){
        car.position.x = Math.max(minLimitCarX, car.position.x + movementCar * speed); 
    }else{
        car.position.x = Math.min(maxLimitCarX, car.position.x + movementCar * speed); 
    }
    

    //Para la señal
    if(actualSignal!=null){
        actualSignal.position.z += speed;
        if(actualSignal.position.z > car.position.z){
            
            if(actualSignal.name.includes("40_speed_sign")) speed = 0.2;
            if(actualSignal.name.includes("60_speed_sign")) speed = 0.4;
            if(actualSignal.name.includes("80_speed_sign")) speed = 0.6;
            if(actualSignal.name.includes("100_speed_sign")) speed = 0.8;

            //Añadir animacion de que cambió la velocidad
        }

        if(actualSignal.position.z > limitViewZ){
            scene.remove(actualSignal);
            actualSignal = null;
        }
    }



    //Objetos de decoración
    if(actualDecoration==null){
        actualDecoration = decorationWithMovement[getRandomInt(0,decorationWithMovement.length+1)];
        try{
            actualDecoration.position.z = -45;
            scene.add(actualDecoration);
        }catch(err){
            //console.log(err);
        }
        
    }else{
        actualDecoration.position.z += speed;
        if(actualDecoration.position.z > limitViewZ){
            scene.remove(actualDecoration);
            actualDecoration = null;
        }
    }

    renderer.render(scene, camera);
}


var time = 0;

function carMovementY(object) {
    // Ajusta la amplitud y la frecuencia según tus necesidades
    var amplitude = 0.005; // Amplitud de la oscilación
    var frequency = 10; // Frecuencia de la oscilación

    // Calcula la nueva posición vertical del coche usando una función sinusoidal
    var deltaY = amplitude * Math.sin(frequency * time);

    // Aplica la nueva posición al coche
    object.position.y = deltaY;

    // Incrementa el tiempo para animar la oscilación
    time += 0.01;
}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// Función para detectar colisión entre dos objetos 3D
function detectCollision(object1, object2) {
    const box1 = new THREE.Box3().setFromObject(object1);
    const box2 = new THREE.Box3().setFromObject(object2);

    return box1.intersectsBox(box2);
}


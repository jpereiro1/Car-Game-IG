import TWEEN from 'three/examples/jsm/libs/tween.module.js';


var limitViewZ = 6;
var startPositionZ = -45;

var tweenDecoration;
var tweenCarEnemy;
var tweenSignals;


export function startTween(scene,car,carEnemy,decorationWithMovement,signals,speed){
    console.log(signals);
    tweenDecoration = new TweenDecoration(scene,decorationWithMovement,speed);
    tweenCarEnemy = new TweenCarEnemy(scene,carEnemy,speed,car);
    tweenSignals = new TweenSignals(scene,signals,speed,car);
}

export function isEndGame(){
    return tweenCarEnemy.getIsEndGame();
}

export function getCars(){
    return tweenCarEnemy.getCars();
}

export function updateTween(){
    TWEEN.update();
}


class TweenDecoration {

    constructor(scene,decorations,speed){
        this.scene = scene;
        this.actualDecoration;
        this.decorations = decorations;
        this.speed = speed;
        this.tween;
        this.newIteration();
    }

    init(){
        this.tween = new TWEEN.Tween(this.actualDecoration.position)
        .to({z: limitViewZ}, (1/this.speed)*1000)
        .onStart(() => {
            this.scene.add(this.actualDecoration);
        })
        .onComplete(() => {
            this.scene.remove(this.actualDecoration);
            this.newIteration();
        }).start();
    }

    changeSpeed(speed){
        this.speed = speed;
        this.tween.stop();
        TWEEN.remove(this.tween);
        this.tween = new TWEEN.Tween(this.actualDecoration.position)
        .to({z: limitViewZ}, ((1/this.speed)*1000)*positionPercentege(this.actualDecoration.position.z))
        .onComplete(() => {
            this.scene.remove(this.actualDecoration);
            this.newIteration();
        }).start();
    }

    newIteration(){
        this.actualDecoration = this.decorations[getRandomInt(0, this.decorations.length)];
        this.actualDecoration.position.z = startPositionZ;
        this.init();
    }
}

class TweenCarEnemy {

    constructor(scene,carEnemy,speed,car){
        this.scene = scene;
        this.carEnemy = carEnemy;
        this.car = car;
        this.speed = speed;
        this.tween;
        this.isEndGame = false;
        this.newIteration();
    }

    init(){
        this.tween = new TWEEN.Tween(this.carEnemy.position)
        .to({z: limitViewZ}, (1/this.speed)*2000)
        .onStart(() => {
            this.scene.add(this.carEnemy);
        })
        .onUpdate(() => {
            carMovementY(this.carEnemy);
        })
        .onComplete(() => {
            this.scene.remove(this.carEnemy);
            this.newIteration();
        }).start();
    }

    changeSpeed(speed){
        this.speed = speed;
        this.tween.stop();
        TWEEN.remove(this.tween);
        this.tween = new TWEEN.Tween(this.carEnemy.position)
        .to({z: limitViewZ}, ((1/this.speed)*2000)*positionPercentege(this.carEnemy.position.z))
        .onStart(() => {
            //this.scene.add(this.actualDecoration);
        })
        .onComplete(() => {
            this.scene.remove(this.carEnemy);
            this.newIteration();
        }).start();
    }

    newIteration(){
        this.carEnemy.position.z = startPositionZ;
        getRandomInt(0,2)>0 ? this.carEnemy.position.x = 0.5 : this.carEnemy.position.x = -0.5;
        this.init();
    }

    getIsEndGame(){
        return this.isEndGame;
    }

    getCars(){
        return [this.car, this.carEnemy];
    }
}

class TweenSignals {

    constructor(scene,signals,speed,car){
        this.scene = scene;
        this.signal;
        this.signals = signals;
        this.car = car;
        this.speed = speed;
        this.tween;
        this.newIteration();
    }

    init(){
        this.tween = new TWEEN.Tween(this.signal.position)
        .to({z: limitViewZ}, (1/this.speed)*1000)
        .onStart(() => {
            this.scene.add(this.signal);
        })
        .onUpdate(() => {
            if(this.signal.position.z > this.car.position.z){
            
                if(this.signal.name.includes("40_speed_sign")) this.speed = 0.4;
                if(this.signal.name.includes("60_speed_sign")) this.speed = 0.8;
                if(this.signal.name.includes("80_speed_sign")) this.speed = 1.2;
                if(this.signal.name.includes("100_speed_sign")) this.speed = 1.6;
    
                //Añadir animacion de que cambió la velocidad
            }
        })
        .delay(5000)
        .onComplete(() => {
            tweenDecoration.changeSpeed(this.speed);
            tweenCarEnemy.changeSpeed(this.speed);
            this.scene.remove(this.signal);
            this.newIteration();
        }).start();
    }


    newIteration(){
        this.signal = this.signals[getRandomInt(0, this.signals.length)];
        this.signal.position.z = startPositionZ;
        this.init();
    }

}




function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function positionPercentege(z){
    return (Math.abs(z-limitViewZ))/Math.abs(startPositionZ-limitViewZ);
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


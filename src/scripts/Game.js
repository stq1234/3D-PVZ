/*
 * File: Game.js
 * Project : 3D Plant VS Zombie
 * Author: 邵天奇
 * Email: 2200013082@stu.pku.edu.cn
 * Date: 2024.5-2024.6
 * Copyright: Copyright (c) 2024 邵天奇
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
    createApp,
    nextTick,
    reactive,
} from 'vue';

import {
    plantNames,
    plantGenerateSpeed,
    objectsPerRound,
    smallInterval,
    plantGenerateType,
    plantHP,
    zombieHP,
    zombieSpeed,
    zombieAttackSpeed,
    zombieAttack,
    plantIsAttack,
    priceOfPlant,
    plantAttack,
} from './BasicDataSettings.js';

import CardSlots from '../components/CardSlots.vue';
import ShovelButton from '../components/ShovelButton.vue';
import SunSlot from '../components/CollectableSlots.vue';
import MyLoaders2 from '../components/MyLoaders2.vue';

import {
    hideDialog,
    showDialog
} from './DialogOperator.js';

import axios from 'axios';

import {
    Sound,
    SoundPool
} from './SoundOperator.js';


// 菜单变量区域

let startBlock = null;
let setttingBlock = null;
let exitBlock = null;

let startSceneModel = null; // 是gltf格式，需要使用.scene属性，用于恢复动画使用

// 游戏变量区域

let gameComponents = [];

let cannonWorld;

let scene;
let camera;

let menuGroup; // 游戏开始界面物体组
let gameGroup; // 游戏界面物体组

let zombiesGroup;
let collectableGroup;
let buildingsGroup; // 包含草地、围栏、房子、街道
let grassesGroup;


let renderer;
let clock;

let loader;

let rayCaster;

let plane; // 用于鼠标检测的平面

const menuState = 0;
const normalState = 1 << 0;
const plantingState = 1 << 1;
const removingState = 1 << 2;
const noRayCasterState = 1 << 3;

let currentState = noRayCasterState; // 当前游戏状态

let hintBlock = null; // 植物位置提示框
let plantPreviewer = null; // 预览植物模型(种植前)
let shovel = null; // 铲子模型

let map = []; // null表示没有植物，否则表示植物的位置

let zombies = []; // 每个元素是一个长度为2的数组，第一个元素是僵尸的three.js模型，第二个元素是僵尸的cannon.js模型

let bullets = []; // 每个元素是一个长度为2的数组，第一个元素是子弹的three.js模型，第二个元素是子弹的cannon.js模型

const COLLISION_GROUP_ATTACK = 1 << 0;
const COLLISION_GROUP_ZOMBIE = 1 << 1;
const COLLISION_GROUP_WEEDER = 1 << 2;

let zombieID = 0; // 用于给僵尸编号
let bulletID = 0; // 用于给子弹编号

let zombiesToBeRemoved = []; // 用于存放待删除的僵尸
let bulletsToBeRemoved = []; // 用于存放待删除的子弹 由于在一次step中不能删除物体

// 用于判断是否点击了铲子，因为点击铲子按钮时也会触发点击事件，而点击非草地区域时会取消铲子状态，所以需要这个变量来过滤掉点击铲子按钮时的点击事件
let shovelIsClickedRightNow = false;

let mixers = []; // 用于存放模型动画混合器

let sunNumber = reactive({
    myValue: 50 // 初始阳光数量
});

let totalZombieNumber;
let generatedZombieNumber;
let killedZombieNumber;

let haveWeeder;
let weederTRHEEjsModel;
let weederCannonjsModel;

let gameAccountState = reactive({
    account: '',
    user_name: '',
    money: 0,
    signedIn: false,
});

let PORT = reactive({
    myValue: 3000,
    isInitialized: false,
    isInitializing: false,
    isFailed: false,
});

let loaderApps = {
    app1: null,
    app2: null,
}

let sunGeneratorTimer; // 用于生成阳光，结束游戏时需要清除
let zombieTimers = []; // 用于生成僵尸，结束游戏时需要清除
let objectsGeneratorTimers = []; // 用于生成子弹的计时器，结束游戏时需要清除

let coldTimeOfSelectedPlants = [];
let isColding = [];

// let frameTimer;

// 背景音乐
function bgm() {
    let sound = new Sound(
        "./sound/背景音乐.wav",
        true // 音频将会循环播放
    );
    sound.play();
}

// 豌豆打普僵音效
let bulletHitZombieSound;

// 阳光不足提示音效
function sunNotEnoughSound() {
    let sound = new Sound(
        './sound/阳光不足植物无法购买.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 700);
}

// 预览植物音效
function previewPlantSound() {
    let sound = new Sound(
        './sound/预览植物.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 1500);
}

// 种下植物音效
function plantPlantSound() {
    let sound = new Sound(
        './sound/种植物.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 2000);
}

// 土豆地雷生长音效
function potatoMineGrowSound() {
    let sound = new Sound(
        './sound/土豆地雷生长.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 2300);
}

// 拿铁锹特效
function pickUpShovelSound() {
    let sound = new Sound(
        './sound/拿铲子.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 700);
}

// 铲除植物音效
function removePlantSound() {
    let sound = new Sound(
        './sound/种植物.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 2000);
}

// 除草机音效
function weederSound() {
    let sound = new Sound(
        './sound/除草机.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 3000);
}

// 毁灭菇音效
function doomShroomSound() {
    let sound = new Sound(
        './sound/毁灭菇.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 4000);
}

// 捡硬币音效
// let pickUpMoneySound = new Sound(
//     './sound/捡硬币.ogg',
//     false
// );

// 僵尸吃植物音效
let zombieEatPlantSound;

// 僵尸吃掉植物音效
function zombieEatUpPlantSound() {
    let sound = new Sound(
        './sound/僵尸吞掉植物音效.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 1200);
}

// // 开始游戏音效（僵尸手动画）
// let startGameSound = new Sound(
//     './sound/开始音效.ogg',
//     false
// );

// 僵尸来了音效
let zombieComeSound;

// 僵尸死亡音效
function zombieDieSound() {
    let sound = new Sound(
        './sound/僵尸死亡.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 1200);
}

// 胜利音效
let winSound;

// 失败音效
let loseSound;

// 收集阳光音效
function collectSunSound() {
    let sunSound = new Sound(
        './sound/收集阳光.ogg',
        false
    );
    sunSound.play();
    setTimeout(() => {
        sunSound.destroy();
    }, 2000);
}

// 土豆地雷爆炸音效
function potatoMineExplodeSound() {
    let sound = new Sound(
        './sound/土豆地雷爆炸.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 3000);
}

// 樱桃炸弹爆炸音效
function cherryBombExplodeSound() {
    let sound = new Sound(
        './sound/樱桃炸弹爆炸.ogg',
        false
    );
    sound.play();
    setTimeout(() => {
        sound.destroy();
    }, 3000);
}

function startColdAnimation(index) {
    let elements = document.querySelectorAll('.cold-cover');
    isColding[index] = true;
    elements[index].style.animation = `coldAnimation ${coldTimeOfSelectedPlants[index] / 1000}s linear`;
    setTimeout(() => {
        isColding[index] = false;
        elements[index].style.animation = '';
    }, coldTimeOfSelectedPlants[index]);
}

// 初始化整个程序
function initGame() {

    bgm();

    currentState = menuState;

    let user_name_container = document.querySelector('#username-container1');
    user_name_container.style.display = 'block';

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 3000);

    let $canvas = document.querySelectorAll('canvas#game-canvas')[0];

    loader = new GLTFLoader();

    rayCaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({
        canvas: $canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff, 1);

    // 改位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    let light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(400, 200, 150);
    scene.add(light); // 需要根据关卡模式决定光照使用

    menuGroup = new THREE.Group();
    scene.add(menuGroup);

    loader.load('./models/startScene.glb', gltf => {
        menuGroup.add(gltf.scene);
        startSceneModel = gltf;
        let mixer1 = new THREE.AnimationMixer(startSceneModel.scene);
        mixers.push([mixer1, 0.12]);
        let action1 = mixer1.clipAction(startSceneModel.animations[0]);
        action1.play();
        let mixer2 = new THREE.AnimationMixer(startSceneModel.scene);
        mixers.push([mixer2, 0.6]);
        let action2 = mixer2.clipAction(startSceneModel.animations[1]);
        action2.play();
    });

    // let blocksTemp = [];
    for (let i = 0; i < 3; i++) {
        loader.load('./models/menuBlock.glb', gltf => {
            menuGroup.add(gltf.scene);
            gltf.scene.position.set(3.3, 1.7 - i * 0.7, -4.3);
            // blocksTemp.push(gltf.scene);
            switch (i) {
                case 0:
                    startBlock = [];
                    startBlock.push(gltf.scene);
                    loader.load('./models/menu' + (i + 1).toString() + '-negative.glb', gltf => {
                        startBlock.push(gltf.scene);
                        menuGroup.add(gltf.scene);
                        gltf.scene.position.set(3.5, 1.7 - i * 0.7, -4.1);
                        loader.load('./models/menu' + (i + 1).toString() + '-positive.glb', gltf => {
                            startBlock.push(gltf.scene);
                            gltf.scene.position.set(3.5, 1.7 - i * 0.7, -4.1);
                        });
                    });
                    break;
                case 1:
                    setttingBlock = [];
                    setttingBlock.push(gltf.scene);
                    loader.load('./models/menu' + (i + 1).toString() + '-negative.glb', gltf => {
                        setttingBlock.push(gltf.scene);
                        menuGroup.add(gltf.scene);
                        gltf.scene.position.set(3.5, 1.7 - i * 0.7, -4.1);
                        loader.load('./models/menu' + (i + 1).toString() + '-positive.glb', gltf => {
                            setttingBlock.push(gltf.scene);
                            gltf.scene.position.set(3.5, 1.7 - i * 0.7, -4.1);
                        });
                    });
                    break;
                case 2:
                    exitBlock = [];
                    exitBlock.push(gltf.scene);
                    loader.load('./models/menu' + (i + 1).toString() + '-negative.glb', gltf => {
                        exitBlock.push(gltf.scene);
                        menuGroup.add(gltf.scene);
                        gltf.scene.position.set(3.5, 1.7 - i * 0.7, -4.1);
                        loader.load('./models/menu' + (i + 1).toString() + '-positive.glb', gltf => {
                            exitBlock.push(gltf.scene);
                            gltf.scene.position.set(3.5, 1.7 - i * 0.7, -4.1);
                        });
                    });
                    break;
            }
        });
    }

    addGlobelListeners();

    camera.position.set(9.438085, 1.679520, 0.589513);
    camera.lookAt(0, 1, -3.3);

    startFrame();
}

// 初始化某一局游戏（一个关卡）
function startGame() {

    document.querySelector('canvas#game-canvas').style.display = 'block';

    mixers = [];

    zombieTimers = [];
    objectsGeneratorTimers = [];

    loseSound = new Sound(
        './sound/失败音效.mp3',
        false
    );

    winSound = new Sound(
        './sound/胜利音效.wav',
        false
    );

    // 豌豆打普僵音效
    bulletHitZombieSound = new SoundPool(
        './sound/豌豆打普僵.ogg',
        10,
        false
    );

    // 僵尸吃植物音效
    zombieEatPlantSound = new SoundPool(
        './sound/僵尸咀嚼植物音效.wav',
        10,
        false
    );

    // 僵尸来了音效
    zombieComeSound = new Sound(
        './sound/僵尸来了.ogg',
        false
    );

    // 创建游戏组件
    const app1 = createApp(ShovelButton);
    app1.mount('#shovelbutton-root');
    gameComponents.push(app1);
    const app2 = createApp(SunSlot);
    app2.mount('#sunslot-root');
    gameComponents.push(app2);

    scene.remove(menuGroup);

    currentState = normalState;

    camera.position.set(6, 13.2, 15);
    camera.lookAt(2.5, -5, -7);

    shovelIsClickedRightNow = false;
    zombieID = 0;
    bulletID = 0;
    zombiesToBeRemoved = [];
    bulletsToBeRemoved = [];

    sunNumber['myValue'] = 50; // 初始阳光数量
    totalZombieNumber = 25; // 需要调整 **
    generatedZombieNumber = 0;
    killedZombieNumber = 0;

    haveWeeder = [false, false, false, false, false];
    weederCannonjsModel = [];
    weederTRHEEjsModel = [];

    cannonWorld = new CANNON.World();
    cannonWorld.gravity.set(0, 0, 0);

    gameGroup = new THREE.Group();
    scene.add(gameGroup);

    zombiesGroup = new THREE.Group();
    collectableGroup = new THREE.Group();
    buildingsGroup = new THREE.Group();
    grassesGroup = new THREE.Group();

    buildingsGroup.add(grassesGroup);
    gameGroup.add(buildingsGroup);
    gameGroup.add(zombiesGroup);
    gameGroup.add(collectableGroup);

    // 创建一个透明的平面，用于鼠标检测
    const planeGeometry = new THREE.BoxGeometry(10 * window.innerHeight, 2, 10 * window.innerWidth);
    const planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0 // 设置材质透明度为0
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -1, 0);
    buildingsGroup.add(plane);

    // 创建地面模型
    loader.load('./models/gameScene.glb', gltf => {
        buildingsGroup.add(gltf.scene);
        gltf.scene.position.set(4.5, -0.15, 2);
    });

    // 创建房子模型
    loader.load('./models/house.glb', gltf => {
        buildingsGroup.add(gltf.scene);
        gltf.scene.position.set(-2.7, 0, 2);
    });

    // 围栏模型
    loader.load('./models/fence.glb', gltf => {
        buildingsGroup.add(gltf.scene);
        gltf.scene.position.set(-0.75, 0, -0.75);
    });

    // 植物位置提示框模型
    loader.load('./models/hintblock.glb', gltf => {
        hintBlock = gltf.scene;
        hintBlock.position.set(9999, 0, 9999); // 将hintBlock放到看不见的地方
        gameGroup.add(hintBlock);
    });

    // 铲子模型
    loader.load('./models/shovel.glb', gltf => {
        shovel = gltf.scene;
        shovel.position.set(9999, 0, 9999); // 将shovel放到看不见的地方
        gameGroup.add(shovel);
    });

    // 地图初始化
    map = [];
    for (let i = 0; i < 5; i++) {
        map.push([]);
        for (let j = 0; j < 10; j++) {
            map[i].push(null);
        }
    }

    // 状态数组的初始化
    zombies = [];
    bullets = [];
    mixers = [];

    // 创建草地
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 5; j++) {
            let filename = './models/grass' + ((i + j) % 2 == 0 ? 1 : 2).toString() + '.glb';
            loader.load(filename, gltf => {
                grassesGroup.add(gltf.scene);
                gltf.scene.position.set(i, -0.1, j);
                gltf.scene.myposition = new THREE.Vector2(i, j);
            });
        }
    }

    for (let i = 0; i < 5; i++) {
        weederTRHEEjsModel.push(null);
    }

    // 创建除草机
    for (let i = 0; i < 5; ++i) {
        setTimeout(() => {
            loader.load('./models/weeder.glb', gltf => {
                gameGroup.add(gltf.scene);
                gltf.scene.position.set(-2.8, 0, i);
                for (let j = 1; j <= 40; j++) {
                    setTimeout(() => {
                        gltf.scene.position.set(-2.8 + 0.05 * j, 0, i);
                        if (j === 40) {
                            haveWeeder[i] = true;
                            weederTRHEEjsModel[i] = gltf.scene;
                            let cannonShape = new CANNON.Box(new CANNON.Vec3(0.3, 5, 0.3));
                            let cannonBody = new CANNON.Body({
                                shape: cannonShape,
                                mass: 1000000,
                                position: new CANNON.Vec3(-0.8, 0, i),
                                collisionFilterGroup: COLLISION_GROUP_WEEDER,
                                collisionFilterMask: COLLISION_GROUP_ZOMBIE,
                                collisionResponse: false
                            });
                            cannonBody.velocity.set(0, 0, 0);
                            cannonWorld.addBody(cannonBody);
                            cannonBody.isWeeder = true;
                            weederCannonjsModel.push(cannonBody);
                        }
                    }, 50 * j);
                }
            });
        }, 800 * i);
    }

    // for (let i = 0; i < totalZombieNumber; i++) {
    //     setTimeout(() => {
    //         if (i === 0) {
    //             zombieComeSound.play();
    //         }
    //         generateZombie(2);
    //     }, i * 300 + 20000);
    // }

    for (let i = 0; i < totalZombieNumber; i++) {
        zombieTimers.push(setTimeout(() => {
            if (i === 0) {
                zombieComeSound.play();
            }
            let r = Math.random();
            let zombieId;
            if (i < 4) {
                zombieId = 0;
            } else if (i >= 4 && i < 15) {
                if (r < 0.4) {
                    zombieId = 0;
                } else if (r < 0.8) {
                    zombieId = 1;
                } else {
                    zombieId = 2;
                }
            } else if (i >= 15 && i < 30) {
                if (r < 0.2) {
                    zombieId = 0;
                } else if (r < 0.6) {
                    zombieId = 1;
                } else {
                    zombieId = 2;
                }
            } else {
                if (r < 0.4) {
                    zombieId = 1;
                } else {
                    zombieId = 2;
                }
            }
            generateZombie(zombieId);
        }, 320 * (50 - i) * (i + 1))); // 间隔为16000 - 640 * i
    }

    startSunGererator();

    addLocalListeners();
}

// setInterval(() => {
// console.log(document.querySelectorAll('audio').length);
// }, 300);
function startSunGererator() {
    sunGeneratorTimer = setInterval(() => {
        randomizedSunGenerator();
    }, 6000); // 需要调整 **
}

function stopSunGenerator() {
    clearInterval(sunGeneratorTimer);
}

function startFrame() {
    clock = new THREE.Clock();
    frame();
}

// function stopFrame() {
//     cancelAnimationFrame(frameTimer);
//     clock = null;
// }

// 结束某一局游戏（一个关卡）
function endGame1() {

    stopSunGenerator();
    zombieTimers.forEach(timer => {
        clearTimeout(timer);
    });
    objectsGeneratorTimers.forEach(timer => {
        clearTimeout(timer);
    });

    let loaderContainer = document.querySelector('#loaders-container');
    loaderContainer.style.display = 'block';
    loaderApps.app2 = createApp(MyLoaders2);
    loaderApps.app2.mount('#loaders-container');
    gameComponents.forEach(app => {
        app.unmount();
    });
    let gameContainer = document.querySelector('canvas#game-canvas');
    gameContainer.style.display = 'none';

    let audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        if (document.body.contains(audio)) {
            audio.pause();
            document.body.removeChild(audio);
        }
    });

}

function endGame2() {

    bgm();

    loaderApps.app2.unmount();
    let gameContainer = document.querySelector('canvas#game-canvas');
    gameContainer.style.display = 'block';

    mixers = [];

    let mixer1 = new THREE.AnimationMixer(startSceneModel.scene);
    mixers.push([mixer1, 0.12]);
    let action1 = mixer1.clipAction(startSceneModel.animations[0]);
    action1.play();
    let mixer2 = new THREE.AnimationMixer(startSceneModel.scene);
    mixers.push([mixer2, 0.6]);
    let action2 = mixer2.clipAction(startSceneModel.animations[1]);
    action2.play();


    gameComponents = [];
    scene.remove(gameGroup);
    currentState = menuState;
    scene.add(menuGroup);

    let user_name_container = document.querySelector('#username-container1');
    user_name_container.style.display = 'block';

    camera.position.set(9.438085, 1.679520, 0.589513);
    camera.lookAt(0, 1, -3.3);

}

// 退出整个程序
function exitGame() {
    axios.post('http://localhost:' + PORT.myValue + '/exitGame', {
        account: gameAccountState.account,
        money: gameAccountState.money,
    });
}

function randomizedSunGenerator() {
    loader.load('./models/sun.glb', gltf => {
        let model = gltf.scene;
        let position = new THREE.Vector2((Math.random() * 9), (Math.random() * 4));
        model.position.set(position.x + 0.65, 5, position.y);
        model.collectionType = 'sun';
        model.collectionValue = 25;
        model.myTimeoutId = -1; // -1 表示当前没有定时器，-2表示这个阳光已经被收集
        collectableGroup.add(model);
        sunFallingAnimation(model);
        sunAnimationCreator(gltf);
        // 创建动画动作并播放
    });
}

function sunFallingAnimation(sunModel) {
    if (sunModel.myTimeoutId === -2) { // 如果这个阳光已经被收集
        return;
    }
    if (sunModel.position.y > 1) {
        sunModel.position.y -= 0.05;
        sunModel.myTimeoutId = setTimeout(() => {
            sunFallingAnimation(sunModel);
        }, 50);
        return;
    }
    if (sunModel.position.y === 1) {
        sunModel.myTimeoutId = -1;
        return;
    }
}

// 用于创建阳光的动画，统一创建便于管理
function sunAnimationCreator(sunGLTF) {
    let mixer = new THREE.AnimationMixer(sunGLTF.scene);
    mixers.push([mixer, 0.3]);
    let action = mixer.clipAction(sunGLTF.animations[0]);
    action.play();
}

function addGlobelListeners() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.onbeforeunload = function () {
        exitGame();
    };

    document.addEventListener('mousemove',
        onMouseMove,
        false);
    document.addEventListener('click',
        onMouseLeftButtonClick,
        false);
    document.addEventListener('contextmenu',
        onMouseRightButtonClick,
        false);

    // 禁用双指缩放
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    });
    document.addEventListener('gestureend', function (e) {
        e.preventDefault();
    });

}

function addLocalListeners() {
    cannonWorld.addEventListener('beginContact',
        collisionHandler,
        false);
}

function removeLocalListeners() {
    cannonWorld.removeEventListener('beginContact',
        collisionHandler,
        false);
}

function collisionHandler(event) {
    let zombieid = event.bodyA.zombieID;
    let zombiebody = event.bodyA;
    let bulletid = event.bodyA.bulletID;
    let bulletbody = event.bodyA;
    if (zombieid === undefined) {
        zombieid = event.bodyB.zombieID;
        zombiebody = event.bodyB;
    }
    if (bulletid === undefined) {
        bulletid = event.bodyB.bulletID;
        bulletbody = event.bodyB;
    } // 以上代码用于找到碰撞的僵尸和子弹

    // 如果有一方是除草机的话
    if (event.bodyA.isWeeder === true) {
        zombiesToBeRemoved.push(event.bodyB.zombieID);
        return;
    }
    if (event.bodyB.isWeeder === true) {
        zombiesToBeRemoved.push(event.bodyA.zombieID);
        return;
    }

    if (zombiebody.HP <= 0) {
        zombiesToBeRemoved.push(zombieid);
    }

    let ATK = bulletbody.ATK;
    // 如果是灰烬植物的话（ATK为1e9）
    if (ATK > 1e8) {
        explodeHandler(0, new THREE.Vector2(bulletbody.position.x, bulletbody.position.z));
        bulletsToBeRemoved.push(bulletid);
    } else {
        bulletHitZombieSound.play(); // 播放子弹击中僵尸的音效
    }
    zombiebody.HP -= ATK // 僵尸受到伤害

    // 子弹消失
    bulletsToBeRemoved.push(bulletid);
    // 如果僵尸死亡，将僵尸放到待删除数组中
    if (zombiebody.HP <= 0) {
        zombieDieSound(); // 播放僵尸死亡音效
        zombiesToBeRemoved.push(zombieid);
    }
}

/*
 *
 * 爆炸种类定义：
 * 0：土豆雷
 * 1：毁灭菇
 * 2：樱桃炸弹
 * ········
 */
function explodeHandler(type, position) {
    switch (type) {
        case 0:
            potatoMineExplodeSound();
            zombies.forEach(element => {
                let zombie = element[1];
                if (Math.abs(zombie.position.x - position.x) < 0.7 && zombie.position.y === position.y) {
                    zombiesToBeRemoved.push(zombie.zombieID);
                }
            });
            if (map[position.y][position.x] === null ||
                map[position.y][position.x] === undefined) {
                return;
            }
            
            bulletsToBeRemoved.push(map[position.y][position.x].bulletID);
            map[position.y][position.x] = null;
            break;
        case 1:
            doomShroomSound();
            zombies.forEach(element => {
                let zombie = element[1];
                zombiesToBeRemoved.push(zombie.zombieID);
            });
            gameGroup.remove(map[position.y][position.x]);
            map[position.y][position.x] = null;
            loader.load('./models/explosion.glb', gltf => {
                gltf.scene.position.set(position.x, 0.2, position.y);
                gltf.scene.isNotPlant = true;
                gameGroup.add(gltf.scene);
                map[position.y][position.x] = gltf.scene;
                setTimeout(() => {
                    gameGroup.remove(map[position.y][position.x]);
                    map[position.y][position.x] = null;
                }, 20000);
            });
            break;
        case 2:
            cherryBombExplodeSound();
            zombies.forEach(element => {
                let zombie = element[1];
                if (Math.abs(zombie.position.x - position.x) < 1.5 &&
                    Math.abs(zombie.position.z - position.y) < 1.5) { // 周围的3 * 3区域
                    zombiesToBeRemoved.push(zombie.zombieID);
                }
            });
            gameGroup.remove(map[position.y][position.x]);
            map[position.y][position.x] = null;
            break;
    }
}

function triggerWeeder(row) {
    if (haveWeeder[row] === true) {
        weederSound();
        haveWeeder[row] = false;
        weederCannonjsModel[row].velocity.set(2.5, 0, 0);
    }
}

function onMouseMove(event) {

    let mousePosition = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    ); // 将鼠标在屏幕上的坐标转换到canvas上的坐标
    rayCaster.setFromCamera(mousePosition, camera); // 通过摄像机和鼠标位置更新射线

    if (currentState === menuState) {
        if (startBlock === undefined || setttingBlock === undefined || exitBlock === undefined ||
            startBlock === null || setttingBlock === null || exitBlock === null ||
            startBlock[0] === undefined || setttingBlock[0] === undefined || exitBlock[0] === undefined ||
            startBlock[1] === undefined || setttingBlock[1] === undefined || exitBlock[1] === undefined ||
            startBlock[2] === undefined || setttingBlock[2] === undefined || exitBlock[2] === undefined
        ) {
            return;
        }
        startBlock[0].scale.set(1, 1, 1);
        setttingBlock[0].scale.set(1, 1, 1);
        exitBlock[0].scale.set(1, 1, 1);
        if (startBlock.length === 3 && setttingBlock.length === 3 && exitBlock.length === 3) {
            for (let i = 1; i < 3; i++) {
                menuGroup.remove(startBlock[i]);
                menuGroup.remove(setttingBlock[i]);
                menuGroup.remove(exitBlock[i]);
                if (i === 1) {
                    menuGroup.add(startBlock[i]);
                    menuGroup.add(setttingBlock[i]);
                    menuGroup.add(exitBlock[i]);
                }
            }
        }

        const intersects_with_startBlock = rayCaster.intersectObject(startBlock[0], true);
        const intersects_with_settingBlock = rayCaster.intersectObject(setttingBlock[0], true);
        const intersects_with_exitBlock = rayCaster.intersectObject(exitBlock[0], true);
        if (intersects_with_startBlock.length > 0) {
            startBlock[0].scale.set(1.1, 1.1, 1.1);
            menuGroup.remove(startBlock[1]);
            menuGroup.remove(startBlock[2]);
            menuGroup.add(startBlock[2]);
        }
        if (intersects_with_settingBlock.length > 0) {
            setttingBlock[0].scale.set(1.1, 1.1, 1.1);
            menuGroup.remove(setttingBlock[1]);
            menuGroup.remove(setttingBlock[2]);
            menuGroup.add(setttingBlock[2]);
        }
        if (intersects_with_exitBlock.length > 0) {
            exitBlock[0].scale.set(1.1, 1.1, 1.1);
            menuGroup.remove(exitBlock[1]);
            menuGroup.remove(exitBlock[2]);
            menuGroup.add(exitBlock[2]);
        }

        return;

    } else if (currentState === normalState ||
        currentState === plantingState ||
        currentState === removingState) {

        // 防止在模型未加载完成时出现错误，影响游戏体验
        if (hintBlock === null || shovel === null) {
            return;
        }
        if (plantPreviewer === null && currentState === plantingState) {
            return;
        }

        hintBlock.position.set(9999, 0, 9999); // 将hintBlock放到看不见的地方

        // 先设置预览植物或者铲子的位置，如果鼠标同时在某一块草地上，再将位置取整。
        if (currentState === plantingState) {
            let _position = (rayCaster.intersectObject(plane)[0]).point;
            plantPreviewer.position.set(_position.x, 0, _position.z);

        }
        if (currentState === removingState) {
            // 处理铲子逻辑
            let _position = (rayCaster.intersectObject(plane)[0]).point;
            shovel.position.set(_position.x, 0, _position.z);
        }

        const intersects_with_grasses = rayCaster.intersectObjects(grassesGroup.children, true);
        if (intersects_with_grasses.length > 0) {
            const obj = intersects_with_grasses[0].object;
            const position = obj.parent.myposition; // gltf.scene是一个Group, 碰撞检测到的是Mesh，Mesh有的parent才是gltf.scene
            switch (currentState) {
                case normalState:
                    // no need to do anything
                    break;
                case plantingState:
                    if (map[position.y][position.x] != null) { // 该位置已经有植物
                        break;
                    }
                    hintBlock.position.set(position.x, 0.1, position.y);
                    plantPreviewer.position.set(position.x, 0.1, position.y);
                    break;
                case removingState:
                    hintBlock.position.set(position.x, 0.1, position.y);
                    // 处理铲子逻辑
                    shovel.position.set(position.x, 0.5, position.y);
                    break;
            }
        }
    }
}

function onMouseLeftButtonClick(event) {

    // 将鼠标在屏幕上的坐标转换到canvas上的坐标
    let mousePosition = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    // 通过摄像机和鼠标位置更新射线
    rayCaster.setFromCamera(mousePosition, camera);

    if (currentState === menuState) {
        if (startBlock === null || setttingBlock === null || exitBlock === null) {
            return;
        }

        const intersects_with_startBlock = rayCaster.intersectObject(startBlock[0], true);
        const intersects_with_settingBlock = rayCaster.intersectObject(setttingBlock[0], true);
        const intersects_with_exitBlock = rayCaster.intersectObject(exitBlock[0], true);
        if (intersects_with_startBlock.length > 0) {
            nextTick(() => {
                const app1 = createApp(CardSlots);
                app1.mount('#cardslots-root');

                gameComponents.push(app1);
                scene.remove(menuGroup);

                let gameCanvas = document.querySelector('canvas#game-canvas');
                gameCanvas.style.display = 'none';

                let user_name_container = document.querySelector('#username-container1');
                user_name_container.style.display = 'none';

                currentState = noRayCasterState;

            });
        }
        if (intersects_with_settingBlock.length > 0) {
            window.open('./个人简历/a.html', '_blank');
        }
        if (intersects_with_exitBlock.length > 0) {
            exitGame();
            gameAccountState.signedIn = false;
            location.reload();
            currentState = noRayCasterState;
        }

        //恢复菜单栏的物体状态，防止切换界面时突然发生变化，影响美观

        startBlock[0].scale.set(1, 1, 1);
        setttingBlock[0].scale.set(1, 1, 1);
        exitBlock[0].scale.set(1, 1, 1);

        menuGroup.remove(startBlock[1]);
        menuGroup.remove(startBlock[2]);
        menuGroup.add(startBlock[1]);
        menuGroup.remove(setttingBlock[1]);
        menuGroup.remove(setttingBlock[2]);
        menuGroup.add(setttingBlock[1]);
        menuGroup.remove(exitBlock[1]);
        menuGroup.remove(exitBlock[2]);
        menuGroup.add(exitBlock[1]);

        return;

    } else if (currentState === normalState ||
        currentState === plantingState ||
        currentState === removingState) {

        const intersects_with_grasses = rayCaster.intersectObjects(grassesGroup.children, true);
        const intersects_with_collections = rayCaster.intersectObjects(collectableGroup.children, true);
        if (intersects_with_grasses.length > 0) {
            const obj = intersects_with_grasses[0].object;
            const position = obj.parent.myposition; // gltf.scene是一个Group, 碰撞检测到的是Mesh，Mesh有的parent才是gltf.scene
            switch (currentState) {
                case normalState:
                    // no need to do anything
                    break;
                case plantingState:
                    plantPlant(position);
                    break;
                case removingState:
                    removePlant(position);
                    break;
            }
        }
        if (shovelIsClickedRightNow) {
            shovelIsClickedRightNow = false;
            return;
        }
        if (intersects_with_grasses.length === 0 && (currentState === plantingState || currentState === removingState)) {
            currentState = normalState;
            if (plantPreviewer != null) {
                gameGroup.remove(plantPreviewer);
                plantPreviewer = null;
            }
            hintBlock.position.set(9999, 0, 9999); // 将hintBlock放到看不见的地方
            shovel.position.set(9999, 0, 9999); // 将shovel放到看不见的地方
        }

        if (intersects_with_collections.length > 0 && currentState === normalState) {
            let obj = intersects_with_collections[0].object;
            obj = obj.parent;
            let type = obj.collectionType;
            let value = obj.collectionValue;
            switch (type) {
                case 'sun':
                    collectSunSound();
                    if (obj.myTimeoutId > -1) {
                        clearTimeout(obj.myTimeoutId);
                    }
                    obj.myTimeoutId = -2;
                    changeSunNumberByDelta(value);
                    break;
                case 'money':

                    break;
            }
            collectableGroup.remove(obj);
        }
    }
}


function onMouseRightButtonClick(event) {
    if (currentState === menuState) {
        return;
    } else if (currentState === normalState ||
        currentState === plantingState ||
        currentState === removingState) {
        event.preventDefault();
        if (currentState === plantingState || currentState === removingState) {
            currentState = normalState;
            if (plantPreviewer != null) {
                gameGroup.remove(plantPreviewer);
                plantPreviewer = null;
            }
            hintBlock.position.set(9999, 0, 9999); // 将hintBlock放到看不见的地方
            shovel.position.set(9999, 0, 9999); // 将shovel放到看不见的地方
        }
    }
}

function changeSunNumberByDelta(delta) {
    sunNumber['myValue'] += delta;
}

function generateObject(plantId, position, bulletNumber) {
    // 如果植物被铲除，停止生成子弹
    if (map[position.y][position.x] === null) {
        return;
    }

    if (bulletNumber > 0) {
        let objectName;
        switch (plantGenerateType[plantId]) {
            case 0:
                objectName = './models/sun.glb';
                break;
            case 1:
                objectName = './models/beanbullet.glb';
                break;
            case 2:
                objectName = './models/icebeanbullet.glb';
                break;
            case 3:
                objectName = './models/firebeanbullet.glb';
                break;
            case 4:
                objectName = './models/bubblebullet.glb';
                break;
            default:
                // objectName = './models/beanbullet.glb';
                // break;
                return;
        }

        loader.load(objectName, gltf => {
            let objectTemp = gltf.scene;

            let cannonShape;
            let cannonBody;
            // let mixer;
            // let action; // 可能会用到
            switch (plantGenerateType[plantId]) {
                case 0:
                    objectTemp.position.set(
                        position.x + 0.65 + Math.random() / 2 - 0.25,
                        1 + Math.random() - 0.25,
                        position.y + Math.random() - 0.5
                    );
                    objectTemp.collectionType = 'sun';
                    objectTemp.collectionValue = 25;
                    collectableGroup.add(objectTemp);
                    sunAnimationCreator(gltf);
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    bulletID += 1;
                    console.log('plantId:', plantId, 'position:', position, 'bulletNumber:', bulletNumber, 'objectName:', objectName);
                    // 在three.js中创建子弹
                    objectTemp.position.set(position.x + 0.3, 0.7, position.y);
                    gameGroup.add(objectTemp);
                    // 在cannon.js中创建子弹
                    cannonShape = new CANNON.Sphere(0.15);
                    cannonBody = new CANNON.Body({
                        shape: cannonShape,
                        mass: 1,
                        position: new CANNON.Vec3(position.x + 0.3, 0.7, position.y),
                        collisionFilterGroup: COLLISION_GROUP_ATTACK,
                        collisionFilterMask: COLLISION_GROUP_ZOMBIE
                    });
                    cannonBody.velocity.set(4, 0, 0); // 设置子弹的速度 **
                    cannonBody.bulletID = bulletID;

                    cannonBody.ATK = plantAttack[plantId]; // 后续可以调整 **
                    cannonWorld.addBody(cannonBody);
                    bullets.push([objectTemp, cannonBody]); // 将three.js模型和cannon.js模型放到bullets数组中
                    break;
            }
        });

        bulletNumber = bulletNumber - 1;
        // 如果植物被铲除，停止生成子弹
        if (map[position.y][position.x] === null) {
            return;
        }
        if (bulletNumber === 0 && plantGenerateSpeed[plantId] >= 0) {
            map[position.y][position.x].myTimeoutId = setTimeout(() => {
                generateObject(plantId, position, objectsPerRound[plantId]);
            }, plantGenerateSpeed[plantId]);
            return;
        } else {
            map[position.y][position.x].myTimeoutId = -1;
            objectsGeneratorTimers.push(
                setTimeout(
                    () => {
                        generateObject(plantId, position, bulletNumber);
                    }, smallInterval[plantId]
                )
            );

        }
    }
}

// 记录最近生成的僵尸的行，在最近未生成僵尸的行生成僵尸，false表示最近未生成僵尸，true表示最近生成了僵尸
let zombieHistory = [false, false, false, false, false];

function generateZombie(zombieId = 0) {
    generatedZombieNumber += 1;
    if (generatedZombieNumber > totalZombieNumber) {
        return;
    }
    zombieID += 1;
    let rows = zombieHistory.reduce((indexes, element, index) => {
        if (element === false) {
            indexes.push(index);
        }
        return indexes;
    }, []);
    if (rows.length === 0) {
        zombieHistory = [false, false, false, false, false];
        rows = zombieHistory.reduce((indexes, element, index) => {
            if (element === false) {
                indexes.push(index);
            }
            return indexes;
        }, []);
    }
    let row = rows[Math.floor(Math.random() * rows.length)];
    zombieHistory[row] = true;
    loader.load('/models/zombies/zombie' + zombieId + '.glb', gltf => {
        // 在three.js中创建僵尸
        zombiesGroup.add(gltf.scene);
        gltf.scene.position.set(10, 0.1, row);
        gltf.scene.myrow = row; // 添加myrow属性，表示僵尸所在的行
        gltf.scene.myTimeoutId = -1; // 添加myTimeoutId属性，用于存储setTimeout的返回值

        // 在cannon.js中创建僵尸
        let cannonShape = new CANNON.Box(new CANNON.Vec3(0.3, 5, 0.3));
        let cannonBody = new CANNON.Body({
            shape: cannonShape,
            mass: 1000000,
            position: new CANNON.Vec3(10, 0.1, row),
            collisionFilterGroup: COLLISION_GROUP_ZOMBIE,
            collisionFilterMask: COLLISION_GROUP_ATTACK | COLLISION_GROUP_WEEDER
        });
        cannonBody.velocity.set(zombieSpeed[zombieId], 0, 0); // 设置僵尸的速度
        cannonBody.zombieID = zombieID;
        cannonBody.HP = zombieHP[zombieId];
        cannonBody.ATK = zombieAttack[zombieId];
        cannonBody.ATKSpeed = zombieAttackSpeed[zombieId];
        cannonBody.moveSpeed = zombieSpeed[zombieId];
        cannonWorld.addBody(cannonBody);

        zombies.push([gltf.scene, cannonBody]); // 将three.js模型和cannon.js模型放到zombies数组中

        // let scale1 = 0.2; // 最后可能可以删掉
        // gltf.scene.scale.set(scale1, scale1, scale1); // 最后可能可以删掉
    });
}

/// 记得改回来
function frame() {
    const deltaTime = clock.getDelta();
    if (currentState === normalState ||
        currentState === plantingState ||
        currentState === removingState) {

        if (killedZombieNumber === totalZombieNumber) {
            let reward = 0;
            for (let i = 0; i < 5; i++) {
                if (haveWeeder[i] === true) {
                    reward += 100;
                }
            }
            gameAccountState['money'] += reward;
            showDialog('游戏胜利！3秒后返回主菜单，本次游戏奖励' + reward.toString() + '金币');
            winSound.play();
            currentState = noRayCasterState;
            removeLocalListeners();
            setTimeout(() => {
                hideDialog();
                endGame1();
            }, 3000);

            renderer.render(scene, camera);
            requestAnimationFrame(frame);
            return;
        }

        if (currentState === normalState) {
            if (hintBlock != null) {
                hintBlock.position.set(9999, 0, 9999); // 将hintBlock放到看不见的地方
            }
            if (plantPreviewer != null) {
                gameGroup.remove(plantPreviewer);
                plantPreviewer = null;
            }
        }
        let rows = [
            [],
            [],
            [],
            [],
            []
        ]; // 记录每行的僵尸的位置
        zombies.forEach(element => {
            let threejsModel = element[0];
            let row = threejsModel.myrow;
            rows[row].push(threejsModel.position.x);
        }); // 记录每行的僵尸的位置

        // 为每行僵尸的位置从小到大排序
        rows.forEach(row => {
            row.sort((a, b) => a - b);
        });

        //给面前有僵尸的攻击型植物生成子弹

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                if (map[i][j] != null) {
                    let hasZombie = false;
                    let Id = map[i][j].myId;
                    let position = map[i][j].myposition;
                    let bulletNumber = objectsPerRound[Id];
                    for (let k = 0; k < rows[i].length; k++) {
                        if (rows[i][k] >= j) {
                            hasZombie = true;
                            if (map[i][j].myTimeoutId % 1 != 0 && plantIsAttack[Id] === true) {
                                generateObject(Id, position, bulletNumber);
                                break;
                            }
                        }
                    }
                    if (hasZombie === false && map[i][j].myTimeoutId != -1 && plantIsAttack[Id] === true) { // -1表示一次生成多发子弹，不用取消
                        clearTimeout(map[i][j].myTimeoutId);
                        map[i][j].myTimeoutId = 0.1;
                    }
                }
            }
        }

        // 所有非攻击型植物生成对应object，在创建时设置timeout函数，这里不用其他处理

        // 在此处理僵尸移动的逻辑，更新僵尸的速度后再进行模拟
        zombies.forEach(element => {
            let threejsModel = element[0];
            let cannonModel = element[1];
            let row = threejsModel.myrow;
            let x = threejsModel.position.x;
            if (x < 0) {
                if (haveWeeder[row] === true) {
                    triggerWeeder(row);
                }
            }
            if (x < -0.5) { // 游戏结束
                showDialog('游戏失败:( 3秒后返回主菜单');
                loseSound.play();
                currentState = noRayCasterState;
                removeLocalListeners();
                setTimeout(() => {
                    hideDialog();
                    endGame1();
                }, 3000);

                renderer.render(scene, camera);
                requestAnimationFrame(frame);
                return;
            }

            if (x < 10 &&
                x >= 0 &&
                map[row][Math.floor(x)] !== null &&
                x - Math.floor(x) <= 0.2 &&
                cannonModel.velocity.x !== 0 &&
                !(map[row][Math.floor(x)].isNotPlant === true)) { // 如果僵尸前方有植物且距离小于0.2

                cannonModel.velocity.set(0, 0, 0);
                eat(threejsModel, cannonModel, map[row][Math.floor(x)]);
            }
            if (x < 10 && map[row][Math.floor(x)] === null && cannonModel.velocity.x === 0) { // 如果僵尸前方没有植物
                cannonModel.velocity.set(cannonModel.moveSpeed, 0, 0);
            }

        });

        // 更新所有运动物体的位置

        cannonWorld.step(deltaTime);

        // 更新所有运动物体的位置

        zombies.forEach(element => {
            let threejsModel = element[0];
            let cannonModel = element[1];
            threejsModel.position.copy(cannonModel.position);
        });

        bullets.forEach(element => {
            let threejsModel = element[0];
            let cannonModel = element[1];
            threejsModel.position.copy(cannonModel.position);
            if (threejsModel.position.x > 20) { // 子弹飞出屏幕后删除，降低性能消耗
                bulletsToBeRemoved.push(cannonModel.bulletID);
            }
        });

        weederTRHEEjsModel.forEach(element => {
            if (element === null) {
                return;
            }
            let index = weederTRHEEjsModel.indexOf(element);
            element.position.copy(
                weederCannonjsModel[index]
                .position
            );
        });

        // 在模拟step后删除需要清除的僵尸和子弹
        zombiesToBeRemoved.forEach(zombieid => {
            let zombiePairIndex = zombies.findIndex(element => element[1].zombieID === zombieid);
            if (zombiePairIndex >= 0) { // 由于可能在一次模拟中多个子弹击中一个僵尸，所以可能重复删除导致程序崩溃
                let threejsModel = zombies[zombiePairIndex][0];
                let cannonModel = zombies[zombiePairIndex][1];
                if (threejsModel.myTimeoutId > 0) {
                    clearTimeout(threejsModel.myTimeoutId);
                    threejsModel.myTimeoutId = -1;
                }
                zombiesGroup.remove(threejsModel);

                cannonWorld.removeBody(cannonModel);
                cannonModel.HP = -1000;

                zombies.splice(zombiePairIndex, 1);
                killedZombieNumber += 1;
            }
        });
        zombiesToBeRemoved = [];
        bulletsToBeRemoved.forEach(bulletid => {
            let bulletPairIndex = bullets.findIndex(element => element[1].bulletID === bulletid);
            if (bulletPairIndex >= 0) {
                gameGroup.remove(bullets[bulletPairIndex][0]);
                cannonWorld.removeBody(bullets[bulletPairIndex][1]);
                bullets.splice(bulletPairIndex, 1);
            }
        });
        bulletsToBeRemoved = [];

    }
    mixers.forEach(element => {
        let mixer = element[0];
        let coefficient = element[1];
        mixer.update(deltaTime * coefficient);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
    // frameTimer = requestAnimationFrame(frame);

}

function eat(threejsModel, cannonModel, plant) {
    if (cannonModel.HP <= 0) {
        return;
    }
    if (plant.HP <= 0) {
        return;
    }

    zombieEatPlantSound.play();
    plant.HP -= cannonModel.ATK;

    if (plant.HP <= 0) {
        zombieEatUpPlantSound();
        if (plant.myTimeoutId % 1 === 0 && plant.myTimeoutId != -1) {
            clearTimeout(plant.myTimeoutId);
        }
        gameGroup.remove(plant);
        let position = plant.myposition;
        map[position.y][position.x] = null;
        threejsModel.myTimeoutId = -1;
        return;
    }
    if (cannonModel.HP > 0) {
        threejsModel.myTimeoutId = setTimeout(() => {
            eat(threejsModel, cannonModel, plant);
        }, cannonModel.ATKSpeed);
    }
}

function previewPlant(plantId, index) {

    let plantName = plantNames[plantId];
    if (isColding[index] === true || sunNumber['myValue'] < priceOfPlant[plantId]) {
        sunNotEnoughSound();
        return;
    } else {
        previewPlantSound();
        loader.load('./models/plants/' + plantName + '.glb', gltf => {
            currentState = plantingState; // 异步加载模型，所以要先设置状态，并且必须在加载完成后设置
            plantPreviewer = gltf.scene;
            plantPreviewer.myId = plantId;
            plantPreviewer.HP = plantHP[plantId];

            plantPreviewer.index = index;

            gameGroup.add(plantPreviewer);
            plantPreviewer.gltf = gltf; // 创建这个引用是为了在真正中下植物时为植物添加动画使用

            if (plantName === '向日葵') {
                let scale = 0.7;
                plantPreviewer.scale.set(scale, scale, scale);
            }

            plantPreviewer.position.set(-9999, 0, -9999); // 将plantPreviewer放到看不见的地方
            hintBlock.position.set(-9999, 0, -9999); // 将hintBlock放到看不见的地方
        });
    }
}

function plantPlant(position) {
    // 该位置已经有植物，预览植物直接消失即可
    if (map[position.y][position.x] === null &&
        sunNumber['myValue'] >= priceOfPlant[plantPreviewer.myId]) { // 该位置没有植物，且阳光足够，可以种植

        plantPlantSound();

        startColdAnimation(plantPreviewer.index);
        plantPreviewer.index = undefined;

        plantPreviewer.position.set(position.x, 0, position.y);
        plantPreviewer.myposition = position;
        plantPreviewer.myTimeoutId = 0.1;
        map[position.y][position.x] = plantPreviewer;

        // 非攻击型植物生成对应object
        let Id = plantPreviewer.myId;
        let objectNumber = objectsPerRound[Id];
        if (plantIsAttack[Id] === false) {
            generateObject(Id, position, objectNumber);
        }
        changeSunNumberByDelta(-priceOfPlant[Id]); // 减去植物的阳光值

        // 为植物添加动画
        if (plantPreviewer.gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(plantPreviewer);
            let coefficient;
            switch (plantPreviewer.myId) {
                case 0:
                    coefficient = 0.333;
                    break;
                case 4:
                    coefficient = 1;
                    break;
                case 13:
                    coefficient = 0.333;
                    break;

            }
            mixers.push([mixer, coefficient]); // 创建 AnimationMixer 并添加到 mixers 数组中
            // 创建动画动作并播放
            const action = mixer.clipAction(plantPreviewer.gltf.animations[0]);
            action.play();
        }

        // 对一些特殊植物的特殊处理
        let cannonShape;
        let cannonBody;
        switch (plantPreviewer.myId) {
            case 5: // 土豆地雷
                // 定时生长
                map[position.y][position.x].position.set(position.x, -0.55, position.y); // 隐藏
                setTimeout(() => {
                    potatoMineGrowSound();
                    // map[position.y][position.x].position.set(position.x, 0, position.y); // 长出
                    for (let i = 1; i <= 55; i++) {
                        setTimeout(() => {
                            map[position.y][position.x].position.set(position.x, -0.55 + i * 0.01, position.y); // 长出
                            if (i === 55) {
                                // 土豆地雷长出后，创建一个相当于子弹的cannon.js模型，检测与僵尸的碰撞
                                bulletID += 1;
                                // 在cannon.js中创建子弹
                                cannonShape = new CANNON.Sphere(0.15);
                                cannonBody = new CANNON.Body({
                                    shape: cannonShape,
                                    mass: 1,
                                    position: new CANNON.Vec3(position.x, 0, position.y),
                                    collisionFilterGroup: COLLISION_GROUP_ATTACK,
                                    collisionFilterMask: COLLISION_GROUP_ZOMBIE
                                });
                                cannonBody.velocity.set(0, 0, 0); // 设置子弹的速度 **
                                cannonBody.bulletID = bulletID;
                                map[position.y][position.x].bulletID = bulletID; // 用于铲除时使用
                                cannonBody.ATK = 1e9; // 土豆地雷的攻击力为1e9，仅为了区分
                                cannonWorld.addBody(cannonBody);
                                bullets.push([map[position.y][position.x], cannonBody]); // 将three.js模型和cannon.js模型放到bullets数组中
                            }
                        }, i * 20);
                    }
                }, 3000);
                break;

            case 7: // 毁灭菇
                // 动画效果
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        let scale = 1.1 + i * 0.1;
                        map[position.y][position.x].scale.set(scale, scale, scale);
                    }, i * 100);
                }
                // 定时爆炸
                setTimeout(() => {
                    explodeHandler(1, position);
                }, 1200);
                break;
            case 8: // 樱桃炸弹
                // 定时爆炸
                setTimeout(() => {
                    explodeHandler(2, position);
                }, 1200);
                // 动画效果
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        let scale = 1.1 + i * 0.1;
                        map[position.y][position.x].scale.set(scale, scale, scale);
                    }, i * 100);
                }
                break;
            default:
                break;
        }
    } else { // 不满足种植条件，预览植物直接消失即可
        gameGroup.remove(plantPreviewer);
    }

    hintBlock.position.set(9999, 0, 9999); // 将hintBlock放到看不见的地方

    currentState = normalState;
    plantPreviewer = null;
}

function removePlant(position) {
    if (map[position.y][position.x] != null && map[position.y][position.x].isNotPlant === undefined) {
        if (map[position.y][position.x].bulletID != undefined) {
            bulletsToBeRemoved.push(map[position.y][position.x].bulletID);
        }
        removePlantSound();
        gameGroup.remove(map[position.y][position.x]);
        map[position.y][position.x] = null;
    }
    shovel.position.set(9999, 0, 9999); // 将shovel放到看不见的地方
    currentState = normalState;
}

function pickUpShovel() {
    pickUpShovelSound();
    currentState = removingState;
    shovelIsClickedRightNow = true;
}

export {
    initGame,
    previewPlant,
    pickUpShovel,
    gameAccountState,
    PORT,
    sunNumber,
    currentState,
    menuState,
    normalState,
    plantingState,
    removingState,
    noRayCasterState,
    startGame,
    endGame1,
    endGame2,
    loaderApps,
    startColdAnimation,
    coldTimeOfSelectedPlants,
    isColding,
};

// loader.load('./models/zombie-hand.glb', gltf => {
//     scene.add(gltf.scene);
//     let scale3 = 2;
//     gltf.scene.position.set(5, 0, 4);
//     gltf.scene.scale.set(scale3, scale3, scale3);
//     gltf.scene.rotation.y = -Math.PI / 2;
// }); // 开始界面的僵尸手
<!-- /*
* File: CardSlots.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <div id="cardslots-container">
        <div class="up-slots">
            <div class="card" v-for="(item, index) in selectedPlants" :key="item.plantID" @click=" () => {
                plantPlant(item.plantID, index);
                cancelPlant(item.plantID);
            }">
                <img :src="item.path" alt="plant">
                <div class="cold-cover" v-show="!show"></div>
                <div class="buy-cover" v-if="priceOfSelectedPlants[index] > sun.myValue && !show"></div>
            </div>
        </div>
        <div class="preview-slots" v-if="show">
            <div class="preview-slots2">
                <div class="card" v-for="(item, index) in allPlants" :key="item.plantID"
                    @click="selectPlant(item.plantID, item.isChosen)">
                    <img v-if="item.path !== ''" :src="item.path" alt="plant">
                    <span v-if="item.path === ''">
                        &nbsp;&nbsp;待解锁
                        <br>
                        敬请期待
                    </span>
                    <div class="selected-cover" v-if="item.isChosen === true && index < plantNumber"></div>
                </div>
            </div>
        </div>
        <button id="start-game-button" @click="start" v-if="show">
            <span>一起摇滚吧！</span>
        </button>
        <WaterRipple v-if="show"></WaterRipple>
    </div>
</template>

<script>
    import {
        noRayCasterState,
        previewPlant,
        currentState,
        startGame,
        sunNumber,
        coldTimeOfSelectedPlants,
        isColding,
        startColdAnimation,
    } from '@/scripts/Game.js';

    import {
        plantNames,
        priceOfPlant,
        coldTime,
    } from '@/scripts/BasicDataSettings.js';

    import WaterRipple from './WaterRipple.vue';

    import {
        showDialog
    } from '@/scripts/DialogOperator';

    // import {
    //     Sound
    // } from '@/scripts/Sound.js';

    export default {
        components: {
            WaterRipple
        },

        data() {

            let allPlants = [];

            for (let i = 0; i < plantNames.length; i++) {
                allPlants[i] = {
                    path: '/images/' + plantNames[i] + '.png',
                    plantID: i,
                    isChosen: false
                }
            }

            for (let i = 0; i < 91; i++) {
                allPlants.push({
                    path: '',
                    plantID: i + plantNames.length,
                    isChosen: true
                });
            }

            return {
                selectedPlants: [], // 存img路径的数组
                allPlants: allPlants,
                show: true, // 是否显示全部植物的卡片以及开始游戏按钮
                priceOfSelectedPlants: [], // 存放选中植物的价格
                sun: sunNumber,
                plantNumber: plantNames.length, // 植物的数量
            }
        },

        methods: {

            plantPlant(plantId, index) {
                if (currentState === noRayCasterState) {
                    return;
                }
                previewPlant(plantId, index);
            },

            selectPlant(index, isChosen) {
                if (isChosen) {
                    return;
                }

                if (this.selectedPlants.length >= 9) {
                    return;
                }

                this.selectedPlants[this.selectedPlants.length] = {
                    path: '/images/' + plantNames[index] + '.png',
                    plantID: index,
                    isColding: false,
                }

                this.allPlants[index].isChosen = true;

            },

            cancelPlant(index) {

                if (currentState !== noRayCasterState) {
                    return;
                }

                this.selectedPlants = this.selectedPlants.filter((item) => {
                    return item.plantID !== index;
                });
                this.allPlants[index].isChosen = false;

            },

            start() {
                if (this.selectedPlants.length === 0) {
                    showDialog('请至少选择一种植物！');
                    return;
                }

                this.show = false;

                coldTimeOfSelectedPlants.length = 0;
                isColding.length = 0;

                this.selectedPlants.forEach((item, index) => {
                    this.priceOfSelectedPlants.push(priceOfPlant[item.plantID]);
                    coldTimeOfSelectedPlants.push(coldTime[item.plantID]);
                    isColding.push(true);
                    startColdAnimation(index);
                });

                startGame();
            }
        },

    }
</script>

<style>
    #cardslots-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .card {
        width: 90px;
        height: 120px;
        border: 1px solid blue;
        font-size: 20px;
        overflow: hidden;
        background: brown;
        border: 5px solid rgb(211, 12, 12);
        border-radius: 7px;
        box-shadow: 0 0 7px 2.5px rgba(0, 0, 0, 0.6);

        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px;
        position: relative;
        transition: all 0.45s ease-in-out;
    }

    .card img {
        width: 92%;
        height: 92%;
        /* transition: all 0.25s ease-in-out; */
    }

    .card:hover {
        box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.6);
    }

    .card .selected-cover {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        top: 0;
        left: 0;
    }

    .card .buy-cover {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        top: 0;
        left: 0;
    }

    .card .cold-cover {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        bottom: 100%;
    }

    @keyframes coldAnimation {
        0% {
            bottom: 0;
        }

        50% {
            bottom: 50%;
        }

        100% {
            bottom: 100%;
        }

    }

    .up-slots {
        position: absolute;
        top: 45px;
        left: 50%;
        transform: translateX(-50%);
        width: 990px;
        height: 140px;
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        background: brown;
        border: 8px solid rgb(211, 12, 12);
        border-radius: 15px;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.75);
        z-index: 50;
    }

    .preview-slots {
        position: absolute;
        top: 230px;
        left: 50%;
        transform: translateX(-50%);
        width: 880px;
        height: calc(100vh - 350px);

        z-index: 50;
        border: 10px solid brown;
        border-radius: 15px;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.75);
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .preview-slots .preview-slots2 {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
    }

    .preview-slots .preview-slots2::-webkit-scrollbar {
        width: 0;
    }

    .preview-slots .preview-slots2::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }

    @font-face {
        font-family: 'start-game-button';
        src: url('/public/fonts/GameButton.ttf');
    }

    #start-game-button {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        cursor: pointer;
        transition: text-shadow 0.3s ease;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        width: 300px;
        height: 70px;
        background-color: rgb(194, 43, 43);
        border: solid 5px rgb(156, 41, 41);
        border-radius: 6px;
        z-index: 9999;

    }

    #start-game-button span {
        font-family: 'start-game-button';
    }

    #start-game-button:hover {
        text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #4CAF50;
    }

    #start-game-button:active {
        transform: translate(-50%, 2px) translateX(2px);
    }
</style>
<!-- /*
* File: CollectableSlots.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <div class="collectable-container">
        <div class="sunslot-container">
            <img src="/images/阳光卡槽图片.png" alt="">
            <div class="temp">
                <div id="number-container">{{ sunNumber['myValue'] }}</div>
            </div>
        </div>
        <div class="moneyslot-container1">
            <div class="moneyslot-container2">
                <img src="/images/金币卡槽图片.png" alt="">
                <span> ￥{{ gameState.money }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        gameAccountState,
        sunNumber,
    } from "@/scripts/Game.js";

    export default {
        data() {
            return {
                sunNumber: sunNumber,
                gameState: gameAccountState,
            }
        },

    }
</script>

<style>
    @font-face {
        font-family: 'MyNumber';
        src: url('/public/fonts/Number.ttf');
    }

    .collectable-container {
        width: 100vw;
        height: 100vh;
        position: relative;

    }

    .collectable-container .sunslot-container {
        position: absolute;
        top: 50px;
        left: 50px;
        width: 100px;
        height: 130px;
        background: brown;
        border: 8px solid rgb(211, 12, 12);
        border-radius: 15px;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.75);
        padding: 5px;
    }

    .collectable-container .sunslot-container img {
        margin: 0;
        padding: 0;
        height: 100px;
        width: 100px;
        /* border: 1px solid red; */
    }

    .collectable-container .sunslot-container .temp {
        margin: 0;
        padding: 0;
        width: 100px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .collectable-container .sunslot-container .temp #number-container {
        margin: 0;
        width: 100px;
        height: auto;
        background-image: linear-gradient(0deg, rgb(238, 241, 185), rgb(219, 213, 147));
        text-align: center;
        color: black;
        font-size: 25px;

        position: relative;
        top: -4px;
        font-family: 'MyNumber';
    }

    .collectable-container .moneyslot-container1 {
        position: absolute;
        bottom: 20px;
        left: 8%;
        width: 140px;
        height: 35px;
        border: none;
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.75);
    }

    .collectable-container .moneyslot-container1 .moneyslot-container2 {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .collectable-container .moneyslot-container2 img {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .collectable-container .moneyslot-container2 span {
        position: absolute;
        width: auto;
        height: auto;
        top: 50%;
        transform: translateY(-50%);
        left: 50px;
        font-size: 18px;
        color: rgb(180, 255, 90);
        font-family: 'MyNumber';
    }
    
</style>
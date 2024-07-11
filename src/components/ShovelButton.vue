<!-- /*
* File: ShovelButton.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <button class="shovel" @click="onShovelClick">
        <img src="/images/shovel.png" alt="">
    </button>
    <button class="exitGame" @click="onExitGameClick">
        <div>
            <img src="/images/退出游戏按钮.png" alt="">
            <span>退出游戏</span>
        </div>
    </button>
</template>

<script>
    import {
        pickUpShovel,
        endGame1
    } from '@/scripts/Game.js';

    export default {
        methods: {

            onShovelClick() {
                pickUpShovel();
            },

            onExitGameClick() {
                endGame1();
            },

        }
    }
</script>

<style>
    @font-face {
        font-family: 'exitButtonFont';
        src: url('/public/fonts/fzcq.ttf');
    }

    .exitGame {
        position: absolute;
        width: 100px;
        height: 30px;
        top: 15px;
        right: 20px;
        border: none;
        padding: 0;
        margin: 0;
        z-index: 50;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .exitGame div {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .exitGame img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        /* transition: transform 0.4s ease-in-out; */
    }

    .exitGame span {
        position: absolute;
        width: 100%;
        /* height: 100%; */
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        font-size: 14px;
        color: rgb(0, 194, 0);
        transition: color 0.2s ease-in-out;
        font-family: 'exitButtonFont';
    }

    .exitGame span:hover {
        color: rgb(0, 231, 0);
    }

    .shovel {
        position: absolute;
        width: 120px;
        height: 120px;
        top: 50px;
        right: 50px;
        background-color: transparent;
        border: 15px solid brown;
        padding: 0;
        margin: 0;
        overflow: hidden;
        z-index: 50;
    }

    .shovel img {
        width: 100%;
        height: 100%;
        transition: transform 0.25s ease-in-out;
    }

    .shovel img:hover {
        transform: scale(1.1);
    }
</style>
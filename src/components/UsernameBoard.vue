<template>
    <div class="usr-name-container2 noselect">
        <div class="canvas">
            <div class="tracker tr-1"></div>
            <div class="tracker tr-2"></div>
            <div class="tracker tr-3"></div>
            <div class="tracker tr-4"></div>
            <div class="tracker tr-5"></div>
            <div class="tracker tr-6"></div>
            <div class="tracker tr-7"></div>
            <div class="tracker tr-8"></div>
            <div class="tracker tr-9"></div>
            <div class="tracker tr-10"></div>
            <div class="tracker tr-11"></div>
            <div class="tracker tr-12"></div>
            <div class="tracker tr-13"></div>
            <div class="tracker tr-14"></div>
            <div class="tracker tr-15"></div>
            <div class="tracker tr-16"></div>
            <div class="tracker tr-17"></div>
            <div class="tracker tr-18"></div>
            <div class="tracker tr-19"></div>
            <div class="tracker tr-20"></div>
            <div class="tracker tr-21"></div>
            <div class="tracker tr-22"></div>
            <div class="tracker tr-23"></div>
            <div class="tracker tr-24"></div>
            <div class="tracker tr-25"></div>
            <div id="card">
                <p id="prompt">Move here</p>
                <div class="title">Welcome back, <br> {{ gameAccountState.user_name }}</div>
                <div class="subtitle">
                    3D 
                    <br>
                    Plants
                    <br>
                    Vs
                    <br>
                    Zombies
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        gameAccountState
    } from '@/scripts/Game';

    export default {
        data() {
            return {
                gameAccountState: gameAccountState,
            }
        }
    }
</script>

<style>
    @font-face {
        font-family: "UserNameFont";
        src: url(/public/fonts/UserName.ttf);
    }

    .usr-name-container2 {
        position: relative;
        width: 190px;
        height: 254px;
        transition: 200ms;
    }

    .usr-name-container2:active {
        width: 180px;
        height: 245px;
    }

    .usr-name-container2 #card {
        position: absolute;
        inset: 0;
        z-index: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        transition: 700ms;
        background: linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%);
    }

    .usr-name-container2 .subtitle {
        transform: translateY(160px);
        color: rgb(134, 110, 221);
        text-align: center;
        width: 100%;
        font-family: 'UserNameFont';
        font-size: 27px;
        padding-top: 90px;
    }

    .usr-name-container2 .title {
        opacity: 0;
        transition-duration: 300ms;
        transition-timing-function: ease-in-out-out;
        transition-delay: 100ms;
        position: absolute;
        font-size: x-large;
        font-weight: bold;
        color: white;
    }

    .usr-name-container2 .tracker:hover~#card .title {
        opacity: 1;
    }

    .usr-name-container2 #prompt {
        bottom: 8px;
        left: 12px;
        z-index: 20;
        font-size: 20px;
        font-weight: bold;
        transition: 300ms ease-in-out-out;
        position: absolute;
        max-width: 110px;
        color: rgb(255, 255, 255);
        font-family: 'UserNameFont';
    }

    .usr-name-container2 .tracker {
        position: absolute;
        z-index: 200;
        width: 100%;
        height: 100%;
    }

    .usr-name-container2 .tracker:hover {
        cursor: pointer;
    }

    .usr-name-container2 .tracker:hover~#card #prompt {
        opacity: 0;
    }

    .usr-name-container2 .tracker:hover~#card {
        transition: 300ms;
        filter: brightness(1.1);
    }

    .usr-name-container2:hover #card::before {
        transition: 200ms;
        content: '';
        opacity: 80%;
    }

    .usr-name-container2 .canvas {
        perspective: 800px;
        inset: 0;
        z-index: 200;
        position: absolute;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
        gap: 0px 0px;
        grid-template-areas: "tr-1 tr-2 tr-3 tr-4 tr-5"
            "tr-6 tr-7 tr-8 tr-9 tr-10"
            "tr-11 tr-12 tr-13 tr-14 tr-15"
            "tr-16 tr-17 tr-18 tr-19 tr-20"
            "tr-21 tr-22 tr-23 tr-24 tr-25";
    }

    .usr-name-container2 #card::before {
        content: '';
        background: linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%);
        filter: blur(2rem);
        opacity: 30%;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        transition: 200ms;
    }

    .usr-name-container2 .tr-1 {
        grid-area: tr-1;
    }

    .usr-name-container2 .tr-2 {
        grid-area: tr-2;
    }

    .usr-name-container2 .tr-3 {
        grid-area: tr-3;
    }

    .usr-name-container2 .tr-4 {
        grid-area: tr-4;
    }

    .usr-name-container2 .tr-5 {
        grid-area: tr-5;
    }

    .usr-name-container2 .tr-6 {
        grid-area: tr-6;
    }

    .usr-name-container2 .tr-7 {
        grid-area: tr-7;
    }

    .usr-name-container2 .tr-8 {
        grid-area: tr-8;
    }

    .usr-name-container2 .tr-9 {
        grid-area: tr-9;
    }

    .usr-name-container2 .tr-10 {
        grid-area: tr-10;
    }

    .usr-name-container2 .tr-11 {
        grid-area: tr-11;
    }

    .usr-name-container2 .tr-12 {
        grid-area: tr-12;
    }

    .usr-name-container2 .tr-13 {
        grid-area: tr-13;
    }

    .usr-name-container2 .tr-14 {
        grid-area: tr-14;
    }

    .usr-name-container2 .tr-15 {
        grid-area: tr-15;
    }

    .usr-name-container2 .tr-16 {
        grid-area: tr-16;
    }

    .usr-name-container2 .tr-17 {
        grid-area: tr-17;
    }

    .usr-name-container2 .tr-18 {
        grid-area: tr-18;
    }

    .usr-name-container2 .tr-19 {
        grid-area: tr-19;
    }

    .usr-name-container2 .tr-20 {
        grid-area: tr-20;
    }

    .usr-name-container2 .tr-21 {
        grid-area: tr-21;
    }

    .usr-name-container2 .tr-22 {
        grid-area: tr-22;
    }

    .usr-name-container2 .tr-23 {
        grid-area: tr-23;
    }

    .usr-name-container2 .tr-24 {
        grid-area: tr-24;
    }

    .usr-name-container2 .tr-25 {
        grid-area: tr-25;
    }

    .usr-name-container2 .tr-1:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-2:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(20deg) rotateY(-5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-3:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-4:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(20deg) rotateY(5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-5:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(20deg) rotateY(10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-6:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(10deg) rotateY(-10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-7:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(10deg) rotateY(-5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-8:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-9:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(10deg) rotateY(5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-10:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(10deg) rotateY(10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-11:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-12:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(0deg) rotateY(-5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-13:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-14:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(0deg) rotateY(5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-15:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(0deg) rotateY(10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-16:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-10deg) rotateY(-10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-17:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-10deg) rotateY(-5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-18:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-19:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-10deg) rotateY(5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-20:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-10deg) rotateY(10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-21:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-20deg) rotateY(-10deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-22:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-20deg) rotateY(-5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-23:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-24:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-20deg) rotateY(5deg) rotateZ(0deg);
    }

    .usr-name-container2 .tr-25:hover~#card {
        transition: 125ms ease-in-out;
        transform: rotateX(-20deg) rotateY(10deg) rotateZ(0deg);
    }

    .usr-name-container2 .noselect {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
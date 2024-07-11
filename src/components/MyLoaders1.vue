<!-- /*
* File: MyLoaders1.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <div class="loaders-container2">

        <div class="loader-page1">
            <div class="loader1">
                <div id="loader"></div>
                <div class="loader-section section-left"></div>
                <div class="loader-section section-right"></div>
                <div class="load_title">正在加载用户数据,请耐心等待...</div>
            </div>

            <div class="loader2">
                <div class="loading"></div>
                <p>loading...</p>
            </div>
        </div>

        <div class="loader-page2">
            <div class="loader3">
                <div class="hint">
                    正在加载游戏界面，请稍等
                </div>
                <div class="circle">
                    <div class="dot"></div>
                    <div class="outline"></div>
                </div>
                <div class="circle">
                    <div class="dot"></div>
                    <div class="outline"></div>
                </div>
                <div class="circle">
                    <div class="dot"></div>
                    <div class="outline"></div>
                </div>
                <div class="circle">
                    <div class="dot"></div>
                    <div class="outline"></div>
                </div>
            </div>

            <div class="loader4">
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
                    <div class="wheel"></div>
                    <div class="hamster">
                        <div class="hamster__body">
                            <div class="hamster__head">
                                <div class="hamster__ear"></div>
                                <div class="hamster__eye"></div>
                                <div class="hamster__nose"></div>
                            </div>
                            <div class="hamster__limb hamster__limb--fr"></div>
                            <div class="hamster__limb hamster__limb--fl"></div>
                            <div class="hamster__limb hamster__limb--br"></div>
                            <div class="hamster__limb hamster__limb--bl"></div>
                            <div class="hamster__tail"></div>
                        </div>
                    </div>
                    <div class="spoke"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        initGame,
        loaderApps,
    } from '@/scripts/Game';

    export default {
        data() {
            return {
                keyframes: [],
                animationDuration: 8
            }
        },

        mounted() {
            // 生成 5 个随机的百分比值
            for (let i = 0; i < 25; i++) {
                this.keyframes.push(Math.floor(Math.random() * 100));
            }
            this.keyframes.sort((a, b) => a - b);
            // 确保最后一个百分比值是 100
            this.keyframes[this.keyframes.length - 1] = 100;

            // 生成 CSS @keyframes 规则
            let keyframesRule = '@keyframes load {';
            for (let i = 0; i < this.keyframes.length; i++) {
                keyframesRule += `${(i / (this.keyframes.length - 1)) * 100}% { width: ${this.keyframes[i]}%; }`;
            }
            keyframesRule += '}';

            // 将 @keyframes 规则添加到页面的样式中
            const styleElement = document.createElement('style');
            styleElement.textContent = keyframesRule;
            document.head.append(styleElement);

            setTimeout(() => {
                this.$el.querySelector('.loader-page1').style.display = 'none';
                this.$el.querySelector('.loader-page2').style.display = 'block';
                setTimeout(() => {
                    this.$el.querySelector('.loader-page2').style.display = 'none';
                    loaderApps.app1.unmount();
                    const loadersContainer = document.getElementById('loaders-container');
                    loadersContainer.style.display = 'none';

                    const gameContainer = document.getElementById('game-container');
                    gameContainer.style.display = 'block';
                    initGame();
                }, 4 * 1000);
            }, (this.animationDuration + 0.25) * 1000);
        }
    }
</script>

<style>
    .loaders-container2 {
        position: relative;
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        z-index: 1000;
    }

    .loader-page1,
    .loader-page2 {
        position: absolute;
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        top: 0;
        left: 0;
    }

    .loader-page1 {
        display: block;
    }

    .loader-page2 {
        display: none;
    }

    /* loader1 start */

    .chromeframe {
        margin: 0.2em 0;
        background: #ccc;
        color: #000;
        padding: 0.2em 0;
    }

    .loader1 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }

    #loader {
        display: block;
        position: relative;
        left: 50%;
        top: 50%;
        width: 150px;
        height: 150px;
        margin: -75px 0 0 -75px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #FFF;
        -webkit-animation: spin 2s linear infinite;
        -ms-animation: spin 2s linear infinite;
        -moz-animation: spin 2s linear infinite;
        -o-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
        z-index: 1001;
    }

    #loader:before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #FFF;
        -webkit-animation: spin 3s linear infinite;
        -moz-animation: spin 3s linear infinite;
        -o-animation: spin 3s linear infinite;
        -ms-animation: spin 3s linear infinite;
        animation: spin 3s linear infinite;
    }

    #loader:after {
        content: "";
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #FFF;
        -moz-animation: spin 1.5s linear infinite;
        -o-animation: spin 1.5s linear infinite;
        -ms-animation: spin 1.5s linear infinite;
        -webkit-animation: spin 1.5s linear infinite;
        animation: spin 1.5s linear infinite;
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    .loader1 .loader-section {
        position: fixed;
        top: 0;
        width: 51%;
        height: 100%;
        background: #494a5f;
        z-index: 1000;
        -webkit-transform: translateX(0);
        -ms-transform: translateX(0);
        transform: translateX(0);
    }

    .loader1 .loader-section.section-left {
        left: 0;
    }

    .loader1 .loader-section.section-right {
        right: 0;
    }

    .loaded .loader1 .loader-section.section-left {
        -webkit-transform: translateX(-100%);
        -ms-transform: translateX(-100%);
        transform: translateX(-100%);
        -webkit-transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
        transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
    }

    .loaded .loader1 .loader-section.section-right {
        -webkit-transform: translateX(100%);
        -ms-transform: translateX(100%);
        transform: translateX(100%);
        -webkit-transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
        transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000);
    }

    .loaded #loader {
        opacity: 0;
        -webkit-transition: all 0.3s ease-out;
        transition: all 0.3s ease-out;
    }

    .loaded .loader1 {
        visibility: hidden;
        -webkit-transform: translateY(-100%);
        -ms-transform: translateY(-100%);
        transform: translateY(-100%);
        -webkit-transition: all 0.3s 1s ease-out;
        transition: all 0.3s 1s ease-out;
    }

    .no-js .loader1 {
        display: none;
    }

    .no-js h1 {
        color: #222222;
    }

    .loader1 .load_title {
        font-family: 'Open Sans';
        color: #FFF;
        font-size: 19px;
        width: 100%;
        text-align: center;
        z-index: 9999999999999;
        position: absolute;
        top: 60%;
        opacity: 1;
        line-height: 30px;
    }

    .loader1 .load_title span {
        font-weight: normal;
        font-style: italic;
        font-size: 13px;
        color: #FFF;
        opacity: 0.5;
    }

    /* loader1 end */
    /* loader2 start */

    .loader2 {
        width: 350px;
        position: fixed;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1500;
    }

    .loading {
        position: relative;
        width: 100%;
        height: 10px;
        border: 1px solid #69e2d7;
        border-radius: 10px;
    }

    .loading:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background-color: #69e2d7;
        box-shadow: 10px 0 15px 0 #69e2d7;
        animation: load 8s linear 1 forwards;
        border-radius: 10px;

    }

    @keyframes load {
        0% {
            width: 0%;
        }

        100% {
            width: 100%;
        }
    }

    p {
        color: #69e2d7;
        font-size: 20px;
        text-align: center;
        margin: 0;
        line-height: 50px;
    }

    /* loader2 end */
    /* loader3 start */

    .loader3 {
        display: flex;
        justify-content: center;
        align-items: center;
        --color: hsl(0, 3%, 27%);
        --animation: 2s ease-in-out infinite;
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .loader3 .circle {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 20px;
        height: 20px;
        border: solid 2px var(--color);
        border-radius: 50%;
        margin: 0 10px;
        background-color: transparent;
        animation: circle-keys var(--animation);
    }

    .loader3 .circle .dot {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--color);
        animation: dot-keys var(--animation);
    }

    .loader3 .circle .outline {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        animation: outline-keys var(--animation);
    }

    .circle:nth-child(1) {
        animation-delay: -1.5s;
    }

    .circle:nth-child(2) {
        animation-delay: -1.2s;
    }

    .circle:nth-child(3) {
        animation-delay: -0.9s;
    }

    .circle:nth-child(4) {
        animation-delay: -0.6s;
    }

    .circle:nth-child(1) .dot {
        animation-delay: -1.5s;
    }

    .circle:nth-child(2) .dot {
        animation-delay: -1.2s;
    }

    .circle:nth-child(3) .dot {
        animation-delay: -0.9s;
    }

    .circle:nth-child(4) .dot {
        animation-delay: -0.6s;
    }

    .circle:nth-child(1) .outline {
        animation-delay: -1.5s;
    }

    .circle:nth-child(2) .outline {
        animation-delay: -1.2s;
    }

    .circle:nth-child(3) .outline {
        animation-delay: -0.9s;
    }

    .circle:nth-child(4) .outline {
        animation-delay: -0.6s;
    }

    @keyframes circle-keys {
        0% {
            transform: scale(1);
            opacity: 1;
        }

        50% {
            transform: scale(1.5);
            opacity: 0.5;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes dot-keys {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(0);
        }

        100% {
            transform: scale(1);
        }
    }

    @keyframes outline-keys {
        0% {
            transform: scale(0);
            outline: solid 20px var(--color);
            outline-offset: 0;
            opacity: 1;
        }

        100% {
            transform: scale(1);
            outline: solid 0 transparent;
            outline-offset: 20px;
            opacity: 0;
        }
    }

    /* loader3 end */
    /* loader4 start */

    .loader4 {
        position: absolute;
        width: auto;
        height: auto;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .wheel-and-hamster {
        --dur: 1s;
        position: relative;
        width: 12em;
        height: 12em;
        font-size: 14px;
    }

    .wheel,
    .hamster,
    .hamster div,
    .spoke {
        position: absolute;
    }

    .wheel,
    .spoke {
        border-radius: 50%;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .wheel {
        background: radial-gradient(100% 100% at center, hsla(0, 0%, 60%, 0) 47.8%, hsl(0, 0%, 60%) 48%);
        z-index: 2;
    }

    .hamster {
        animation: hamster var(--dur) ease-in-out infinite;
        top: 50%;
        left: calc(50% - 3.5em);
        width: 7em;
        height: 3.75em;
        transform: rotate(4deg) translate(-0.8em, 1.85em);
        transform-origin: 50% 0;
        z-index: 1;
    }

    .hamster__head {
        animation: hamsterHead var(--dur) ease-in-out infinite;
        background: hsl(30, 90%, 55%);
        border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
        box-shadow: 0 -0.25em 0 hsl(30, 90%, 80%) inset,
            0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
        top: 0;
        left: -2em;
        width: 2.75em;
        height: 2.5em;
        transform-origin: 100% 50%;
    }

    .hamster__ear {
        animation: hamsterEar var(--dur) ease-in-out infinite;
        background: hsl(0, 90%, 85%);
        border-radius: 50%;
        box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
        top: -0.25em;
        right: -0.25em;
        width: 0.75em;
        height: 0.75em;
        transform-origin: 50% 75%;
    }

    .hamster__eye {
        animation: hamsterEye var(--dur) linear infinite;
        background-color: hsl(0, 0%, 0%);
        border-radius: 50%;
        top: 0.375em;
        left: 1.25em;
        width: 0.5em;
        height: 0.5em;
    }

    .hamster__nose {
        background: hsl(0, 90%, 75%);
        border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
        top: 0.75em;
        left: 0;
        width: 0.2em;
        height: 0.25em;
    }

    .hamster__body {
        animation: hamsterBody var(--dur) ease-in-out infinite;
        background: hsl(30, 90%, 90%);
        border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
        box-shadow: 0.1em 0.75em 0 hsl(30, 90%, 55%) inset,
            0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
        top: 0.25em;
        left: 2em;
        width: 4.5em;
        height: 3em;
        transform-origin: 17% 50%;
        transform-style: preserve-3d;
    }

    .hamster__limb--fr,
    .hamster__limb--fl {
        clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
        top: 2em;
        left: 0.5em;
        width: 1em;
        height: 1.5em;
        transform-origin: 50% 0;
    }

    .hamster__limb--fr {
        animation: hamsterFRLimb var(--dur) linear infinite;
        background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
        transform: rotate(15deg) translateZ(-1px);
    }

    .hamster__limb--fl {
        animation: hamsterFLLimb var(--dur) linear infinite;
        background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
        transform: rotate(15deg);
    }

    .hamster__limb--br,
    .hamster__limb--bl {
        border-radius: 0.75em 0.75em 0 0;
        clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
        top: 1em;
        left: 2.8em;
        width: 1.5em;
        height: 2.5em;
        transform-origin: 50% 30%;
    }

    .hamster__limb--br {
        animation: hamsterBRLimb var(--dur) linear infinite;
        background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
        transform: rotate(-25deg) translateZ(-1px);
    }

    .hamster__limb--bl {
        animation: hamsterBLLimb var(--dur) linear infinite;
        background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
        transform: rotate(-25deg);
    }

    .hamster__tail {
        animation: hamsterTail var(--dur) linear infinite;
        background: hsl(0, 90%, 85%);
        border-radius: 0.25em 50% 50% 0.25em;
        box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
        top: 1.5em;
        right: -0.5em;
        width: 1em;
        height: 0.5em;
        transform: rotate(30deg) translateZ(-1px);
        transform-origin: 0.25em 0.25em;
    }

    .spoke {
        animation: spoke var(--dur) linear infinite;
        background: radial-gradient(100% 100% at center, hsl(0, 0%, 60%) 4.8%, hsla(0, 0%, 60%, 0) 5%),
            linear-gradient(hsla(0, 0%, 55%, 0) 46.9%, hsl(0, 0%, 65%) 47% 52.9%, hsla(0, 0%, 65%, 0) 53%) 50% 50% / 99% 99% no-repeat;
    }

    /* Animations */
    @keyframes hamster {

        from,
        to {
            transform: rotate(4deg) translate(-0.8em, 1.85em);
        }

        50% {
            transform: rotate(0) translate(-0.8em, 1.85em);
        }
    }

    @keyframes hamsterHead {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(0);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(8deg);
        }
    }

    @keyframes hamsterEye {

        from,
        90%,
        to {
            transform: scaleY(1);
        }

        95% {
            transform: scaleY(0);
        }
    }

    @keyframes hamsterEar {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(0);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(12deg);
        }
    }

    @keyframes hamsterBody {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(0);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(-2deg);
        }
    }

    @keyframes hamsterFRLimb {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(50deg) translateZ(-1px);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(-30deg) translateZ(-1px);
        }
    }

    @keyframes hamsterFLLimb {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(-30deg);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(50deg);
        }
    }

    @keyframes hamsterBRLimb {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(-60deg) translateZ(-1px);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(20deg) translateZ(-1px);
        }
    }

    @keyframes hamsterBLLimb {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(20deg);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(-60deg);
        }
    }

    @keyframes hamsterTail {

        from,
        25%,
        50%,
        75%,
        to {
            transform: rotate(30deg) translateZ(-1px);
        }

        12.5%,
        37.5%,
        62.5%,
        87.5% {
            transform: rotate(10deg) translateZ(-1px);
        }
    }

    @keyframes spoke {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(-1turn);
        }
    }

    /* loader4 end */
</style>
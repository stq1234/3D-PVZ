<!-- /*
* File: App.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <div id="app-container">
        <MyDialog></MyDialog>
        <div id="login-container">
            <LogIn></LogIn>
        </div>
        <div id="game-container">
            <MyCanvas></MyCanvas>
            <div id="cardslots-root"></div>
            <div id="shovelbutton-root"></div>
            <div id="sunslot-root"></div>
        </div>
        <div id="loaders-container">
            <!-- <MyLoaders></MyLoaders> -->
        </div>
        <div id="username-container1">
            <UsernameBoard></UsernameBoard>
        </div>
    </div>
</template>

<script>
    import LogIn from './components/SignIn.vue';
    import MyCanvas from './components/MyCanvas.vue';
    // import CardSlots from './components/CardSlots.vue';
    // import ShovelButton from './components/ShovelButton.vue';
    // import SunSlot from './components/SunSlot.vue';
    import MyDialog from './components/MyDialog.vue';
    import UsernameBoard from './components/UsernameBoard.vue';

    export default {
        components: {
            LogIn,
            MyCanvas,
            // CardSlots,
            // ShovelButton,
            // SunSlot,
            MyDialog,
            UsernameBoard,
        }
    }
</script>

<style>

    #app-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
    }

    #game-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: none;
    }

    #cardslots-root {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    #shovelbutton-root {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    #sunslot-root {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    #login-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
    }

    #loaders-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: none;
    }

    #username-container1 {
        width: auto;
        height: auto;
        position: fixed;
        left: 30px;
        top: 30px;
        display: none;
        z-index: 100;
    }
</style>
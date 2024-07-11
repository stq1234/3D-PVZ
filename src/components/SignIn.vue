<!-- /*
* File: SignIn.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <div class="login-container1">
        <div class="login-container2" :class="{ 'right-panel-active': right_active }">
            <!-- Sign Up -->
            <div class="container__form container--signup">
                <form action="#" class="form" id="form1" @submit.prevent="validateSignup" autocomplete="off">
                    <h2 class="form__title">注册</h2>
                    <div class="account-container">
                        <div class="input">账号：{{ account_signup }}(自动分配)</div>
                        <div class="input">
                            <img src="../../public/images/刷新账号按钮图片.jpg" alt="" @click="flushAccount"
                                title="不喜欢此账号？点击更换一个">
                        </div>
                    </div>
                    <input type="text" placeholder="昵称" class="input" v-model="user_name" autocomplete="off">
                    <input type="password" placeholder="密码" class="input" v-model="password_signup_1"
                        autocomplete="off">
                    <input type="password" placeholder="确认密码" class="input" v-model="password_signup_2"
                        autocomplete="off">
                    <button type="submit" class="btn">注册</button>
                </form>
            </div>

            <!-- Sign In -->
            <div class="container__form container--signin">
                <form action="#" class="form" id="form2" @submit.prevent="validateSignin">
                    <h2 class="form__title">登录</h2>
                    <input type="text" v-model="account_signin" placeholder="账号" class="input">
                    <input type="password" v-model="password_signin" placeholder="密码" class="input">
                    <!-- <a href="#" class="link">忘记密码？</a> -->
                    <button type="submit" class="btn">登录</button>
                </form>
            </div>

            <!-- Overlay -->
            <div class="container__overlay">
                <div class="overlay">
                    <div class="overlay__panel overlay--left">
                        <button class="btn" id="signIn" @click="signinButtonClicked">登录</button>
                    </div>
                    <div class="overlay__panel overlay--right">
                        <button class="btn" id="signUp" @click="signupButtonClicked">注册</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="exit-button" @click="closeDialogAndChangePage" v-if="exitButtonSignInShow"></div>
        <div class="exit-cover" @click="closeDialogAndChangePage" v-if="exitButtonSignInShow"></div>
        <div class="exit-button" @click="closeDialogAndTurnToSignIn" v-if="exitButtonSignUpShow"></div>
        <div class="exit-cover" @click="closeDialogAndTurnToSignIn" v-if="exitButtonSignUpShow"></div>
        <div class="calculator-button" @click="openCalculator">
            <img src="/images/计算器图标.jpg" alt="">
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {
        PORT,
        gameAccountState,
        loaderApps,
        // initGame,
    } from '@/scripts/Game.js';

    import {
        hideDialog,
        showDialog
    } from '@/scripts/DialogOperator.js';

    import MyLoaders1 from './MyLoaders1.vue';

    import {
        createApp
    } from 'vue';

    // import {
    //     Sound
    // } from '@/scripts/SoundOperator.js';
    export default {
        data() {
            return {
                user_name: '',
                account_signup: '',
                password_signup_1: '',
                password_signup_2: '',
                account_signin: '',
                password_signin: '',
                counterID: 0, // for setInterval
                right_active: false,
                exitButtonSignInShow: false,
                exitButtonSignUpShow: false,
                port: PORT,
                failPortNumber: 0,
            }
        },

        mounted() {
            this.initPort();
            // let temp = [];
            // for(let i=0;i<100;i++){
            //     temp.push(new Sound('./sound/豌豆打普僵.ogg', false));
            // }
            // setTimeout(() => {
            //     console.log('play');
            //     temp.forEach(sound => {
            //         sound.play();
            //     });
            // }, 3000);
        },

        beforeUnmount() {
            window.removeEventListener('keydown', this.enterHandler);
        },

        methods: {

            openCalculator() {
                window.open('./计算器/index.html', '_blank');
            },

            initPort() {
                this.port.isInitializing = true;
                for (let i = 3000; i < 3000 + 200; i++) {
                    axios.get(`http://localhost:${i}/getPort`)
                        .then(response => {
                            if (response.status === 200) {
                                console.log(`Server is running on port ${i}`);
                                this.port.myValue = i;
                                this.getValidAccount();
                                this.port.isInitialized = true;
                                this.port.isInitializing = false;
                                this.port.isFailed = false;
                                window.addEventListener('keydown', this.enterHandler);

                                return;
                            }
                        })
                        .catch(() => {
                            this.failPortNumber++;
                            console.clear();
                            if (this.failPortNumber === 200) {
                                this.port.isInitializing = false;
                                this.port.isInitialized = false;
                                this.port.isFailed = true;
                                showDialog('未检测到服务器，请您确保服务器已启动。启动后请按F5刷新页面。');
                            }

                            // if (this.failPortNumber === 199 && this.port.isFailed === false && this.port
                            //     .isInitialized === true) {
                            // }
                        });
                }
            },

            enterHandler(event) {
                if (event.key === 'Enter') {
                    const loginContainer = document.getElementById('login-container');
                    if (loginContainer.style.display != 'none') {
                        if (this.right_active) {
                            this.validateSignup();
                        } else {
                            this.validateSignin();
                        }
                    }
                }
            },

            getValidAccount() {
                axios.get('http://localhost:' + this.port.myValue.toString() + '/getValidAccount')
                    .then(response => {
                        this.account_signup = response.data.account;
                    }).catch(error => {
                        console.log(error);
                    });
            },

            signinButtonClicked() {
                this.right_active = false;
                // this.account_signin = '';
                // this.password_signin = '';
                this.user_name = '';
                this.password_signup_1 = '';
                this.password_signup_2 = '';
            },

            signupButtonClicked() {
                this.right_active = true;
                this.account_signin = '';
                this.password_signin = '';
                this.user_name = '';
                this.password_signup_1 = '';
                this.password_signup_2 = '';

                this.getValidAccount();
            },

            validateSignin() {
                if (this.port.isInitialized === false) {
                    showDialog('服务器正在初始化，请稍后再试');
                    if (this.port.isInitializing === true) {
                        return;
                    } else if (this.port.isFailed === true) {
                        showDialog('未检测到服务器，请您确保服务器已启动。启动后请按F5刷新页面。');
                        return;
                    } else {
                        this.initPort();
                    }
                }
                if (gameAccountState.signedIn) {
                    return;
                }
                const accountPattern = /^\d{8}$/;
                if (!accountPattern.test(this.account_signin)) {
                    showDialog('账号必须为8位数字');
                    return;
                }
                this.submitSigninRequest();
            },

            flushAccount() {
                this.getValidAccount();
            },

            async submitSigninRequest() {
                try {
                    const response = await axios.post('http://localhost:' + this.port.myValue.toString() +
                        '/signin', {
                            account: this.account_signin,
                            password: this.password_signin
                        });
                    if (response.status === 200) { // successful login
                        let responseObject = response.data;
                        let user_name = responseObject['user_name'];
                        let money = responseObject['money'];
                        gameAccountState.signedIn = true;
                        this.signIn(this.account_signin, user_name, money, 3);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) { // failed login
                        showDialog('账号或密码错误');
                    } else {
                        showDialog(
                            `请您按F5刷新页面。未知错误 ${error.response ? error.response.status : undefined}， 请联系客服2200013082@stu.pku.edu.cn`
                        );
                    }
                }
            },

            validateSignup() {
                if (this.port.isInitialized === false) {
                    showDialog('服务器正在初始化，请稍后再试');
                    if (this.port.isInitializing === true) {
                        return;
                    } else if (this.port.isFailed === true) {
                        showDialog('未检测到服务器，请您确保服务器已启动。启动后请按F5刷新页面。');
                        return;
                    } else {
                        this.initPort();
                    }
                }

                // 密码合法性检查
                const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
                if (!passwordPattern.test(this.password_signup_1)) {
                    showDialog('密码必须包含至少一个字母和一个数字，且长度至少为6位');
                    return;
                }
                if (this.password_signup_1 !== this.password_signup_2) {
                    showDialog('两次输入的密码不一致');
                    return;
                }

                if (this.user_name.length > 7) {
                    showDialog('用户名不能超过7个字符');
                    return;
                }
                
                // 提交注册请求
                this.submitSignupRequest();
            },

            async submitSignupRequest() {
                try {
                    const response = await axios.post('http://localhost:' + this.port.myValue.toString() +
                        '/signup', {
                            user_name: this.user_name,
                            account: this.account_signup,
                            password: this.password_signup_1
                        });
                    if (response.status === 200) { // successful registration
                        this.signUp(3);
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) { // duplicate account
                        showDialog('该账号已被注册');
                    } else {
                        showDialog(
                            `请您按F5刷新页面。未知错误 ${error.response ? error.response.status : undefined}， 请联系客服2200013082@stu.pku.edu.cn`
                        );
                    }
                }
            },

            signIn(_account, _user_name, _money, counter) {
                this.exitButtonSignInShow = true;
                gameAccountState.account = _account;
                gameAccountState.money = _money;
                gameAccountState.user_name = _user_name;
                if (counter > 0) {
                    showDialog(`登录成功，${counter}秒后跳转到游戏页面，关闭立即跳转`)
                    this.counterID = setTimeout(() => {
                        this.signIn(_account, _user_name, _money, counter - 1);
                    }, 1000);
                    return;
                } else {
                    this.closeDialogAndChangePage();
                }
            },

            closeDialogAndChangePage() {
                clearTimeout(this.counterID);
                hideDialog();
                console.clear();
                const loginContainer = document.getElementById('login-container');
                loginContainer.style.display = 'none';
                const loadersContainer = document.getElementById('loaders-container');
                loadersContainer.style.display = 'block';
                loaderApps.app1 = createApp(MyLoaders1);
                loaderApps.app1.mount('#loaders-container');
                this.exitButtonSignInShow = false;
                const gameContainer = document.getElementById('game-container');
                gameContainer.style.display = 'block';
                // initGame();
            },

            signUp(count) {
                this.exitButtonSignUpShow = true;
                if (count > 0) {
                    showDialog(`注册成功，${count}秒后跳转到游戏页面，关闭立即跳转`);
                    this.counterID = setTimeout(() => {
                        this.signUp(count - 1);
                    }, 1000);
                    return;
                } else {
                    this.closeDialogAndTurnToSignIn();
                }
            },

            closeDialogAndTurnToSignIn() {
                hideDialog();
                clearTimeout(this.counterID);
                this.signinButtonClicked();
                this.account_signin = this.account_signup;
                this.exitButtonSignUpShow = false;
            }
        }
    }
</script>

<style>
    .calculator-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: fixed;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        right: 40px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        z-index: 9999;
        overflow: hidden;
    }

    .calculator-button img {
        width: 100%;
        height: 100%;
    }

    @font-face {
        font-family: 'Chinese';
        src: url('/public/fonts/Chinese.ttf') format('truetype');
    }

    .login-container1 {
        align-items: center;
        background-color: var(--white);
        background: url("/public/images/loginback.jpg");
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        display: grid;
        height: 100vh;
        place-items: center;
        --white: #e9e9e9;
        --gray: #333;
        --blue: #0367a6;
        --lightblue: #008997;
        --button-radius: 11.2px;
        --max-width: 758px;
        --max-height: 420px;
        font-family: 'Chinese';
    }

    .form__title {
        font-weight: 300;
        margin: 0;
        margin-bottom: 20px;
        font-family: 'Chinese';
    }

    .link {
        color: var(--gray);
        font-size: 14.4px;
        margin: 24px 0;
        text-decoration: none;
        font-family: 'Chinese';
    }

    .login-container2 {
        background-color: var(--white);
        border-radius: var(--button-radius);
        box-shadow: 0 14.4px 27.2px rgba(0, 0, 0, 0.25),
            0 11.2px 11.2px rgba(0, 0, 0, 0.22);
        height: var(--max-height);
        max-width: var(--max-width);
        overflow: hidden;
        position: relative;
        width: 100%;
    }

    .container__form {
        height: 100%;
        position: absolute;
        top: 0;
        transition: all 0.6s ease-in-out;
    }

    .container--signin {
        left: 0;
        width: 50%;
        z-index: 2;
    }

    .container.right-panel-active .container--signin {
        transform: translateX(100%);
    }

    .container--signup {
        left: 0;
        opacity: 0;
        width: 50%;
        z-index: 1;
    }

    .login-container2.right-panel-active .container--signup {
        animation: show 0.6s;
        opacity: 1;
        transform: translateX(100%);
        z-index: 5;
    }

    .container__overlay {
        height: 100%;
        left: 50%;
        overflow: hidden;
        position: absolute;
        top: 0;
        transition: transform 0.6s ease-in-out;
        width: 50%;
        z-index: 100;
    }

    .login-container2.right-panel-active .container__overlay {
        transform: translateX(-100%);
    }

    .overlay {
        background-color: var(--lightblue);
        background: url("/public/images/loginback.jpg");
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        left: -100%;
        position: relative;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
        width: 200%;
    }

    .login-container2.right-panel-active .overlay {
        transform: translateX(50%);
    }

    .overlay__panel {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        position: absolute;
        text-align: center;
        top: 0;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
        width: 50%;
    }

    .overlay--left {
        transform: translateX(-20%);
    }

    .login-container2.right-panel-active .overlay--left {
        transform: translateX(0);
    }

    .overlay--right {
        right: 0;
        transform: translateX(0);
    }

    .login-container2.right-panel-active .overlay--right {
        transform: translateX(20%);
    }

    .btn {
        background-color: var(--blue);
        background-image: linear-gradient(90deg, var(--blue) 0%, var(--lightblue) 74%);
        border-radius: 20px;
        border: 1px solid var(--blue);
        color: var(--white);
        cursor: pointer;
        font-size: 19.2px;
        font-weight: bold;
        letter-spacing: 1.6px;
        padding: 14.4px 64px;
        text-transform: uppercase;
        transition: transform 80ms ease-in;
        font-family: 'Chinese';
    }

    .form>.btn {
        margin-top: 24px;
    }

    .btn:active {
        transform: scale(0.95);
    }

    .btn:focus {
        outline: none;
    }

    .form {
        background-color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 48px;
        height: 100%;
        text-align: center;
    }

    .input {
        background-color: #fff;
        border: none;
        padding: 14.4px 14.4px;
        margin: 8px 0;
        width: 100%;
        font-family: 'Chinese';
    }

    @keyframes show {

        0%,
        49.99% {
            opacity: 0;
            z-index: 1;
        }

        50%,
        100% {
            opacity: 1;
            z-index: 5;
        }
    }

    .login-container1 .exit-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: fixed;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 74%;
        top: 38%;
        cursor: pointer;
        z-index: 9999;
    }

    .login-container1 .exit-cover {
        background: transparent;
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 250;
    }

    .login-container2 .account-container {
        display: flex;
        width: calc(100% + 28.8px);
        /* padding: 14.4px 14.4px; */
        margin: 8px 0;
        align-items: center;
        justify-content: center;
    }

    .login-container2 div.input {
        margin: 0;
    }

    .login-container2 div.input:nth-of-type(1) {
        flex: 1 1 auto;
    }

    .login-container2 div.input:nth-of-type(2) {
        width: 44.8px;
        height: 44.8px;
        flex: 0 0 auto;
        margin-left: 10px;
        overflow: hidden;
        padding: 0;
    }

    .login-container2 div.input img {
        width: 100%;
        height: 100%;
        transition: all 0.4s ease-in-out;
    }

    .login-container2 div.input img:hover {
        transform: scale(1.2);
    }
</style>
<!-- /*
* File: MyDialog.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <div class="dialog">
        <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
        <div class="dialog-cover back" v-if="myState['show']" @click="closeDialog"></div>
        <!-- transition 这里可以加一些简单的动画效果 -->
        <transition name="drop">
            <!--style 通过props 控制内容的样式  -->
            <div class="dialog-content" :style="{top:topDistance+'%',width:widNum+'%',left:leftSite+'%'}"
                v-if="myState['show']">
                <div class="dialog_head back ">
                    <!--弹窗头部 title-->
                    <slot name="header">提示</slot>
                </div>
                <div class="dialog_main " :style="{paddingTop:pdt+'px',paddingBottom:pdb+'px'}">
                    <!--弹窗的内容-->
                    <slot name="main">{{ myState['message'] }}</slot>
                </div>
                <!--弹窗关闭按钮-->
                <div class="foot_close " @click="closeDialog"></div>
            </div>
        </transition>
        <div class="hint-text" v-if="myState['show']">点击空白处或按钮关闭弹窗</div>
    </div>
</template>

<script>
    import {
        dialogState,
        hideDialog
    } from "@/scripts/DialogOperator.js";
    export default {
        data() {
            return {
                myState: dialogState,
                widNum: 86.5,
                leftSite: 6.5,
                topDistance: 35,
                pdt: 22,
                pdb: 47
            };
        },
        methods: {
            closeDialog() {
                hideDialog();
            }
        }
    };
</script>
<style>
    .hint-text {
        color: #fff;
        font-size: 16px;
        margin-top: 10px;
        border-bottom: 1px solid #fff;
        /* 添加下划线 */
        padding-bottom: 3.5px;
        /* 控制下划线离文字的距离 */
        z-index: 200;
        position: absolute;
        left: 50%;
        top: 55%;
        transform: translate(-50%, -50%);
        height: 20px;
    }

    /* 弹窗动画 */
    .drop-enter-active {
        /* 动画进入过程：0.5s */
        transition: all 0.5s ease;
    }

    .drop-leave-active {
        /* 动画离开过程：0.5s */
        transition: all 0.3s ease;
    }

    .drop-enter {
        /*动画之前的位置 */
        transform: translateY(-500px);
    }

    .drop-leave-active {
        /*动画之后的位置 */
        transform: translateY(-500px);
    }

    /* 最外层 设置position定位 */
    .dialog {
        position: relative;
        color: #2e2c2d;
        font-size: 16px;
        width: 100%;
        height: 100%;
    }

    /* 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩 */
    .dialog-cover {
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        z-index: 200;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /* 内容层 z-index要比遮罩大，否则会被遮盖 */
    .dialog-content {
        position: fixed;
        top: 35%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 300;
    }

    .dialog-content .dialog_head {
        /* 头部title的背景 居中圆角等属性。没有图片就把background-image注释掉 */
        /* background-image: url("../../static/gulpMin/image/dialog/dialog_head.png"); */
        width: 60%;
        height: 43px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .dialog-content .dialog_main {
        /* 主体内容样式设置 */
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-content: center;
        width: 60%;
        padding: 22px 0 47px 0;
        border-radius: 10px;
    }

    .dialog-content .foot_close {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: fixed;
        background: red;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 74%;
        top: 38%;
        cursor: pointer;
    }

    .foot_close:before,
    .foot_close:after {
        content: '';
        position: absolute;
        width: 6px;
        height: 70%;
        background: white;
        border-radius: 3px;
    }

    .foot_close:before {
        transform: rotate(45deg);
    }

    .foot_close:after {
        transform: rotate(-45deg);
    }
</style>
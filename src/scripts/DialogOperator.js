/*
* File: DialogOperator.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

import {
    reactive
} from 'vue';

let dialogState = reactive({
    show: false,
    message: '',
});

function showDialog(msg) {
    dialogState.show = true;
    dialogState.message = msg.toString();
}

function hideDialog() {
    dialogState.show = false;
    dialogState.message = '';
}

export {
    dialogState,
    showDialog,
    hideDialog,
}
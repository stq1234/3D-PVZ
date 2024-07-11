/*
* File: main.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

let input = "";
let input_display = "";
let cal_string = "";
let inputting = false,
    calculating = false;
const inputfield = document.getElementsByClassName('inputfield')[0];
const inputdisplayer = document.getElementsByClassName('inputdisplayer')[0];

// let cal_speed = 0; // 0-slow, 1-high.
let speed_hint_box = document.getElementsByClassName('hint-text-box')[0];
let high_speed_calculate_opportunity = 0;

function set_up() {
    high_speed_calculate_opportunity = localStorage.getItem('high_speed_calculate_opportunity');
    if (high_speed_calculate_opportunity === null || high_speed_calculate_opportunity === '') {
        high_speed_calculate_opportunity = 5;
        localStorage.setItem('high_speed_calculate_opportunity', high_speed_calculate_opportunity);
    } else {
        high_speed_calculate_opportunity = parseInt(high_speed_calculate_opportunity);
    }
}

function onuserclick(keyname) {
    if (calculating === true)
        return;
    if (keyname === "Backspace") {
        if (inputting) {
            input = input.substring(0, input.length - 1);
            cal_string = input.substring(0, cal_string.length - 1);
        }
    } else if (keyname === "c") {
        input = '0';
        input_display = '';
        cal_string = '';
        inputting = false;
    } else if (keyname === "=" || keyname === "Enter") {
        if (!inputting)
            return;
        input_display = input;
        try {
            let result = eval(cal_string);
            calculating = true;
            input = "";
            show_result(result.toString(), 3);
            inputting = false;
            inputdisplayer.innerHTML = input_display;
            return;
        } catch (error) {
            input = 'Math Error';
        }
        inputting = false;
    } else {
        if (!inputting) {
            input = '';
            input_display = '';
            cal_string = '';
            inputting = true;
        }
        if (keyname === "*")
            input += '&times;';
        else if (keyname === "/")
            input += '&divide;';
        else
            input += keyname;
        cal_string += keyname;
    }
    inputfield.innerHTML = input;
}
document.addEventListener("keydown", (event) => {
    let key = event.key;
    if (/^[0-9+\-*/=()c.\b]$/.test(key) || key === "Enter" || key === "Backspace") {
        event.preventDefault();
        onuserclick(key);
    }
});

function show_result(result, dots) {
    if (result.length > 0)
        if (high_speed_calculate_opportunity >= 1) {
            high_speed_calculate_opportunity -= 1;
            let cnt = 0;
            for (let i = input.length - 1; i >= 0; i--) {
                if (input[i] === "·")
                    cnt++;
            }
            input = input.substring(0, input.length - cnt);
            input += result;
            inputfield.innerHTML = input;
            calculating = false;
            return;
        } else {
            if (dots > 0) {
                input += '·';
                inputfield.innerHTML = input;
                setTimeout(() => {
                    show_result(result, dots - 1)
                }, 80);
            } else {
                input = input.substring(0, input.length - 3);
                input += result[0];
                inputfield.innerHTML = input;
                if (result.length === 1) {
                    calculating = false;
                    return;
                }
                setTimeout(() => {
                    show_result(result.substring(1, result.length), 3)
                }, 80);
            }
        }
}
set_up();

function update_speed_hint() {
    let text = "";
    if (high_speed_calculate_opportunity <= 0) {
        text = "当前最高计算速度 : " + (Math.random() * 120 + 70).toString() + " bits/s";
    } else {
        text = "当前最高计算速度 : <font style=\"color: red;\">" + (Math.random() * 5 + 5).toString() + " MB/s 当前剩余高速计算次数 : " + high_speed_calculate_opportunity.toString() + "</font>";
    }
    speed_hint_box.innerHTML = text + "<br/><span style=\"color: blue; font-weight: 600; font-size: 18px;\">玩小游戏获取更多高速计算次数！</span>";
}
setInterval(update_speed_hint, 800);
window.onbeforeunload = function () {
    localStorage.setItem('high_speed_calculate_opportunity', high_speed_calculate_opportunity);
}
// 为所有游戏连接添加点击增加高速计算次数事件。
function add_listener() {
    let game_links = document.querySelectorAll(".games>a");
    for (let i = 0; i < game_links.length; i++)
        game_links[i].addEventListener("click", () => {
            high_speed_calculate_opportunity += 5;
        });
}
add_listener();
// localStorage.removeItem('high_speed_calculate_opportunity')
/*
* File: authorboxscript.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

let color_index = 0;
const colors = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#800080"];
let author_box = document.getElementById('author');

function changecolor() {
    author_box.style.color = colors[color_index];
    color_index = (color_index + 1) % colors.length;
}
changecolor();
setInterval(changecolor, 800);
const s_x = 1.2, s_y = 1.2;
let speedX = s_x;
let speedY = s_y;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let start_x = Math.random() * screenWidth;
let start_y = Math.random() * screenHeight;
author_box.style.left = start_x + 'px';
author_box.style.top = start_y + 'px';

function moveElement() {
    let rect = author_box.getBoundingClientRect();
    if (rect.left <= 0) {
        speedX = s_x;
    }
    if (rect.right >= screenWidth) {
        speedX = -s_x;
    }
    if (rect.top <= 0) {
        speedY = s_y;
    }
    if (rect.bottom >= screenHeight) {
        speedY = -s_y;
    }
    author_box.style.left = rect.left + speedX + 'px';
    author_box.style.top = rect.top + speedY + 'px';
    requestAnimationFrame(moveElement);
}
window.addEventListener("resize", () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
});
moveElement();
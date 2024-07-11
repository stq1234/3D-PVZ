/*
* File: saolei.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

const rows = 20;
const cols = 20;
const size = 30;
let result = [];
const minesCount = 50;
let mines = {};
let cur_mine_num = 0;
const box = document.querySelector('.box');
const message = document.querySelector('.message');
const colors_for_message = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#800080"];

function init_game() {
    result = [];
    mines = {};
    cur_mine_num = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            mines[i + '-' + j] = false;
        }
    }
    while (cur_mine_num < minesCount) {
        let i = Math.floor(Math.random() * rows);
        let j = Math.floor(Math.random() * cols);
        if (!mines[i + '-' + j]) {
            mines[i + '-' + j] = true;
            cur_mine_num++;
        }
    }
    message.innerHTML = `地雷：${minesCount}`;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isMines = mines[i + '-' + j];
            const number = Object.values({
                0: mines[`${i - 1}-${j - 1}`],
                1: mines[`${i - 1}-${j}`],
                2: mines[`${i - 1}-${j + 1}`],
                3: mines[`${i}-${j - 1}`],
                4: mines[`${i}-${j + 1}`],
                5: mines[`${i + 1}-${j - 1}`],
                6: mines[`${i + 1}-${j}`],
                7: mines[`${i + 1}-${j + 1}`],
            }).filter(v => v).length;
            result.push(`<div class="item hide" data-v="${i}-${j}"
                style="width:${size}px;height:${size}px"
            >
                ${isMines ? `<div class="circle"></div>` :
                    `<div class="number">${number ? number : ''}</div>`}
            </div>`);
        }
    }
    box.style.width = `${cols * size}px`;
    box.style.height = `${rows * size}px`;
    box.style.left = `calc(50% - ${cols * size / 2}px)`;
    box.innerHTML = result.join('');
    // console.log(result.join(''));

    box.querySelectorAll('.item').forEach(v => {
        v.addEventListener('click', grid_clicked_handler);
        v.addEventListener('contextmenu', e => {
            v.classList.toggle('info');
            let mines_left = minesCount - box.querySelectorAll('.info').length
            message.innerHTML = `地雷：${mines_left}`;
            message.style.color = colors_for_message[Math.floor(mines_left * colors_for_message.length / minesCount)];
            e.preventDefault();
        });
    });
}

function grid_clicked_handler() {
    let v = this;
    v.classList.remove('hide');
    if (minesCount === box.querySelectorAll('.hide').length) {
        alert('恭喜您成功了');
        game_over();
    } else if (v.querySelector('.circle')) {
        setTimeout(() => {
            alert('游戏失败，踩中地雷了');
            game_over();
        }, 100);
    } else if (v.innerText.trim() === '') {
        const indexs = v.getAttribute('data-v').split('-').map(v => Number(v));
        const loop = (indexs) => {
            [
                [indexs[0] - 1, indexs[1] - 1],
                [indexs[0] - 1, indexs[1]],
                [indexs[0] - 1, indexs[1] + 1],
                [indexs[0], indexs[1] - 1],
                [indexs[0], indexs[1] + 1],
                [indexs[0] + 1, indexs[1] - 1],
                [indexs[0] + 1, indexs[1]],
                [indexs[0] + 1, indexs[1] + 1]
            ].forEach(subIndexs => {
                const el = document.querySelector(`[data-v="${subIndexs.join('-')}"]`);
                if (el) {
                    const text = el.querySelector('.number').innerText.trim();
                    if (el.className.indexOf('hide') >= 0 && text === '') {
                        el.classList.remove('hide');
                        loop(subIndexs);
                    } else {
                        el.classList.remove('hide');
                    }
                }
            });
        }
        loop(indexs);
    }
}

function game_over() {
    box.querySelectorAll('.item').forEach(v => {
        v.removeEventListener('click', grid_clicked_handler);
        // console.log(getEventListeners(v));
    });
}
init_game();
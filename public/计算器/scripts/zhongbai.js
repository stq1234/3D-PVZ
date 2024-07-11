/*
* File: zhongbai.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

const game = document.querySelector('.game')
const score = document.querySelector('#val')
const max = 9
let index = 0
const data = Array.from(new Array(max)).map((v, i) => {
    const deg = i * 360 / max;
    return `<div class="item" style="transform: rotate(${deg}deg) translate(160px);z-index:${i === index ? '10' : ''}">
            <span class="item-name"></span>
            ${i === index ? `<div class="tool">
                <div class="tool-circle"><span id="curr"></span></div>    
            </div>`:''}
        </div>`
});
game.innerHTML = data.join('')
document.onkeyup = (e) => {
    if (e.keyCode !== 32) {
        return;
    }
    const tool = game.querySelector('.tool');
    tool.classList.add('paused');
    const nextIndex = index === max - 1 ? 0 : index + 1;
    const list = game.children;
    const currRect = document.getElementById('curr').getBoundingClientRect();
    const moveEl = list[nextIndex].querySelector('.item-name');
    const moveRect = moveEl.getBoundingClientRect();
    if (Math.abs(currRect.left - moveRect.left) < 12.5 && Math.abs(currRect.top - moveRect.top) < 12.5) {
        list[nextIndex].appendChild(tool);
        tool.classList.remove('paused');
        list[index].style.zIndex = '';
        list[nextIndex].style.zIndex = '10';
        if (index === max - 1) {
            index = 0;
        } else {
            index++;
        }
        score.innerHTML = parseInt(score.innerHTML) + 1;
    } else if (score.innerHTML.indexOf('，') === -1) {
        score.innerHTML += '，游戏结束';
        setTimeout(() => {
            location.reload();
        }, 500);
    }
}
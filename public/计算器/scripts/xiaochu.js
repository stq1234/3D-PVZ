/*
* File: xiaochu.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

const simpleData = [{
        name: '虎',
        color: '#ff1100',
        bg: '../pictures/虎.png'
    },
    {
        name: '兔',
        color: '#ff8800',
        bg: '../pictures/兔.png'
    },
    {
        name: '牛',
        color: 'green',
        bg: '../pictures/牛.png'
    },
    {
        name: '羊',
        color: 'blue',
        bg: '../pictures/羊.png'
    },
    {
        name: '蛇',
        color: '#779922',
        bg: '../pictures/蛇.png'
    },
    {
        name: '鼠',
        color: '#335577',
        bg: '../pictures/鼠.png'
    }
];
const size = 40;
const rows = 10;
const cols = 10;
const oneGoupCount = 3;
const group = 6;
const layerCount = 6;
const cellHtml = [];
const renderData = Array.from(new Array(oneGoupCount * group)).map(v => {
    return simpleData.map(v => ({
        ...v
    }))
}).flat().sort(v => Math.random() - 0.5)
for (let ly = layerCount - 1; ly >= 0; ly--) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let pyStep = (ly + 1) % 2 === 0 ? size / 2 : 0
            let item = (Math.random() > 0.7 && renderData.pop())

            item && cellHtml.push(`<div class="item" onclick="move(this)" id="m${ly}-${i}-${j}"
style="width:${size}px;height:${size}px;left:${size * j + pyStep}px;top:${size * i + pyStep}px;background-image:url(${item.bg || ''})">${item.name || ''}</div>`)
        }
    }
}
const main = document.querySelector('.main');
const moveList = document.querySelector('.move-list');
main.innerHTML = cellHtml.reverse().join('');
main.style.height = `${size * rows + size * 2}px`;
main.style.width = `${size * cols}px`;
moveList.style.height = `${size}px`;
moveList.style.width = `${size * 6}px`;
// 第二步：计算被遮住的底牌需标暗色
const checkDisabled = (items) => {
    (items || main.querySelectorAll('.item')).forEach((v, i) => {
        const arr = v.id.substring(1).split('-').map(v => Number(v))
        const isPy = (arr[0] + 1) % 2 === 0;
        for (let i = arr[0] + 1; i <= layerCount - 1; i++) {
            const isPyB = (i + 1) % 2 === 0;
            if (isPy === isPyB) {
                const el = main.querySelector(`#m${i}-${arr[1]}-${arr[2]}`)
                if (el) {
                    v.classList.add('disabled');
                    break;
                }
            } else if (isPy && !isPyB) {
                if (![
                        `${i}-${arr[1]}-${arr[2]}`,
                        `${i}-${arr[1]}-${arr[2]+1}`,
                        `${i}-${arr[1]+1}-${arr[2]}`,
                        `${i}-${arr[1]+1}-${arr[2]+1}`
                    ].every(k => {
                        return !main.querySelector('#m' + k);
                    })) {
                    v.classList.add('disabled');
                    break;
                } else {
                    v.classList.remove('disabled');
                }

            } else if (!isPy && isPyB) {
                if (![
                        `${i}-${arr[1]}-${arr[2]}`,
                        `${i}-${arr[1]}-${arr[2]-1}`,
                        `${i}-${arr[1]-1}-${arr[2]}`,
                        `${i}-${arr[1]-1}-${arr[2]-1}`
                    ].every(k => {
                        return !main.querySelector('#m' + k);
                    })) {
                    v.classList.add('disabled');
                    break;
                } else {
                    v.classList.remove('disabled');
                }

            }
        }
    })
}
let canMove = true;
const move = (me) => {
    let left = moveList.offsetLeft;
    let top = moveList.offsetTop;
    if (!canMove || me.className.indexOf('disabled') >= 0) {
        return;
    }
    canMove = false;
    if (moveList.children.length > 0) {
        let el = moveList.children[moveList.children.length - 1];
        left = el.offsetLeft + size;
        top = el.offsetTop;
    }
    me.style.top = `${top}px`;
    me.style.left = `${left}px`;
    me.transitionNamesCount = 0;
    me.ontransitionend = (e) => {
        me.transitionNamesCount++;
        if (me.transitionNamesCount === 2) {
            moveEnd(me);
            canMove = true;
        }

    }
}
const moveEnd = (me) => {
    me.ontransitionend = null;
    me.setAttribute('onclick', '');
    moveList.appendChild(me);

    const findResult = [...moveList.children].filter(v => v.innerHTML === me.innerHTML);
    if (findResult.length === 3) {
        findResult.forEach(v => {
            v.ontransitionend = (e) => {

                moveList.removeChild(v);
                [...moveList.children].forEach((v, i) => {
                    v.style.left = `${i*size + moveList.offsetLeft}px`;
                });
            }
            setTimeout(() => v.style.transform = 'scale(0)');
        })

    }
    setTimeout(() => {
        if (moveList.children.length === 6) {
            alert('池子已满，游戏结束');
            return location.reload();
        } else if (main.children.length === 0) {
            alert('恭喜通关');
            return location.reload();
        }
    }, 1000);
    checkDisabled();
}
checkDisabled();
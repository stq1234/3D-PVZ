/*
* File: changethemescript.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

let change_buttom = document.getElementsByClassName("slider");
let _elements = document.getElementsByClassName("change-theme-elements");
let cur_theme = 0; // 0 - sun, 1 - moon.
change_buttom[0].addEventListener("click", ()=>{
    if(cur_theme == 0)
    {
        cur_theme = 1;
        for(let i=0; i<_elements.length; i++)
        {
            _elements[i].classList.remove("sun");
            _elements[i].classList.add("moon");
        }
        // document.body.style.background = `url(../pictures/moon.jpg)`;
    }
    else
    {
        cur_theme = 0;
        for(let i=0; i<_elements.length; i++)
        {
            _elements[i].classList.remove("moon");
            _elements[i].classList.add("sun");
        }
        // document.body.style.background = `url(../pictures/sun.jpg)`;
    }
});
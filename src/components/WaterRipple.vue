<!-- /*
* File: WaterRipple.vue
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/ -->

<template>
    <canvas ref="canvas" id="background-canvas1"></canvas>
    <!-- :style="{ position: 'fixed', top: 0, left: 0, zIndex: -100, opacity: 0.8 }" -->
    <canvas ref="canvas" id="background-canvas2"></canvas>
</template>

<script>
    export default {

        data() {
            return {
                img: null,
                myCanvas: null,
                context: null,
                current_point: {
                    x: null,
                    y: null,
                    max: 20000
                },
                all_array: null,
                random_points: [],
                colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'],
                animationID: null,
            };
        },

        mounted() {
            this.myCanvas = document.getElementById('background-canvas1');
            this.context = this.myCanvas.getContext("2d");
            this.setCanvasSize();
            window.addEventListener('resize', this.setCanvasSize);
            window.addEventListener('mousemove', this.mouseMove);
            window.addEventListener('mouseout', this.mouseOut);
            for (let i = 0; 180 > i; i++) {
                let x = Math.random() * this.myCanvas.width,
                    y = Math.random() * this.myCanvas.height,
                    xa = 2 * Math.random() - 1,
                    ya = 2 * Math.random() - 1;
                this.random_points.push({
                    x: x,
                    y: y,
                    xa: xa,
                    ya: ya,
                    max: 6000,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)]
                });
            }
            this.all_array = this.random_points.concat([this.current_point]);
            setTimeout(() => {
                this.drawBackgroundImage();
                this.drawCanvas();
            }, 100);

            this.img = new Image();
            this.img.src = require('../../public/images/choosePlantBack.jpg');
            this.img.onload = this.drawBackgroundImage;
        },

        beforeUnmount() {
            cancelAnimationFrame(this.animationID);
            window.removeEventListener('resize', this.setCanvasSize);
            window.removeEventListener('mousemove', this.mouseMove);
            window.removeEventListener('mouseout', this.mouseOut);
        },

        methods: {
            setCanvasSize() {
                if (!this.myCanvas) {
                    return;
                }
                this.myCanvas.width = window.innerWidth;
                this.myCanvas.height = window.innerHeight;
                this.drawBackgroundImage();
            },

            mouseMove(e) {
                this.current_point.x = e.clientX;
                this.current_point.y = e.clientY;
            },

            mouseOut() {
                this.current_point.x = null;
                this.current_point.y = null;
            },

            drawBackgroundImage() {
                if (this.img) {
                    let canvas = document.getElementById('background-canvas2');
                    if (!canvas) {
                        return;
                    }
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
                }
            },

            drawCanvas() {
                // console.log('drawCanvas');
                this.context.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
                let e, d, x_dist, y_dist, dist; //临时节点
                this.random_points.forEach((r, idx) => {
                    r.x += r.xa;
                    r.y += r.ya;
                    r.xa *= r.x > this.myCanvas.width || r.x < 0 ? -1 : 1;
                    r.ya *= r.y > this.myCanvas.height || r.y < 0 ? -1 : 1;
                    this.context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1);
                    for (let i = idx + 1; i < this.all_array.length; i++) {
                        e = this.all_array[i];
                        if (null !== e.x && null !== e.y) {
                            x_dist = r.x - e.x;
                            y_dist = r.y - e.y;
                            dist = x_dist * x_dist + y_dist * y_dist;
                            if (dist < e.max) {
                                if (e === this.current_point && dist >= e.max / 2) {
                                    r.x -= 0.03 * x_dist;
                                    r.y -= 0.03 * y_dist;
                                }
                                d = (e.max - dist) / e.max;
                                this.context.beginPath();
                                this.context.lineWidth = d * 5;
                                this.context.strokeStyle = r.color;
                                this.context.moveTo(r.x, r.y);
                                this.context.lineTo(e.x, e.y);
                                this.context.stroke();
                            }
                        }
                    }
                });
                this.animationID = requestAnimationFrame(this.drawCanvas);
            }
        }
    }
</script>

<style>
    #background-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -100;
    }

    #background-canvas1,
    #background-canvas2 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -100;
        opacity: 1;
    }

    #background-canvas2 {
        opacity: 0.6;
    }
</style>
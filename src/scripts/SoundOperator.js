/*
 * File: SoundOperator.js
 * Project : 3D Plant VS Zombie
 * Author: 邵天奇
 * Email: 2200013082@stu.pku.edu.cn
 * Date: 2024.5-2024.6
 * Copyright: Copyright (c) 2024 邵天奇
 */

class Sound {

    constructor(src, _loop) {
        if(src === null || src === undefined) {
            return;
        }
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.loop = _loop; // 设置音频是否循环播放
        document.body.appendChild(this.sound);
    }

    play() {
        if (this.sound === null ||
            this.sound === undefined ||
            this.sound.src === null ||
            this.sound.src === undefined) {
            return;
        }

        if (!document.body.contains(this.sound)){
            return;
        }

        this.sound.play();
    }

    stop() {
        if (this.sound === null ||
            this.sound === undefined ||
            this.sound.src === null ||
            this.sound.src === undefined) {
            return;
        }

        if (!document.body.contains(this.sound)){
            return;
        }

        this.sound.pause();
    }

    destroy() {
        if (document.body.contains(this.sound)) {
            document.body.removeChild(this.sound);
        }
    }
}

class SoundPool {
    constructor(src, count, loop = false) {
        this.sounds = [];
        for (let i = 0; i < count; i++) {
            let sound = new Sound(src, loop);
            this.sounds.push(sound);
        }
    }

    play() {
        for (let i = 0; i < this.sounds.length; i++) {
            if (!this.sounds[i].sound.ended && !this.sounds[i].sound.paused) {
                continue;
            }
            this.sounds[i].play();
            return;
        }
    }

    stop() {
        for (let i = 0; i < this.sounds.length; i++) {
            this.sounds[i].stop();
        }
    }

    destroy() {
        for (let i = 0; i < this.sounds.length; i++) {
            this.sounds[i].destroy();
        }
    }
}

export {
    Sound,
    SoundPool,
};

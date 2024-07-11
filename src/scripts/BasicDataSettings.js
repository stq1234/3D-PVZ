/*
* File: BasicDataSettings.js
* Project : 3D Plant VS Zombie
* Author: 邵天奇
* Email: 2200013082@stu.pku.edu.cn
* Date: 2024.5-2024.6
* Copyright: Copyright (c) 2024 邵天奇
*/

// 游戏基本数据设置文件

// 植物段开始
/**
 * 
 * 植物id设定
 * 
 * 0 向日葵
 * 1 豌豆射手 
 * 2 寒冰射手
 * 3 双发射手
 * 4 坚果
 * 5 土豆地雷
 * 6 火焰射手
 * 7 毁灭菇
 * 8 樱桃炸弹
 * 9 高坚果
 * 10 小喷菇
 * 11 路灯花
 * 12 阳光菇
 * 13 双子向日葵
 * 14 机枪射手
 * 15 花盆
 */

// 植物名称设定
const plantNames = [
    '向日葵',
    '豌豆射手',
    '寒冰射手',
    '双发射手',
    '坚果',
    '土豆地雷',
    '火焰射手',
    '毁灭菇',
    '樱桃炸弹',
    '高坚果',
    '小喷菇',
    '路灯花',
    '阳光菇',
    '双子向日葵',
    '机枪射手',
    '花盆',
];

// 植物产生物品间隔设定（这里的物品包括子弹和阳光，因此需要设置每种植产生物品的种类）
//    -1 为不不不产生任何物品的植物
//    整数为每轮产生间隔时间，单位ms

const plantGenerateSpeed = [
    23500,
    1350,
    1350,
    1350,
    -1,
    -1,
    1350,
    -1,
    -1,
    -1,
    1350,
    0,
    25500,
    26000,
    150,
    0,
];

// 植物每轮生成物品数量设定
const objectsPerRound = [
    1,
    1,
    1,
    2,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    0,
    1,
    2,
    4,
    0,
];

// 植物每轮生成多个物品时小间隔时间设定
const smallInterval = [
    0,
    0,
    0,
    200,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    200,
    0,
];

// 植物生成物品种类设定
const plantGenerateType = [
    0, // 阳光
    1, // 普通豌豆
    2, // 冰豌豆
    1, // 普通豌豆
    -1, // 不产生物品
    -1, // 不产生物品
    3, // 火焰豌豆
    -1, // 不产生物品
    -1, // 不产生物品
    -1, // 不产生物品
    4, // 泡泡子弹
    -1, // 不产生物品
    0, // 阳光
    0, // 阳光
    1, // 普通豌豆
    -1, // 不产生物品
];

const plantHP = [
    75,
    75,
    75,
    90,
    300,
    10000,
    75,
    10000,
    10000,
    700,
    75,
    100,
    75,
    75,
    125,
    75,
];

// 植物攻击力
const plantAttack = [
    0,
    20,
    30,
    20,
    0,
    9999, // 灰烬类
    50,
    9999, // 灰烬类
    9999, // 灰烬类
    0,
    20,
    0,
    0,
    0,
    20,
    0,
];

// 是否是攻击型植物
const plantIsAttack = [
    false,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
    true,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
];

// 植物价格
const priceOfPlant = [
    50,
    100,
    175,
    200,
    50,
    25,
    300,
    125,
    150,
    125,
    0,
    25,
    25,
    150,
    250,
    25,
];

// 植物冷却时间
const coldTime = [
    6000,
    7500,
    8000,
    8000,
    30000,
    25000,
    9000,
    30000,
    25000,
    40000,
    7500,
    5000,
    9000,
    12000,
    15000,
    5000,
];
// const coldTime = [
//     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
// ];

// 植物段结束

// 僵尸段开始

const zombieHP = [
    270, // 普通僵尸
    370, // 路障僵尸
    1100, // 铁桶僵尸
    250, // 铁栅栏僵尸maybe
];

const zombieSpeed =[
    -0.25,
    -0.25,
    -0.26,
    -0.5
];

const zombieAttackSpeed = [
    700,
    700,
    700,
    700
];

const zombieAttack = [
    15,
    15,
    15,
    15
];

// 僵尸段结束

// 导出相应数据
export {
    plantNames,
    plantGenerateSpeed,
    objectsPerRound,
    smallInterval,
    plantGenerateType,
    plantHP,
    plantAttack,
    plantIsAttack,
    priceOfPlant,
    coldTime,
    zombieHP,
    zombieSpeed,
    zombieAttackSpeed,
    zombieAttack
}

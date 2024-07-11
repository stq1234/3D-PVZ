/*
 * File: server.js
 * Project : 3D Plant VS Zombie
 * Author: 邵天奇
 * Email: 2200013082@stu.pku.edu.cn
 * Date: 2024.5-2024.6
 * Copyright: Copyright (c) 2024 邵天奇
 */

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
let port = 3000;

app.use(cors()); // 使用CORS中间件
app.use(express.json()); // 用于解析JSON的请求体

app.post('/save', (req, res) => {
    let filePath = req.headers.myfilepath;
    fs.writeFile(filePath, JSON.stringify(req.body), 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error writing file');
        } else {
            res.send('File saved successfully');
        }
    });
});

app.get('/read', (req, res) => {
    let filePath = req.headers.myfilepath;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
        } else {
            console.log(data);
            res.send(data);
        }
    });
});

app.get('/getPort', (req, res) => {
    res.sendStatus(200);
});

// 处理登录请求的路由，200表示成功，401表示失败
app.post('/signin', (req, res) => {
    const {
        account,
        password
    } = req.body;

    console.log('signin', 'account:', account, 'password:', password);

    // 处理账号和密码，检验是否正确
    fs.readFile('account.json', 'utf8', (err, data) => {
        if (err || data.length === 0) {
            // 如果账号文件不存在，创建一个新的文件
            fs.writeFile('account.json', '', 'utf8', (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('Account file created successfully');
                    res.status(401).json({
                        message: 'Invalid account or password'
                    });
                }
            });
        } else {
            let file = data.length === 0 ? {} : JSON.parse(data);
            if (file[account] !== undefined && file[account]['password'].toString() === password) {
                res.status(200).json({
                    message: 'Login successful',
                    user_name: file[account].user_name,
                    money: file[account].money
                });
                console.log('match');
            } else {
                res.status(401).json({
                    message: 'Invalid account or password'
                });
                console.log('not match', file[account], password);
            }
        }
    });
});

app.get('/getValidAccount', (req, res) => {
    fs.readFile('account.json', 'utf8', (err, data) => {
        if (err) {
            // 如果账号文件不存在，创建一个新的文件
            fs.writeFile('account.json', '', 'utf8', (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('Account file created successfully');
                    let randomAccount1 = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
                    res.status(200).json({
                        account: randomAccount1
                    });
                }
            });
        } else {
            let file = data.length === 0 ? {} : JSON.parse(data);
            let temp = Math.floor(Math.random() * 100000000)
                .toString().padStart(8, '0');
            while (file[temp] != undefined) {
                temp = Math.floor(Math.random() * 100000000)
                    .toString().padStart(8, '0');
            }
            let randomAccount2 = temp.toString().padStart(8, '0');
            res.status(200).json({
                account: randomAccount2
            });
        }
    });
});

app.post('/signup', (req, res) => {
    const {
        user_name,
        account,
        password
    } = req.body;

    console.log('signup', 'user_name:', user_name, 'account:', account, 'password:', password);

    fs.readFile('account.json', 'utf8', (err, data) => {
        if (err) {
            // 如果账号文件不存在，创建一个新的文件
            let account_temp = {
                [account]: {
                    password: password,
                    user_name: user_name,
                    money: 0,
                }
            };
            fs.writeFile('account.json', JSON.stringify(account_temp), 'utf8', (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('Account file created successfully');
                    res.status(200).json({
                        message: 'Account created successfully'
                    });
                }
            });
        } else {
            let file = data.length === 0 ? {} : JSON.parse(data);
            if (file[account] != undefined) {
                res.status(401).json({
                    message: 'Account already exists'
                });
                return;
            }
            file[account.toString()] = {
                password: password,
                user_name: user_name,
                money: 0,
            };
            fs.writeFile('account.json', JSON.stringify(file), 'utf8', (err) => {
                if (err) {
                    throw err;
                }
            });
            res.status(200).json({
                message: 'Account created successfully'
            });
        }
    });
});

app.post('/exitGame', (req, res) => {
    const {
        account,
        money
    } = req.body;

    if (account === undefined ||
        money === undefined ||
        account === null ||
        money === null) {
        res.status(401).json({
            message: 'Invalid account or money'
        });
        return;
    }

    console.log('exitGame', 'account:', account, 'money:', money);

    fs.readFile('account.json', 'utf8', (err, data) => {
        let file = data.length === 0 ? {} : JSON.parse(data);
        file[account]['money'] = money;
        fs.writeFile('account.json', JSON.stringify(file), 'utf8', (err) => {
            if (err) {
                throw err;
            }
        });
        res.status(200).json({
            message: 'Account updated successfully'
        });

    });
});

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Current PID: ${process.pid}`);
});

function handleError(error) {
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying another one...`);
        port += 1;
        server.removeListener('error', handleError);
        server.close();
        server.listen(port, () => console.log(`Server now listening on port ${port}`));
        server.on('error', handleError);
    } else {
        throw error;
    }
}

server.on('error', handleError);

process.on('exit', () => {
    server.close(() => {
        console.log('Server closed');
    });
});
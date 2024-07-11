const fs = require('fs');
const path = require('path');

let results = [];

function countLines(file) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n').length;
    const ext = path.extname(file);
    results.push({ file, lines, ext });
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (let file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            walkDir(filePath); // 递归遍历子目录
        } else if (/\.(css|js|html|vue)$/.test(filePath)) {
            countLines(filePath);
        }
    }
}

walkDir(path.join(__dirname, 'public'));
walkDir(path.join(__dirname, 'src'));
walkDir(path.join(__dirname, 'server'));

countLines(__filename);

const groupedResults = results.reduce((groups, result) => {
    if (!groups[result.ext]) {
        groups[result.ext] = [];
    }
    groups[result.ext].push(result);
    return groups;
}, {});

for (let ext in groupedResults) {
    console.log(`\n\x1b[31mFile type: ${ext}\x1b[0m`); // 使用ANSI转义序列将文本颜色设置为红色
    const sortedResults = groupedResults[ext].sort((a, b) => b.lines - a.lines);
    const maxLinesLength = 5; // Math.max(...sortedResults.map(result => String(result.lines).length));
    let totalLinesPerType = 0; // 添加一个变量来计算每类文件的总行数
    for (let result of sortedResults) {
        console.log(`${path.basename(result.file).padEnd(25, ' ')} ${String(result.lines).padStart(maxLinesLength, ' ')} lines`);
        totalLinesPerType += result.lines; // 累加每个文件的行数
    }
    console.log();
    console.log(`Total lines for ${ext}`.padEnd(25, ' ') + ` ${String(totalLinesPerType).padStart(maxLinesLength, ' ')} lines`); // 输出每类文件的总行数
}

console.log();
const totalLines = results.reduce((total, result) => total + result.lines, 0);
console.log(`Total lines`.padEnd(25, ' ') + ` ${String(totalLines).padStart(5, ' ')} lines`);
console.log();
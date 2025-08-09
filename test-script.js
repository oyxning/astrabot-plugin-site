// 测试脚本
const fs = require('fs');
const path = require('path');

// 模拟浏览器环境
global.document = {}
global.window = {}

try {
    // 读取并执行loader.js
    const loaderContent = fs.readFileSync(path.join(__dirname, 'data', 'loader.js'), 'utf8');
    eval(loaderContent);
    console.log('loader.js加载成功');

    // 读取并执行scripts.js的核心函数
    const scriptsContent = fs.readFileSync(path.join(__dirname, 'scripts.js'), 'utf8');
    // 提取核心函数，排除DOM相关代码
    const coreFunctions = scriptsContent.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/g);
    if (coreFunctions) {
        coreFunctions.forEach(func => {
            try {
                eval(func);
                console.log(`函数加载成功: ${func.match(/function\s+(\w+)/)[1]}`);
            } catch (error) {
                console.error(`函数加载失败: ${func.match(/function\s+(\w+)/)[1]}`, error);
            }
        });
    }

    console.log('测试完成');
} catch (error) {
    console.error('测试失败:', error);
}
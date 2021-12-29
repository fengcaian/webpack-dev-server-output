const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
let isFirstBuild = true; // 是否是第一次编译
module.exports = class DevServerOutput {
    constructor(options){
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.assetEmitted.tap('DevServerOutput', (file, { content, outputPath, targetPath }) => {
            const { clear, ext: exts, clearHash } = this.options;
            let isMatch = false;
            let ext = '';
            const slashTargetPath = targetPath.replace(/\\/g, '/'); // 反斜杠转换为斜杠
            const slashOutputPath = outputPath.replace(/\\/g, '/'); // 反斜杠转换为斜杠
            let customOutputPath = this.options.outputPath || outputPath;
            customOutputPath = customOutputPath.replace(/\\/g, '/'); // 反斜杠转换为斜杠
            if (slashTargetPath.match(/\..*?$/)) {
                [ext] = slashTargetPath.match(/\..*?$/);
            }
            if (!ext) {
                isMatch = true;
            } else if ((Array.isArray(exts)) ) {
                if (!exts.length) {
                    isMatch = true;
                } else {
                    isMatch = exts.findIndex(item => `.${item}` === ext) !== -1;
                }
            } else if (exts === '' || exts === null || exts === undefined) {
                isMatch = true;
            }

            if (isMatch) { // 只处理md文件
                const filenameReg = new RegExp(`\/[^\/]+${ext ? `.${ext}$` : '$'}`);
                const hashReg = new RegExp(`(?<=_).*?(?=${ext ? `.${ext}$` : '$'})`);
                const fileLoaderOutPutPath = slashTargetPath.replace(filenameReg, '');
                const fullPath = path.join(customOutputPath, fileLoaderOutPutPath);
                if (fs.existsSync(customOutputPath)) { // 判断输出路径已经存在
                    if (clear && isFirstBuild) { // clear标识需要清除，且是第一次的时候，清除目录并重建
                        rimraf.sync(customOutputPath) && mkdirp.sync(customOutputPath);
                    }
                } else { // 文件夹不存在则创建
                    mkdirp.sync(customOutputPath);
                }
                isFirstBuild = false;

                let filename = '', realname = '', hash = '';
                if (slashTargetPath.match(filenameReg)) {
                    filename = slashTargetPath.match(filenameReg)[0]; // /first_d91938411f311a8a57e1538265cecc72.md
                    if (clearHash) {
                        realname = filename.match(/(?<=\/).*?(?=(_|\.|$))/)[0]; // 匹配/与_或者.中间真正的文件名:first
                    } else {
                        realname = filename.match(new RegExp(`(?<=\/).*?(?=${ext ? `.${ext}$` : '$'})`))[0]; // 匹配/与_或者.中间真正的文件名:first
                    }
                    if (filename.match(hashReg)) {
                        hash = filename.match(hashReg)[0]; // 匹配_与.md之间的hash:d91938411f311a8a57e1538265cecc72
                    }
                }
                const writePath = path.join(customOutputPath, realname + ext);
                fs.writeFileSync(writePath, content.toString());
            }
        });
    }
};
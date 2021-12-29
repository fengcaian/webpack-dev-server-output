# webpack-dev-server-output
一个支持webpack5的webpack-dev-server写入disk的插件,需配置file-loader

## 参数说明

### outputPath
自定义的输出路径，没有则输出到output的path里面

### clear
是否清空输出路径并重建

### clearHash
当file-loader的options配置的name为[name]_[contenthash].[ext]时，是否清除文件名称中的hash

### ext
指定输出的文件类型，值为字符串数组，如['html', 'md']则只输出html与md文件

与webpack-dev-server内置的writetodisk比较，新增以上特性支持

## 使用方法：
```javascript
const DevServerOutput = require('./DevServerOutput');

new DevServerOutput({
    name: 'DevServerOutput',
    outputPath: '/output',
    clear: false, // 是否清除输出目录及里面所有文件
    clearHash: true,
    ext: ['html'], // 需要输出文件类型后缀数组，空数组或无该选项默认输出所有文件
}),
```
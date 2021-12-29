const glob = require('glob');
const DevServerOutput = require('./DevServerOutput');

function getAllTemplateEntry() {
    const entries = {};
    const files = glob.sync('./src/*.html', 'src');
    files.forEach((file) => {
        const index = file.lastIndexOf('/');
        const key = file.slice(index + 1, -5);
        entries[key] = file;
    });
    console.log(entries);
    return entries;
}

const entries = getAllTemplateEntry();

module.exports = {
    mode: 'production',
    entry: entries,
    output: {
        path: '/code/webpack-study/webpack-dev-server-output/output',
    },
    module: {
        rules: [
            {
                test: /\.html/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[contenthash].[ext]',
                            outputPath: '/post'
                        },
                    }
                ],
            }
        ],
    },
    plugins: [
        new DevServerOutput({
            name: 'DevServerOutput',
            outputPath: '/code/webpack-study/webpack-dev-server-output/output/fff',
            clear: false, // 是否清除输出目录及里面所有文件
            clearHash: true,
            ext: ['html'], // 需要输出文件类型后缀数组，空数组或无该选项默认输出所有文件
        }),
    ],
};
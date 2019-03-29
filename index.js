#!/usr/bin/env node

const program = require('commander');
const callBack = require('./lib/commander-callback');
const chalk = require('chalk');


program.on('--help', () => {
    console.log('')
    console.log(chalk.green('Boom cli 为leek项目提供快捷易用的命令'))
    console.log('')
  })

function help () {
program.parse(process.argv)
if (program.args.length < 1){
    callBack.cliSymbolAction()
    return program.help()
}
}
help()


program.version(require('./package.json').version, '-v, --version')
program.usage('init')
program.command('init')
       .description('创建项目')
       .action(callBack.initAction)
program.command('add')
       .description('追加模板到README.md文件')
       .action(callBack.addAction)
program.command('pub')
       .description('生成segmentFault发版格式')
       .action(callBack.pubAction)
program.command('co')
       .description('提交item到仓库')
       .action(callBack.commitAction)
program.command('pic')
       .description('抓取网络图片到指定目录')
       .action(callBack.getPictureAction)
program.command('list')
       .description('生成所有包的列表')
       .action(callBack.generatorListAction)
program.command('webpack')
       .description('生成webpack资源列表')
       .action(callBack.webpackAction)
program.parse(process.argv)

program.on('command:*', (e) => {
    console.log(chalk.red(`命令未注册：${e}`))
})






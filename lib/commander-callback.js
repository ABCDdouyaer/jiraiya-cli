/**
 * created by Jiraiya on 11/16/2018
 * commander 命令执行的回调
 */
const inquirer = require('inquirer');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const Request = require('request');
const ora = require('ora');
const spinner = new ora();
const readJson = require('read-metadata');
const inquirerOption = require('./inquirer-config');
const root = require('./path-config');
const {expressPack, cliSymbol} = require('./express-pack-config');
//初始化文件夹
const initAction = ()=>{
    inquirer.prompt(inquirerOption.init).then(as=>{  
        let pack_path; 
        //创建项目目录结构
        let time = new Date().toLocaleString();
        if(as.item_name){
            let item_name = as.item_name;
            shell.mkdir('-p', path.resolve(root.rootPath, item_name));
            pack_path = path.resolve(root.rootPath, item_name);
            shell.cp(root.rootPathTem + '/README.md', pack_path);
            shell.exec(`
              cd ${pack_path}
              touch index.js
              echo '/**\n *Created by Jiraiya on '${time}'\n */\n' > ${pack_path}'/index.js'
              npm init -y
            `);
        }  
        //下载node依赖包
        if(as.pack_name){
            let pack_name = as.pack_name.replace(/,/g, ' ');
            let downPackString = `npm i ${pack_name}  --save`;
            shell.exec(`
              cd ${pack_path}
              ${downPackString}
            `)
        }  
       
    })
}

//将内容增加到README.md
const addAction = ()=>{
    inquirer.prompt(inquirerOption.add).then(as=>{
       spinner.start('开始执行命令');
       spinner.color = 'yellow';
       spinner.spinner = 'hearts';
       let expressIndex = Math.floor(Math.random()*expressPack.length);
       let rootPath = path.resolve(root.rootPath, 'README.md');
       let {pack_name, item_name, pack_desc, pack_type} = as;
       if(pack_name && item_name && pack_desc && pack_type){
           shell.exec(`
                echo '\n>'${expressPack[expressIndex]}${expressPack[expressIndex]}${expressPack[expressIndex]}'【'${item_name}'】'${pack_name} >> ${rootPath}
                echo '\n>'${expressPack[expressIndex]}'[文档地址:https://www.npmjs.com/package/'${pack_name}'](https://www.npmjs.com/package/'${pack_name}')' >> ${rootPath}
                echo '\n>'${pack_desc} >> ${rootPath}
                echo '\n---------' >> ${rootPath}
            `)
            const jsonResult = readJson.sync(path.resolve(root.rootPath, 'data.json'));
            if(jsonResult[pack_type]){
                jsonResult[pack_type].push({
                    name: pack_name,
                    desc: pack_desc,
                    id:item_name
                })
            }else{
                jsonResult[pack_type] = [
                    {
                        name: pack_name,
                        desc: pack_desc,
                        id:item_name
                    }
                ]
            }
            fs.writeFileSync(path.resolve(root.rootPath, 'data.json'), JSON.stringify(jsonResult,(k,v)=>{return v},2));
            spinner.stop();
       }else{
           spinner.stop();
           console.error('输入的信息不完善，请重新输入...');
           addAction();
       }
    })
}
//生成segmentFault发布版本
const pubAction = ()=>{
    inquirer.prompt(inquirerOption.pub).then(as=>{
       if(as.item_name){
           let copyFrom = path.resolve(root.rootPath, as.item_name, 'README.md');
           let copyTo = path.resolve(root.rootPath, 'PUBLISH.md');
           shell.exec(`
              echo '【每日一包'${as.item_name}'】\n' > ${copyTo} 
              echo '[github地址：https://github.com/ABCDdouyaer/a_pack_per_day_NO.1]\n' >> ${copyTo}
              cat ${copyFrom} >> ${copyTo}           
           `)
       }else{
           console.error('请输入项目名称');
           pubAction()
       }
    })
}
//提交项目到仓库
const commitAction = ()=>{
    inquirer.prompt(inquirerOption.commit).then(as=>{
        if(as.commit_note){
           shell.exec(`
              cd ${root.rootPath}
              git add .
              git commit -m  ${as.commit_note}
              git push origin master
              git tag ${as.item_name}
              git push origin ${as.item_name}
           `)
        }else{
            console.error('输入信息不完整');
            commitAction()
        }
    })
}

//抓取图片到指定目录

const getPictureAction = ()=>{
    inquirer.prompt(inquirerOption.getPicture).then(as=>{
        let imgPath = path.resolve(root.rootPath, as.item_name, 'img');
        if(!fs.existsSync(imgPath)){
            fs.mkdirSync(imgPath);
        }
        if(as.item_name && as.pic_url){
            let picArr = as.pic_url.split(',');
            for(let pic of picArr){
                let _url = pic.split('/').pop();
                Request(pic).pipe(fs.createWriteStream(`${imgPath}/${_url}`))
            }
        }else{
            getPictureAction();
        }
    })
}

//所有的node包生成列表

const generatorListAction = ()=>{
    let listPath = path.resolve(root.rootPath, 'LIST.md');
    let data = readJson.sync(path.resolve(root.rootPath, 'data.json'));
    fs.unlinkSync(listPath);
    let fd = fs.openSync(listPath, 'a');
    for(let type in data){ 
        let str = data[type].reduce((all, v, k) => {
            return all + `<tr><td><a href='https://www.npmjs.com/package/${v.name}'>${v.name}</a></td><td>${v.desc}</td></tr><tr>`
        },'')
    let htmlStr = `## ${type}\n\n<table><thead><tr><th>参数</th><th>描述</th></tr></thead><tbody>${str}</tbody></table>\n\n`;
        fs.writeSync(fd, Buffer.from(htmlStr), 0, null, null);
    }
    fs.closeSync(fd);
}

const cliSymbolAction = () => {
    console.log(cliSymbol)
}

module.exports = {
    initAction,
    addAction,
    pubAction,
    commitAction,
    getPictureAction,
    generatorListAction,
    cliSymbolAction,
}
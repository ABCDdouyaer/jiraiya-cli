/**
 * created by Jiraiya on 11/16/2018
 * 终端交换的配置文件
 */

module.exports = {
    init: [
        {
            type:"string",
            message:"请输入项目名称",
            name: 'item_name'
        },
        {
            type:"string",
            message:"请输入需要下载的依赖包以,分割",
            name: 'pack_name'
        }
    ],
    add: [
        {
            type: 'string',
            message: '请输入项目名称',
            name: "item_name"
        },
        {
            type: "string",
            message: "请输入包名",
            name: 'pack_name'
        },
        {
            type: "string",
            message: "请输入包描述",
            name: 'pack_desc'
        },
        {
            type: "list",
            message: "请选择包类型",
            name: 'pack_type',
            choices: [
                '工具函数包',
                '服务端包',
                '自带包',
                '框架工具包',
                '合集包']
        }
    ],
    pub: [
        {
            type: "string",
            message:'请输入项目名称',
            name: 'item_name'
        }
    ],
    commit: [
        {
            type: "string",
            message:'请输入本次提交的项目名称',
            name: 'item_name'
        },
        {
            type: "string",
            message:'请输入本次提交的备注',
            name: 'commit_note'
        }
    ],
    getPicture: [
        {
            type: "string",
            message:'请输入本次提交的项目名称',
            name: 'item_name'
        },
        {
            type: "string",
            message:'请输入需要抓取的图片链接以，分割',
            name: 'pic_url'
        }
    ],
    webpack: [
        {
            type: "string",
            message: "请输入包名",
            name: 'pack_name'
        },
        {
            type: "string",
            message: "请输入包描述",
            name: 'pack_desc'
        },
        {
            type: "list",
            message: "请选择包类型",
            name: 'pack_type',
            choices: [
                'loader',
                'plugin',
                '自带plugin',
                '辅助工具',
            ]
        }
    ],
}
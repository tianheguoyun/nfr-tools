> Notice: This project only for TiChain NFR app.
> More information please access to https://tichain.tianhecloud.com

# 天河链 NFR 小工具
本项目采用node.js开发，主要服务天河链开放联盟链的NFR处理。

# 安装

1. 按照官方方法安装node.js
Linux  和 Windwos安装方法稍有不同。

Linux建议采用nvm方式安装，可以选择Node版本。

2. 在程序目录执行库安装
```
npm install
```
3. 执行程序
```
将xxxx.exls文件的信息执行批量转移
node transfer-to-client.js test "./xxxx.exls" "sheet1"
```

# 资产批量转移工具
> 通过Excel文件转移用户的NFR到其他用户地址，需要指定合约、用户名称、密码、用户地址、NFR ID和目标用户地址

```
# node transfer-to-client.js <env> <filename> <sheetName> [startLine] [endLine]
node transfer-to-client.js test "./xxxx.exls" "sheet1"
```
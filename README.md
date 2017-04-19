# ninecouponServer 九宫格服务器端 #

## 服务搭建 ##

### 准备环境 ###
  * fork 代码
  * 下载代码 git clone git@github.com:<yourAccount>/ninecouponServer.git
  * 如果没有nvm，建议安装nvm
  * 使用nvm安装nodeJS
  * 在项目目录下使用命令 npm install

### 启动服务 ###
  * 执行 npm start 即可启动服务

## 目录结构 ##
  * server.js
  * src/
  * package.json 外部依赖包

### server.js ###
描述服务器运行参数配置

### src ###
  * app.js 管理应用特性
  * app_system.js 管理公众号服务环境：服务器配置，授权等
  * coupon/\*.js 管理发券相关
  * business/\*.js 管理子商户相关
  * customer/\*.js 处理用户相关
  * statistics/\*.js

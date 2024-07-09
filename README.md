## 雅安项目前端
### 开发过程中的遇到问题
> cesium1.89版本直接安装无法正常使用

首先使用`npm i cesium@1.99 vite-plugin-cesium`命令，再将`package.json`中的cesium版本改到1.89（多安装了`vite-plugin-cesium`插件）。
安装过后在vite.config.js中找到`plugins`属性对值（指向`plugins\index.js`），在文件中添加对应的cesium插件。
## 雅安项目前端
### 开发过程中的遇到问题
> cesium1.89版本直接安装无法正常使用

首先使用`npm i cesium@1.99 vite-plugin-cesium`命令，再将`package.json`中的cesium版本改到1.89（多安装了`vite-plugin-cesium`插件）。
安装过后在vite.config.js中找到`plugins`属性对值（指向`plugins\index.js`），在文件中添加对应的cesium插件。

> 开发完组件，在页面中切换菜单中页面时显示空白页面

检查对应vue文件中的template标签里第一层是否只有一个div，如果还有别的如注释等，需要删除或者再套一个div。
下面这种情况会报错。
```vue
<template>
  <div>
    ....
  </div>
<!--  <div>-->
<!--    ...-->
<!--  </div>-->
</template>>
```
可以修改成下面这种，再套一个div，或者直接把注释删除。
```vue
<template>
  <div>
    <div>
      ....
    </div>
    <!--  <div>-->
    <!--    ...-->
    <!--  </div>-->
  </div>
</template>>
```
参考链接 `https://gitee.com/y_project/RuoYi-Vue/issues/I5F40M` `淞哥五分钟解决一个bug`


> 访问倾斜模型，因url中+号导致无法获取正常数据

修改node_modules/urijs/src/URI.js中
```javascript
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      }
```
部分里的'%2B': '+'改为'%2B': '%2B',该文件中有两个encode,均需要修改

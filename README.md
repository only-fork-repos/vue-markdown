# vue-markdown
一个十分简洁易用的[Vue](https://github.com/yyx990803/vue) Markdown编辑器，依赖[marked](https://github.com/chjj/marked)和[Font Awesome](https://github.com/FortAwesome/Font-Awesome)。
演示地址：[http://vue-markdown.coding.io/](http://vue-markdown.coding.io/)
## 浏览器中使用
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Demo</title>
    <!--引入vue,marked和font awesome-->
    <script src="//cdn.bootcss.com/vue/0.12.8/vue.js"></script>
    <script src="//cdn.bootcss.com/marked/0.3.2/marked.js"></script>
    <link href="//cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.css" rel="stylesheet">
    <script src="vue-markdown.js"></script>
</head>
<body>
<div style="width: 800px;margin: auto">
    <!--这里覆盖了默认的text，并与父组件双向同步-->
    <md-editor text="{{@text}}"></md-editor>
</div>
<script>
    //可以根据你的需要，对marked进行设置
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
    //初始化编辑器，设置默认参数，可以使用组件时对默认值进行覆盖
    var editor = new VueMarkdown(marked, {
        width: "100%",//宽
        height: "300px",//高
        text: "# Vue Markdown Editor"//默认文本
    });
    //对编辑器进行扩展
    editor.addButton({
        title: "标题",
        icon: "图标样式",
        type: "自定义类型，不能与已有的重合",
        callback: function (vm) {
            //这里是写回调逻辑，即点击按钮后进行的操作
            //vm是编辑器组件的实例，有三个方法可供使用：
            //replaceSelection(content),getSelection(),setSelection(start,end)
            //详细使用可看源码
        }
    });
    //注册到Vue
    Vue.use(editor);
    new Vue({
        el: document.body,
        data: {
            text: "# Vue Markdown Editor"
        }
    })
</script>
</body>
</html>
```
也可以使用AMD加载器
```js
//配置略去
require(["Vue","marked","VueMarkdown"],function(Vue,marked,VueMarkdown){
    //在这里初始化编辑器，并进行设置
})
```
## node中使用
可通过github来安装
```npm install --save-dev https://github.com/PeakTai/vue-markdown.git```
```js
var Vue = require("Vue")
var marked = require("marked")
var VueMarkdown = require("vue-markdown")
//接下来的使用代码和浏览器中的一样，略
```
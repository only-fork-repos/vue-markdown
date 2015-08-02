/**
 * Vue Markdown 1.1.1
 * 2015/8/2 Peak Tai
 * https://github.com/PeakTai/vue-markdown.git
 */
(function () {
    "user strict"
    function defaultData() {
        return {
            mode: "edit",
            previewHtml: "",
            buttons: [
                {title: "标题", type: "header", icon: "fa fa-header"},
                {title: "加粗", type: "bold", icon: "fa fa-bold"},
                {title: "斜体", type: "italic", icon: "fa fa-italic"},
                {title: "超连接", type: "link", icon: "fa fa-link"},
                {title: "引用", type: "quote-left", icon: "fa fa-quote-left"},
                {title: "代码", type: "code", icon: "fa fa-code"},
                {title: "有序列表", type: "list-ol", icon: "fa fa-list-ol"},
                {title: "无序列表", type: "list-ul", icon: "fa fa-list-ul"},
                {title: "网络图片", type: "image", icon: "fa fa-image"}
            ]
        }
    }

    function defaultCallbacks() {
        return {
            header: function (vm) {
                vm.replaceSelection("### ")
                var selection = vm.getSelection()
                vm.setSelection(selection.end, selection.end)
            },
            bold: function (vm) {
                vm.replaceSelection(" ****")
                var selection = vm.getSelection()
                vm.setSelection(selection.end - 2, selection.end - 2)
            },
            italic: function (vm) {
                vm.replaceSelection(" **")
                var selection = vm.getSelection()
                vm.setSelection(selection.end - 1, selection.end - 1)
            },
            link: function (vm) {
                var url = prompt("请输入链接地地址")
                if (!url) {
                    return
                }
                vm.replaceSelection("[链接描述](" + url + ")")
                var selection = vm.getSelection()
                vm.setSelection(selection.start + 1, selection.start + 5)
            },
            "quote-left": function (vm) {
                vm.replaceSelection(" >")
                var selection = vm.getSelection()
                vm.setSelection(selection.end, selection.end)
            },
            "code": function (vm) {
                vm.replaceSelection("``````")
                var selection = vm.getSelection()
                vm.setSelection(selection.end - 3, selection.end - 3)
            },
            "list-ol": function (vm) {
                vm.replaceSelection("1. ")
                var selection = vm.getSelection()
                vm.setSelection(selection.end, selection.end)
            },
            "list-ul": function (vm) {
                vm.replaceSelection("* ")
                var selection = vm.getSelection()
                vm.setSelection(selection.end, selection.end)
            },
            "image": function (vm) {
                var url = prompt("请输入图片的地址")
                if (!url) {
                    return
                }
                vm.replaceSelection("![图片说明](" + url + ")")
                var selection = vm.getSelection()
                vm.setSelection(selection.start + 2, selection.start + 6)

            }
        }
    }


    var VueMarkdown = function (marked, options) {
        var markdown = this
        options = options || {}
        markdown.data = defaultData()
        markdown.data.width = options.width || "100%"
        markdown.data.height = options.height || "300px"
        markdown.data.text = options.text || "# Vue Markdown Editor"

        markdown.buttonCallbacks = defaultCallbacks();

        /**
         * add a button
         * @param button {title,String,type:String,icon:String,callback:Function}
         */
        markdown.addButton = function (button) {
            if (!button.type) {
                throw "button must has a 'type' property"
            }
            if (markdown.buttonCallbacks[button.type]) {
                throw "the type of button is already in use"
            }
            markdown.buttonCallbacks[button.type] = button.callback
            delete button.callback
            markdown.data.buttons.push(button)
        }

        //Vue.use(instance)
        markdown.install = function (Vue) {
            Vue.component("md-editor", {
                props: ["width", "height", "text"],
                template: "<style>\n    .md-editor {\n        padding: 0 10px 10px 10px;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n        box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n    }\n\n    .md-editor textarea {\n        border: none;\n        resize: vertical;\n        outline: none;\n        padding: 0;\n    }\n\n    .md-editor textarea {\n        width: 100%;\n    }\n\n    .md-editor .md-preview {\n        overflow-y: auto;\n    }\n\n    .md-editor .md-toolbar {\n        border-bottom: 1px solid #ddd;\n        overflow-x: auto;\n        margin: 0 -10px 10px -10px;\n\n    }\n\n    .md-toolbar .button {\n        line-height: 32px;\n        width: 32px;\n        text-align: center;\n        cursor: pointer;\n    }\n\n    .md-help {\n        overflow-x: auto;\n    }\n\n    .md-help table {\n        border-spacing: 0;\n        border-collapse: collapse;\n        min-width: 100%;\n    }\n\n    .md-help table th, .md-help table td {\n        border: 1px solid #ddd;\n        padding: 8px;\n    }\n\n    .md-help table th {\n        min-width: 80px;\n    }\n</style>\n<div class=\"md-editor\" v-style=\"width:width\">\n    <div class=\"md-toolbar\">\n        <span class=\"button {{icon}}\" v-repeat=\"buttons\" title=\"{{title}}\" v-on=\"click:action(type)\"></span>\n        <span class=\"button fa\" v-class=\"'fa-eye':mode=='preview','fa-eye-slash':mode!='preview'\"\n              v-on=\"click:mode = mode == 'preview'?'edit':'preview'\"></span>\n        <span class=\"button fa fa-question-circle\" v-on=\"click:mode = mode == 'help'?'edit':'help'\"></span>\n    </div>\n    <textarea v-model=\"text\" v-el=\"textarea\" v-show=\"mode=='edit'\" v-style=\"height:height\"></textarea>\n\n    <div class=\"md-preview\" v-show=\"mode=='preview'\">{{{previewHtml}}}</div>\n    <div class=\"md-help\" v-show=\"mode=='help'\">\n        <h1>markdown语法说明</h1>\n        <table>\n            <tbody>\n            <tr>\n                <th><i class=\"fa fa-image\"></i>&nbsp;图片</th>\n                <td colspan=\"2\">![描述](图片地址)</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-link\"></i>&nbsp;链接</th>\n                <td colspan=\"2\">[描述](链接地址)</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-bold\" style=\"margin-right: 0\"></i>/<i class=\"fa fa-italic\"></i>强调</th>\n                <td colspan=\"2\">*斜体* 和 **粗体**</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-header\"></i>&nbsp;标题</th>\n                <td colspan=\"2\"># 一级标题 <br> ## 二级标题 <br>...<br> ##### 五级标题</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-quote-left\"></i>&nbsp;引用</th>\n                <td colspan=\"2\">&gt; 一级引用 <br> &gt;&gt; 二级引用</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-table\"></i>&nbsp;列表</th>\n                <td>\n                    1. 有序列表1 <br>\n                    2. 有序列表2 <br>\n                    3. 有序列表3\n                </td>\n                <td>\n                    - 无序列表1 <br>\n                    - 无序列表2 <br>\n                    - 无序列表3\n                </td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-code\"></i>&nbsp;代码</th>\n                <td colspan=\"2\"><code>`var a = 1;`</code></td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-table\"></i>&nbsp;表格</th>\n                <td colspan=\"2\">\n                    <pre>First Header | Second Header | Third Header\n:----------- | :-----------: | -----------:\n Left        |     Center    |       Right</pre>\n                    <!--<p><code>First Header | Second Header | Third Header</code></p>-->\n\n                    <!--<p><code>:-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; | :-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;: | -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;:</code></p>-->\n\n                    <!--<p><code>Left&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; | &#45;&#45;&#45;&#45;Center-&#45;&#45; | -&#45;&#45;&#45;&#45;&#45;&#45;Right</code></p>-->\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n</div>\n<content></content>",
                data: function () {
                    return markdown.data
                },
                methods: {
                    getSelection: function () {
                        return {
                            start: this.$$.textarea.selectionStart,
                            end: this.$$.textarea.selectionEnd
                        }
                    },
                    setSelection: function (start, end) {
                        this.$$.textarea.selectionStart = start
                        this.$$.textarea.selectionEnd = end
                    },
                    replaceSelection: function (content) {
                        var selection = this.getSelection()
                        val = this.$$.textarea.value
                        var val = this.text.substring(0, selection.start) + content + this.text.substring(selection.end)
                        this.$$.textarea.value = this.text = val
                        this.setSelection(selection.start, selection.start + content.length)
                        this.$$.textarea.focus()
                    },
                    //trigger by click button
                    action: function (type) {
                        if (this.previewMode) {
                            return
                        }
                        var callback = markdown.buttonCallbacks[type]
                        callback && callback(this)
                    }
                },
                ready: function () {
                    var vm = this;
                    vm.previewHtml = marked(vm.text)
                    this.$watch("text", function (val) {
                        vm.previewHtml = marked(val)
                    })
                }
            })
        }
    }
    if (typeof exports == "object") {
        module.exports = VueMarkdown;
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return VueMarkdown
        })
    } else if (window) {
        window.VueMarkdown = VueMarkdown
    }
})()
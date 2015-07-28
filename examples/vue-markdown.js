/**
 * Vue Markdown 1.0.0
 * 2015/6/2 Peak Tai
 * https://github.com/PeakTai/vue-markdown.git
 */
(function () {
    "user strict"
    var data = {
        previewMode: false,
        previewHtml: ""
    }
    data.buttons = [
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
    var buttonCallbacks = {
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
    var VueMarkdown = function (marked, options) {
        options = options || {}
        data.width = options.width || "100%"
        data.height = options.height || "300px"
        data.text = options.text || "# Vue Markdown Editor"

        /**
         * add a button
         * @param button {title,String,type:String,icon:String,callback:Function}
         */
        this.addButton = function (button) {
            if (!button.type) {
                throw "button must has a 'type' property"
            }
            if (buttonCallbacks[button.type]) {
                throw "the type of button is already in use"
            }
            buttonCallbacks[button.type] = button.callback
            delete button.callback
            data.buttons.push(button)
        }

        //Vue.use(instance)
        this.install = function (Vue) {
            Vue.component("md-editor", {
                props: ["width", "height", "text"],
                template: "<style>\n    .md-editor {\n        padding: 40px 10px 10px 10px;\n        position: relative;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n        box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n    }\n\n    .md-editor textarea {\n        border: none;\n        resize: vertical;\n        outline: none;\n        padding: 0;\n    }\n\n    .md-editor textarea {\n        width: 100%;\n    }\n\n    .md-editor .md-preview {\n        overflow-y: auto;\n    }\n\n    .md-editor .md-toolbar {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 32px;\n        border-bottom: 1px solid #ddd;\n        overflow-x: auto;\n    }\n\n    .md-toolbar .button {\n        line-height: 32px;\n        width: 32px;\n        text-align: center;\n        cursor: pointer;\n    }\n</style>\n<div class=\"md-editor\" v-style=\"width:width\">\n    <div class=\"md-toolbar\">\n        <span class=\"button {{icon}}\" v-repeat=\"buttons\" title=\"{{title}}\" v-on=\"click:action(type)\"></span>\n        <span class=\"button fa\" v-class=\"'fa-eye':previewMode,'fa-eye-slash':!previewMode\"\n              v-on=\"click:togglePreview\"></span>\n    </div>\n    <textarea v-model=\"text\" v-el=\"textarea\" v-show=\"!previewMode\" v-style=\"height:height\"></textarea>\n\n    <div class=\"md-preview\" v-show=\"previewMode\" v-style=\"height:height\">{{{previewHtml}}}</div>\n</div>\n<content></content>",
                data: function () {
                    return data
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
                        var callback = buttonCallbacks[type]
                        if (callback) {
                            callback(this)
                        }
                    },
                    togglePreview: function () {
                        var self = this
                        if (this.previewMode) {
                            this.previewMode = false
                            return
                        }
                        self.previewHtml = marked(self.text)
                        self.height = self.$$.textarea.clientHeight
                        this.previewMode = true
                    }
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
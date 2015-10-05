/*!
 * Vue Markdown 1.2.0
 *  2015/10/5 Peak Tai
 * https://github.com/PeakTai/vue-markdown.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueMarkdown"] = factory();
	else
		root["VueMarkdown"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	            {title: "网络图片", type: "image", icon: "fa fa-image"},
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
	            vm.replaceSelection("``")
	            var selection = vm.getSelection()
	            vm.setSelection(selection.end - 1, selection.end - 1)
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
	    markdown.data.placeholder = options.placeholder || ""
	    markdown.data.upload = options.upload || {}
	    markdown.data.upload.formData = options.upload ? ( options.upload.formData || {}) : {}


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
	            props: ["width", "height", "placeholder", "text"],
	            template: __webpack_require__(2),
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
	                    if (this.mode != "edit") {
	                        return
	                    }
	                    var callback = markdown.buttonCallbacks[type]
	                    callback && callback(this)
	                },
	                toggleMode: function (mode) {
	                    this.mode = this.mode == mode ? "edit" : mode
	                }
	            },
	            components: {
	                //uploader components
	                uploader: __webpack_require__(3)
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
	module.exports = VueMarkdown;

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = "<style>\n    .md-editor {\n        padding: 0 10px 10px 10px;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n        box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\n    }\n\n    .md-editor textarea {\n        border: none;\n        resize: vertical;\n        outline: none;\n        padding: 0;\n    }\n\n    .md-editor textarea {\n        width: 100%;\n    }\n\n    .md-editor .md-preview {\n        overflow: auto;\n    }\n\n    .md-editor .md-preview img {\n        max-width: 100%;\n    }\n\n    .md-editor .md-toolbar {\n        border-bottom: 1px solid #ddd;\n        overflow-x: auto;\n        margin: 0 -10px 10px -10px;\n\n    }\n\n    .md-toolbar .button {\n        line-height: 32px;\n        width: 32px;\n        text-align: center;\n        cursor: pointer;\n    }\n\n    .md-help {\n        overflow-x: auto;\n    }\n\n    .md-help table {\n        border-spacing: 0;\n        border-collapse: collapse;\n        min-width: 100%;\n    }\n\n    .md-help table th, .md-help table td {\n        border: 1px solid #ddd;\n        padding: 8px;\n    }\n\n    .md-help table th {\n        min-width: 80px;\n    }\n</style>\n<div class=\"md-editor\" v-style=\"width:width\">\n    <div class=\"md-toolbar\">\n        <span class=\"button {{icon}}\" v-repeat=\"buttons\" title=\"{{title}}\" v-on=\"click:action(type)\"></span>\n\n        <span class=\"button fa fa-cloud-upload\" v-on=\"click:toggleMode('upload')\" v-if=\"upload.server\"></span>\n        <span class=\"button fa fa-eye\" v-on=\"click:toggleMode('preview')\"></span>\n        <span class=\"button fa fa-question-circle\" v-on=\"click:toggleMode('help')\"></span>\n    </div>\n    <textarea v-model=\"text\" v-el=\"textarea\" v-show=\"mode=='edit'\" v-style=\"height:height\"\n              v-attr=\"placeholder:placeholder\"></textarea>\n\n    <div class=\"md-preview\" v-show=\"mode=='preview'\" v-style=\"min-height:height\">{{{previewHtml}}}</div>\n    <div class=\"md-help\" v-show=\"mode=='help'\">\n        <h1>markdown语法说明</h1>\n        <table>\n            <tbody>\n            <tr>\n                <th><i class=\"fa fa-image\"></i>&nbsp;图片</th>\n                <td colspan=\"2\">![描述](图片地址)</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-link\"></i>&nbsp;链接</th>\n                <td colspan=\"2\">[描述](链接地址)</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-bold\" style=\"margin-right: 0\"></i>/<i class=\"fa fa-italic\"></i>强调</th>\n                <td colspan=\"2\">*斜体* 和 **粗体**</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-header\"></i>&nbsp;标题</th>\n                <td colspan=\"2\"># 一级标题 <br> ## 二级标题 <br>...<br> ##### 五级标题</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-quote-left\"></i>&nbsp;引用</th>\n                <td colspan=\"2\">&gt; 一级引用 <br> &gt;&gt; 二级引用</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-list-ol\"></i>&nbsp;列表</th>\n                <td>\n                    1. 有序列表1 <br>\n                    2. 有序列表2 <br>\n                    3. 有序列表3\n                </td>\n                <td>\n                    - 无序列表1 <br>\n                    - 无序列表2 <br>\n                    - 无序列表3\n                </td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-code\"></i>&nbsp;代码</th>\n                <td colspan=\"2\">`var a = 1;`</td>\n            </tr>\n            <tr>\n                <th><i class=\"fa fa-table\"></i>&nbsp;表格</th>\n                <td colspan=\"2\">\n                    <pre>First Header | Second Header | Third Header\n:----------- | :-----------: | -----------:\n Left        |     Center    |       Right</pre>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div class=\"md-upload\" v-if=\"upload.server\" v-show=\"mode=='upload'\" v-style=\"min-height:height\">\n        <uploader server=\"{{upload.server}}\" max=\"{{upload.max||500*1024}}\" form-data=\"{{upload.formData}}\"/>\n    </div>\n</div>";

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4)
	module.exports.template = __webpack_require__(5)


/***/ },
/* 4 */
/***/ function(module, exports) {

	var xhr = null;
	    module.exports = {
	        props: ["server", "max", "formData"],
	        data: function () {
	            return {
	                server: null,//服务器上传地址
	                formData: {},//附加的表单数据
	                max: 500 * 1024,//默认最大500k
	                dataUrl: null,//图片预览地址
	                errmsg: null,//错误信息
	                uploader: {
	                    loading: false,//加载中状态
	                    progress: "0%",//进度
	                    errmsg: null//上传错误信息
	                }
	            }
	        },
	        methods: {
	            upload: function () {
	                var component = this
	                xhr = new XMLHttpRequest()
	                var formData = new FormData()
	                for (var key in component.formData) {
	                    var value = component.formData[key]
	                    if (value instanceof Array) {
	                        for (var i = 0; i < value.length; i++) {
	                            formData.append(key, value[i]);
	                        }
	                    } else {
	                        formData.append(key, value)
	                    }
	                }
	                var file = component.$$.file.files[0]
	                formData.append("file", file, file.name)
	                xhr.onload = function () {
	                    component.resetUpload()
	                    if (xhr.status != 200) {
	                        component.uploader.errmsg = "上传发生错误:" + xhr.status + "," + xhr.statusText
	                        return
	                    }
	                    var json = JSON.parse(xhr.responseText)//{url:"图片地址",desc:"描述"}
	                    var text = "![" + (json.desc ? json.desc : "图片说明"  ) + "](" + json.url + ")"
	                    component.$parent.replaceSelection(text)
	                    var selection = component.$parent.getSelection()
	                    component.$parent.setSelection(selection.end + text.length, selection.end + text.length)
	                    component.reset()
	                    component.$parent.toggleMode("edit")
	                }
	                xhr.onabort = function () {
	                    component.resetUpload()
	                }
	                xhr.onerror = function () {
	                    component.resetUpload()
	                    component.uploader.errmsg = "上传发生错误:" + xhr.status + "," + xhr.statusText
	                }
	                xhr.onprogress = function (e) {
	                    if (e.lengthComputable) {
	                        component.uploader.progress = (e.loaded / e.total).toFixed(2) + "%";
	                    } else {
	                        component.uploader.progress = "无法显示进度"
	                    }
	                }
	                xhr.open("POST", component.server)
	                component.resetUpload()
	                component.uploader.loading = true
	                xhr.send(formData)
	            },
	            cancel: function () {
	                if (xhr) {
	                    xhr.abort()
	                }
	            },
	            reset: function () {
	                var component = this
	                component.resetUpload()
	                component.$$.file.value = null
	                component.dataUrl = null
	            },
	            resetUpload: function () {
	                var component = this
	                component.uploader.loading = false
	                component.uploader.progress = "0%"
	                component.uploader.errmsg = null
	            }
	        },
	        ready: function () {
	            var component = this
	            console.log(component.formData)
	            component.$$.file.onchange = function () {
	                var file = this.files[0]
	                if (file.type.indexOf("image") != 0) {
	                    component.errmsg = "只支持上传图片"
	                    component.$$.file.value = null
	                    return
	                }
	                if (file.size > component.max) {
	                    component.errmsg = "图片文件过大"
	                    component.$$.file.value = null
	                    return
	                }
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                    component.dataUrl = reader.result
	                }
	                reader.readAsDataURL(file);
	                component.errmsg = null
	            }
	        }
	    }

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "<style>\n        .md-btn {\n            border-radius: .5em;\n            border: 1px solid #ddd;\n            background-color: white;\n            padding: 10px 15px;\n        }\n    </style>\n    <div style=\"margin-bottom: 10px\" v-show=\"!dataUrl\">\n        <input type=\"file\" v-el=\"file\" class=\"md-btn\">\n        <span style=\"color: darkred\">{{errmsg}}</span>\n    </div>\n    <div v-show=\"dataUrl\">\n        <p>\n            <img v-if=\"dataUrl\" v-attr=\"src:dataUrl\" style=\"max-width: 100%\">\n        </p>\n\n        <div v-show=\"!uploader.loading\">\n            <p v-if=\"uploader.errmsg\" style=\"color: darkred\">{{uploader.errmsg}}</p>\n            <button v-on=\"click:upload\" class=\"md-btn\"><i class=\"fa fa-upload\"></i>&nbsp;上传图片</button>\n            <button v-on=\"click:reset\" class=\"md-btn\"><i class=\"fa fa-undo\"></i>&nbsp;重新选择</button>\n        </div>\n        <div v-show=\"uploader.loading\">\n            <button v-on=\"click:cancel\" class=\"md-btn\"><i class=\"fa fa-times\"></i>&nbsp;取消上传</button>\n            {{uploader.progress}}\n        </div>\n    </div>";

/***/ }
/******/ ])
});
;
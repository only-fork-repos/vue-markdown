<template>
    <style>
        .md-btn {
            border-radius: .5em;
            border: 1px solid #ddd;
            background-color: white;
            padding: 10px 15px;
        }
    </style>
    <div style="margin-bottom: 10px" v-show="!dataUrl">
        <input type="file" v-el="file" class="md-btn">
        <span style="color: darkred">{{errmsg}}</span>
    </div>
    <div v-show="dataUrl">
        <p>
            <img v-if="dataUrl" v-attr="src:dataUrl" style="max-width: 100%">
        </p>

        <div v-show="!uploader.loading">
            <p v-if="uploader.errmsg" style="color: darkred">{{uploader.errmsg}}</p>
            <button v-on="click:upload" class="md-btn"><i class="fa fa-upload"></i>&nbsp;上传图片</button>
            <button v-on="click:reset" class="md-btn"><i class="fa fa-undo"></i>&nbsp;重新选择</button>
        </div>
        <div v-show="uploader.loading">
            <button v-on="click:cancel" class="md-btn"><i class="fa fa-times"></i>&nbsp;取消上传</button>
            {{uploader.progress}}
        </div>
    </div>
</template>
<script>
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
</script>

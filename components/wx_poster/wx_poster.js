// components/wx_poster.js
var canvas = null
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showPoster: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        width: 0,
        height: 0,
        imgUrl: '',
        ctx: null,
        canvas: null,
        isSetWH: false
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 初始化
        inits(cb) {
            // 如果传递过来的是 showPoster
            let that = this;
            const query = that.createSelectorQuery()
            query.select('#poster_canvas')
                .fields({ node: true, size: true })
                .exec((res) => {
                    canvas = res[0].node
                    const ctx = canvas.getContext('2d')
                    that.setData({
                        canvas,
                        ctx
                    },function () {
                        isFn(cb)(canvas)
                    })
                })
        },
        // 设置海报大小。如果知道开发者优先设置海报宽度和高度的话，是可以
        setWH({ width = 0, height = 0}, cb) {
            console.log(this.data.canvas)
            var canvas = this.data.canvas
            if(typeof cb === 'function') {
                cb({
                    status: !canvas
                })
            }
            if(!canvas) {
                return;
            }
            this.data.canvas.width = width;
            this.data.canvas.height = height;
            this.setData({
                isSetWH: true
            })
        },
        // 添加图片
        addImg(arrOrPath) {
            var that = this;
            if(!arrOrPath) {
                console.error('[wx_poster] error 参数错误：',arrOrPath )
                return;
            }
            if(Array.isArray(arrOrPath)) { // 是数组的话，

            }else if(typeof arrOrPath === 'string' ){ // 链接
                this.loadImg(canvas,arrOrPath, function (img) {
                    // 判断当前的  isSetWH 是true
                    if(!that.data.isSetWH) {
                        that.data.canvas.width = img.width;
                        that.data.canvas.height = img.height;
                        that.setData({
                            isSetWH: true,
                            width: img.width,
                            height: img.height
                        },function () {
                            that.drawing(that.data.ctx,[{
                                __imgObj: img
                              }])
                        })
                    }else {
                        that.drawing(that.data.ctx,[{
                        __imgObj: img
                        }])
                    }
                })
            }
        },
        // 绘制的方法
        drawing(ctx,arr, cb) {
            var len = arr.length;
            for(var i=0;i<len;i++) {
            var x = arr[i].x || 0,
                y = arr[i].y || 0,
                w = arr[i].w || undefined,
                h = arr[i].h || undefined;
            let img = arr[i].__imgObj
            ctx.drawImage(img, x, y, w || img.width, h || img.height)
            }
            if (cb && typeof cb === 'function') {
            setTimeout(() => {
                cb(true)
            },100)
            }
        },
        loadImg(canvas, ObjOrUrl,cb) {
            // 判断url是否是对象
            if(!ObjOrUrl) {
                console.error('[loadImg] 图片地址不对')
                return
            }else if(ObjOrUrl.url) {
                var url = ObjOrUrl.url;
            var index = ObjOrUrl.___index
            }else {
                var url = ObjOrUrl;
                var index = 0
            }
            if (canvas && url) {
              const img = canvas.createImage()
              img.onload = () => {
                if (cb && typeof cb === 'function') {
                  // ctx.drawImage(img, x, y, w || img.width, h || img.height)
                  cb(img, index)
                }
              }
              img.onerror = () => {
                isFn(cb)()
              }
              img.src = url
            }else {
              console.error('[loadImg] 缺少参数')
            }
          },
    }
})

// 检测是否是函数
function isFn(cb) {
    return cb && typeof cb === 'function'?cb:()=>{}
}
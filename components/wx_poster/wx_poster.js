// components/wx_poster.js
var canvas = null,
        drawCb = () =>{},
        isSetWH = false, // 是否设置过宽度和高度
        isCheck  = true
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
        width: 0, // 画布宽度
        height: 0, // 画布高度
        imgUrl: '', // 合成后，图片微信临时地址
        ctx: null, // 生成二维
        canvas: null, // 画布
        countsAll: 0, // 加载过的数量（不管是失败还是成功了）
        arrImg: [], // 存放已经加载完成图片
        allArrImg: [], // 存放所有的阵列，需要执行的
        imgLoadErr: false, // 加载失败了
        isDraw: false
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
            isSetWH = true
        },
        // 添加图片
        addImg(arrOrPath, options) {
            var that = this;
            if(!arrOrPath) {
                console.error('[wx_poster] error 参数错误：',arrOrPath )
                return;
            }
            var options = options || {}
            if(Array.isArray(arrOrPath)) { // 是数组的话，

            }else if(typeof arrOrPath === 'string' ){ // 链接
               // 添加阵列内 loadArrImg
               var index = that.data.allArrImg.length
               var allArrImg = that.data.allArrImg
               allArrImg.push(loadArrImg(canvas,arrOrPath,index))
               that.setData({
                allArrImg
               },function () {
                   // 进行通知调用方法
                    that.run(index)
               })
            }
        },
        // 绘制方法
        draw(cb) {
            // 如果某个或者多个图片还没有加载完成的话。就得做等待
            // if(countsAll) {
            //     // countsAll
            // }
            this.setData({
                isDraw: true
            })
            if(cb && typeof cb=== 'function') {
                drawCb = cb
                checkAllLengthCount(this) // 如果网络非常的好，一下子都加载好了这个方法，正好赶上了
            }
        },
        // 加载阵列中图片
        run (index) {
            var that = this;
            // 得先做个加载状态
            that.data.allArrImg[index](function (img) {
                var countsAll = ++that.data.countsAll
                // 加载完成
                if(img) {
                    var arrImg = that.data.arrImg;
                    arrImg[index] = {
                        index: index,
                        myImg: img
                    }
                    that.setData({
                        arrImg,
                        countsAll
                    },function () {
                        checkAllLengthCount(that)
                    })
                }else {
                    that.setData({
                        imgLoadErr: true
                    },function () {
                        // 通知给开发者。
                        that.triggerEvent('img_err', index)
                        that.setData({
                            countsAll
                        },function () {
                            checkAllLengthCount(that)
                        })
                    })
                }
            })
        }
    }
})
// 阵列排序（当图片渲染完成后，进行排列下图片）


// 检查下是否全部都执行完成了。如果执行完成，就给 draw 进行回调下
function checkAllLengthCount (that) {
    // debugger
    if(that.data.countsAll === that.data.allArrImg.length) {
        // 判断当前开发者调过 draw
        if(that.data.isDraw & isCheck) {
            console.log('检测')
            isCheck = false
            var arrImgs = that.data.arrImg,
                   len = arrImgs.length,
                   i = 0;
                   drawLoad(arrImgs)
            function drawLoad (arrImg) {
                var item = arrImg[i].myImg
                if(!isSetWH) {
                    that.data.canvas.width = item.width;
                    that.data.canvas.height = item.height;
                    isSetWH = true
                    that.setData({
                        width: item.width,
                        height: item.height
                    })
                    drawing(that.data.ctx,[{
                        __imgObj: item
                      }],function () {
                        i++
                        if(i !=len) {
                            drawLoad(arrImg)
                        }else {
                            drawCb()
                        }
                      })
                }else {
                    drawing(that.data.ctx,[{
                        __imgObj: item
                    }], function () {
                        i++
                        console.log(i)
                        if(i !=len) {
                            drawLoad(arrImg)
                        }else {
                            drawCb()
                        }
                    })
                }
            }
        }
        
    }
}


// 阵列方法
function loadArrImg (canvas,arrOrPath, index) {
    return function (cb) {
        loadImg(canvas,arrOrPath, function (img) {
            // 判断当前的  isSetWH 是true（设置过宽度高度吗）
            cb(img)
        })
    }
}

// 绘制的方法
function  drawing(ctx,arr, cb) {
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
}

 // 加载图片
function loadImg(canvas, ObjOrUrl,cb) {
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
  }
// 检测是否是函数
function isFn(cb) {
    return cb && typeof cb === 'function'?cb:()=>{}
}
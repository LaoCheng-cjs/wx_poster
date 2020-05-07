/*
   @page components/wx_poster.js 
    @author laocheng
    @version 0.1
    (c) 2019 laocheng
    Released under the MIT License.
*/
var canvas = null,
        drawCb = () =>{},
        isSetWH = false, // 是否设置过宽度和高度
        isCheck  = true,
        generateImg = () => {} // 导出图片方法
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
        isDraw: false,
        txtAll: []
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
            // debugger
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
            canvas.width = width;
            canvas.height = height;
            isSetWH = true
            this.setData({
                width,
                height
            })
        },
        // 添加图片
        addImg(path, options) {
            var that = this;
            if(!path) {
                console.error('[wx_poster] error 参数错误：',path )
                return;
            }
            var options = options || {}
            if(typeof path === 'string' ){ // 链接
               // 添加阵列内 loadArrImg
               var index = that.data.allArrImg.length
               var allArrImg = that.data.allArrImg
               options.___index = index
               options.url = path
               options.x = options.x || 0
               options.y = options.y  || 0
               allArrImg.push(loadArrImg(canvas,options,index))
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
                    var index = img.options.___index
                    arrImg[index] = {
                        index: index,
                        myImg: img,
                        options: img.options
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
                        that.triggerEvent('img_err', {
                            index
                        })
                        that.setData({
                            countsAll
                        },function () {
                            checkAllLengthCount(that)
                        })
                    })
                }
            })
        },
        // 添加文本
        setFont(txt, options) {
            if(!txt && typeof txt != 'string') {
                console.error('[setFont] error 添加文本错误'+ text)
                return;
            }
            let option = options || {}
            let optionsInit = {
                size: 23,
                color: '#000000',
                y: 10,
                x: 0
            }
            for(let str in optionsInit) {
                optionsInit[str] = option[str] ? option[str] : optionsInit[str];
            }
            var txtAll = this.data.txtAll
            // 添加到文本内
            txtAll.push({
                txt,
                option: optionsInit
            })
            this.setData({
                txtAll
            })
        },
        // 绘制微信小程序码
        wxCode(url, options) {
            if(!url && typeof url != 'string') {
                return;
            }else {
                let option = options || {}
                let optionInit = {
                    width: 280,
                    height: 280,
                    y: 0,
                    x: 0,
                    deviation: 20,
                    bgColor: '#fff',
                    success: () => {

                    }
                }
                for(let str in optionInit) {
                    optionInit[str] = option[str] ? option[str] : optionInit[str]
                }
                // 加载微信小程序码地址
                optionInit.___index = 0
                optionInit.url = url
                let ctx = this.data.ctx
                loadImg(canvas,optionInit, function (img) {
                    console.log(img)
                    // 计算半圆位置x与y的公式：传递过来位置 + width / 2 + deviation
                    let width = optionInit.width / 2
                    let x = optionInit.x + width + optionInit.deviation
                    let y = optionInit.y + width+ optionInit.deviation
                    ctx.arc(x, y , width + optionInit.deviation, 0, 2 * Math.PI)
                    // console.log(ctx);
                    ctx.fillStyle = optionInit.bgColor
                    // ctx.setFillStyle('#EEEEEE')
                    ctx.fill()
                    drawing(ctx,[{
                        __imgObj: img,
                        w: optionInit.width,
                        h: optionInit.height,
                        x: optionInit.x + optionInit.deviation,
                        y: optionInit.y + optionInit.deviation
                      }],function () {
                          optionInit.success()
                      })
                })
            }
        },
        // 导出图片
        generatePic(cb, qualityNum) {
            let that = this;
            let quality = qualityNum || 1
            // 必须等待前面的图片全部绘制完成后，才能导出。
            wx.canvasToTempFilePath({
                canvas,
                // width: that.data.ctxWidth, // 导出的图片大小
                // height: that.data.ctxHeight,
                quality,
                success: function (res) {
                  var tempFilePath = res.tempFilePath
                  // 导出渲染的页面宽度和高度
                  var w =  that.data.width,
                        h =  that.data.height;
                  if(w > 750) {
                    var scale = 750 / w;
                    w = 750;
                    h = h * scale
                  }
                  isFn(cb)({
                      status: 1,
                      w,
                      h,
                      tempFilePath
                  })
                },
                fail(err) {
                    isFn(cb)({
                        status: 0,
                        err
                    })
                }
            })
        }
    }
})
// 阵列排序，加载完成后，有些图片加载失败了，但是索引不对啊，得重新在弄下
function recombination (arr) {
    // 重新组装下
    var len = arr.length,
            result = []
    for(var i=0;i<len;i++) {
        if(arr[i]) {
            result.push(arr[i])
        }
    }
    return result
}

// 检查下是否全部都执行完成了。如果执行完成，就给 draw 进行回调下
function checkAllLengthCount (that) {
    // debugger
    if(that.data.countsAll === that.data.allArrImg.length) {
        // 判断当前开发者调过 draw
        if(that.data.isDraw & isCheck) {
            console.log('检测')
            isCheck = false
            var arrImgs = recombination(that.data.arrImg),
                   len = arrImgs.length,
                   i = 0;
                   drawLoad(arrImgs)
            function drawLoad (arrImg) {
                var item = arrImg[i].myImg
                let w = item.options.width || item.width
                let h = item.options.height || item.height
                let y =  item.options.y
                let x =  item.options.x
                if(!isSetWH) {
                    canvas.width = item.width;
                    canvas.height = item.height;
                    isSetWH = true
                    that.setData({
                        width: w,
                        height: h
                    },function () {
                        drawing(that.data.ctx,[{
                            __imgObj: item,
                            w,
                            h,
                            x,
                            y
                        }],function () {
                            i++
                            item.success({
                                w,
                                h,
                                x,
                                y
                            })
                            if(i !=len) {
                                drawLoad(arrImg)
                            }else {
                                drawTxt(that)
                            }
                        })
                    })
                    
                }else {
                    drawing(that.data.ctx,[{
                        __imgObj: item,
                        w,
                        h,
                        x,
                        y
                    }], function () {
                        i++
                        item.success({
                            w,
                            h,
                            x,
                            y
                        })
                        console.log(i)
                        if(i !=len) {
                            drawLoad(arrImg)
                        }else {
                            drawTxt(that)
                        }
                    })
                }
            }
        }
    }
}

// 绘制文本
function drawTxt(that) {
    var txtAll = that.data.txtAll
    var len = txtAll.length
    if(len === 0) {
        drawCb()
    }else {
        var ctx = that.data.ctx
        for(var i=0;i<len;i++) {
            var option = txtAll[i].option
            ctx.font =  option.size + "px sans-serif"
            // ctx.fillText((nickname.length > 6 ? nickname.slice(0, 6) + '...' : nickname) + '邀你' + (app.storeData.userinfo.user_type == 2 ? '开团' : '参团'), 141 / ratio, 946 / ratio)
            ctx.fillStyle = option.color
            ctx.fillText(txtAll[i].txt , option.x , option.y)
        }
        drawCb()
    }
}

// 阵列方法
function loadArrImg (canvas,objOrPath, index) {
    return function (cb) {
        loadImg(canvas,objOrPath, function (img) {
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
        cb(true)
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
    }else if(typeof ObjOrUrl === 'string') {
        var url = ObjOrUrl;
        var index = 0
    }
    if (canvas && url) {
      const img = canvas.createImage()
      img.options = JSON.parse(JSON.stringify(ObjOrUrl))
      img.success = ObjOrUrl.success || function ()  {};
      img.onload = () => {
        if (cb && typeof cb === 'function') {
          // ctx.drawImage(img, x, y, w || img.width, h || img.height)
          cb(img)
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
// pages/demo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: '',
        tab: [{
            name: '夏天'
        },{
            name: '高考'
        }],
        active: 0,
        width: '0',
        height: '0'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.cunItemload()
    },
    // 选项卡点击
    tabBtn(e) {
        var id = e.currentTarget.dataset.id
        this.setData({
            active: id
        },function () {
            if(id == 1) { // 高考

            }
        })
    },
    // 春天
    cunItemload () {
        var that = this
        wx.showLoading({
        })
        var wx_poster = this.selectComponent('#wx_poster')
        wx_poster.inits(function (){ // 初始化完成
            console.log('初始化完成')
            wx_poster.setWH({
                width: 750,
                height: 1344
            })
            wx_poster.addImg('../../img/xiatian.png', {
                success(msg) {
                    console.log(msg)
                }
            })
            wx_poster.setFont('wx_poster描述一段文本了，哈哈哈哈',{
                color: '#333',
                y: 1310,
                x: 136,
                size: 24,
            })
            // https://ww1.sinaimg.cn/bmiddle/005MGTLwgy1g8ge5p1or4j30u016k4qp.jpg
            wx_poster.draw(function () {
                // 单独绘制小程序码
                wx_poster.wxCode('../../img/wx_img.png', {
                    y: 920,
                    x: 133,
                    width: 180,
                    height: 180,
                    success() {
                        wx_poster.generatePic(function (obj) {
                            if(obj.status) { // 导出成功
                                console.log('导出成功')
                                console.log(obj)
                                that.setData({
                                    imgSrc: obj.tempFilePath
                                } ,function () {
                                    // 设置渲染宽度和高度
                                    that.setData({
                                        width: obj.w,
                                        height: obj.h
                                    })
                                    wx.hideLoading({
                                      complete: (res) => {},
                                    })
                                })
                            }else {
                                // 导出失败
                                consle.log('导出失败')
                            }
                        }, 1)
                    }
                })
                
            })
        })
    },
    // 高考
    
    img_err(msg) {
        console.log(msg.detail); // 获取第几张错误。
    }
})
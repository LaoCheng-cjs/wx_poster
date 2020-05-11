// pages/demo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: '',
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
    
    // 高考
    
    img_err(msg) {
        console.log(msg.detail); // 获取第几张错误。
    }
})
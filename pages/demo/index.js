// pages/demo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

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
        var wx_poster = this.selectComponent('#wx_poster')
        wx_poster.inits(function (){ // 初始化完成
            console.log('初始化完成')
            wx_poster.addImg('https://www.baidu.com/img/baidu_jgylogo3.gif',{
                width: '',
                height: '',
                y: '0',
                x: 0,
            },(img) => {
                console.log(img)
            })
        })
        // wx_poster.setWH({
        //     width: 605,
        //     height: 1080
        // },function (status) {
        //     console.log(status)
        // })
        // wx_poster.addImg('https://www.baidu.com/img/baidu_jgylogo3.gif',() => {

        // })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    wxPosterInit() {
        console.log(1111111);
        
    }
})
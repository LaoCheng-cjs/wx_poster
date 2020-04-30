- 目前开发中
- 目前开发中
- 目前开发中
- 目前开发中


# wx_poster

> 用于海报生成，希望能帮助那些不经常开发小程序开发者。用完，觉得好用点赞，辛苦制作。


## 问答

**为什么没有二维码功能及一维码。**

> 这个问题在于我们这个是合成海报功能，不是生成二维码和一维码工具。完全可以使用第三方的生成二维码或者一维码。

**为什么有小程序码这个方法了（）**

> 我们工具在于帮助那么接触少的小程序开发者少走弯路（希望大家读读源码，大佬请绕路）。原因在于后台传给我们的无法做圆形的大小，那么我这里进行帮你绘制好了。

**为什么不直接使用 canvas画布画好的了，还要设置showPoster为true了？**

> 最终合成图片的好处：

1. 如果你是想设置rpx单位的话，那么可以拿着图片，将 view标签设置背景图，这样可以进行缩放比例
2. 如果你拿着图片，在保存那块，能够快速进行保存下来。
3. 如果你设置长按进行保存，也是能做到的。

**如果没有设置海报的宽度和高度。默认取第一张图片（就是第一个addImag()方法拿到的图片）宽度和高度**

> 这个怕是用于后台上传后的，海报不知道是多大的，有可能小点，你没在现场不知道用户是怎么操作的。后期新增缩放率，大家都知道微信的缩放值不准确，哎。可怜的娃啊。

**图片加载错误处理？**

> 如果图片加载错误，我们会使用 img_err 这个事件来通知，返回第几个 addImg 加载错误了。

```html
<wx_poster id="wx_poster" bind:img_err="img_err"></wx_poster>
```

```js
// 在页面js中添加接受的方法。
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // ....代码块省略
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    },
    // 1、加载错误事件
    img_err(msg) {
        console.log(msg.detail); // 获取第几个 addImg加载错误了。
    }
})
```

**如果第一张图片加载错误，并且我还没设置大小怎么处理的**

> 如果第一个 addImg 图片加载失败的话，并且未设置图片宽度高度，进行 img_err 事件以外，以第二个图片加载完成的作为海报的宽度和高度，以此类推。

## 使用步骤：

### 第一步：下载或者克隆

> （下载方式，不懂自行百度），下载好后，在项目中找到 components 目录中 wx_poster 文件夹，进行拷贝放入到自己项目中。比如我放入在 components 文件夹下面。

### 第二步：引入组件

> 找到自己想要引入的页面 .json文件。然后将 usingComponents 里面进行添加上 wx_poster 。比如如下（注意组件路径）：

```json
{
  "usingComponents": {
    "wx_poster": "/components/wx_poster/wx_poster"
  }
}
```

### 第三步：在 .wxss 文件中使用

```html
<wx_poster id="wx_poster" ></wx_poster>
```

### 第四步：在 .js 中使用

> 此处是重点啊。咱们必须在 onReady 中调用初始化

```js
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
        // 1、获取到页面中的dom对象
        var wx_poster = this.selectComponent('#wx_poster')
        // 2、调用inits 初始化
        wx_poster.inits(function (){ 
            console.log('初始化完成')
            // 3、添加海报宽度高度、图片、文字等方法在此处添加
            wx_poster.addImg('https://uploadfile.bizhizu.cn/2015/0723/20150723061023750.jpg')

        })
    },
    // ....代码块
})
```


## 【方法】：

方法或者属性 | 说明
---|---
inits(function) | 在页面的onReady生命周期中进行调用，初始化成功后，才能进行往下走。在回调内才能
showPoster | 属性，默认false，进行隐藏canvas。true显示，一般用于调试
setWH({width: 0,height: 0},[function]) | 设置海报大小。默认你第一张图高度和宽度作为海报宽高。第二个参数可选，返回状态，设置成功(status: 1)还是失败(status: 0)。
addImg(url, [options]) | 方法，进行添加某个图片。可以是数组或者是图片地址。返回值是添加得所有图片
draw | 返回第一个参数回调当前得绘制完成得。第二个参数
setFont(text,[{size: 22,color: '#000', y: 0, x: 0}]) | 参数一：设置文本。参数二：可选，默认值 {size: 22,color: '#000', y: 0, x: 0}
wxCode('url',[{width: 280,height: 280,y: 0, x: 0,deviation: 20,bgColor: '#fff'}]) | 需要后台将小程序码图片弄成透明的背景。使用这个必须在 draw 方法调用成功后回调中使用。参数一：图片的地址（本地地址也可以）。参数二：可选项，默认的值。
generatePic(function (object) {}, [quality]) | 生成图片，第一个参数为函数，回调返回对象，生成失败status为0，返回err信息。生成成功 status为1，返回tempFilePath。第二个参数是可选项，生成图片质量，默认最好的（值为1）

### ~~设置调试模式~~

> ~~我们可以通过 showPoster 设置这个属性进行开启调试。如果不需要调试进行不用设置 showPoster即可，默认为false~~

```
<wx_poster id="wx_poster" showPoster="{{true}}"></wx_poster>
```


### setWH方法：设置海报大小[可选]

> 设置海报大小（宽度和高度），是可选项。就是如果你不知道海报大小是多少，希望后台运营同事上传图片大小来决定话，可以不用设置这个，默认第一张图为海报背景图。

```js
// ... 省略前面的代码
wx_poster.inits(function (){ // 1、必须初始化完成后，才能设置宽度和图片及文字。
    console.log('初始化完成')
    // 2、设置海报宽度和高度
     wx_poster.setWH({
        width: 120,
        height: 444
    })
    // 3、后面才是添加图片及文字.........
})
```

### addImg方法：添加图片

> 如果不设置海报大小，默认取第一张图片大小。

```js
// ... 省略前面的代码
wx_poster.inits(function (){ 
    console.log('初始化完成')
    // 1、没有使用 setWH 方法的话，默认第一张图片的宽度和高度。
    wx_poster.addImg('https://uploadfile.bizhizu.cn/2015/0723/20150723061023750.jpg')
    // 2、第二个参数是可选项，可以设置图片的宽度和高度，还有位置。也就是说，你别管一张图多少，都可以自己缩放下
    wx_poster.addImg('https://m.baidu.com/static/index/plus/plus_logo_web.png', {
        width: 101,
        height: 33,
        y: 122,
        x: 44
    })
})
```

### setFont方法：添加文本

> 添加文字。可以进行添加文本内容，进行设置文字颜色、大小、位置。

```js
// ... 省略前面的代码
wx_poster.inits(function (){ 
    console.log('初始化完成')
    // 1、添加背景图
    wx_poster.addImg('https://uploadfile.bizhizu.cn/2015/0723/20150723061023750.jpg')
    // 2、设置文本
    wx_poster.setFont('标题： wx_poster')
    wx_poster.setFont('wx_poster是我开发的第一个完整项目，开心',{
        size: 16,
        color: '#fff',
        x: 22,
        y: 120
    })
})
```

### draw方法：合成

> 进行将所有加载完成的图片和文字都合成起来。成功后进行回调

```js
wx_poster.inits(function (){ 
    console.log('初始化完成')
    wx_poster.addImg('https://uploadfile.bizhizu.cn/2015/0723/20150723061023750.jpg')
    wx_poster.setFont('标题： wx_poster')
    wx_poster.setFont('wx_poster是我开发的第一个完整项目，开心',{
        size: 16,
        color: '#fff',
        x: 22,
        y: 120
    })
    // 1、合成图片和文字
    wx_poster.draw(function () {
        console.log('合成图片成功')
    })
})
```

### wxCode方法：合并小程序码

> 为什么会单独拿出来了，是因为官方的小程序码没有背景是白色的，或者自定义颜色。那么此处需要和后台一起开发，后台将背景透明加上。注意的地方：

- 必须在draw有回调了，才能合并小程序码
- 小程序码的宽度和高度默认是 280
- 设置y和x轴，默认都是0
- 设置小程序码背景颜色，bgColor: '#fff'
- 图片需要是背景是透明的。
- 小程序码与背景颜色扩张（deviation）距离，默认20

```js
wx_poster.inits(function (){ 
    console.log('初始化完成')
    wx_poster.addImg('https://uploadfile.bizhizu.cn/2015/0723/20150723061023750.jpg')
    wx_poster.setFont('标题： wx_poster')
    wx_poster.setFont('wx_poster是我开发的第一个完整项目，开心',{
        size: 16,
        color: '#fff',
        x: 22,
        y: 120
    })
    // 1、合成图片和文字
    wx_poster.draw(function () {
        console.log('合成图片成功')
        // 2、小程序码，第二个参数是可选项
        // wx_poster.wxCode('https://res.wx.qq.com/wxdoc/dist/assets/img/mydev-qrcode-new.669a7d88.jpg')
         wx_poster.wxCode('https://res.wx.qq.com/wxdoc/dist/assets/img/mydev-qrcode-new.669a7d88.jpg', {
            width: 280, // 默认值
            height: 280, // 默认值
            y: 0, // 默认值
            x: 0, // 默认值
            deviation: 20 // 默认值
        })
    })
})
```

### generatePic 方法，生成图片地址

> 能生成图片地址，可用于展示或者用于导出。第一个参数为返回合成状态与连接。第二个参数为[可选项]合成图片质量，默认为1，从 0.1 - 1值。

```js
wx_poster.inits(function (){ 
    console.log('初始化完成')
    wx_poster.addImg('https://uploadfile.bizhizu.cn/2015/0723/20150723061023750.jpg')
    wx_poster.setFont('标题： wx_poster')
    wx_poster.setFont('wx_poster是我开发的第一个完整项目，开心',{
        size: 16,
        color: '#fff',
        x: 22,
        y: 120
    })
    wx_poster.draw(function () {
        console.log('合成图片成功')
         wx_poster.wxCode('https://res.wx.qq.com/wxdoc/dist/assets/img/mydev-qrcode-new.669a7d88.jpg', {
            width: 120,
            height: 120,
        })
        // 进行导出图片
        wx_poster.generatePic(function (obj) {
            if(obj.status) { // 导出成功
                consle.log('导出成功')
            }else {
                // 导出失败
                consle.log('导出失败')
            }
        }, 1)
    })
})
```


## 【案例】如下：


## 合成



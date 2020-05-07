// components/demo/demo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 420,
    height: 600,
    canvas: null,
    ctx: null,
  },
  ready() {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      let that = this;
    const query = that.createSelectorQuery()
    query.select('#poster_canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
          var canvas = res[0].node
          const ctx = canvas.getContext('2d')
          that.setData({
              canvas,
              ctx
          },function () {
            const img = canvas.createImage()
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              that.setData({
                width: img.width,
                height: img.height
              },function () {
                setTimeout(() => {
                  ctx.drawImage(img, 0, 0, img.width,img.height)

                },1000)
              })
            }
            img.src = '../../img/xiatian.png'
          })
      })
    }
  }
})

 
var slideModal = {

  duration: 500, //动画持续时间 单位毫秒
  timingFunction: 'linear', // 定义动画效果，当前是匀速(其他参考小程序动画文档)
  chooseType: 'default',
  //that 是调用时的页面对象
  on: function(that, chooseType) {
    var this_ = this;
    chooseType = chooseType || this_.chooseType
    var animation = wx.createAnimation({
      duration: this_.duration,
      timingFunction: this_.timingFunction
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(500).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      'panelPage.animationData': animation.export(),
      // 改变view里面的Wx：if
      'panelPage.chooseSize': true,
      'panelPage.chooseType': chooseType,
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        'panelPage.animationData': animation.export(),
        
      })
    }, 20)

  },
  off: function(that) {
    var this_ = this;

    var animation = wx.createAnimation({
      duration: this_.duration,
      timingFunction: this_.timingFunction
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      'panelPage.animationData': animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        'panelPage.animationData': animation.export(),
        'panelPage.chooseSize': false,
        'panelPage.chooseType': ''
      })
    }, 500)

  }
 
}
var filters = {
  toFix: function (value) {
    return value.toFixed(2)//此处2为保留两位小数
  }
}
 
module.exports = {
  slideModal: slideModal,
  filters: filters,
  toFix: filters.toFix
}
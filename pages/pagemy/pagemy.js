// pages/pagemy/pagemy.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu();
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

  onclick:function(event){
    var ty = event.currentTarget.dataset.type;
    if (ty =='giftgivelist'){
      wx.navigateTo({
        url: '/page/component/pages/pagegift/giftgivelist/giftgivelist',
      })
    }
   
  },


  /**账户 */
  accountPage:function(){

     wx.navigateTo({
       url: '/page/component/pages/pagecount/counthome/counthome',
     })
  },
    /**我的订单 */
  myorderPage: function () {

    wx.navigateTo({
      url: '/page/component/pages/pagemy/myorder/myorder',
    })
  }
})
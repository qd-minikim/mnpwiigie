// page/component/pages/pagemy/selcarrier/selcarrier.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCarrier: false,

    isCarrierMsg: '在这里您可以检索快递公司',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getCarrier()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  getCarrier:function(){

    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id//1528869953018820
    var data = {
      code_: 'x_getCarrier',
      
    }

    rRequest.doRequest(url, data, that, function (rdata) {

      wx.hideLoading();

    })
  }
})
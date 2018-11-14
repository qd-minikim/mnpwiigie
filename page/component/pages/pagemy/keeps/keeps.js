// page/component/pages/pagemy/keeps/keeps.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    keepsInfo:[],
    /**分页 */
    itemsPerPage: 10,
    endRow: 0,
    allRows: 0,
    searched:false,

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
    this.getKeeps()
    wx.hideShareMenu();
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
  getKeeps:function(){

    var that = this;
    
    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id//
    var data = {
      code_: 'x_getMyKeeps',
      userid: userid,
      channelType: 'V-3',
      endRow: endRow,
      itemsPerPage: itemsPerPage,
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      if(rdata.infolist){
        that.setData({

          keepsInfo: rdata.infolist,
          allRows: rdata.infocounts
        })

      }

      that.setData({

        
        searched: true
      })

      
      wx.hideLoading();

    })
  },
  showDetail: function (event) {

    var that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;

    var userid = that.data.userInfo.id;

    wx.navigateTo({
      url: "/page/component/pages/pagexdd/pagexdd?m=" + upmarkid + "&r=" + requirementid,
    })

  }
})
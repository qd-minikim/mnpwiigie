// page/component/pages/pagemy/myorder/myorder.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**tab */
    currentTab: 0, // 0自购 1送礼
    /** */
    swiperHeight: 0,

    searched: false,
    /**自购 */
    orderbuysearched: false,
    orderbuyArray: [],

    /**送礼 */
    ordergiftsearched: false,
    ordergiftArray: [],

    /**分页 */
    itemsPerPage: 10,
    orderbuyEndRow: 0,
    orderbuyAllRows: 0,

    ordergiftEndRow: 0,
    ordergiftAllRows: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var swiperHeight = windowHeight - 80 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })

    this.getOrdersInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindChange: function(e) {

    var that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
    });


    if (currentTab == '0') {
      var orderbuysearched = that.data.orderbuysearched;

      if (!orderbuysearched){
        that.getOrdersInfo()
      }
    }
    if (currentTab == '1') {
      var ordergiftsearched = that.data.ordergiftsearched;

      if (!ordergiftsearched) {
        that.getOrdersInfo()
      }
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

      var that = this;

      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current,

        })
      }
    }

    ,

  getOrdersInfo: function() {

    var that = this;
    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })


    var orderType = '2'
    //自购
    if (currentTab == '0') {
      orderType = '2'
      endRow = that.data.orderbuyEndRow;
      allRows = that.data.orderbuyAllRows;
    }

    //送礼
    if (currentTab == '1') {
      orderType = '3'
      endRow = that.data.ordergiftEndRow;
      allRows = that.data.ordergiftAllRows;
    }


    var url = config.orderPayUrl;

    var that = this;
    var url = config.requestUrl;

    var userid = '1528869953018820'; //that.data.userInfo.id



    var data = {
      code_: 'x_getMyOrders',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      orderType: orderType

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        if (currentTab == '0') {
          that.setData({
            orderbuysearched:true,
            orderbuyEndRow: rdata.endRow,
            orderbuyAllRows: rdata.infocounts,
            orderbuyArray: rdata.infolist,
          })

        }

        if (currentTab == '1') {
          that.setData({
            ordergiftsearched: true,
            ordergiftArray: rdata.infolist,
            ordergiftEndRow: rdata.endRow,
            ordergiftAllRows: rdata.infocounts,
          })
        }

      }
      that.setData({
        searched: true,

      })
      wx.hideLoading();

    })



  }

})
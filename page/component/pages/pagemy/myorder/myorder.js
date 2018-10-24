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

    /**自购 */
    orderbuyArray: [],
    /**送礼 */
    ordergiftArray: [],

    /**分页 */
    endRow: 0,
    itemsPerPage: 10,
    allRows: 0,
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
    that.setData({
      currentTab: e.detail.current,
      endRow: 0,
      allRows: 0,
    });

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
          endRow: 0,
          allRows: 0,
        })
      }
    }

    ,

  getOrdersInfo: function() {

    var that = this;
    var currentTab = that.data.currentTab;

    var orderType = '2'
    //自购
    if (currentTab == '0') {
      orderType = '2'
    }

    //送礼
    if (currentTab == '1') {
      orderType = '3'
    }


    var url = config.orderPayUrl;

    var that = this;
    var url = config.requestUrl;

    var userid = '1528869953018820';//that.data.userInfo.id

    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    var data = {
      code_: 'x_getMyOrders',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      orderType: orderType

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          endRow: rdata.endRow,
          allRows: rdata.infocounts,

        })
        if (currentTab == '0') {
          that.setData({
            orderbuyArray: rdata.infolist,

          })
        }

        if (currentTab == '1') {
          that.setData({
            ordergiftArray: rdata.infolist,
          })
        }

      }

    })



  }

})
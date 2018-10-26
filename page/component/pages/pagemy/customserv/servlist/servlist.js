// page/component/pages/pagemy/customserv/servlist/servlist.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**tab */
    clickindex: -1,
    currentTab: 0, // 0自购 1送礼
    /** */
    swiperHeight: 0,

    searched: false,
    /**售后申请 */
    servlistsearched_0: false,
    servlistArray_0: [],

    /**申请记录 */
    servlistsearched_1: false,
    servlistArray_1: [],

    /**分页 */
    itemsPerPage: 10,
    servlistEndRow_0: 0,
    servlistAllRows_0: 0,

    servlistEndRow_1: 0,
    servlistAllRows_1: 0,

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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var swiperHeight = windowHeight - 80 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    try {
      var value = wx.getStorageSync('refresh')
      var currentTab = that.data.currentTab;
      var index = that.data.clickindex;
      if (value && value == '1' && index != '-1') {

        if (currentTab == '0') {

          // var orderbuyArray = that.data.orderbuyArray;
          // orderbuyArray[index].evaluable = '1';
          // that.setData({
          //   orderbuyArray: orderbuyArray,
          // })
        }
        if (currentTab == '1') {
          // that.setData({
          //   ordergiftArray: rdata.infolist,
          // })
        }


      }
    } catch (e) {

    }
    wx.setStorage({
      key: "refresh",
      data: "0",
    })
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

  }
  ,
  bindChange: function (e) {

    var that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
    });


    if (currentTab == '0') {
      var servlistsearched_0 = that.data.servlistsearched_0;

      if (!servlistsearched_0) {
        //that.getOrdersInfo()
      }
    }
    if (currentTab == '1') {
      var servlistsearched_1 = that.data.servlistsearched_1;

      if (!servlistsearched_1) {
        //that.getOrdersInfo()
      }
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },
  getOrdersInfo: function () {

    var that = this;
    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

   
    //售后申请
    if (currentTab == '0') {
      
      endRow = that.data.servlistEndRow_0;
      allRows = that.data.servlistAllRows_0;
    }

    //申请记录
    if (currentTab == '1') {
    
      endRow = that.data.servlistEndRow_1;
      allRows = that.data.servlistAllRows_1;
    }


    var url = config.requestUrl;

    var userid = that.data.userInfo.id



    var data = {
      code_: 'x_getMyOrders',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      orderType: orderType

    }
    rRequest.doRequest(url, data, that, function (rdata) {
servlist
      if (rdata.infolist) {

        if (currentTab == '0') {
          that.setData({
            servlistsearched_0: true,
            servlistEndRow_0: rdata.endRow,
            servlistAllRows_0: rdata.infocounts,
            servlistArray_0: rdata.infolist,
          })

        }

        if (currentTab == '1') {
          that.setData({
            servlistsearched_1: true,
            servlistEndRow_1: rdata.endRow,
            servlistAllRows_1: rdata.infocounts,
            servlistArray_1: rdata.infolist,
          })
        }

      }
      that.setData({
        searched: true,

      })
      wx.hideLoading();

    })



  },
})
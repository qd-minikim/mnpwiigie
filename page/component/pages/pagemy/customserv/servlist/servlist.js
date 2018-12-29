// page/component/pages/pagemy/customserv/servlist/servlist.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rCommon = require('../../../../../../utils/rCommon.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**tab */
    clickindex: -1,
    currentTab: 0, // 0 售后  1 申请记录
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
    // userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // if (app.globalData.userWxInfo) {
    if (app.globalData.userIData) {
      this.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    this.getCusServApplys()


    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
  
    var percent = windowWidth / 750

    var swiperHeight = windowHeight - 80 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
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

    let that = this;

    var currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab,
      searched: false,
    });


    if (currentTab == '0') {
      var servlistsearched_0 = that.data.servlistsearched_0;

      if (!servlistsearched_0) {
        that.getCusServApplys()
      }
    }
    if (currentTab == '1') {
      var servlistsearched_1 = that.data.servlistsearched_1;

      if (!servlistsearched_1) {
        that.getCusServApplys()
      }
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

    let that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },
  getCusServApplys: function() {

    let that = this;
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

    var userid =  that.data.userInfo.id
    var data = {
      code_: 'x_getCusServApply', //x_getMyOrders getCustomerServiceApply
      userid: userid,
      "endRow": endRow,
      "itemsPerPage": itemsPerPage,
      "userid": userid,
      "pageType": currentTab


    }
    rRequest.doRequest(url, data, that, function(rdata) {

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
      if (currentTab == '0') {
        that.setData({
          servlistsearched_0: true,

        })
      }
      if (currentTab == '1') {
        that.setData({
          servlistsearched_1: true,

        })
      }
      that.setData({
        searched: true,

      })
      wx.hideLoading();

    })
  },
  /**售后详情 */
  servdetaPage: function (event) {
    var serviceId = event.currentTarget.dataset.serviceid;
    wx.navigateTo({

      url: '/page/component/pages/pagemy/customserv/servdeta/servdeta?s=' + serviceId,

    })

  },
  /**进度详情(暂时没用，) */
  servjdPage: function (event) {
    var serviceId = event.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/customserv/servjd/servjd?s=' + serviceId,
    })

  },
  /**售后申请 */
  servapply: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/customserv/servadd/servadd?o=' + orderid,
    })
  },

  /**确认收货 */
  surereceve: function(e) {
    let that = this;
    var orderid = e.currentTarget.dataset.orderid;
    var promotionid = e.currentTarget.dataset.proid;
    var requirementid = e.currentTarget.dataset.reqid;
    var receiveSuccessCS = e.currentTarget.dataset.recs;
    var dealtype = e.currentTarget.dataset.detype;
    var deliverytype = e.currentTarget.dataset.deltype;
    var logisticsstatus = e.currentTarget.dataset.lstatus;

    var userid = that.data.userInfo.id;
    if (deliverytype == '2' && logisticsstatus == '1') {

      wx.showModal({
        title: '提示',
        content: '确定收到了商品了吗？',
        success: function(res) {
          if (res.confirm) {
            var data = {
              code_: 'x_doreceive',
              "orderid": orderid,
              "promotion_id": promotionid,
              "requirementid": requirementid,
              "userid": userid
            }

            rCommon.doOrder.orderAction(that, data, function(rdata) {

              wx.showToast({
                title: '确认成功',
                image: '/image/icon_ok.png',
                duration: 2000,
                success: function() {


                }
              })

              that.getOrdersInfo()

            });
          } else if (res.cancel) {

          }

        }
      })

    }
  },
  /**回寄确认收货 */
  suhjrereceve: function(e) {
    let that = this;
    var serviceId = e.currentTarget.dataset.serviceid;
    var userId = e.currentTarget.dataset.buyuserid;
    var userName = e.currentTarget.dataset.username;

    wx.showModal({
      title: '提示',
      content: '确定收到了商品了吗？',
      success: function(res) {
        if (res.confirm) {
          var data = {
            code_: 'x_doHjReceive',
            "serviceId": serviceId,
            "serviceStatus": 61,
            "userId": userId,
            "userName": encodeURIComponent(userName)
          }

          rCommon.doOrder.orderAction(that, data, function(rdata) {

            wx.showToast({
              title: '确认成功',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function() {


              }
            })

            that.getOrdersInfo()

          });
        } else if (res.cancel) {

        }

      }
    })

  },

})
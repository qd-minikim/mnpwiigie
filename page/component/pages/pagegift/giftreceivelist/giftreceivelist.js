// page/component/pages/pagegift/giftreceivelist/giftreceivelist.js

var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var app = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
        giftreceivelist: null,

        searched: false,

        itemsPerPage: 10,
        endRow: 0,
        allRows: 0,
        /**用户信息 */
        userInfo: {},
        //hasUserInfo: false,
        userIData: false,
        // userWxInfo: {},

        isPullDownRefresh: false,
        //是否上拉更多
        isReachBottom: false,
        isRefresh: false,
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
        this.getGiftReceiveListInfo();
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {
        wx.hideShareMenu();
      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
        let that = this;
        try {
          var value = wx.getStorageSync('refresh')
          var currentTab = that.data.currentTab;

          if (value && value == '1') {
            that.setData({
              isRefresh: true
            })
            that.getGiftReceiveListInfo();

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
        // var isPullDownRefresh = this.data.isPullDownRefresh;

        // if (isPullDownRefresh) {

        // } else {

        //   this.setData({
        //     isPullDownRefresh: true
        //   })
        //   this.getGiftReceiveListInfo();
        // }
      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function() {
        var isReachBottom = this.data.isReachBottom;

        if (isReachBottom) {

        } else {

          this.setData({
            isReachBottom: true
          })
          this.getGiftReceiveListInfo();
        }

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function() {

      },
      getGiftReceiveListInfo: function() {

        let that = this
        var isPullDownRefresh = that.data.isPullDownRefresh;
        var isReachBottom = that.data.isReachBottom;
        var isRefresh = that.data.isRefresh;

        var userid = that.data.userInfo.id //that.data.userInfo.id
        var url = config.requestUrl
        var endRow = that.data.endRow;
        var itemsPerPage = that.data.itemsPerPage;
        var allRows = that.data.allRows;

        if (isReachBottom && allRows == endRow) {

          that.setData({
            isReachBottom: false,
          })
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500,
            success: function() {}
          })
          return false
        }
        // if (isPullDownRefresh && allRows == endRow) {

        //   that.setData({
        //     isPullDownRefresh: false,
        //   })
        //   wx.showToast({
        //     title: '没有新礼品',
        //     icon: 'none',
        //     duration: 1500,
        //     success: function () { }
        //   })
        //   wx.stopPullDownRefresh();
        //   return false
        // }

        if (isRefresh || isPullDownRefresh) {
          if (endRow != 0) {

            itemsPerPage = endRow

          }
          endRow = 0;

        }


        wx.showLoading({
          title: '加载中...',
          mask: true,
        })
        var data = {
          code_: 'x_getReceiveGiftList',
          userid: userid,
          endRow: endRow,
          itemsPerPage: itemsPerPage,

        }
        wx.request({
          url: url, //对外地址
          data: data,
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            var rdata = res.data
            if (rdata.infolist) {


              var giftreceivelist = [];
              var giftreceivelistNew = [];
              if (isPullDownRefresh ) {
                giftreceivelist = [];

                wx.stopPullDownRefresh();
              }
              if (isRefresh) {
                giftreceivelist = [];

              }
              if (isReachBottom) {
                giftreceivelist = that.data.giftreceivelist;

              }

              giftreceivelistNew = giftreceivelist.concat(rdata.infolist);

              that.setData({
                'giftreceivelist': giftreceivelistNew,
                'endRow': rdata.endRow,
                'allRows': rdata.infocounts,
                'searched': true,
              })
            }

          },
          fail: res => {

          },
          complete: res => {

            that.setData({

              isPullDownRefresh: false,
              isReachBottom: false,
              isRefresh: false,
            })
            wx.hideLoading();
          }
        })

        // rRequest.doRequest(url, data, that, function (rdata) {

        //   if (rdata.infolist) {

        //     that.setData({
        //       'giftreceivelist': rdata.infolist,
        //       'searched': true,

        //     })
        //   }
      // })

  },
  /**查看物流 */
  wayBill: function(event) {

    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/waybill/waybill?o=' + orderId,
    })

  },
  /**评价晒单*/

  /**评价晒单 */
  evaladd: function(event) {
    let that = this

    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaladd/evaladd?e=' + evalid,
    })
  },
  /**申请售后 */
  serviceApply: function(event) {
    let that = this

    var orderid = event.currentTarget.dataset.orderid;
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


              that.getGiftReceiveListInfo();
            });
          } else if (res.cancel) {

          }

        }
      })

    }
  },

  /** */
  showReceiveDetail: function(event) {

    var id = event.currentTarget.dataset.id;
    var fu = event.currentTarget.dataset.fu;
    wx.navigateTo({
      url: '/page/component/pages/pagegift/giftreceive/giftreceive?gr=' + id + '&fu=' + fu,
    })


  }
})
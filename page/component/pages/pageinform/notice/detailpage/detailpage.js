// page/component/pages/pageinform/notice/detailpage/detailpage.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../../utils/rUserInfo.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeSumId: '',
    noticeSumType: '',
    notices: [],
    selected: false,

    endRow: 0,
    itemsPerPage: 5,
    allCount: 0,

    minheight: 0,
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;


    that.setData({

      noticeSumId: options.ns,
      noticeSumType: options.nt,
    })

    wx.setNavigationBarTitle({
      title: options.nt,
    })
    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })

      that.getNotices()
      that.readNotice()
    } else {

      rUserInfo.getUserInfoApp(that, function(rdata) {

        if (app.globalData.userIData) {
          that.setData({
            // userWxInfo: app.globalData.userWxInfo,
            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          that.getNotices()

        
        }

      })
    }

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    this.setData({
      'minheight': windowHeight,


    })
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

    this.setData({
      endRow: '0',
      allCount: '0',
      isPullDownRefresh: true
    })
    this.getNotices()


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
      this.getNotices()
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getNotices: function() {


    let that = this;

    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allCount = that.data.allCount;

    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
 
    if (isReachBottom && allCount == endRow) {

      that.setData({
        isReachBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function () { }
      })
      return false
    }
 
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820

    var noticeSumId = that.data.noticeSumId
    var data = {
      code_: 'x_getNotices',
      userid: userid,
      noticeSumId: noticeSumId,
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
        
        if (res.data.infolist) {

          var notices = [];
          var noticesNew = [];
          if (isPullDownRefresh) {
            notices = [];
 
            wx.stopPullDownRefresh();
          }
          if (isReachBottom) {
            notices = that.data.notices;

          }

          noticesNew = notices.concat(res.data.infolist);

          that.setData({

            notices: noticesNew,
            selected: true,
            allCount: res.data.infocounts,
            endRow: res.data.endRow,
           
          })


        }
      },
      fail: res => {

      },
      complete: res => {
     
        that.setData({

          isPullDownRefresh: false,
          isReachBottom: false,
        })
        that.readNotice();
        wx.hideLoading();
      }
    })


  },
  readNotice: function() {


    let that = this;

    var url = config.requestUrl;

    var noticeSumId = that.data.noticeSumId
    var data = {
      code_: 'x_readNotice',

      noticeSumId: noticeSumId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

      }

    })
  },
  deleteNotice: function(e) {

    var noticeindex = e.currentTarget.dataset.index;
    var noticeId = e.currentTarget.dataset.noticeid;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除该条记录？',
      cancelText: '取消',
      confirmText: '删除',
      success: function(res) {
        if (res.confirm) {


          var url = config.requestUrl;

          var noticeSumId = that.data.noticeSumId

          var data = {
            code_: 'x_deleNotice',

            noticeSumId: noticeSumId,
            noticeId: noticeId,
          }
          rRequest.doRequest(url, data, that, function(rdata) {

            var notices = that.data.notices;

            notices.splice(noticeindex, 1);
            that.setData({
              notices: notices
            })

            if (notices.length == 0) {

              wx.setStorage({
                key: "refresh",
                data: "1",
              })
            }


          })
        } else if (res.cancel) {

        }
      }
    })



  },
 
  touchStart: function (e) {

    this.setData({
      touchStartTime: e.timeStamp
    })
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {

    this.setData({
      touchEndTime: e.timeStamp
    })
  },
  noticeDetail: function (event) {
    let that = this;
    var pagepath = event.currentTarget.dataset.pagepath;

    if (that.data.touchEndTime - that.data.touchStartTime < 300) {
     
      wx.navigateTo({
        url: "/"+pagepath,
      })
    }
  }
})
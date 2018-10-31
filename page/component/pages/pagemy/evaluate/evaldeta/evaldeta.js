// page/component/pages/pagemy/evaluate/evaldeta/evaldeta.js
var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    evalid: '',
    picsize: 0,
    scrollHeight: 0,
    scrollTop: 0,
    /**星数量 */
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/normal.png',
    selectedSrc: '/image/selected.png',
    halfSrc: '/image/half.png',
    key: 5, //评分

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    evalInfo: {},
    evalDiscuss: [],
    evalDiscussCounts: 0,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载 x_getEvalDet
   */
  onLoad: function(options) {
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }

    var evalid = options.e;

    this.setData({

      evalid: evalid
    })

    this.getEvalDet();

    this.getEvalDiscuss();

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var picsize = (windowWidth - 30 * percent) / 6
    var scrollHeight = windowHeight - app.globalData.bottomBtnHeight * percent
    this.setData({

      picsize: picsize,
      scrollHeight: scrollHeight
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
  getEvalDet: function() {

    var that = this;

    var url = config.requestUrl;
    var evaluationId = that.data.evalid;
    var userid = that.data.userInfo.id
    var data = {
      code_: 'x_getEvalDet',
      userid: userid,
      evaluationId: evaluationId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      console.log("------------")
      if (rdata.info) {

        that.setData({

          evalInfo: rdata.info,
          key: rdata.info.score
        })
      }

    })
  },
  getEvalDiscuss: function() {

    var that = this;

    var url = config.requestUrl;
    var evaluateId = that.data.evalid;
    var userid =  that.data.userInfo.id
    var data = {
      code_: 'x_getEvalDiscuss',
      endRow: 0,
      itemsPerPage: 100,
      userid: userid,
      evaluateId: evaluateId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {


      if (rdata.infolist) {
        that.setData({

          evalDiscuss: rdata.infolist,
          evalDiscussCounts: rdata.infocounts,
        })

        var scrollTop = that.data.scrollTop

        if (scrollTop != 0) {

          that.setData({
            scrollTop: 1000 * that.data.evalDiscuss.length
          });
        }

      }

    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })


  },
  imageYl: function (event) {

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var imageUrlArry = new Array();
    for (var n = 0; n < imgList.length; n++) {

      var imageUrl = imgList[n].relativeurl
      imageUrlArry.push(imageUrl)
    }

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imageUrlArry // 需要预览的图片http链接列表

    })
  },
   
  sendDiscuss: function() {
    var that = this;




    var url = config.requestUrl;
    var evaluationId = that.data.evalid;
    var userid = that.data.userInfo.id
    var discuss = that.data.inputValue;

    if (discuss==''){

      wx.showToast({
        title: '信息不能为空',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })
      return false;
    }
 
    var data = {
      code_: 'x_addEvalDiscuss',
      discuss: encodeURIComponent(discuss),

      userid: userid,
      evaluateid: evaluationId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      console.log("------------")

      that.setData({
        inputValue: '',

      })
      var scrollTop = that.data.scrollTop

      if (scrollTop == 0) {
        that.setData({
          scrollTop: 1,

        })
      }
      that.getEvalDiscuss()


    })


  }
})
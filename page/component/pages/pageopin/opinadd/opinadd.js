// page/component/pages/pageopin/opinadd/opinadd.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**传递参数 */
    requirementId: '',
    /**字数限制 */
    textareaMaxLen: 200,

    /**初始页面 */
    initOpinion: {},
    /**选择的选项 */
    choosecode: '',
    opinionReason: '',

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

    this.setData({

      'requirementId': options.r
    })
    this.getInitOpinion()

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

  getInitOpinion: function () {

    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;

    var data = {
      code_: 'x_getInitOpinion',
      userid: userid,
      requirementid: requirementId,


    }
    rRequest.doRequest(url, data, that, function (rdata) {
      if (rdata.info) {

        that.setData({

          'initOpinion': rdata.info
        })
      }

    })
  }


  ,
  addopinion: function () {
    var that = this;
    var url = config.requestUrl;

    var code = that.data.choosecode;
    var opinionReason = that.data.opinionReason;;

    if (code == '') {

      wx.showToast({
        title: '请选择您的表态',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })

      return false;
    }

    if (opinionReason == '') {

      wx.showToast({
        title: '请输入您的描述',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function () { }
      })

      return false;
    }

    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;
    var promotionId = that.data.initOpinion.promotionid;

    var data = {
      code_: 'x_addopinion',
      opinionType: code,
      opinion_reason: encodeURIComponent(opinionReason),
      userid: userid,
      requirementid: requirementId,
      promotionid: promotionId,
      otherRecommended: '',
      images: [],
      voices: []
    }
    rRequest.doRequest(url, data, that, function (rdata) {

      wx.showToast({
        title: '提交成功',
        image: '/image/icon_ok.png',
        duration: 2000,
        success: function () {


        }
      })

      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000);

    })


  },
  selectCode: function (event) {

    var code = event.currentTarget.dataset.code;

    this.setData({
      'choosecode': code
    });

  },

  //字数限制
  bindWordLimit: function (e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len, //当前字数
      opinionReason: e.detail.value
    });
  }
})
// page/component/pages/pagecount/counthome/counthome.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUserInfo = require('../../../../../utils/rUserInfo.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountInfo: {},
    creditInfo: {},
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    /**tabbar */
    pageScrollView: {
      height: 0
    },
    tabbar: {}, //tabbar 信息
    tabbarPage: '/pages/pagemy/pagemy', //当前页面属于哪个tabbar 默认是null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    app.editTabBar();
    var url = "/page/component/pages/pagecount/counthome/counthome"
    wx.setStorage({
      key: "cardpage",
      data: url,
    })
 
    if (app.globalData.userIData) {
      that.setData({
        
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
      that.getAccount()
      that.getCredit()

    } else {
      rUserInfo.getUserInfoApp(that, function (rdata) {

        if (app.globalData.userIData) {
          that.setData({

            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          
          that.getAccount()
          that.getCredit()

        }

      })
      // app.userLogin();
    }


    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAccount()
    this.getCredit()
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
  getAccount: function() {

    let that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;

    var data = {
      code_: 'x_getAccount',

      userid: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          accountInfo: rdata.info
        })
      }


    })
  },
  /**获取行为积分 */
  getCredit: function() {

    let that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;

    var data = {
      code_: 'x_getCredit',

      userid: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          creditInfo: rdata.info
        })
        //$("#action_point_id").text(info.actionPoint);
      }


    })
  },
  countdetail: function (e) {
    var counttype = e.currentTarget.dataset.counttype;
    var countid = e.currentTarget.dataset.countid;
    wx.navigateTo({
      url: '/page/component/pages/pagecount/countdetail/countdetail?t=' + counttype+'&cid='+countid,
    })
  },
  /**去提现 */
  countoutPage: function() {

    wx.navigateTo({
      url: '/page/component/pages/pagecount/countout/countout',
    })
  }
})
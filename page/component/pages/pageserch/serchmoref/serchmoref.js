// page/component/pages/pageserch/serchmoref/serchmoref.js
 
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
var pageserch = require('../../../../../page/common/pages/pageserch/pageserch.js');
 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    friendUserId:'',

    serchListA:[],

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
        'friendUserId': options.fu,
        'friendUserName': options.fn
      })
    wx.setNavigationBarTitle({
      title: options.fn
    })

     this.getSerchInfoOnFriend();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideShareMenu();
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


  getSerchInfoOnFriend:function(){

    let that = this;

    
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
   
    var fuserid = that.data.friendUserId;
    // var search = '冯';
    var data = {
      code_: 'x_getSerchInfoOnFriend',
      endRow: 0,
      itemsPerPage: 10,
      userid: userid,
      fuserid: fuserid,
    }

    rRequest.doRequest(url, data, that, function (rdata) {
    
      // wx.hideLoading();
      if (rdata.infoList){
        
        that.setData({
          
          'serchListA': rdata.infoList
        })
      }
      
    })
  },
  serchShowDetail: function (event) {
    let that = this;

    var upmarkid = event.currentTarget.dataset.upmarkid;
    var requirementid = event.currentTarget.dataset.requir;
    var userid = that.data.userInfo.id;
    pageserch.pageSerch.showDetail(upmarkid, requirementid, userid);


  },
})
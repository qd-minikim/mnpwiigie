// page/component/pages/pageopin/opinlist/opinlist.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backpage: '',
    requirementId: '',

    opinionInfo: {
      dataInfo: [],
      pageSize: 100,
      allrows: 0
    },
    // 朋友说图片大小
    opinpicsize: 0,
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
    this.setData({
      'requirementId': options.r,
      'role': options.ro
    })

    if (options.ro == 'TW') {

      wx.setNavigationBarTitle({
        title: '友托帮-粉丝说',
      })
    }

    this.getOpinionInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var opinpicsize = (windowWidth - 80 * percent) / 8
    that.setData({

      'opinpicsize': opinpicsize,

    })
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    var backpage = this.data.backpage;

    if (backpage == 'remark') {

      try {
        var value = wx.getStorageSync('refresh')

        if (value && value == '1') {
          that.getOpinionInfo()
        }

      } catch (e) {

      }
      wx.setStorage({
        key: "refresh",
        data: "1",
      })


    }
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
  opinImageYl: function(event) {

    let that = this;

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var indexImg = event.currentTarget.dataset.index;

    var imageUrlArry = new Array();
    for (var n = 0; n < imgList.length; n++) {

      var imageUrl = imgList[n].imageurl
      imageUrl = imageUrl.replace('160', '1024')
      imageUrlArry.push(imageUrl)
    }

    //图片预览
    wx.previewImage({
      current: imageUrlArry[indexImg], // 当前显示图片的http链接
      urls: imageUrlArry // 需要预览的图片http链接列表

    })
  },
  /**获取朋友说 */
  getOpinionInfo: function() {
    let that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;;
    var pageSize = that.data.opinionInfo.pageSize;


    var data = {
      code_: 'x_getOpinionList',
      endRow: 0,
      itemsPerPage: pageSize,
      userid: userid,
      requirementId: requirementId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          'opinionInfo.dataInfo': rdata.info.infolist,
          'opinionInfo.allrows': rdata.info.allrows,
        })
      }
    })
  },
  /**************朋友说留言************** */
  opinremark: function(event) {
    var that = this;
    var o = event.currentTarget.dataset.opinionid;
    var ro = that.data.role;
    this.setData({
      'backpage': 'remark',
    })
    wx.navigateTo({
      url: '/page/component/pages/pageopin/opinremark/opinremark?o=' + o + '&ro=' + ro,
    })
  },
})
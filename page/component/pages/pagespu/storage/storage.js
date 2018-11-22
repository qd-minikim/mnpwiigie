// page/component/pages/pagespu/storage/storage.js

var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spuid: '',
    skuListInfo: [],
    itemsPerPage: 100,
    endRow: 0,
    allRows: 0,

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},

    // 弹出层
    viewModal: {
      isModalShow: false,

    },
    storage: '',
    skuid: '',
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var spuid = options.spuid;
    this.setData({

      spuid: spuid
    })

    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
        spuid: spuid
      })

      this.getSkuList()

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
  closeModal: function() {
    let that = this;
    that.setData({
      'viewModal.isModalShow': false,
    })
  },

  openModal: function(e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    var storage = e.currentTarget.dataset.storage;
    var index = e.currentTarget.dataset.index;
    that.setData({
      'viewModal.isModalShow': true,
      'storage': storage,
      'skuid': id,
      'index': index,
    })
  },

  bindKeyInputStorage: function(e) {
    this.setData({
      storage: e.detail.value
    })
  },
  uppStorage: function() {

      let that = this;

      var url = config.requestUrl;
      var skuid = that.data.skuid;
      var storage = that.data.storage;
      var index = that.data.index;
      var data = {
        code_: 'x_uppStorage',
        "skuid": skuid,
        "storage": storage
      }
      rRequest.doRequest(url, data, that, function(rdata) {

        if (rdata.info) {
          var skuListInfo = that.data.skuListInfo;
          skuListInfo[index].storage = rdata.info.storage
          that.setData({
            skuListInfo: skuListInfo
          })
          wx.setStorage({
            key: "refresh",
            data: "1",
          })


        }
        that.setData({
          'viewModal.isModalShow': false,
        })

      })
    }

    ,
  getSkuList: function() {

    let that = this;

    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var spuid = that.data.spuid
    var itemsPerPage = that.data.itemsPerPage
    var endRow = that.data.endRow

    var data = {
      code_: 'x_getReSkuList',
      "endRow": endRow,
      "itemsPerPage": itemsPerPage,
      "spuid": spuid,
      "userid": userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          skuListInfo: rdata.infolist,
          endRow: rdata.endRow,
          allRows: rdata.infocounts
        })
      }


      wx.hideLoading();

    })
  }
})
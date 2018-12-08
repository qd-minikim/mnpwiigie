// page/component/pages/pagemy/selcarrier/selcarrier.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCarrier: false,

    isCarrierMsg: '在这里您可以检索快递公司',

    scrollView: 0,

    carriersArray: [],

    carriersSearch: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getCarrier()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var scrollViewHeight = windowHeight - 72 * percent

    this.setData({

      'scrollView.height': scrollViewHeight
    })
    wx.hideShareMenu();
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
  //检索
  bindKeyInput: function(e) {
    let that = this;
    var carrier = e.detail.value
    if (carrier == '') {

      that.setData({
        isCarrier: false,
        carriersSearch: [],
        isCarrierMsg: '在这里您可以检索快递公司',
      })
    } else {

      var carriersArray = that.data.carriersArray
      var carriersSearch = [];
      for (var i = 0; i < carriersArray.length; i++) {

        var companyname = carriersArray[i].company_name
        var companycode = carriersArray[i].company_code

        var carrierInfo = {
          carrierName: companyname,
          carrierCode: companycode,
        }

        if (companyname.indexOf(carrier) > -1) {

          carriersSearch.push(carrierInfo)
        }

      }
      var isCarrier = false;
      if (carriersSearch.length > 0) {
        isCarrier = true;
      }

      that.setData({
        isCarrier: isCarrier,
        carriersSearch: carriersSearch,
        isCarrierMsg: "没有检索到快递公司",
      })
    }

  },
  getCarrier: function() {

    let that = this;
    var url = config.requestUrl;

    var data = {
      code_: 'x_getCarrier',

    }

    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {

        that.setData({
          carriersArray: rdata.infolist,

        })


      }

    })
  },
  selectedCarriers:function(e){

    var carrierName = e.currentTarget.dataset.carriername;
    var carrierCode = e.currentTarget.dataset.carriercode;
    var carrierInfo={
      carrierName: carrierName,
      carrierCode: carrierCode,
    }
    app.globalData.carrierInfo = carrierInfo;
    
    wx.navigateBack({
      delta:1
    })
  }
})
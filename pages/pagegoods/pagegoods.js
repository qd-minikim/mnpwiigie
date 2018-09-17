// pages/pagegoods/pagegoods.js
var config = require('../../config.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    loginInfo: app.globalData.loginInfo,
    promotiontag: '',

    
    promotiontagArry: [],

    promotiontagNum: 5, //允许横向显示的个数

    promotiontagCount: 0, //已最小单元划分时，最小单元的个数
    promotiontagWidth: 0, //已最小单元划分时，最小单元的宽度

    goodsArry:[],

    windowWidth: app.globalData.systemInfo.windowWidth,
    screenWidth: app.globalData.systemInfo.screenWidth,
    windowHeight: app.globalData.systemInfo.windowHeight,
    scrollViewHeight:0,
    imageSize: app.globalData.systemInfo.screenWidth

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    this.promotionTag();
    this.getGoods();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    var viewTagHeight = (this.data.screenWidth/750) *100

    this.setData({

      scrollViewHeight: (this.data.windowHeight - viewTagHeight-5)+"px"
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

  promotionTag: function() {
    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_PromotionTag',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log("tag=1=" + res.data.infolist)

        var wCount = 1;

        for (var i = 0; i < res.data.infolist.length; i++) {
          var childrenNum = res.data.infolist[i].children_num;

          if (childrenNum == 0) {

            wCount += 1;
          } else {
            wCount += childrenNum;
          }
        }
        var w = this.data.screenWidth
        var n = this.data.promotiontagNum //默认5个
        var lwidth = w / n;
        if (1 <= wCount && wCount <= n) {
          lwidth = w / wCount;
        }
        if (wCount == 0) {
          lwidth = w / 1;
        }
     

          this.setData({
            promotiontagArry: res.data.infolist,

            promotiontagCount: wCount,
            promotiontagWidth: lwidth+"px" 
          })

      }
    })
  },
 
  selectTag:function(event){
 
    var tagCode = event.currentTarget.dataset.tagcode;

    this.setData({
      promotiontag: tagCode,
    })

    this.getGoods();
  }

  ,

  getGoods: function() {

    // var usreId = this.data.loginInfo.userid
    var usreId = '1527671283933540'
    var tag = this.data.promotiontag;
    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_getGoods',
        goodspageid: 'goodspage_1',
        userid: usreId,
        endRow: '0',
        itemsPerPage: '10',
        promotiontag: tag,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        
        console.log(res.data.infolist)
        this.setData({
            
          goodsArry: res.data.infolist
        })
      }
    })
  }


  //		var data ={"endRow":endRow,"itemsPerPage":itemsPerPage,"promotiontag":tag,"userid":userid, "search":search,"goodspageid":goodspageid};
  //		var url = "/wiigie/wiigiegoods/getGoodspageInfo";
})
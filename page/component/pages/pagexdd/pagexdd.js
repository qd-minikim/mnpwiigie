// page/component/pages/pagexdd/pagexdd.js

var config = require('../../../../config.js')

var routeTree = require('../../../../utils/routeTreeInfo.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requirementInfo: {},

    swiperArea: {
      swiperImgUrls: ['/image/home_swiper_1.jpg', '/image/home_swiper_2.jpg'],
      swiperIndicatorDots: true, //是否显示指示点   
      swiperAutoplay: true, //是否自动切换
      swiperInterval: 2000, //自动切换时间间隔
      swiperDuration: 500, //duration 滑动动画时长
    },
    // progressRouteInfo: null,

    fixedBottom: {
      oneGridWidth: 0,
      twoGridWidth: 0,
      gridNums: 8, //下单 送礼 推荐给 占用两个 首页或客服的 空间

      xdClassName: 'bottom-xd',
      slClassName: 'bottom-sl',
      tjClassName: 'bottom-tj'
    },

    //
    currentnode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getProgressRouteInfo()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


    var windowWidth = app.globalData.systemInfo.windowWidth

    var ongGridWidth = windowWidth / this.data.fixedBottom.gridNums

    this.setData({

      oneGridWidth: ongGridWidth + "px",
      twoGridWidth: (ongGridWidth * 2) + "px"
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

  /**获取详情信息 */

  getRequirementInfo: function() {

  },
 

  drawTest: function() {

    var context = wx.createCanvasContext('route_canvas_id')
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()
  },
  /**获取进展区信息 */

  getProgressRouteInfo: function() {
    var usreId = '1528869953018820';
    var requirementid = '1535359452591612';
    var treetype = 'ZFC12_1';
    wx.request({
      url: config.requestUrl, //仅为示例，并非真实的接口地址
      data: {
        code_: 'x_getRelateTree',
        id: requirementid,
        userid: usreId,
        role: treetype,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        // this.setData({

        //   progressRouteInfo: res.data
        // })
 // var category = 'content_12';
  // var id = 'route_canvas_id';
        routeTree.doProgressRouteInfoImpl(res.data, 'content_12', 'route_canvas_id')
      }
    })
  },
  //   datainfo.put("copies", rMap == null ? 0 : rMap.get("all_copies"));
  //   datainfo.put("orders", rInfo_.size());
  //   datainfo.put("rInfo_", rInfo_);
  // }

  // 			datainfo.put("boder", rBorder);
  // datainfo.put("info_", rInfo);
  doProgressRouteInfo: function() {
    var info = this.data.progressRouteInfo;
    if (info) {

      var boder = info.boder;
      var treetype = info.treetype;
      // $("#dr").attr("width", boder.max_width);
      // $("#dr").attr("height", boder.max_height);

      // $("#dr").css("width", boder.max_width / 3);
      // $("#dr").css("height", boder.max_height / 3);


      // $("#drdiv").height("height", (boder.max_height / 3) + 20);

      // this.doProgressRouteInfoImpl(info.info_, "dr");

      // $("#unlinkfriend_dr").attr("width", boder.max_nl_width);
      // $("#unlinkfriend_dr").attr("height", boder.max_nl_height);
      // $("#unlinkfriend_dr").css("width", boder.max_nl_width / 3);
      // $("#unlinkfriend_dr").css("height", boder.max_nl_height / 3);

      // if (treetype != 'TW') {
      //   if (dealType == '2') {
      //     unLinkFrinds(info.rInfo_, "unlinkfriend_dr");
      //     $("#all_copies_id").text(info.copies);
      //     $("#all_orders_id").text(info.orders);
      //   }

      

    }



  },
 



})
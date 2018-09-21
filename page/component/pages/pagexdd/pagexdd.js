var config = require('../../../../config.js')
var rCommon = require('../../../../utils/rCommon.js')
var rRequest = require('../../../../utils/rRequest.js')
var rUtils = require('../../../../utils/rUtils.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    requirementInfo: {
      keepstatus: '/image/keep_off.png',
      title: '',

    },

    pagePard: {
      headHeight: '110',
      footHeight: '120',
      contentHeight: '',

    },
    panelPage: {
      chooseSize: false,
      chooseType: '',
      animationData: {},
      maskLayerHeight: '',
      maskLayerWidth: '',
    },
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
    currentnode: null,

    //画布信息
    canvasViewInfo: {
      canvasSaveImage: null,
      canvasWidth: '0px',
      canvasHeight: '0px',
      canvasTop: '0px',
      canvasLeft: '0px'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getRequirementKeepInfo()
    this.getProgressRouteInfo()
    //this.test()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight
    var ongGridWidth = windowWidth / this.data.fixedBottom.gridNums
    var percent = windowWidth / 750
    var contentHeight = windowHeight - this.data.pagePard.headHeight * percent - this.data.pagePard.footHeight * percent
    console.log(contentHeight)
    this.setData({

      oneGridWidth: ongGridWidth + "px",
      twoGridWidth: (ongGridWidth * 2) + "px",
      'pagePard.contentHeight': contentHeight,
      'panelPage.maskLayerHeight': windowHeight + "px",
      'panelPage.maskLayerWidth': windowWidth + "px",
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


  test: function() {

    rCommon.canvaProgressRoute.doProgressRouteInfoImpl("ddd")
  },

  clickView_7x: function(event) {
    var that = this

    var clicklx = event.currentTarget.dataset.lx;

    rUtils.slideModal.on(that,clicklx);
   
  },
  hideModal: function(e) {
    var that = this
    rUtils.slideModal.off(that );
    
  },

  /**获取详情 */
  getRequirementDetail: function() {
    var that = this
    var usreId = '1528869953018820';
    var requirementid = '1535359452591612';

    var url = config.requestUrl
    var data = {
      code_: 'x_getRequirementDetail',
      id: requirementid,
      userid: usreId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      that.setData({
        'requirementInfo.title': ''
      })

    })
    // requirementInfo: {
    //   keepstatus: '/image/keep_off.png',
    //     title: '',

    // },
  },
  /**获取收藏信息 */
  getRequirementKeepInfo: function() {
    var that = this
    var usreId = '1528869953018820';
    var requirementid = '1535359452591612';

    var url = config.requestUrl
    var data = {
      code_: 'x_getKeepInfo',
      requirementid: requirementid,
      userid: usreId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {
      var keepstatus = rdata.keepstatus;
      if (keepstatus == 1) {
        that.setData({
          'requirementInfo.keepstatus': '/image/keep_on.png'
        })
      } else {
        that.setData({
          'requirementInfo.keepstatus': '/image/keep_off.png'
        })
      }
    })
  },
  //获取进展区路径图
  getProgressRouteInfo: function() {
    var usreId = '1528869953018820';
    var requirementid = '1535359452591612';
    var treetype = 'ZFC12_1';

    var that = this
    var url = config.requestUrl
    var data = {
      code_: 'x_getRelateTree',
      id: requirementid,
      userid: usreId,
      role: treetype,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      that.setData({

        'canvasViewInfo.canvasWidth':
          (rdata.boder.max_width * config.routeCicleConfig.circleRM) + "px",
        'canvasViewInfo.canvasHeight':
          (rdata.boder.max_height * config.routeCicleConfig.circleRM) + "px",

        'canvasInfo.canvasTop':
          (rdata.boder.max_height * config.routeCicleConfig.circleRM) + "px",
        'canvasInfo.canvasLeft':
          (rdata.boder.max_width * config.routeCicleConfig.circleRM) + "px",

      })
      rCommon.canvaProgressRoute.doProgressRouteInfoImpl(rdata, 'content_12', 'route_canvas_id', that);
      //rCommon.doProgressRouteInfoImpl(rdata, 'content_12', 'route_canvas_id', that);

    });
  },

  /**获取进展区信息 */

  getProgressRouteInfo1: function() {
    var that = this;
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

        that.setData({

          'canvasViewInfo.canvasWidth': (res.data.boder.max_width * config.routeCicleConfig.circleRM) + "px",
          'canvasViewInfo.canvasHeight': (res.data.boder.max_height * config.routeCicleConfig.circleRM) + "px",

          'canvasInfo.canvasTop': (res.data.boder.max_height * config.routeCicleConfig.circleRM) + "px",
          'canvasInfo.canvasLeft': (res.data.boder.max_width * config.routeCicleConfig.circleRM) + "px",

        })
        rCommon.doProgressRouteInfoImpl(res.data, 'content_12', 'route_canvas_id', this);


      }
    })
  },



})
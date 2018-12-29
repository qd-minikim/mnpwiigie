// page/component/pages/pagelink/pagelink.js


var config = require('../../../../config.js');
var rCommon = require('../../../../utils/rCommon.js');
var rRequest = require('../../../../utils/rRequest.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //画布信息
    canvasViewInfo: {
      canvasSaveImage: '',
      canvasWidth: '0',
      canvasHeight: '0',
      canvasTop: '0',
      canvasLeft: '0',
      imageMaxWidth: 0,
      imageMaxHeight: 0,
    },
    /**不在链购的朋友 */
    nolinkCanvasViewInfo: {
      canvasSaveImage: '',
      canvasWidth: '0',
      canvasHeight: '0',
      canvasTop: '0',
      canvasLeft: '0',
      copies: '0',
      orders: '0'

    },
    downSuccess: false,
    downNoLinkSuccess: false,
    percent: 1,

    animationshow: true,
    dealtype: '',
    role: '',
    treetype:'ZFC12_1',
    requirementId:'',
    usreId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

 
    let that = this
    var dt = options.dt;
    var ro = options.ro;
    var r = options.r;
    var u = options.u;
    var treetype ='ZFC12_1'
    var title ='链购-我的链团' 
    if (ro == 'TW') {
      treetype = 'TW';
      title = '链购-活动链团' 
    }


     wx.setNavigationBarTitle({
       title: title,
     })

    that.setData({
      'role': ro,
      'dealtype': dt,
      'treetype': treetype,
      'requirementId':r,
      'usreId':u
    })
    this.getProgressRouteInfo()



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    var role=that.data.role;
    var dealtype = that.data.dealtype;

    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight

 
    var percent = windowWidth / 750

  
    if (role == 'XQ' && dealtype == '2'){
      that.setData({
        'percent': percent,
        'canvasViewInfo.imageMaxWidth': windowWidth,
        'canvasViewInfo.imageMaxHeight': windowHeight * 0.7,
      })
    }else{

      that.setData({
        'percent': percent,
        'canvasViewInfo.imageMaxWidth': windowWidth,
        'canvasViewInfo.imageMaxHeight': windowHeight - 25 * percent,
      })
    }
     
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
  showAction: function (that, param ) {
    let duration = 6000;
    var animation = wx.createAnimation({
      //持续时间5000ms
      duration: duration,
      timingFunction: 'linear',
    });
    //var animation = this.animation
    animation.opacity(0).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    
  setTimeout(function () {
      animation.opacity(0).step()
      that.setData(json)
     
    }, 500)
    setTimeout(function () {
      that.setData({
        'animationshow': false,
      })

    }, duration)
    
  },
 
  imageYl: function(event) {

    var src = event.currentTarget.dataset.src; //获取data-src

    src = encodeURI(src)
    var imgList = new Array();
    imgList.push(src)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })
  },
  //获取进展区路径图
  getProgressRouteInfo: function() {
    let that = this
    var usreId = that.data.usreId;//1493385648561700  1493393524428946
    var requirementid =that.data.requirementId;//1543742012288937 1538373911382413
    var treetype = that.data.treetype; //TW ZFC12_1
 
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
          (rdata.boder.max_width * config.routeCicleConfig.circleRM),
        'canvasViewInfo.canvasHeight':
          (rdata.boder.max_height * config.routeCicleConfig.circleRM),

        'canvasInfo.canvasTop':
          (rdata.boder.max_height * config.routeCicleConfig.circleRM),
        'canvasInfo.canvasLeft':
          (rdata.boder.max_width * config.routeCicleConfig.circleRM),

      })
      if (that.data.dealtype == '2') {
        that.setData({

          'nolinkCanvasViewInfo.canvasWidth':
            (rdata.boder.max_nl_width * config.routeCicleConfig.circleRM),
          'nolinkCanvasViewInfo.canvasHeight':
            (rdata.boder.max_nl_height * config.routeCicleConfig.circleRM),

          'nolinkCanvasViewInfo.canvasTop':
            (rdata.boder.max_nl_height * config.routeCicleConfig.circleRM),
          'nolinkCanvasViewInfo.canvasLeft':
            (rdata.boder.max_nl_width * config.routeCicleConfig.circleRM),
          'nolinkCanvasViewInfo.copies': rdata.copies ? rdata.copies : 0,
          'nolinkCanvasViewInfo.orders': rdata.orders ? rdata.orders : 0,

        })
        if (rdata.rInfo_) {
          rCommon.nolinkCanvaProgressRoute.doProgressRouteInfoImplNolink(rdata, 'content_12', 'no_route_canvas_id', that, function() {});
        }

      }
      rCommon.canvaProgressRoute.doProgressRouteInfoImpl(rdata, 'content_12', 'route_canvas_id', that, function() {
        that.showAction(that,'showaction')
      });
      // if (that.data.requirementInfo.dealtype == '2') { }







    });
  },
})
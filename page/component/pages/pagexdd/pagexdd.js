var config = require('../../../../config.js');
var rCommon = require('../../../../utils/rCommon.js');
var rRequest = require('../../../../utils/rRequest.js');
var rUtils = require('../../../../utils/rUtils.js');
var WxParse = require('../../../../wxParse/wxParse.js');
var rAdvUtils = require('../../../../utils/rAdvUtils.js');
var rUserInfo = require('../../../../utils/rUserInfo.js');
var pagekskujs = require('../../../../page/common/pages/pagesku/pagesku.js');
var clickNative = false;
const app = getApp()
Page({
  /**
   * 页面的初始数据 
   */
  data: {

    backpage: '',
    /**记录有哪个页面返回到当前页，离开该页面时记录，返回时刷新 */

    /**传递的参数 */
    requirementId: '',
    upmarkid: '',
    /**初始化时的数据 */
    initDetail: {},
    ///**{markid:'',upmarkid:'',fmarkid:''} */

    requirementInfo: {},
    richtextInfo: {
      richtextContent: '',
      richtextMore: true,
      richtextShow: false
    },
    // 弹出层
    viewModal: {
      isModalShow: false,
      addtoComossionShow: false, //追加赏金
      myLinkPriceShow: false, //我的链团价
      dynamicLinkPriceShow: false, //动态链团价
    },
    /**转发蒙板 */
    pagemask: {
      isForward: false,
      msgTitle: '',
      msgTitleColor: '',
      msgDesc: '',
      msgDescColor: '',
    },


    keepinfo: {
      keepstatus: '/image/keep_off.png',
    },
    /**spusku:{min_copies:,max_copies:,spuinfo:{},skuinfo:[{},{}],spuname:[{},{}]} */
    spuInfo: {},
    myOrderInfo: {
      orderType: 1, //1选择2:下单拦截选择  3:送礼拦截选择 0:查看
      mySkuInfo: null,
      orderCopies: 1,
      /**根据库存 限购 等控制sku选择时的按钮显示 */
      sureBtn: {
        btntext: '确定',
        btnDisabled: false,
        btnTipMsg: ''

      },
      /**选择规格时的动态赋值变化 */
      selectSkuId: []
    },

    pcPromotionGroupOrderInfo: {},

    pcPromotionGroupsummaryInfo: {},

    opinionInfo: {
      dataInfo: [],
      pageSize: 5,
      allrows: 0
    },

    attributeInfo: {},
    pagePard: {
      headHeight: '40',
      footHeight: 90,
      contentHeight: '',

    },
    panelPage: {
      panelPageTop: false, // false 表示底部上推，true 表示 上不下推
      chooseSize: false,
      chooseType: '',
      animationData: {},
      maskLayerHeight: '',
      maskLayerWidth: '',
      maskPanHeight: '', //例如下单选择等存在底端按钮的时候，按钮上部的view的高度
      maskPanWidth: '',

      msginfo: '',
      isHtml: false,
      userrole: 'XQ'
    },
    swiperArea: {
      swiperImgUrls: [],
      swiperImgUrlsArry: [],
      swiperIndicatorDots: true, //是否显示指示点   
      swiperAutoplay: true, //是否自动切换
      swiperInterval: 2000, //自动切换时间间隔
      swiperDuration: 500, //duration 滑动动画时长
      swiperWidth: 0,
      swiperHeight: 0,
    },
    // progressRouteInfo: null,

    fixedBottom: {
      oneGridWidth: 0,
      twoGridWidth: 0,
      gridNums: 8, //下单 送礼 推荐给 占用两个 首页或客服的 空间

      xdClassName: 'bottom-xd-u',//下单
      slClassName: 'bottom-xd-u',//送礼
      tjClassName: 'bottom-tj',//推荐
      shClassName: 'bottom-sh',//角色是商户时（控制：追加 延期 补库存）
      shClassFlg: '0',//配合classname的标志 0 未下线  1下线

      xdText: '下单',
      xdClick: false,
      slText: '送礼',
      slClick: false,
     

    },

    //
    currentnode: null,

    //画布信息
    canvasViewInfo: {
      canvasSaveImage: null,
      canvasWidth: '0',
      canvasHeight: '0',
      canvasTop: '0',
      canvasLeft: '0'
    },
    /**不在链购的朋友 */
    nolinkCanvasViewInfo: {
      canvasSaveImage: null,
      canvasWidth: '0',
      canvasHeight: '0',
      canvasTop: '0',
      canvasLeft: '0',
      copies: '0',
      orders: '0'

    },
    percent: 1, //rpx 和px的转化比例

    downSuccess: false,
    downNoLinkSuccess: false,

    configMsgInfo: {},

    // 朋友说图片大小
    opinpicsize: 0,

    addToCommission: '', //追加预算
    singlePrice: '',

    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    // userWxInfo: {},

    treetype: 'ZFC12_1',

    /**************详情页新增************** */
    currScrollTop: 0,
    scrollTop: 0,
    navigaheight: 30, //页头导航的高度 
    navigaSelected: 'part0',
    navigeids: {
      'part0': {
        top: 0
      },
      'part1': {
        top: 0
      },
      'part2': {
        top: 0
      },
      'part3': {
        top: 0
      }
    },
    friendActiveArray: [],
    friendActiveEnd: 0,
    friendActiveCount: 0,
    friendActiveItemsPerPage: 50,

    preCopies: 1, //查看我的链团价时的预选份数
    mylinkprice: 0,
    mydiscount: '',

    opinionmsg: '朋友说',
    pageposition:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this
    var fm = options.m;
    var r = options.r;

    // var at = options.at;//好友动态的朋友说参数
    that.setData({
      'requirementId': r,
      'upmarkid': fm,
      'pageposition': options.at ? options.at:''
    })
    // if (options.at && options.at == 'opinion') {
    //   setTimeout(function() {
    //     that.setData({
    //       'navigaSelected': 'part2',
    //       'scrollview': 'part2',
    //     })
    //   }, 2000)

    // }

    var url = "/page/component/pages/pagexdd/pagexdd?m=" + fm + "&r=" + r
    wx.setStorage({
      key: "cardpage",
      data: url,
    })

    if (app.globalData.userIData) {
      that.setData({
        // userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,

      })

      that.getInitDetail()

      that.getRequirementDetail()

      that.getRequirementKeepInfo()

      that.getConfigMsgInfo()


      if (options.advc && options.advp) {
        var loginstatus = app.globalData.loginInfo.loginstatus;
        var isNew = loginstatus == 'ok' ? '0' : '1' //0不是；1是新用户
        var pdata = {
          'isNew': isNew,
          'advCode': options.advc,
          'positionCode': options.advp,
          'pageType': '1',
          'userId': that.data.userInfo.id,
          'parameters': options,
        }
        rAdvUtils.adv.doadv(that, pdata);

      }

    } else {

      rUserInfo.getUserInfoApp(that, function(rdata) {

        if (app.globalData.userIData) {
          that.setData({

            userIData: app.globalData.userIData,
            userInfo: app.globalData.userInfo,
          })
          that.getInitDetail()

          that.getRequirementDetail()

          that.getRequirementKeepInfo()

          that.getConfigMsgInfo()


          if (options.advc && options.advp) {
            var loginstatus = app.globalData.loginInfo.loginstatus;
            var isNew = loginstatus == 'ok' ? '0' : '1' //0不是；1是新用户
            var pdata = {
              'isNew': isNew,
              'advCode': options.advc,
              'positionCode': options.advp,
              'pageType': '1',
              'userId': that.data.userInfo.id,
              'parameters': options,
            }
            rAdvUtils.adv.doadv(that, pdata);

          }
        }

      })
    }

    wx.showLoading({
      title: '加载中...',
      mask: true,
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    let that = this;


    const res = wx.getSystemInfoSync()

    var windowWidth = res.windowWidth
    var windowHeight = res.windowHeight
    var screenHeight = res.screenHeight

    var ongGridWidth = windowWidth / this.data.fixedBottom.gridNums
    var percent = windowWidth / 750

    var footHeight = this.data.pagePard.footHeight


    var contentHeight = windowHeight - this.data.pagePard.headHeight * percent -
      this.data.pagePard.footHeight * percent
    var maskPanHeight = 400 - 120 * percent

    var opinpicsize = (windowWidth - 80 * percent) / 8
    this.setData({

      oneGridWidth: ongGridWidth + "px",
      twoGridWidth: (ongGridWidth * 2) + "px",
      'pagePard.contentHeight': contentHeight,
      'panelPage.maskLayerHeight': windowHeight + "px",
      'panelPage.maskLayerWidth': windowWidth + "px",

      'panelPage.maskPanHeight': maskPanHeight + "px",
      'panelPage.maskPanWidth': windowWidth + "px",

      'swiperArea.swiperWidth': windowWidth + "px",
      'swiperArea.swiperHeight': windowWidth + "px",

      'percent': percent,
      'opinpicsize': opinpicsize,
      'navigaheight': percent * 50,

    })

    this._observer = wx.createIntersectionObserver(this)
    this._observer
      .relativeTo('.scroll-view', {
        bottom: -(contentHeight - 20)
      }).relativeToViewport()
      .observe('.part0', (res) => {
        if (res.intersectionRatio > 0 && !clickNative) {
          that.setData({
            'navigaSelected': 'part0'
          });
        }

      })
    this._observer1 = wx.createIntersectionObserver(this)
    this._observer1
      .relativeTo('.scroll-view', {
        bottom: -(contentHeight - 20)
      }).relativeToViewport()
      .observe('.part1', (res) => {
        if (res.intersectionRatio > 0 && !clickNative) {
          that.setData({
            'navigaSelected': 'part1'
          });
        }

      })
    this._observer3 = wx.createIntersectionObserver(this)
    this._observer3
      .relativeTo('.scroll-view', {
        bottom: -(contentHeight - 20)
      }).relativeToViewport()
      .observe('.part2', (res) => {
        if (res.intersectionRatio > 0 && !clickNative) {
          that.setData({
            'navigaSelected': 'part2'
          });
        }

      })
    this._observer3 = wx.createIntersectionObserver(this)
    this._observer3
      .relativeTo('.scroll-view', {
        bottom: -(contentHeight - 20)
      }).relativeToViewport()
      .observe('.part3', (res) => {
        if (res.intersectionRatio > 0 && !clickNative) {
          that.setData({
            'navigaSelected': 'part3'
          });
        }

      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let that = this;
    var backpage = this.data.backpage;

    if (backpage == 'opinion') {

      try {
        var value = wx.getStorageSync('refresh')

        if (value && value == '1') {
          that.getOpinionInfo()
        }

      } catch (e) {

      }
      wx.setStorage({
        key: "refresh",
        data: "0",
      })


    }
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
        data: "0",
      })


    }
    if (backpage == 'order') {
      try {
        var value = wx.getStorageSync('refresh')

        if (value && value == '2') { //下单成功

          var role = that.data.initDetail.role;

          if (role == "XQ") {
            that.getSpuInfo()
            that.getPcPromotionGroupOrderInfo()

          }

        }
        if (value && value == '3') { //下单失败

          var role = that.data.initDetail.role;

          if (role == "XQ") {

            that.getSpuInfo()
          }

        }

      } catch (e) {

      }
      wx.setStorage({
        key: "refresh",
        data: "0",
      })
    }
    if (backpage == 'gift') {
      try {
        var value = wx.getStorageSync('refresh')

        if (value && value == '2') { //送礼成功/失败

          var role = that.data.initDetail.role;

          if (role == "XQ") {
            that.getSpuInfo()

          }

        }


      } catch (e) {

      }
      wx.setStorage({
        key: "refresh",
        data: "0",
      })
    }
    if (backpage == 'storage') {

      try {
        var value = wx.getStorageSync('refresh')

        if (value && value == '1') {
          that.getRequirementDetail()
        }
      } catch (e) {

      }
      wx.setStorage({
        key: "refresh",
        data: "0",
      })
    }


    that.setData({
      'backpage': '',
    })
    //
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


    let that = this;
    var title = that.data.requirementInfo.wxdescription;
    var fm = that.data.initDetail.fmarkid;;
    var r = that.data.requirementId;
    var swiperImgUrls = that.data.swiperArea.swiperImgUrls;
    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;;

    // var upmarkid = that.data.upmarkid;
    var upmarkid = that.data.initDetail.upmarkid;

    var markid = that.data.initDetail.markid;
    var url = config.requestUrl;

    var data = {
      code_: 'x_addForward',
      "userid": userid,
      "requirement_id": requirementId,
      "upmarkid": upmarkid,
      "markid": markid
    }
    rRequest.doRequest(url, data, that, function(rdata) {


    })
    return {
      title: title,
      path: "/page/component/pages/pagexdd/pagexdd?m=" + fm + "&r=" + r,
      imageUrl: swiperImgUrls[0].imageUrl,
      success: function() {
        wx.showToast({
          title: '分享成功',
          image: '/image/icon_ok.png',
          duration: 2000,
          success: function() {

          }
        })
      },
      fail: function() {

      },

    }


  },

  clickView_7x: function(event) {

    let that = this
    var clicklx = event.currentTarget.dataset.lx;
    var clickcode = event.currentTarget.dataset.code;
    var isHtml = event.currentTarget.dataset.html
    rUtils.slideModal.up(that, clicklx, true);



    that.setData({
      'panelPage.isHtml': isHtml,
    })

    if (clicklx == 'default') {
      if (isHtml) {
        WxParse.wxParse('codemsg', 'html', that.data.configMsgInfo[clickcode], that, 5);

      } else {

        that.setData({
          'panelPage.msginfo': that.data.configMsgInfo[clickcode],
        })
      }
    } else if (clicklx == 'sku') {

      that.mylinkprice(that.data.myOrderInfo.orderCopies);

      var userrole = that.data.initDetail.role;
      var dealtype = that.data.requirementInfo.dealtype;

      that.setData({
        'panelPage.userrole': userrole,
        'panelPage.dealtype': dealtype,
      })

    }

  },
  hideSlideModal: function() {
    let that = this
    rUtils.slideModal.down(that, null, false);

  },

  imageYl: function(event) {

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表

    })
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


    var userrole = that.data.initDetail.role;

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


  openModal: function() {
    let that = this;
    that.setData({
      'viewModal.isModalShow': true,
    })
  },
  closeModal: function() {
    let that = this;
    that.setData({
      'viewModal.isModalShow': false,
    })
  },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    let that = this;
    var url = config.requestUrl;
    var values = [{
        code: 'CBDJSM',
        replace: []
      },
      {
        code: 'THZQ_MSG',
        replace: []
      },
      {
        code: 'HHZQ_MSG',
        replace: []
      },
      {
        code: 'FWJZ_MSG',
        replace: []
      },
      {
        code: 'TGJZ_MSG',
        replace: []
      },
      {
        code: 'CBDJSM',
        replace: []
      },
      {
        code: 'SOWER_PER_MSG',
        replace: []
      },
      {
        code: 'CFG_GROUP_MSG',
        replace: []
      },
      {
        code: 'MSJG_MSG',
        replace: []
      }, {
        code: 'ZJSM',
        replace: []
      }, {
        code: 'CBDJSET',
        replace: []
      },
      {
        code: 'DETAIL_MSG_1', //（详情页）我的折扣说明
        replace: []
      }, {
        code: 'DETAIL_MSG_2', //（详情页）我的链团说明
        replace: []
      }, {
        code: 'DETAIL_MSG_3', //（详情页）其他链团说明
        replace: []
      }, {
        code: 'DETAIL_MSG_4', //（详情页）动态折扣说明
        replace: []
      }, {
        code: 'DETAIL_MSG_5', //（详情页）当前链购说明
        replace: []
      }, {
        code: 'DETAIL_MSG_6', //（详情页）售后服务说明
        replace: []
      }, {
        code: 'DETAIL_MSG_7', //（详情页）门市价格说明
        replace: []
      }, {
        code: 'DETAIL_MSG_8', //（详情页）我的链团价
        replace: []
      }, {
        code: 'DETAIL_MSG_9', //（详情页）我的链团价-说明
        replace: []
      }, {
        code: 'DETAIL_MSG_10', //（详情页）我的链团价-说明
        replace: []
      }, {
        code: 'DETAIL_MSG_11', //（详情页）我的链团价-说明
        replace: []
      },


    ];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function(rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

      }

    });

  },
  getPcPromotionGroupOrderInfo: function() {

    let that = this;

    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820

    var promotionId = that.data.requirementInfo.promotionid;
    var data = {
      code_: 'x_getPcPromotionGroupOrderInfo',
      "promotionid": promotionId,
      "userid": userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {
      if (rdata.info) {


        that.setData({

          pcPromotionGroupOrderInfo: rdata.info
        })
      }


    })

  },
  getPcPromotionGroupsummaryInfo: function() {

    let that = this;

    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820

    var promotionId = that.data.requirementInfo.promotionid;
    var data = {
      code_: 'x_getPcPromotionGroupSummaryInfo',
      "promotionid": promotionId,
      "userid": userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {
      if (rdata.info) {


        that.setData({

          pcPromotionGroupsummaryInfo: rdata.info
        })
      }


    })

  },


  /**获取SpuCoverImage*/
  getSpuCoverImageInfo: function() {
    let that = this
    var spuid = that.data.requirementInfo.spuid;

    var url = config.requestUrl
    var data = {
      code_: 'x_getSpuCoverImageInfo',
      spuid: spuid,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        // imageUrl
        var imageUrlArry = new Array();
        for (var n = 0; n < rdata.info.length; n++) {

          var imageUrl = rdata.info[n].imageUrl
          imageUrlArry.push(imageUrl)
        }
        that.setData({
          'swiperArea.swiperImgUrls': rdata.info,
          'swiperArea.swiperImgUrlsArry': imageUrlArry,
        })
      }
    })
  },
  /**选择sku */
  selectSku: function(event) {
    let that = this
    var skuindex = event.currentTarget.dataset.skuindex;
    var skuids = event.currentTarget.dataset.skuids;
    var vindex = event.currentTarget.dataset.vindex;
    pagekskujs.selectSpuSku.doSelectSpuSku(skuindex, vindex, skuids, that)

    that.orderBtn()
  },



  /**点击确认按钮 */
  sureSelect: function() {
    let that = this
    // pagekskujs.selectSpuSku.sureBtn(that)
    that.hideSlideModal();

    var orderType = that.data.myOrderInfo.orderType;

    var orderData = {
      requirementid: that.data.requirementId,
      userid: that.data.userInfo.id,
      markid: that.data.initDetail.markid,
      upmarkid: that.data.initDetail.upmarkid, //that.data.upmarkid,
      buyCash: Number(that.data.myOrderInfo.mySkuInfo.list_price) * Number(that.data.myOrderInfo.orderCopies),
      skuid: that.data.myOrderInfo.mySkuInfo.id,
      spuid: that.data.requirementInfo.spuid,
      promotionid: that.data.requirementInfo.promotionid,
      buycopies: that.data.myOrderInfo.orderCopies,
      unitPrice: that.data.myOrderInfo.mySkuInfo.list_price,
      ordertype: orderType,
      sku_desc: that.data.myOrderInfo.mySkuInfo.sku_desc,
      /**20190103新加 */
      dealtype: that.data.requirementInfo.dealtype,
      myorderrefound: that.data.myOrderInfo.myrefound
    }



    if (orderType == '1') {

      that.orderBtn()
    }


    if (orderType == '2') { //1选择2:下单拦截选择  3:送礼拦截选择 0 查看
      app.globalData.orderData = orderData


      that.setData({
        'backpage': 'order',
      })
      wx.navigateTo({
        //url: '/page/component/pages/pageorder/pageorder',
        url: '/page/component/pages/pageorder/orderconfirm/orderconfirm',
      })
    }

    if (orderType == '3') { //1选择2:下单拦截选择  3:送礼拦截选择 0 查看
      app.globalData.orderData = orderData

      that.setData({
        'backpage': 'gift',
      })
      wx.navigateTo({
        url: '/page/component/pages/pagegift/giftorder/giftorder',
      })
    }


  },


  /**获取spu*/
  getSpuInfo: function() {

    let that = this
    var spuid = that.data.requirementInfo.spuid;

    var promotionid = that.data.requirementInfo.promotionid;
    var url = config.requestUrl
    var data = {
      code_: 'x_getSpuInfo',
      spuid: spuid,
      promotionid: promotionid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          spuInfo: rdata.info,

        })

        /**判断是佛存在自选的skuinfo */
        var maySkuInfo = that.data.myOrderInfo.mySkuInfo;


        if (maySkuInfo) {
          var skuInfo = that.data.spuInfo.skuinfo;
          var storage = maySkuInfo.storage
          for (let i = 0; i < skuInfo.length; i++) {

            if (skuInfo[i].id == maySkuInfo.id) {

              storage = skuInfo[i].storage
            }

          }

          that.setData({
            'myOrderInfo.mySkuInfo.storage': storage,
          })
          var spuname = that.data.spuInfo.spuname;

          for (var i = 0; i < spuname.length; i++) {

            for (var x = 0; x < spuname[i].skuspecvalues.length; x++) {
              var dataskuids = spuname[i].skuspecvalues[x].sku_id;

              if (dataskuids.indexOf(maySkuInfo.id) >= 0) {
                pagekskujs.selectSpuSku.doSelectSpuSku(i, x, dataskuids, that)

              }

            }

          }

        } else {
          var skuInfo = that.data.spuInfo.skuinfo;

          var spuname = that.data.spuInfo.spuname;

          that.setData({
            'myOrderInfo.mySkuInfo': skuInfo[0],
            'myOrderInfo.orderType': 1, //1选择2:下单拦截选择  3:送礼拦截选择
            'myOrderInfo.orderCopies': 1,
            'myOrderInfo.orderCopies': 1,
            'myOrderInfo.selectSkuId': skuInfo[0].id
          })

          for (var i = 0; i < spuname.length; i++) {

            for (var x = 0; x < spuname[i].skuspecvalues.length; x++) {
              var dataskuids = spuname[i].skuspecvalues[x].sku_id;

              if (dataskuids.indexOf(skuInfo[0].id) >= 0) {
                pagekskujs.selectSpuSku.doSelectSpuSku(i, x, dataskuids, that)

              }

            }

          }


        }

        that.orderBtn()
        pagekskujs.uppdateCopies.canBuyCopies(that, that.data.myOrderInfo.orderCopies);

      }

    })


  },

  orderBtn: function() {
    let that = this;
    var available = that.data.myOrderInfo.mySkuInfo.available_status;

    var storage = that.data.requirementInfo.keep_storage;

    var progressStatus = that.data.requirementInfo.progress_status;
    var progressStatusName = that.data.requirementInfo.progress_status_name;
    if (progressStatus == '0') {


      if (available != '0') {

        that.setData({

          'fixedBottom.xdClassName': 'bottom-xd-u',
          'fixedBottom.xdText': '已下架',
          'fixedBottom.xdClick': false,

          'fixedBottom.slClassName': 'bottom-xd-u',
          'fixedBottom.slText': '已下架',
          'fixedBottom.slClick': false,
        })

      } else {
        if (Number(storage) <= 0) {

          that.setData({

            'fixedBottom.xdClassName': 'bottom-xd-u',
            'fixedBottom.xdText': '已售罄',
            'fixedBottom.xdClick': false,

            'fixedBottom.slClassName': 'bottom-xd-u',
            'fixedBottom.slText': '已售罄',
            'fixedBottom.slClick': false,
          })
        } else {
          that.setData({

            'fixedBottom.xdClassName': 'bottom-xd',
            'fixedBottom.xdText': that.data.requirementInfo.button_name,
            'fixedBottom.xdClick': true,

            'fixedBottom.slClassName': 'bottom-sl',
            'fixedBottom.slText': '送礼',
            'fixedBottom.slClick': true,
          })

        }

      }

    } else {

      that.setData({

        'fixedBottom.xdClassName': 'bottom-xd-u',
        'fixedBottom.xdText': progressStatusName,
        'fixedBottom.xdClick': false,

        'fixedBottom.slClassName': 'bottom-xd-u',
        'fixedBottom.slText': progressStatusName,
        'fixedBottom.slClick': false,
  
      })

      if (progressStatus == '6'){

        that.setData({

          'fixedBottom.shClassName': 'bottom-sh-u',
          'fixedBottom.shClassFlg': '1',
        })

      }


      
    }  

  },
  /**获取sku */
  /**获取详情 */
  getRequirementDetail: function() {
    let that = this
    var usreId = that.data.userInfo.id;
    var requirementid = that.data.requirementId;

    var url = config.requestUrl
    var data = {
      code_: 'x_getRequirementDetail',
      id: requirementid,
      userid: usreId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          requirementInfo: rdata.info,
          /**keep_storage */
          'opinionInfo.pageSize': rdata.info.pt_opi_num ? rdata.info.pt_opi_num : 5
        })

        if (rdata.info.requirement_person != usreId) {


          that.setData({

            'fixedBottom.xdClassName': 'bottom-xd-u',
            'fixedBottom.xdText': that.data.requirementInfo.button_name,
            'fixedBottom.xdClick': false,

            'fixedBottom.slClassName': 'bottom-xd-u',
            'fixedBottom.slText': '送礼',
            'fixedBottom.slClick': false,
          })

          that.getPcPromotionGroupOrderInfo()


        }
        if (rdata.info.requirement_person == usreId) {

          that.getPcPromotionGroupsummaryInfo()

          that.setData({
            treetype: 'TW'

          })
        }
        that.getOpinionInfo()

        that.getSpuCoverImageInfo()
        that.getSpuInfo()
        that.getRequirementRichtext()
        that.getAttribute()

      }


    })

  },
  showRichtext: function() {
    let that = this;
    that.setData({
      'richtextInfo.richtextMore': false,
      'richtextInfo.richtextShow': true
    })

  },
  /**获取展开详情信息 */
  getAttribute: function() {
    let that = this

    var spuid = that.data.requirementInfo.spuid;;

    var url = config.requestUrl
    var data = {
      code_: 'x_getAttribute',
      spuid: spuid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          attributeInfo: rdata.info
        })
      }

    })

  },


  /**获取展开详情信息 */
  getRequirementRichtext: function() {
    let that = this
    var usreId = '';
    var spuid = that.data.requirementInfo.spuid;;

    var url = config.requestUrl
    var data = {
      code_: 'x_getRequirementRichtext',
      spuid: spuid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {
      var richtext = rdata.info.richtext_content;
      /**
       * WxParse.wxParse(bindName , type, data, target,imagePadding)
       * 1.bindName绑定的数据名(必填)
       * 2.type可以为html或者md(必填)
       * 3.data为传入的具体数据(必填)
       * 4.target为Page对象,一般为this(必填)
       * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
       */

      WxParse.wxParse('richtext', 'html', richtext, that, 5);

    })

  },


  /**执行收藏操作 */
  doRequirementKeepInfo: function() {

    let that = this

    var requirementid = that.data.requirementId;
    var userid = that.data.userInfo.id;

    var url = config.requestUrl
    var data = {
      code_: 'x_keepdone',
      requirementid: requirementid,
      userid: userid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      var keepstatusmsg = rdata.keepstatusmsg;

      wx.showToast({
        title: keepstatusmsg,
        icon: 'success',
        duration: 2000,
        success: function() {
          that.getRequirementKeepInfo();
        }
      })

    })
  },
  /**详情页初始化 */
  getInitDetail: function() {
      let that = this
      var usreId = that.data.userInfo.id;
      var requirementid = that.data.requirementId;
      var upmarkid = that.data.upmarkid;
      var url = config.requestUrl
      var data = {
        code_: 'x_initDetail',
        m: upmarkid,
        r: requirementid,
        u: usreId,
      }
      rRequest.doRequest(url, data, that, function(rdata) {

        if (rdata.info) {
          ///**{markid:'',upmarkid:'',fmarkid:'',role:'XQ/TW'EARN_READ:''} */
          that.setData({
            'initDetail': rdata.info,
          })
          var role = rdata.info.role;

          if (role == "TW") {
            that.setData({
              'opinionmsg': '粉丝说',
            })
          }
          if (role == "XQ"){
            var pageposition = that.data.pageposition;
            if (pageposition && pageposition == 'opinion') {
             // setTimeout(function () {
                that.setData({
                  'navigaSelected': 'part2',
                  'scrollview': 'part2',
                })
              //}, 2000)

            }
          }
          wx.hideLoading();
          that.getFriendInfo();
          setTimeout(function() {


            if (rdata.info.EARN_READ && rdata.info.EARN_READ != '') {
              wx.showModal({
                title: '恭喜',
                content: rdata.info.EARN_READ,
                showCancel: false,
                confirmText: '知道了',
                success: function(res) {

                }
              })

            }

          }, 500)




        }


      })

    }

    ,
  /**获取收藏信息 */
  getRequirementKeepInfo: function() {
    let that = this
    var usreId = that.data.userInfo.id;
    var requirementid = that.data.requirementId;

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
          'keepinfo.keepstatus': '/image/keep_on.png'
        })
      } else {
        that.setData({
          'keepinfo.keepstatus': '/image/keep_off.png'
        })
      }
    })
  },


  /** */

  updateCopies: function(event) {
    //var src = event.currentTarget.dataset.src; //获取data-src
    var doType = event.currentTarget.dataset.dotype;
    let that = this;
    if (doType == 'add') {
      pagekskujs.uppdateCopies.addCopies(that);
    }
    if (doType == 'sub') {
      pagekskujs.uppdateCopies.subCopies(that);
    }
  },


  order: function() {

    let that = this

    var isHtml = false
    rUtils.slideModal.up(that, 'sku', true);
    that.setData({
      'myOrderInfo.orderType': 2, //1选择2:下单拦截选择  3:送礼拦截选择
    })
    that.mylinkprice(that.data.myOrderInfo.orderCopies);

    var userrole = that.data.initDetail.role;
    var dealtype = that.data.requirementInfo.dealtype;

    that.setData({
      'panelPage.userrole': userrole,
      'panelPage.dealtype': dealtype,
    })

  },

  gift: function() {

    let that = this

    var isHtml = false
    rUtils.slideModal.up(that, 'sku', true);
    that.setData({
      'myOrderInfo.orderType': 3, //1选择2:下单拦截选择  3:送礼拦截选择
    })
    that.mylinkprice(that.data.myOrderInfo.orderCopies);

    var userrole = that.data.initDetail.role;
    var dealtype = that.data.requirementInfo.dealtype;

    that.setData({
      'panelPage.userrole': userrole,
      'panelPage.dealtype': dealtype,
    })

  },

  unbindDateChange: function () {
    let that =this;
    var progressStatusName = that.data.requirementInfo.progress_status_name
    wx.showModal({
      title: '提示',
      content: '该活动' + progressStatusName,
      showCancel: false,
      confirmText: '知道了',
      success: function (res) { }
    })

  },

  /**延期 */
  bindDateChange: function(e) {




    var newDate = e.detail.value;

    let that = this;


    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var requirementid = that.data.requirementId;
    var data = {
      code_: 'x_uppDeadlineTime',
      "deadlinetime": newDate,
      "requirement_id": requirementid,
      "userid": userid
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {}
      wx.showToast({
        title: '延期成功',
        image: '/image/icon_ok.png',
        duration: 2000,
        success: function() {}
      })

      that.setData({
        'requirementInfo.deadlinetime': newDate
      })

    })
  },
  // 关闭弹窗--追加赏金
  closecommission: function() {
    let that = this;
    that.setData({
      'viewModal.addtoComossionShow': false,
    })
  },
  /**追加 */
  opencommission: function() {
    let that = this;

    var shClassFlg = that.data.fixedBottom.shClassFlg
    if (shClassFlg == '1') {
      var progressStatusName = that.data.requirementInfo.progress_status_name
      wx.showModal({
        title: '提示',
        content: '该活动' + progressStatusName,
        showCancel: false,
        confirmText: '知道了',
        success: function (res) { }
      })

    } else {

      that.setData({
        'viewModal.addtoComossionShow': true,

      })
      WxParse.wxParse('codemsg', 'html', that.data.configMsgInfo.ZJSM, that, 5);

      WxParse.wxParse('codemsg1', 'html', that.data.configMsgInfo.CBDJSET, that, 5);
    }


  },
  bindKeyInputCommission: function(e) {
    this.setData({
      addToCommission: e.detail.value
    })
  },
  bindKeyInputSinglePrice: function(e) {
    this.setData({
      singlePrice: e.detail.value
    })
  },


  /**追加 */
  addcommission: function() {

    // commissionPayUrl
    let that = this;
    var url = config.commissionPayUrl;

    //先判断红包传播单价是否是0，如果是0则
    var settlementsingleprice = that.data.requirementInfo.settlementsingleprice;
    /** */
    var singlePrice = that.data.singlePrice
    if (settlementsingleprice == '' || settlementsingleprice <= 0) {

      if (singlePrice == '') {
        wx.showToast({
          title: '传播单价为空',
          image: '/image/icon_warn.png',
          duration: 1500,
          success: function() {}
        })
        return false;
      }
      if (Number(singlePrice) == NaN) {
        wx.showToast({
          title: '单价金额不正确',
          image: '/image/icon_warn.png',
          duration: 1500,
          success: function() {}
        })
        return false;
      }
      if (Number(singlePrice) == 0) {
        wx.showToast({
          title: '传播单价为零',
          image: '/image/icon_warn.png',
          duration: 1500,
          success: function() {}
        })
        return false;
      }
      if (Number(singlePrice) < 0) {
        wx.showToast({
          title: '传播单价小于零',
          image: '/image/icon_warn.png',
          duration: 1500,
          success: function() {}
        })
        return false;
      }


    }

    /**追加酬金 */
    var addToCommission = that.data.addToCommission
    if (addToCommission == '') {
      wx.showToast({
        title: '追加酬金为空',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }
    if (Number(addToCommission) == NaN) {
      wx.showToast({
        title: '金额不正确',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }
    if (Number(addToCommission) == 0) {
      wx.showToast({
        title: '追加酬金为零',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }
    if (Number(addToCommission) < 0) {
      wx.showToast({
        title: '追加酬金小于零',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }

    if (Number(addToCommission) < Number(singlePrice)) {
      wx.showToast({
        title: '酬金小于单价',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }


    var userid = that.data.userInfo.id
    var prepaytype = 'B'
    var requirementid = that.data.requirementId;
    var upmarkid = that.data.initDetail.upmarkid;
    var markid = that.data.initDetail.markid;

    var dataInfo = {
      "userid": userid,
      "fee": addToCommission,
      "prepaytype": prepaytype,
      "requirementid": requirementid,
      "upmarkid": upmarkid,
      "markid": markid
    }

    rRequest.doRequest(url, dataInfo, that, function(rdata) {
      if (rdata.info) {
        wx.requestPayment({
          timeStamp: rdata.info.timeStamp, //时间戳
          nonceStr: rdata.info.nonceStr, //随机字符串
          package: rdata.info.package, //统一下单接口返回的 prepay_id 参数值
          signType: rdata.info.signType, //签名算法
          paySign: rdata.info.paySign, //签名
          success: function(res) {

            wx.showToast({
              title: '追加成功',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function() {}
            })

            that.setData({
              addToCommission: '',
              singlePrice: ''
            })
            that.closecommission();

            if (settlementsingleprice == '' || settlementsingleprice <= 0) {
              that.uppSingleprice(singlePrice)
            } else {
              setTimeout(function() {
                that.getRequirementDetail()
              }, 5000)


            }


          },
          fail: function(res) {

          },
          complete: function(res) {

          }
        })

      }


    })


  },

  uppSingleprice: function(singleprice) {

    var that = this;

    var url = config.requestUrl;
    var requirementId = that.data.requirementId;
    var data = {
      code_: 'x_uppSingleprice',
      'singleprice': singleprice,
      'id': requirementId
    }
    rRequest.doRequest(url, data, that, function(rdata) {
      setTimeout(function() {
        that.getRequirementDetail()
      }, 5000)


    })
  },

  /**转发蒙板 */
  forwardfriend: function() {
    this.setData({
      'pagemask.isForward': true,
      'pagemask.msgTitle': '请点击右上角,选择【发送给朋友】以便进行链购优享'
    })

  },
  closeforwardfriend: function() {
    this.setData({
      'pagemask.isForward': false,
      'pagemask.msgTitle': ''
    })

  },
  /**首页 */
  homepage: function() {

    wx.switchTab({
      url: '/pages/pagehome/pagehome',
    })

  },
  /**客服聊天 */
  customerpage: function() {
    var r = this.data.requirementId;
    /**type = 1:消费者 0：商户  t == 1时 c =''*/
    wx.navigateTo({

      url: '/page/component/pages/pagedialog/dialog/dialog?t=1&r=' + r + '&d=',

    })

  },

  /**客服聊天--需求者 */
  customerpagelist: function() {
    var r = this.data.requirementId;

    wx.navigateTo({

      url: '/page/component/pages/pagedialog/dialoglist/dialoglist?r=' + r,

    })

  },
  /**添加库存 */
  addstorage: function() {

    let that =this;
 
    var shClassFlg = that.data.fixedBottom.shClassFlg
    if (shClassFlg =='1'){
      var progressStatusName = that.data.requirementInfo.progress_status_name
      wx.showModal({
        title: '提示',
        content: '该活动' + progressStatusName,
        showCancel: false,
        confirmText: '知道了',
        success: function (res) { }
      })

    }else{

      var spuid = that.data.requirementInfo.spuid;

      wx.navigateTo({

        url: '/page/component/pages/pagespu/storage/storage?spuid=' + spuid,

      })
      that.setData({
        'backpage': 'storage',
      })
    }
   
  },

  /**我要说 */
  addopinion: function(event) {
    var requirementId = this.data.requirementId;
    this.setData({
      'backpage': 'opinion',
    })
    wx.navigateTo({
      url: '/page/component/pages/pageopin/opinadd/opinadd?r=' + requirementId,
    })

  },
  /**更多朋友说 */
  moreopinion: function(event) {
    var requirementId = this.data.requirementId;
    var role = this.data.initDetail.role;
    this.setData({
      'backpage': 'remark',
    })
    wx.navigateTo({
      url: '/page/component/pages/pageopin/opinlist/opinlist?r=' + requirementId + '&ro=' + role,
    })

  },


  /**************详情页新增************** */

  initNavigeiPoint: function() {

    let that = this;

    const query0 = wx.createSelectorQuery()
    query0.select('#part0').boundingClientRect()
    query0.selectViewport().scrollOffset()
    query0.exec(function(res) {
      // navigetops.push(res[0].top)
      that.setData({
        'navigeids.part0.top': res[0].top
      })
    })


    const query1 = wx.createSelectorQuery()
    query1.select('#part1').boundingClientRect()
    query1.selectViewport().scrollOffset()
    query1.exec(function(res) {
      // navigetops.push(res[0].top)
      that.setData({
        'navigeids.part1.top': res[0].top
      })
    })
    const query2 = wx.createSelectorQuery()
    query2.select('#part2').boundingClientRect()
    query2.selectViewport().scrollOffset()
    query2.exec(function(res) {
      // navigetops.push(res[0].top)
      that.setData({
        'navigeids.part2.top': res[0].top
      })
    })
    const query3 = wx.createSelectorQuery()
    query3.select('#part3').boundingClientRect()
    query3.selectViewport().scrollOffset()
    query3.exec(function(res) {
      // navigetops.push(res[0].top)
      that.setData({
        'navigeids.part3.top': res[0].top
      })
    })

  },

  pageNativeScroll: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.pid;
    let scrollTop = that.data.scrollTop;
    let navigaheight = that.data.navigaheight;

    let currScrollTop = that.data.currScrollTop;

    let navigaSelected = that.data.navigaSelected;


    if (navigaSelected == id) {
      return;
    }
    clickNative = true;
    that.setData({
      'navigaSelected': id,
      'scrollview': id,

    });

    setTimeout(function() {
      clickNative = false;

    }, 1000)

  },
  // 关闭弹窗--我的链团价
  openlinkprice: function() {
    let that = this;

    var preCopies = that.data.myOrderInfo.orderCopies


    that.setData({
      'viewModal.myLinkPriceShow': true,
      'preCopies': preCopies
    })


    that.mylinkprice(preCopies)


    WxParse.wxParse('codemsg9', 'html', that.data.configMsgInfo.DETAIL_MSG_9, that, 5);


  },
  subpre: function() {
    let that = this;

    var preCopies = that.data.preCopies

    if (preCopies == 1) {
      return;
    }
    preCopies = preCopies - 1;

    that.mylinkprice(preCopies)


  },
  addpre: function() {
    let that = this;
    var preCopies = that.data.preCopies

    if (preCopies == 9999999) {
      return;

    }
    preCopies = preCopies + 1;
    that.mylinkprice(preCopies)
  },

  mylinkprice: function(preCopies) {
    let that = this;
    var role = that.data.initDetail.role;

    var dealtype = that.data.requirementInfo.dealtype;

    if (role == 'TW') {
      return;
    }

    if (dealtype != '2') {
      return;
    }

    var skuprice = that.data.myOrderInfo.mySkuInfo.list_price;
    var cfggroupgradeinfos = that.data.requirementInfo.cfggroupgradeinfos

    var combinedCopies = that.data.pcPromotionGroupOrderInfo.combinedCopies
    var mylinkCopies = combinedCopies + preCopies

    var mylinkDiscount = 1
    var mydiscount = ''
    for (let i = 0; i < cfggroupgradeinfos.length; i++) {
      var minCopiesGrade = cfggroupgradeinfos[i].min_copies_grade
      var maxCopiesGrade = cfggroupgradeinfos[i].max_copies_grade
      var gradeDiscount = cfggroupgradeinfos[i].grade_discount
      var discount = cfggroupgradeinfos[i].discount

      if (mylinkCopies <= maxCopiesGrade && mylinkCopies >= minCopiesGrade) {

        mylinkDiscount = gradeDiscount;
        mydiscount = discount;
        break;
      }

    }
    var mylinkprice = preCopies * mylinkDiscount * skuprice;
    var myrefound = preCopies * (1 - mylinkDiscount) * skuprice;

    that.setData({
      'mydiscount': mydiscount,
      'preCopies': preCopies,
      'mylinkprice': mylinkprice.toFixed(2),
      'myOrderInfo.myrefound': myrefound
    })
  },

  // 关闭弹窗--我的链团价
  closelinkprice: function() {
    let that = this;
    that.setData({
      'viewModal.myLinkPriceShow': false,
    })
  },

  // 关闭弹窗--动态链团价
  opendynamiclinkprice: function() {
    let that = this;
    that.setData({
      'viewModal.dynamicLinkPriceShow': true,
    })

    var skuprice = that.data.myOrderInfo.mySkuInfo.list_price;
    var discount = that.data.pcPromotionGroupsummaryInfo.averageDiscount;

    var linkprice = ''
    if (Number(discount) > 0 && Number(discount) < 1) {

      linkprice = Number(discount) * Number(skuprice)
      linkprice = linkprice.toFixed(2)
    } else {

      linkprice = Number(skuprice)
      linkprice = linkprice.toFixed(2)
    }


    var DETAIL_MSG_10 = that.data.configMsgInfo.DETAIL_MSG_10;

    DETAIL_MSG_10 = DETAIL_MSG_10.replace("@linkprice", linkprice)

    WxParse.wxParse('codemsg10', 'html', DETAIL_MSG_10, that, 5);

    WxParse.wxParse('codemsg11', 'html', that.data.configMsgInfo.DETAIL_MSG_11, that, 5);


  },
  // 关闭弹窗--动态链团价
  closedynamiclinkprice: function() {
    let that = this;
    that.setData({
      'viewModal.dynamicLinkPriceShow': false,
    })
  },
  // 获取好友动态

  getFriendInfo: function() {


    let that = this;
    var url = config.requestUrl;
    var userid = that.data.userInfo.id;
    var requirementId = that.data.requirementId;;
    var role = that.data.initDetail.role;

    var endRow = 0;
    var itemsPerPage = 100;
    var data = {
      code_: 'x_getFriendActiveInfo',
      role: role,
      requirementid: requirementId,
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.infolist) {


        that.setData({
          friendActiveArray: rdata.infolist,
          friendActiveEnd: rdata.endRow,
          friendActiveCount: rdata.infocounts
        })


      }
    })
  },
  /**************拆出路径图新增************** */

  linkpage: function() {
    var that = this;
    var dt = that.data.requirementInfo.dealtype;
    var ro = that.data.initDetail.role;
    var r = that.data.requirementId;
    var u = that.data.userInfo.id;

    wx.navigateTo({
      url: '/page/component/pages/pagelink/pagelink?dt=' + dt + '&ro=' + ro + '&r=' + r + '&u=' + u,
    })
  },
  /**************朋友说留言************** */
  opinremark: function(event) {
    var that = this;
    var o = event.currentTarget.dataset.opinionid;
    var ro = that.data.initDetail.role;
    this.setData({
      'backpage': 'remark',
    })
    wx.navigateTo({
      url: '/page/component/pages/pageopin/opinremark/opinremark?o=' + o + '&ro=' + ro,
    })
  },

})
// page/component/pages/pagegift/giftdeta/giftdeta.js
var config = require('../../../../../config.js');
var rCommon = require('../../../../../utils/rCommon.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUtils = require('../../../../../utils/rUtils.js');
var WxParse = require('../../../../../wxParse/wxParse.js');
var pagekskujs = require('../../../../../page/common/pages/pagesku/pagesku.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

    giftInfo: {
      giftRecordId: '',
      giftInfo: null,
      giftRecordInfo: null,
      fUserNickname: '',
      tUserNickname: '',
      skuinfo: null,

    },

    requirementInfo: {},

    richtextInfo: {
      richtextContent: '',
      richtextMore: true,
      richtextShow: false
    },
    viewModal: {
      isModalShow: false,

    },
    keepinfo: {
      keepstatus: '/image/keep_off.png',
    },
    /**spusku:{min_copies:,max_copies:,spuinfo:{},skuinfo:[{},{}],spuname:[{},{}]} */

    spuInfo: {},
    myOrderInfo: {
      orderType: 0, //1选择2:下单拦截选择  3:送礼拦截选择 0 查看
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


    pagePard: {
      headHeight: '110',
      footHeight: '0',
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
      isHtml: false
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

    // fixedBottom: {
    //   oneGridWidth: 0,
    //   twoGridWidth: 0,
    //   gridNums: 8, //下单 送礼 推荐给 占用两个 首页或客服的 空间

    //   xdClassName: 'bottom-xd',
    //   slClassName: 'bottom-sl',
    //   tjClassName: 'bottom-tj'
    // },

    //
    // currentnode: null,

    configMsgInfo: {},

    processMsg: '',
    /**用户信息 */
    userInfo: {},
    //hasUserInfo: false,
    userIData: false,
    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var giftRecordId = options.gr;
    this.setData({
      'giftInfo.giftRecordId': giftRecordId,

    })
    if (app.globalData.userWxInfo) {
      this.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
    }
    this.getGiftInfo();



  },
  panelPageTop: function() {
    var that = this;

    that.setData({
      'panelPage.panelPageTop': true,
      'panelPage.msginfo': '',
    })
    rUtils.slideModal.down(that, 'pagetop', true);
    setTimeout(function() {
      rUtils.slideModal.up(that, null, false);

      that.setData({
        'panelPage.panelPageTop': false,
      })
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight
    // var ongGridWidth = windowWidth / this.data.fixedBottom.gridNums
    var percent = windowWidth / 750
    var contentHeight = windowHeight - this.data.pagePard.headHeight * percent - this.data.pagePard.footHeight * percent

    var maskPanHeight = 400 - 120 * percent
    var orderType = this.data.myOrderInfo.orderType;
    if (orderType == '0') {
        maskPanHeight = 400
    }

    this.setData({

      // oneGridWidth: ongGridWidth + "px",
      // twoGridWidth: (ongGridWidth * 2) + "px",
      'pagePard.contentHeight': contentHeight,
      'panelPage.maskLayerHeight': windowHeight + "px",
      'panelPage.maskLayerWidth': windowWidth + "px",

      'panelPage.maskPanHeight': maskPanHeight + "px",
      'panelPage.maskPanWidth': windowWidth + "px",

      'swiperArea.swiperWidth': windowWidth + "px",
      'swiperArea.swiperHeight': windowWidth + "px",
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


  test: function() {

    rCommon.canvaProgressRoute.doProgressRouteInfoImpl("ddd")
  },

  getGiftInfo: function() {
    var that = this;
    var url = config.requestUrl;

    var gr = that.data.giftInfo.giftRecordId;
    var data = {
      code_: 'x_getGiftInfo',
      gr: gr,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          //   'opinionInfo.dataInfo': rdata.info,
          'giftInfo.giftInfo': rdata.info.giftInfo,
          'giftInfo.giftRecordInfo': rdata.info.giftRecordInfo,
          'giftInfo.fUserNickname': rdata.info.fUserNickname,
          'giftInfo.tUserNickname': rdata.info.tUserNickname,
          'giftInfo.skuinfo': rdata.info.skuinfo,
          'myOrderInfo.mySkuInfo': rdata.info.skuinfo,
          'myOrderInfo.orderCopies': rdata.info.orderInfo.buyCopies,
        })


        that.getRequirementKeepInfo()
        // this.getProgressRouteInfo()
        that.getRequirementRichtext()
        that.getRequirementDetail()
        that.getSpuInfo()
        // this.getSkuInfo()
        that.getSpuCoverImageInfo()
        that.getConfigMsgInfo()
        // this.getOpinionInfo()
        that.panelPageTop()
      }



    })

  },

  clickView_7x: function(event) {
    /**
     *  data-lx='default' data-code='CBDJSM' data-html='true'
     *  data-lx='sku' data-code='' data-html='false'
     */
    var that = this
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


    }

  },

  hideSlideModal: function(e) {
    var that = this
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

  /**获取朋友说 */
  getOpinionInfo: function() {
    var that = this;
    var url = config.requestUrl;

    var userid = that.data.userInfo.id;
    var requirementId = that.data.giftInfo.giftInfo.requirementId;
    var data = {
      code_: 'x_getOpinionList',
      endRow: 0,
      itemsPerPage: 10,
      userid: userid,
      requirementId: requirementId,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          'opinionInfo.dataInfo': rdata.info,

        })
      }
    })
  },


  openModal: function() {
    var that = this;
    that.setData({
      'viewModal.isModalShow': true,
    })
  },
  // closeModal: function () {
  //   var that = this;
  //   that.setData({
  //     'viewModal.isModalShow': false,
  //   })
  // },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;

    var processStatus = that.data.giftInfo.giftRecordInfo.processStatus;
    if (processStatus == '24') {
      processStatus = '23';
    }
    var PROCESS_ = 'PROCESS_' + processStatus;

    var tUserNickname = that.data.giftInfo.tUserNickname;

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
      },
      {
        code: PROCESS_,
        replace: [{
          regexp: 'nickname',
          replacement: tUserNickname
        }]
      }

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

          'processMsg': rdata.info[PROCESS_]
        })

      }

    });

  },
  /**获取SpuCoverImage*/
  getSpuCoverImageInfo: function() {
    var that = this
    var spuid = that.data.giftInfo.giftInfo.spuId;

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
    var that = this
    var skuindex = event.currentTarget.dataset.skuindex;
    var skuids = event.currentTarget.dataset.skuids;
    var vindex = event.currentTarget.dataset.vindex;
    pagekskujs.selectSpuSku.doSelectSpuSku(skuindex, vindex, skuids, that)
  },

  /**获取spu*/
  getSpuInfo: function() {

    var that = this
    var spuid = that.data.giftInfo.giftInfo.spuId;

    var promotionid = that.data.giftInfo.giftInfo.promotionId;
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
        var orderCopies = that.data.myOrderInfo.orderCopies;

        if (maySkuInfo) {



        } else {

          maySkuInfo = that.data.spuInfo.skuinfo;
          orderCopies = 1;
        }
        //var skuInfo = that.data.spuInfo.skuinfo;

        var spuname = that.data.spuInfo.spuname;

        that.setData({
          'myOrderInfo.mySkuInfo': maySkuInfo,
          'myOrderInfo.orderType': 0, //1选择2:下单拦截选择  3:送礼拦截选择 0查看
          'myOrderInfo.orderCopies': orderCopies,
          // 'myOrderInfo.orderCopies': 1,
          'myOrderInfo.selectSkuId': maySkuInfo.id
        })

        for (var i = 0; i < spuname.length; i++) {


          for (var x = 0; x < spuname[i].skuspecvalues.length; x++) {
            var dataskuids = spuname[i].skuspecvalues[x].sku_id;

            if (dataskuids.indexOf(maySkuInfo.id) >= 0) {
              pagekskujs.selectSpuSku.doSelectSpuSku(i, x, dataskuids, that)

            }

          }

        }



        pagekskujs.uppdateCopies.canBuyCopies(that, that.data.myOrderInfo.orderCopies);

      }


    })


  },
  getSkuInfo: function() {
    var that = this

    var spuid = that.data.giftInfo.giftInfo.spuId;
    var promotionid = that.data.giftInfo.giftInfo.promotionId;
    var url = config.requestUrl
    var data = {
      code_: 'x_getRequirementDetail',
      id: requirementid,
      userid: usreId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          requirementInfo: rdata.info

        })

        var s = that.data.requirementInfo.cfggroupgradeinfos;

        var ss = '';
      }


    })


  },

  /**获取sku */
  /**获取详情 */
  getRequirementDetail: function() {
    var that = this
    var usreId = that.data.userInfo.id;
    var requirementid = that.data.giftInfo.giftInfo.requirementId;

    var url = config.requestUrl
    var data = {
      code_: 'x_getRequirementDetail',
      id: requirementid,
      userid: usreId,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {

        that.setData({
          requirementInfo: rdata.info

        })

        var s = that.data.requirementInfo.cfggroupgradeinfos;

        var ss = '';
      }


    })

  },
  showRichtext: function() {
    var that = this;
    that.setData({
      'richtextInfo.richtextMore': false,
      'richtextInfo.richtextShow': true
    })

  },

  /**获取展开详情信息 */
  getRequirementRichtext: function() {
    var that = this
    var usreId = that.data.userInfo.id;;
    var spuid = that.data.giftInfo.giftInfo.spuId;

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

    var that = this

    var requirementid = that.data.giftInfo.giftInfo.requirementId;
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
  /**获取收藏信息 */
  getRequirementKeepInfo: function() {
    var that = this
    var usreId = that.data.userInfo.id;
    var requirementid = that.data.giftInfo.giftInfo.requirementId;

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



})
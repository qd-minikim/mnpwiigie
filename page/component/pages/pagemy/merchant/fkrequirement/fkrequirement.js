// page/component/pages/pagemy/merchant/fkrequirement/fkrequirement.js

var config = require('../../../../../../config.js');
var rRequest = require('../../../../../../utils/rRequest.js');
var rUpload = require('../../../../../../utils/rUpload.js');
var WxParse = require('../../../../../../wxParse/wxParse.js');
var rCommon = require('../../../../../../utils/rCommon.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    promotionid: '',
    initFq: {},
    pcPromotion: {},
    attributeInfo: {},

    configMsgInfo: {},

    headHeight: '95',
    footHeight: '90',
    contentHeight: 0,

    //展示
    richtextMore: true,
    richtextShow: false,

    //
    title: '',

    commissionfocus: false,
    commission: '0',

    singlepricefocus: false,
    singleprice: '0',
    singlepricedisable: false,
    deadlinetime: '',


    showGroupGrade: true,
    showGroupGradeArrow: '/image/arrow_down_2.png',

    forwardcontrol: '',
    aidcontrol: '',
    initialcontrol: '',

    //参数

    requirementid: '',
    markid: '',

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

    var that = this
    var promotionid = options.p;
    var requirementid = options.r;
    that.setData({

      promotionid: promotionid,
      requirementid: requirementid
    })

    if (app.globalData.userWxInfo) {
      that.setData({
        userWxInfo: app.globalData.userWxInfo,
        userIData: app.globalData.userIData,
        userInfo: app.globalData.userInfo,
      })
      that.initPage()
      that.getConfigMsgInfo()

      that.getPcPromotion()
    } else {
      rUserInfo.getUserInfoApp(that, function(rdata) {
        console.log("rUserInfo is ", app.globalData);
        that.setData({
          userWxInfo: app.globalData.userWxInfo,
          userIData: app.globalData.userIData,
          userInfo: app.globalData.userInfo,
        })

        that.initPage()
        that.getConfigMsgInfo()

        that.getPcPromotion()
      })

    }

    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750
    var contentHeight = windowHeight - this.data.footHeight * percent -
      this.data.headHeight * percent
    this.setData({

      'pagePard.contentHeight': contentHeight,
      contentHeight: contentHeight
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

  titleinput: function(e) {
    var title = e.detail.value
    this.setData({

      title: title,

    })
  },
  /**传播预算获取焦点 */
  commissionfocus: function(e) {
    var singleprice = this.data.singleprice

    var commission = e.detail.value
    if (Number(commission) <= 0) {
      this.setData({
        commission: '',
      })
    }
    this.setData({

      commissionfocus: true,
      singleprice: Number(singleprice).toFixed(2),
    })
  },
  /**传播预算失去焦点 */
  commissionblur: function(e) {
    var that = this;
    var commission = e.detail.value
    var singleprice = this.data.singleprice

    if (Number(commission) <= 0) {
      commission = 0
      that.setData({

        singlepricedisable: true,
      })
    } else {

      that.setData({

        singlepricedisable: false,
      })
    }

    that.setData({
      commission: Number(commission).toFixed(2),
      commissionfocus: false,
      singleprice: Number(singleprice).toFixed(2),
    })
  },
  commissioninput: function(e) {
    var commission = e.detail.value
    var that = this;
    var n = Number(commission);

    if (n <= 0) {
      that.setData({
        commission: Number(commission).toFixed(2),
        singleprice: Number(0).toFixed(2),
        singlepricedisable: true,
      })
    } else {
      var singleprice = that.data.initFq.settlement_single_price
      that.setData({
        commission: commission,
        singleprice: Number(singleprice).toFixed(2),
        singlepricedisable: false,
      })

    }

  },
  /**传播单价获取焦点 */
  singlepricefocus: function(e) {

    var singleprice = e.detail.value
    if (Number(singleprice) <= 0) {
      this.setData({
        singleprice: '',
      })
    }
    this.setData({

      singlepricefocus: true,

    })
  },
  /**传播单价失去焦点 */
  singlepriceblur: function(e) {
    var singleprice = e.detail.value
    if (Number(singleprice) <= 0) {
      singleprice = 0
    }
    this.setData({
      singleprice: Number(singleprice).toFixed(2),
      singlepricefocus: false,

    })
  },
  singlepriceinput: function(e) {
    var singleprice = e.detail.value

    this.setData({

      singleprice: singleprice,

    })
  },

  initPage: function() {

    var that = this

    var userid = that.data.userInfo.id;
    var promotionId = that.data.promotionid
    var requirementid = that.data.requirementid
    var url = config.requestUrl
    var data = {
      code_: 'x_getInitFqPage',

      u: userid,
      pm: promotionId,
      r: requirementid,

    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info) {
        var commission = rdata.info.commission ? rdata.info.commission : '0'
        var singleprice = rdata.info.settlement_single_price ? rdata.info.settlement_single_price : '0'
        that.setData({
          initFq: rdata.info,
          'deadlinetime': rdata.info.the_day,
          'singleprice': Number(singleprice).toFixed(2),
          'commission': Number(commission).toFixed(2),
          'forwardcontrol': rdata.info.forward_control,
          'aidcontrol': rdata.info.aid_control,
          'initialcontrol': rdata.info.initial_control,

        })
      }

    })

  },
  /**获取配置描述 */
  getConfigMsgInfo: function() {
    var that = this;
    var url = config.requestUrl;
    var values = [{
      code: 'CJZWSS',
      replace: []
    }, {
      code: 'ZGCJJE',
      replace: []
    }, {
      code: 'ZGCJ',
      replace: []
    }, {
      code: 'CBDJSM',
      replace: []
    }, {
      code: 'CBDJJE',
      replace: []
    }, {
      code: 'CFG_GROUP_MSG',
      replace: []
    }];


    var data = {
      code_: 'x_getConfigMsgInfo',
      /**[{code:xxxx,replace:[{regexp:xxx,replacement:xxxx},{}]},{}] */
      values: values,
      model: 'V-3',
      contentcode: 'content_12'
    }
    rCommon.configMsgInfo.getConfigMsg(url, data, that, function(rdata) {
      if (rdata.info) {

        that.setData({
          configMsgInfo: rdata.info,

        })

        WxParse.wxParse('cbdjms', 'html', rdata.info.CBDJSM, that, 5);
        WxParse.wxParse('cfg_group_msg', 'html', rdata.info.CFG_GROUP_MSG, that, 5);
        // WxParse.wxParse('richtext', 'html', richtext, that, 5);
      }

    });

  },
  /**获取展开详情信息 */
  getAttribute: function() {
    var that = this

    var spuid = that.data.pcPromotion.spuId;;

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
    var that = this
    var usreId = '';
    var spuid = that.data.pcPromotion.spuId;;

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
  getPcPromotion: function() {

    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    var promotionId = that.data.promotionid
    var typeflg = 'add'
    var flg = ''
    var data = {
      code_: 'x_getPcPromotion',
      "promotionId": promotionId,
      "typeflg": typeflg,
      "flg": flg
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.status == '1') {

        if (rdata.info) {
          that.setData({
            pcPromotion: rdata.info,
            'title': rdata.info.title
          })
        }


        that.getAttribute();
        that.getRequirementRichtext();
      } else {

        wx.showModal({
          title: '提示',
          content: rdata.msg,
          showCancel: false,
          confirmText: '知道了',
          success: function(res) {}
        })
      }
      wx.hideLoading();
    })
  },

  /**展开 */
  showRichtext: function() {

    var that = this;
    that.setData({
      'richtextMore': false,
      'richtextShow': true
    })

  },
  showGroupGrade: function(e) {
    var that = this;

    var showGroupGrade = that.data.showGroupGrade;
    if (showGroupGrade) {
      that.setData({
        'showGroupGrade': false,
        'showGroupGradeArrow': '/image/arrow_right_1.png'
      })
    } else {
      that.setData({
        'showGroupGrade': true,
        showGroupGradeArrow: '/image/arrow_down_2.png'

      })
    }



  },
  /**活动截止 */
  bindDateChange: function(e) {

    var newDate = e.detail.value;
    this.setData({
      deadlinetime: newDate
    })

  },

  continuePay: function(e) {
    var that = this;

    wx.showModal({
      title: '提示',
      content: '付款成功后，您的活动将可以被好友发现和分享了',
      success: function(res) {
        if (res.confirm) {
          that.toPayCommission()
        } else if (res.cancel) {

        }
      }
    })


  },


  toPayCommission: function() {

    var that = this;
    var url = config.commissionPayUrl;

    var commission = that.data.commission

    if (Number(commission) <= 0) {
      wx.showToast({
        title: '传播预算为零',
        image: '/image/icon_warn.png',
        duration: 1500,
        success: function() {}
      })
      return false;
    }
    var userid = that.data.userInfo.id
    var prepaytype = 'A'
    var requirementid = that.data.requirementid;
    var upmarkid = '0';
    var markid = that.data.initFq.markid;

    var dataInfo = {
      
      "userid": userid,
      "fee": commission,
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
              title: '支付成功',
              image: '/image/icon_ok.png',
              duration: 2000,
              success: function() {}
            })

            wx.redirectTo({
              url: "/page/component/pages/pagexdd/pagexdd?m=0&r=" + requirementid,
            })

          },
          fail: function(res) {

          },
          complete: function(res) {

          }
        })

      }


    })


  }
})
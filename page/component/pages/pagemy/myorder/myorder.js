// page/component/pages/pagemy/myorder/myorder.js
var config = require('../../../../../config.js');
var rRequest = require('../../../../../utils/rRequest.js');
var rUtils = require('../../../../../utils/rUtils.js');
const app = getApp()
var unpayordernum = 0;
var unpaygiftnum = 0;
var giftTimerDown = []

var gifttime = null;

var ordertime = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**tab */
    // clickindex:-1,
    currentTab: 0, // 0自购 1送礼
    /** */
    swiperHeight: 0,

    // searched: false,
    /**自购 */
    orderbuysearched: false,
    orderbuyArray: [],

    /**送礼 */
    ordergiftsearched: false,
    ordergiftArray: [],

    /**分页 */
    itemsPerPage: 10,
    orderbuyEndRow: 0,
    orderbuyAllRows: 0,

    ordergiftEndRow: 0,
    ordergiftAllRows: 0,

    isPullDownRefresh: false,
    //是否上拉更多
    isReachBottom: false,
    isRefresh: false,
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
    this.getOrdersInfo()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var windowWidth = app.globalData.systemInfo.windowWidth
    var windowHeight = app.globalData.systemInfo.windowHeight

    var percent = windowWidth / 750

    var swiperHeight = windowHeight - 80 * percent
    this.setData({

      swiperHeight: swiperHeight + "px",

    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    try {
      var value = wx.getStorageSync('refresh')
      var currentTab = that.data.currentTab;
      // var index = that.data.clickindex;
      if (value && value == '1') {

        if (currentTab == '0') {

          that.setData({
            // orderbuyEndRow: 0,
            // orderbuyAllRows: 0,
            isRefresh: true,
          });
          that.getOrdersInfo();

        }
        if (currentTab == '1') {

          that.setData({
            // ordergiftEndRow: 0,
            // ordergiftAllRows: 0,
            isRefresh: true,
          });
          that.getOrdersInfo();
        }


      }
    } catch (e) {

    }
    wx.setStorage({
      key: "refresh",
      data: "0",
    })
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
  scroll: function(e) {

  },

  upper: function(e) {

  },
  lower: function(e) {

    var isReachBottom = this.data.isReachBottom;

    if (isReachBottom) {

    } else {

      this.setData({
        isReachBottom: true
      })
      this.getOrdersInfo();
    }



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindChange: function(e) {

    let that = this;

    var currentTab = e.detail.current;

    that.setData({
      currentTab: currentTab,
      // searched: false,

      isPullDownRefresh: false,
      isReachBottom: false,
      isRefresh: false,
    });

    if (currentTab == '0') {
      var orderbuysearched = that.data.orderbuysearched;

      if (!orderbuysearched) {

        that.getOrdersInfo()
      }
    }
    if (currentTab == '1') {
      var ordergiftsearched = that.data.ordergiftsearched;

      if (!ordergiftsearched) {
        that.getOrdersInfo()
      }
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

    let that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,

      })
    }
  },

  getOrdersInfo: function() {

    let that = this;
    var isPullDownRefresh = that.data.isPullDownRefresh;
    var isReachBottom = that.data.isReachBottom;
    var isRefresh = that.data.isRefresh;

    var currentTab = that.data.currentTab;
    var itemsPerPage = that.data.itemsPerPage;
    var endRow = that.data.endRow;
    var allRows = that.data.allRows;

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })

    var orderType = '2'
    //自购
    if (currentTab == '0') {
      orderType = '2'
      endRow = that.data.orderbuyEndRow;
      allRows = that.data.orderbuyAllRows;
    }

    //送礼
    if (currentTab == '1') {
      orderType = '3'
      endRow = that.data.ordergiftEndRow;
      allRows = that.data.ordergiftAllRows;
    }
    if (isRefresh) {

      endRow = 0;
      itemsPerPage = allRows;
    }

    if (isReachBottom && allRows == endRow) {

      that.setData({
        isReachBottom: false,
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1500,
        success: function() {}
      })
      return false
    }



    var url = config.requestUrl;

    var userid = that.data.userInfo.id



    var data = {
      code_: 'x_getMyOrders',
      userid: userid,
      endRow: endRow,
      itemsPerPage: itemsPerPage,
      orderType: orderType

    }
    // rRequest.doRequest(url, data, that, function(rdata) {
    wx.request({
      url: url, //对外地址
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.infolist) {

          if (currentTab == '0') {

            var orderbuyArray = [];
            var orderbuyArrayNew = [];
            if (isPullDownRefresh) {
              orderbuyArray = [];

              wx.stopPullDownRefresh();
            }
            if (isReachBottom) {
              orderbuyArray = that.data.orderbuyArray;

            }

            orderbuyArrayNew = orderbuyArray.concat(res.data.infolist);
            that.setData({
              orderbuysearched: true,
              orderbuyEndRow: res.data.endRow,
              orderbuyAllRows: res.data.infocounts,
              orderbuyArray: orderbuyArrayNew,
            })

            var unpayorder = [];
            for (let i = 0; i < orderbuyArrayNew.length; i++) {
              if (orderbuyArrayNew[i].buy_status == '0') {
                orderbuyArrayNew[i].unpayindex = i;
                unpayorder.push(orderbuyArrayNew[i])

                /////////////////////////////////////////////
                let currentTime = orderbuyArrayNew[i].now_time
                let enddate = orderbuyArrayNew[i].buy_end_time

                let currentTimeD = new Date(currentTime.replace(/-/g, "/"));
                let enddateD = new Date(enddate.replace(/-/g, "/"));

                let leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数
                if (leftTime>0){
                  let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                  let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                  let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
                  let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数

                  let daysT = checkTime(days);
                  let hoursT = checkTime(hours);
                  let minutesT = checkTime(minutes);
                  let secondsT = checkTime(seconds);

                  orderbuyArrayNew[i].cHours = hoursT
                  orderbuyArrayNew[i].cMinutes = minutesT
                  orderbuyArrayNew[i].cCseconds = secondsT
                }else{

                  orderbuyArrayNew[i].cHours = '00'
                  orderbuyArrayNew[i].cMinutes = '00'
                  orderbuyArrayNew[i].cCseconds = '00'
                }
             

              }

            }

            that.setData({
              orderbuyArray: orderbuyArrayNew,
              unpayorder: unpayorder
            })
            that.operation('order');

          }

          if (currentTab == '1') {

            var ordergiftArray = [];
            var ordergiftArrayNew = [];
            if (isPullDownRefresh) {
              ordergiftArray = [];

              wx.stopPullDownRefresh();
            }
            if (isReachBottom) {
              ordergiftArray = that.data.ordergiftArray;

            }

            ordergiftArrayNew = ordergiftArray.concat(res.data.infolist);


            that.setData({
              ordergiftsearched: true,
              ordergiftArray: ordergiftArrayNew,
              ordergiftEndRow: res.data.endRow,
              ordergiftAllRows: res.data.infocounts,
            })

            var unpaygiftorder = [];
            for (let i = 0; i < ordergiftArrayNew.length; i++) {
              if (ordergiftArrayNew[i].buy_status == '0') {
                ordergiftArrayNew[i].unpayindex = i;
                unpaygiftorder.push(ordergiftArrayNew[i])

                /////////////////////////////////////////////
                let currentTime = ordergiftArrayNew[i].now_time
                let enddate = ordergiftArrayNew[i].buy_end_time

                let currentTimeD = new Date(currentTime.replace(/-/g, "/"));
                let enddateD = new Date(enddate.replace(/-/g, "/"));

                let leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数

                if (leftTime > 0) {
                  let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                  let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                  let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
                  let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数

                  let daysT = checkTime(days);
                  let hoursT = checkTime(hours);
                  let minutesT = checkTime(minutes);
                  let secondsT = checkTime(seconds);

                  ordergiftArrayNew[i].cHours = hoursT
                  ordergiftArrayNew[i].cMinutes = minutesT
                  ordergiftArrayNew[i].cCseconds = secondsT
                }else{
                  ordergiftArrayNew[i].cHours = '00'
                  ordergiftArrayNew[i].cMinutes = '00'
                  ordergiftArrayNew[i].cCseconds = '00'

                }
      
              }

            }

            that.setData({
              ordergiftArray: ordergiftArrayNew,
              unpaygiftorder: unpaygiftorder
            })
            that.operation('gift');

          }

        }


      },
      fail: res => {

      },
      complete: res => {
        console.log("-----complete---")
        that.setData({

          isPullDownRefresh: false,
          isReachBottom: false,
          isRefresh: false,
        })
        wx.hideLoading();
      }
    })



  },

  /**物流信息 */

  wayBill: function(event) {


    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/waybill/waybill?o=' + orderId,
    })
  },
  /**评价晒单 */
  evaladd: function(event) {
    let that = this

    var index = event.currentTarget.dataset.index;

    var evalid = event.currentTarget.dataset.evalid;
    wx.navigateTo({
      url: '/page/component/pages/pagemy/evaluate/evaladd/evaladd?e=' + evalid,
    })
  },
  /*取消订单*/
  cancelOrder: function(event) {

    var orderid = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pageorder/ordercancel/ordercancel?o=' + orderid,
    })


  },
  /*继续付款*/
  continuePayOrder: function(event) {

    var orderid = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/page/component/pages/pageorder/orderdetail/orderdetail?o=' + orderid,
    })


  },
  /*赠送好友*/
  forwardFriend: function(event) {

    var gr = event.currentTarget.dataset.gr;
    wx.navigateTo({
      url: '/page/component/pages/pagegift/giftgivesucc/giftgivesucc?gr=' + gr,
    })


  },


  /*确认收货*/
  surereceve: function(e) {
    let that = this;
    var orderid = e.currentTarget.dataset.orderid;
    var promotionid = e.currentTarget.dataset.proid;
    var requirementid = e.currentTarget.dataset.reqid;
    var receiveSuccessCS = e.currentTarget.dataset.recs;
    var dealtype = e.currentTarget.dataset.detype;
    var deliverytype = e.currentTarget.dataset.deltype;
    var logisticsstatus = e.currentTarget.dataset.lstatus;

    var userid = that.data.userInfo.id;
    if (deliverytype == '2' && logisticsstatus == '1') {

      wx.showModal({
        title: '提示',
        content: '确定收到了商品了吗？',
        success: function(res) {
          if (res.confirm) {
            var data = {
              code_: 'x_doreceive',
              "orderid": orderid,
              "promotion_id": promotionid,
              "requirementid": requirementid,
              "userid": userid
            }

            rCommon.doOrder.orderAction(that, data, function(rdata) {

              wx.showToast({
                title: '确认成功',
                image: '/image/icon_ok.png',
                duration: 2000,
                success: function() {


                }
              })


              that.getOrdersInfo();
            });
          } else if (res.cancel) {

          }

        }
      })

    }

  },


  unPayOrderCancel: function(orderid) {

    var that = this;

    var url = config.requestUrl;
    var userid = that.data.userInfo.id //1528869953018820
    var data = {
      code_: 'x_unPayOrderCancel',
      orderid: orderid,
      userid: userid,

    }

    rRequest.doRequest(url, data, that, function(rdata) {
      that.setData({

        isRefresh: true,
      });
      that.getOrdersInfo();
    })

  },

  /** */
  operation: function(type) { // 接收到没有结束的订单信息
    var that = this;
    if (type == 'gift') {
      if (gifttime) {
        clearInterval(gifttime)
      } 
        gifttime = setInterval(function() { // 循环执行

          that.resetGiftState(); // 设置未到结束时间订单的状态

        }, 1000);

       
    }
    if (type == 'order') {
      if (ordertime) {
         
          clearInterval(ordertime)
         
      }  
        ordertime = setInterval(function () { // 循环执行

          that.resetOrderState(); // 设置未到结束时间订单的状态

        }, 1000);

       
    }
  },
  resetGiftState: function() {
    let that = this

    let result = that.data.unpaygiftorder

    for (let i = 0; i < result.length; i++) { // 循环添加 倒计时
      let currentTime = result[i].now_time
      let enddate = result[i].buy_end_time
      let unindex = result[i].unpayindex

      let currentTimeD = new Date(currentTime.replace(/-/g, "/"));
      let enddateD = new Date(enddate.replace(/-/g, "/"));

      let leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数

     


      if (leftTime > 0) {
        let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数

        let daysT = checkTime(days);
        let hoursT = checkTime(hours);
        let minutesT = checkTime(minutes);
        let secondsT = checkTime(seconds);

        let date1 = new Date(currentTime.replace(/-/g, "/"));

        date1.setTime(date1.getTime() + 1000);
        currentTime = format(date1, "yyyy-MM-dd hh:mm:ss")

        let ordergiftArray = that.data.ordergiftArray;

        ordergiftArray[unindex].cHours = hoursT
        ordergiftArray[unindex].cMinutes = minutesT
        ordergiftArray[unindex].cCseconds = secondsT

        result[i].now_time = currentTime
        that.setData({
          ordergiftArray: ordergiftArray,
          unpaygiftorder: result
        })


      } else {

        that.unPayOrderCancel(result[i].id)

        result.splice(i, 1);
        that.setData({
          unpaygiftorder: result
        })

      }
      if (result.length == 0) { // 如果没有可支付订单 则停止这个订单
        clearInterval(gifttime);
      }


    }
  }
,
  resetOrderState: function () {
    let that = this

    let result = that.data.unpayorder

    for (let i = 0; i < result.length; i++) { // 循环添加 倒计时
      let currentTime = result[i].now_time
      let enddate = result[i].buy_end_time
      let unindex = result[i].unpayindex

      let currentTimeD = new Date(currentTime.replace(/-/g, "/"));
      let enddateD = new Date(enddate.replace(/-/g, "/"));

      let leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数

  


      if (leftTime > 0) {
        let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数

        let daysT = checkTime(days);
        let hoursT = checkTime(hours);
        let minutesT = checkTime(minutes);
        let secondsT = checkTime(seconds);
        let date1 = new Date(currentTime.replace(/-/g, "/"));

        date1.setTime(date1.getTime() + 1000);
        currentTime = format(date1, "yyyy-MM-dd hh:mm:ss")

        let orderbuyArray = that.data.orderbuyArray;

        orderbuyArray[unindex].cHours = hoursT
        orderbuyArray[unindex].cMinutes = minutesT
        orderbuyArray[unindex].cCseconds = secondsT

        result[i].now_time = currentTime
        that.setData({
          orderbuyArray: orderbuyArray,
          unpayorder: result
        })


      } else {

        that.unPayOrderCancel(result[i].id)

        result.splice(i, 1);
        that.setData({
          unpayorder: result
        })

      }
      if (result.length == 0) { // 如果没有可支付订单 则停止这个订单
        clearInterval(ordertime);
      }


    }
  }

})

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
  let r = i;
  if (i < 10) {
    r = "0" + i;
  }
  return r;
}

function format(date, fmt) { //author: meizz
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
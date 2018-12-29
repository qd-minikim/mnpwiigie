 var slideModal = {

   duration: 200, //动画持续时间 单位毫秒
   timingFunction: 'linear', // 定义动画效果，当前是匀速(其他参考小程序动画文档)
   chooseType: '',
   chooseSize: false,
   //that 是调用时的页面对象
   up: function(that, chooseType, chooseSize) {
     var this_ = this;
     chooseType = chooseType || this_.chooseType
     chooseSize = chooseSize || this_.chooseSize
     var animation = wx.createAnimation({
       duration: this_.duration,
       timingFunction: this_.timingFunction
     })
     // 将该变量赋值给当前动画
     that.animation = animation
     // 先在y轴偏移，然后用step()完成一个动画
     animation.translateY(0).step()
     // 用setData改变当前动画
     that.setData({
       // 通过export()方法导出数据
       'panelPage.animationData': animation.export(),
       // 改变view里面的Wx：if
       'panelPage.chooseSize': chooseSize,
       'panelPage.chooseType': chooseType,
     })
     // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
     setTimeout(function() {
       animation.translateY(0).step()
       that.setData({
         'panelPage.animationData': animation.export(),

       })
     }, 10)

   },
   down: function(that, chooseType, chooseSize) {
     var this_ = this;
     chooseSize = chooseSize || this_.chooseSize
     chooseType = chooseType || this_.chooseType
     var animation = wx.createAnimation({
       duration: this_.duration,
       timingFunction: this_.timingFunction
     })
     that.animation = animation
     animation.translateY(500).step()
     that.setData({
       'panelPage.animationData': animation.export()

     })
     setTimeout(function() {
       animation.translateY(0).step()
       that.setData({
         'panelPage.animationData': animation.export(),
         'panelPage.chooseSize': chooseSize,
         'panelPage.chooseType': chooseType,
       })
     }, 100)

   }

 }
 /**礼品倒计时 */
 var timerDown = {
   timer: null,
   countDown: function(that, currentTime, enddate, callback) {

     var this_ = this;
     var currentTimeD = new Date(currentTime.replace(/-/g, "/"));
     var enddateD = new Date(enddate.replace(/-/g, "/"));
     //  var leftTime = (new Date(enddate)) - (new Date(currentTime)); //计算剩余的毫秒数
     var leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数

     var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
     var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
     var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
     var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
     var daysT = this_.checkTime(days);
     var hoursT = this_.checkTime(hours);
     var minutesT = this_.checkTime(minutes);
     var secondsT = this_.checkTime(seconds);

     if (leftTime > 0) {

       that.setData({
         'timerDown.day': daysT,
         'timerDown.hou': hoursT,
         'timerDown.min': minutesT,
         'timerDown.sec': secondsT,

       })

     } else {

       that.setData({
         'timerDown.day': '00',
         'timerDown.hou': '00',
         'timerDown.min': '00',
         'timerDown.sec': '00',

       })
       if (this_.timer) {

         clearTimeout(this_.timer)
       }


       typeof callback == "function" && callback()
     }


     this_.timer = setTimeout(function() {
       var date1 = new Date(currentTime.replace(/-/g, "/"));

       //  var date1 = new Date(Date.parse(currentTime.replace(/-/g, "/")));
       date1.setTime(date1.getTime() + 1000);


       this_.countDown(that, this_.format(date1, "yyyy-MM-dd hh:mm:ss"), enddate, callback);

     }, 1000);


   },
   shutdown: function() {

     var this_ = this;
     if (this_.timer) {
       clearTimeout(this_.timer)

     }

   },
   checkTime: function(i) { //将0-9的数字前面加上0，例1变为01
     var r = i;
     if (i < 10) {
       r = "0" + i;
     }
     return r;
   },
   format: function(date, fmt) { //author: meizz
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

 }
 /**发送验证码倒计时 */
 var countDown = {
   timer: null,

   countStart: 120,
   countDown: function(that, showTipMsg, clickTip) {
     var this_ = this;

     if (this_.countStart == 0) {
       this_.countStart = 120

       that.setData({
         showTipMsg: '重新发送',
         clickTip: true
       })

       clearTimeout(this_.timer)
     } else {


       that.setData({
         showTipMsg: this_.countStart + 's',
         clickTip: false
       })
       this_.countStart--;
       this_.timer = setTimeout(function() {
         this_.countDown(that, showTipMsg, clickTip);
       }, 1000);
     }

   },
   shutdown: function(that, showTipMsg, clickTip) {

     var this_ = this;
     if (this_.timer) {
       clearTimeout(this_.timer)

       this_.countStart = 120

       that.setData({
         showTipMsg: '重新发送',
         clickTip: true
       })
     }

   }



 }
 /**倒计秒数执行 */
 var countSecondDown = {
   timer: null,

   secondStart: 3,
   countSecondDown: function(that, secondStart, downtimes, callback) {
     var this_ = this;

     if (this_.secondStart == 0) {
       this_.secondStart = secondStart
       that.setData({
         [downtimes]: this_.secondStart,

       })
       clearTimeout(this_.timer)

       typeof callback == "function" && callback()
     } else {


       that.setData({
         [downtimes]: this_.secondStart,

       })
       this_.secondStart--;
       this_.timer = setTimeout(function() {
         this_.countSecondDown(that, this_.secondStart, downtimes, callback);
       }, 1000);
     }

   },


 }

 /**未付款订单倒计时 */
 
 var orderTimerDown = {
   timer: null,
   countDown: function(that, i, currentTime, enddate, callback) {

     var this_ = this;
     var currentTimeD = new Date(currentTime.replace(/-/g, "/"));
     var enddateD = new Date(enddate.replace(/-/g, "/"));

     var leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数

     var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
     var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
     var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
     var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
     var times = parseInt(leftTime % 1000, 10); //计算剩余的毫秒数

     var daysT = this_.checkTime(days);
     var hoursT = this_.checkTime(hours);
     var minutesT = this_.checkTime(minutes);
     var secondsT = this_.checkTime(seconds);
     var timesT = this_.checkTimes(times);
     if (leftTime > 0) {
 
       var orderbuyArray = that.data.orderbuyArray;
       orderbuyArray[i].cHours = hoursT
       orderbuyArray[i].cMinutes = minutesT
       orderbuyArray[i].cCseconds = secondsT
       that.setData({
         orderbuyArray: orderbuyArray,

       })

       this_.timer = setTimeout(function () {
         var date1 = new Date(currentTime.replace(/-/g, "/"));

         date1.setTime(date1.getTime() + 1000);

         this_.countDown(that, i, this_.format(date1, "yyyy-MM-dd hh:mm:ss"), enddate, callback);

       }, 1000);
     } else {
 
       var orderbuyArray = that.data.orderbuyArray;
       orderbuyArray[i].cHours = "00"
       orderbuyArray[i].cMinutes = "00"
       orderbuyArray[i].cCseconds = "00"
       that.setData({
         orderbuyArray: orderbuyArray,

       })
      //  if (this_.timer) {

      //    clearTimeout(this_.timer)
      //  }
      
       var rdata = { "orderid": orderbuyArray[i].id}

       typeof callback == "function" && callback(rdata)
     }
 
   },
   shutdown: function() {

     var this_ = this;
     if (this_.timer) {
       clearTimeout(this_.timer)

     }

   },
   checkTime: function(i) { //将0-9的数字前面加上0，例1变为01
     var r = i;
     if (i < 10) {
       r = "0" + i;
     }
     return r;
   },
   checkTimes: function(i) { //将0-9的数字前面加上0，例1变为01
     var r = i;
     if (i < 10) {
       r = "000" + i;
     } else if (i >= 10 && i < 100) {
       r = "00" + i;
     } else if (i >= 100 && i < 1000) {
       r = "0" + i;
     }
     return r;
   },
   format: function(date, fmt) { //author: meizz
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

 }

/**未付款送礼倒计时 */

var giftTimerDown = {
  timer: null,
  timers:{},
  countDown: function (that, i, currentTime, enddate, callback) {

    let this_ = this;
    let currentTimeD = new Date(currentTime.replace(/-/g, "/"));
    let enddateD = new Date(enddate.replace(/-/g, "/"));

    let leftTime = (enddateD) - (currentTimeD); //计算剩余的毫秒数

    let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
    let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
    let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
    let times = parseInt(leftTime % 1000, 10); //计算剩余的毫秒数

    let daysT = this_.checkTime(days);
    let hoursT = this_.checkTime(hours);
    let minutesT = this_.checkTime(minutes);
    let secondsT = this_.checkTime(seconds);
    
    if (leftTime > 0) {

      let ordergiftArray = that.data.ordergiftArray;
      ordergiftArray[i].cHours = hoursT
      ordergiftArray[i].cMinutes = minutesT
      ordergiftArray[i].cCseconds = secondsT
      that.setData({
        ordergiftArray: ordergiftArray,

      })

      this_.timer = setTimeout(function () {
        clearTimeout(this)
        let date1 = new Date(currentTime.replace(/-/g, "/"));
         
        date1.setTime(date1.getTime() + 1000);
         
        this_.countDown(that, i, this_.format(date1, "yyyy-MM-dd hh:mm:ss"), enddate, callback);

      }, 1000);

   

    } else {

      let ordergiftArray = that.data.ordergiftArray;
      ordergiftArray[i].cHours = "00"
      ordergiftArray[i].cMinutes = "00"
      ordergiftArray[i].cCseconds = "00"
      that.setData({
        ordergiftArray: ordergiftArray,

      })
     
      let rdata = { "orderid": ordergiftArray[i].id }

      typeof callback == "function" && callback(rdata)
    }

  },
  shutdown: function () {

    let this_ = this;
    if (this_.timer) {
      clearTimeout(this_.timer)
      this_.timer =null
    }

  },
  checkTime: function (i) { //将0-9的数字前面加上0，例1变为01
    let r = i;
    if (i < 10) {
      r = "0" + i;
    }
    return r;
  },
 
  format: function (date, fmt) { //author: meizz
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

}

var systemInfo = {
  getSystemInfo: function (that,callback) {
    wx.getSystemInfo({
      success: res => {
        // that.globalData.systemInfo = res
        typeof callback == "function" && callback(res)
      },
      fail: res => { },
      complete: res => { },
    })
  },

}


 module.exports = {
   slideModal: slideModal,

   timerDown: timerDown,
   countDown: countDown,
   countSecondDown: countSecondDown,
   orderTimerDown: orderTimerDown,
   giftTimerDown: giftTimerDown,
   systemInfo: systemInfo,
   // filters: filters,
   // toFix: filters.toFix
 }
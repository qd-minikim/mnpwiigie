 /**修改份数 */
 var uppdateCopies = {
   addCopies: function(that) {
   
     var orderCopies = that.data.myOrderInfo.orderCopies;
     var this_ = this;
     var newOrderCopies = Number(orderCopies) + 1;
     this_.canBuyCopies(that, newOrderCopies);
     that.setData({

       'myOrderInfo.orderCopies': newOrderCopies
     })
 
   },
   subCopies: function(that) {
     var orderCopies = that.data.myOrderInfo.orderCopies;

     var  this_  = this;

     if (orderCopies <= 1) {
       return false;
     } else {

       var newOrderCopies = Number(orderCopies) - 1;
       this_.canBuyCopies(that, newOrderCopies);
       that.setData({
         'myOrderInfo.orderCopies': newOrderCopies
       })
     }
 

   },
   canBuyCopies: function (that, newOrderCopies) {

     var storage = that.data.myOrderInfo.mySkuInfo.storage;
     var minCopies = that.data.spuInfo.spuinfo.min_copies;
     var maxCopies = that.data.spuInfo.spuinfo.max_copies;

     if (Number(storage) < Number(minCopies)) {
       that.setData({

         // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
         'myOrderInfo.sureBtn.btnDisabled': true,
         'myOrderInfo.sureBtn.btnTipMsg': '库存小于限购'
       })

     } else if (Number(storage) == Number(minCopies)) {

       if (Number(newOrderCopies) > Number(storage)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买大于限购'
         })

       } else if (Number(newOrderCopies) < Number(storage)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买小于限购'
         })

       } else if (Number(newOrderCopies) == Number(storage)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': false,
           'myOrderInfo.sureBtn.btnTipMsg': ''
         })

       }

     } else if (Number(storage) > Number(minCopies) && Number(storage) <= Number(maxCopies)) {

       if (Number(newOrderCopies) < Number(minCopies)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买小于限购'
         })

       } else if (Number(newOrderCopies) > Number(storage)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买大于库存'
         })

       } else if (Number(newOrderCopies) >= Number(minCopies) && Number(newOrderCopies) <= Number(storage)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': false,
           'myOrderInfo.sureBtn.btnTipMsg': ''
         })

       }

     } else if (Number(storage) > Number(maxCopies)) {

       if (Number(newOrderCopies) < Number(minCopies)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买小于限购'
         })

       } else if (Number(newOrderCopies) > Number(maxCopies)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买大于限购'
         })

       } else if (Number(newOrderCopies) >= Number(minCopies) && Number(newOrderCopies) <= Number(maxCopies)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': false,
           'myOrderInfo.sureBtn.btnTipMsg': ''
         })

       } else if (Number(newOrderCopies) > Number(storage)) {
         that.setData({

           // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
           'myOrderInfo.sureBtn.btnDisabled': true,
           'myOrderInfo.sureBtn.btnTipMsg': '购买大于库存'
         })

       }
     }


   }
 }



 module.exports = {
   uppdateCopies: uppdateCopies,

 }
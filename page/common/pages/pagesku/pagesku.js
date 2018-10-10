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

     var this_ = this;

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
   canBuyCopies: function(that, newOrderCopies) {

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

 var selectSpuSku = {
   doSelectSpuSku: function(inde, vindex, specvalueskuid, that) {
     var this_ = this;
     var spunamelist = that.data.spuInfo.spuname;
     var arr = new Array();
     if (specvalueskuid.indexOf(",") >= 0) {
       arr = specvalueskuid.split(',');
     } else {
       arr.push(specvalueskuid);
     }

     spunamelist[inde].skuspecvalues[vindex].currentstatus = 'selected';;

     that.setData({
       'spuInfo.spuname': spunamelist
     })
 
     if (inde == 0) {

       for (var n = 0; n < spunamelist[inde].skuspecvalues.length; n++) {
         if (n != vindex) {
           var v = spunamelist[inde].skuspecvalues[n];

           v.currentstatus = 'canselect';
         }
       }

       that.setData({
         'myOrderInfo.selectSkuId': arr,
         'spuInfo.spuname': spunamelist
       })
       var selectSkuId = that.data.myOrderInfo.selectSkuId;

     } else {
     

       for (var n = 0; n < spunamelist[inde].skuspecvalues.length; n++) {
         if (n != vindex) {
           var v = spunamelist[inde].skuspecvalues[n];

           if (v.currentstatus == 'selected') {

             v.currentstatus = 'canselect';

           } else {

           }
         }

       }
       var lastSelectSkuId ='';
       for (var m = 0; m < spunamelist[inde-1].skuspecvalues.length; m++) {
       
         var v = spunamelist[inde - 1].skuspecvalues[m];

           if (v.currentstatus == 'selected') {

             lastSelectSkuId = v.sku_id

           }  
         
       }
       var selectSkuId = new Array();
       if (lastSelectSkuId.indexOf(",") >= 0) {
         selectSkuId = lastSelectSkuId.split(',');
       } else {
         selectSkuId.push(lastSelectSkuId);
       }

      //  var selectSkuId = that.data.myOrderInfo.selectSkuId;
       var intersect = '';
       if(arr.length ==1){

         intersect = arr;
       }else{
         intersect = this_.intersect(arr, selectSkuId);
       }
       
       that.setData({
         'myOrderInfo.selectSkuId': intersect,
         'spuInfo.spuname': spunamelist
       })


     }


     for (var n = inde + 1; n < spunamelist.length; n++) {

       var spuname = spunamelist[n];

       for (var x = 0; x < spuname.skuspecvalues.length; x++) {
         var v = spuname.skuspecvalues[x];
         var skuids = v.sku_id;
         var perarry = new Array();
         if (skuids.indexOf(",") >= 0) {
           perarry = skuids.split(',');
         } else {
           perarry.push(skuids);
         }


         var intersect = this_.intersect(perarry, arr)
         if (intersect.length > 0) {

           if (v.currentstatus == 'selected') {


           } else {

             v.currentstatus = 'canselect';
           }
         } else {

           v.currentstatus = 'unselect';
         }


       }

     }
     that.setData({
       'spuInfo.spuname': spunamelist
     })

     var selectSkuId = that.data.myOrderInfo.selectSkuId;

     if (selectSkuId.length == 1) {
       that.setData({

         // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
         'myOrderInfo.sureBtn.btnDisabled': false,
           'myOrderInfo.sureBtn.btnTipMsg': '确定'
       })

       var orderCopies = that.data.myOrderInfo.orderCopies;
       uppdateCopies.canBuyCopies(that, orderCopies);

     }else{

       that.setData({

         // 'myOrderInfo.sureBtn.btntext': 'newOrderCopies',
         'myOrderInfo.sureBtn.btnDisabled': true,
          'myOrderInfo.sureBtn.btnTipMsg': '请选择规格'
       })
     }


    //  var selectSkuId = that.data.myOrderInfo.selectSkuId;


    //  if (selectSkuId.length ==1){

    //    var skuinfo = that.data.spuInfo.skuinfo;
    //     var ind = 0;

    //     for(var m=0;m<skuinfo.length;m++){
    //         var  skuId = skuinfo[m].id;
    //       if (skuId == selectSkuId[0] ){

    //         that.setData({
    //           'myOrderInfo.mySkuInfo': skuinfo[m]
    //         })

    //         return false;
    //       }
             
    //     }
 
    //  }
     
 //    var orderCopies = that.data.myOrderInfo.orderCopies;
    //    uppdateCopies.canBuyCopies(that, orderCopies);
     
  
   },

   sureBtn: function (that){

    var selectSkuId = that.data.myOrderInfo.selectSkuId;


    if (selectSkuId.length == 1) {

      var skuinfo = that.data.spuInfo.skuinfo;
      var ind = 0;

      for (var m = 0; m < skuinfo.length; m++) {
        var skuId = skuinfo[m].id;
        if (skuId == selectSkuId[0]) {

          that.setData({
            'myOrderInfo.mySkuInfo': skuinfo[m]
          })

          return false;
        }

      }

    }

  },

   /**点击选择时，每次都取交集 */
   intersect: function(a, b) {

     let bSet = new Set(b)
     let intersection = Array.from(new Set(a.filter(v => bSet.has(v)))) // [2]

     return intersection;
   }
 }


 module.exports = {
   uppdateCopies: uppdateCopies,
   selectSpuSku: selectSpuSku
 
 }
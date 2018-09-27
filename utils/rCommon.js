// 需求相关公共方法
var canvasDraw = require('canvas.js')
var config = require('../config.js')
var rRequest = require('rRequest.js')

//进展区
var canvaProgressRoute = {
  headImage: null,
  context: null,
  c: 0,
  doProgressRouteInfoImpl: function(data, category, id, that) {
    var info_ = data.info_
    var this_ = this;
    this_.headImage = {
      url: [],
      x: [],
      y: [],
      r: [],
      t: [],
      resource: []
    };
    this_.context = wx.createCanvasContext(id)
    this_.context.save()
    for (var i = 0; i < info_.length; i++) {
      var node = info_[i];
      this_.readTree(node, category, id);
    }
    var len = this_.headImage.url.length
    this_.c = 0;
    for (var n = 0; n < len; n++) {

      this_.drawImageInfo(n, id, that);
    }

  },
  downloadImage: function(url) {
    return new Promise(function(resolve, reject) {
      wx.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            console.log('出错1');
          }
        },
        fail: function() {

        }

      })

    });

  },

  drawImageInfo: function(i, id, that) {

    var this_ = this;
    var image = config.routeCicleConfig.headImage;
    if (this_.headImage.url[i] != undefined) {

    }

    this_.downloadImage(this_.headImage.url[i]).then(function(value) {

      this_.headImage.resource[i] = value;
      this_.c++;

      if (this_.c == this_.headImage.url.length) {

        this_.drawHeadImage(id, that);

      }

    }).catch(function() {});


  },

  drawHeadImage: function(id, that) {
    var this_ = this;
    var leng = this_.headImage.resource.length;

    for (var n = 0; n < leng; n++) {


      var r = this_.headImage.r[n] - 5;

      this_.context.save();

      this_.context.beginPath()
      this_.context.arc(this_.headImage.x[n], this_.headImage.y[n], r, 0, 2 * Math.PI);
      this_.context.stroke();
      this_.context.clip();
      this_.context.drawImage(this_.headImage.resource[n], this_.headImage.x[n] - r, this_.headImage.y[n] - r, 2 * r, 2 * r);

      this_.context.restore();

    }

    this_.context.draw(false, function() {

      wx.canvasToTempFilePath({
        canvasId: id, //canvasId和标签里面的id对应
        success: (res) => {

          that.setData({
            'canvasViewInfo.canvasSaveImage': res.tempFilePath,

          })
        }
      })

    });
  },
  readTree: function(node, category, id) {
    var this_ = this;
    if (node.isRequirement) {

      if (category == 'content_12') {

        // canvasDraw.drawRect(
        //   id,
        //   node.circlePoint[0] - node.forwardRadius - 1,
        //   node.circlePoint[1] - node.forwardRadius - 1,
        //   2 * (node.forwardRadius) - 4,
        //   2 * (node.forwardRadius) - 4,
        //   node.requirementColor);

        this_.headImage.t.push(1);
      } else {

        this_.headImage.t.push(0);
      }


    } else {

      var x = node.circlePoint[0] * config.routeCicleConfig.circleRM;
      var y = node.circlePoint[1] * config.routeCicleConfig.circleRM;
      var r = node.forwardRadius * config.routeCicleConfig.circleRM;
      var url = node.userHeadUrl;


      this_.headImage.url.push(url);
      this_.headImage.x.push(x);
      this_.headImage.y.push(y);
      this_.headImage.r.push(r);
      this_.headImage.t.push(0);

      this_.context.beginPath();
      this_.context.setStrokeStyle(config.routeCicleConfig.circleYd)
      this_.context.arc(x, y, r, Math.PI * 0, Math.PI * 2)
      this_.context.stroke()

      if (node.isForward) {

        this_.context.beginPath();
        this_.context.setStrokeStyle(node.forwardColor)
        this_.context.arc(x, y, r, Math.PI * 7 / 4, Math.PI * 1 / 4)
        this_.context.stroke()

        if (node.isAid) {
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.aidColor)
          this_.context.arc(x, y, r, Math.PI * 5 / 4, Math.PI * 7 / 4)
          this_.context.stroke()
        }
        if (node.isReply) {

          this_.context.beginPath();
          this_.context.setStrokeStyle(node.replyColor)
          this_.context.arc(x, y, r, Math.PI * 1 / 4, Math.PI * 3 / 4, false)
          this_.context.stroke()

          if (node.isReplyAccept) {

            this_.context.beginPath();
            this_.context.setStrokeStyle(node.replyColor)
            this_.context.arc(x, y, r - 5, Math.PI * 0, Math.PI * 2, false)
            this_.context.stroke()
          }
        }
        if (node.isLike) {
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.likeColor)
          this_.context.arc(x, y, r - 5, Math.PI * 3 / 4, Math.PI * 5 / 4, false)
          this_.context.stroke()
        }
        if (node.isBuy) {
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.buyColor)
          this_.context.arc(x, y, r - 5, Math.PI * 0, Math.PI * 2)
          this_.context.stroke()

        }

        if (node.isOpen2) {
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.open2Color)
          this_.context.arc(x, y, r, Math.PI * 7 / 4, Math.PI * 1 / 4)
          this_.context.stroke()

        }
      } else {

        if (node.openChildsOnlyRead) {

          // canvasDraw.drawWord(
          //   id,
          //   "(" + node.openChildsOnlyReadNum + ")",
          //   node.circlePoint[0] * config.routeCicleConfig.circleRM + 48 * config.routeCicleConfig.circleRM,
          //   node.circlePoint[1] * config.routeCicleConfig.circleRM + 15 * config.routeCicleConfig.circleRM, "#6b6a6a", true);



        }

        if (node.isAid) {
          // canvasDraw.drawArcnew(id,
          //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
          //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
          //   node.forwardRadius * config.routeCicleConfig.circleRM,
          //   node.aidColor, 5 / 4, 7 / 4);

        }
        if (node.isReply) {


          // canvasDraw.drawArcnew(
          //   id,
          //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
          //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
          //  node.forwardRadius * config.routeCicleConfig.circleRM, node.replyColor, 1 / 4, 3 / 4);

          if (node.isReplyAccept) {

            // canvasDraw.drawArcnew(
            //   id,
            //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
            //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
            //   node.forwardRadius * config.routeCicleConfig.circleRM - 5 * config.routeCicleConfig.circleRM,
            //   node.replyColor, 0, 2);
          }


        }
        if (node.isLike) {
          // canvasDraw.drawArcnew(
          //   id, node.circlePoint[0] * config.routeCicleConfig.circleRM,
          //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
          //   node.forwardRadius * config.routeCicleConfig.circleRM,
          //   node.likeColor, 3 / 4, 5 / 4);

        }
        if (node.isBuy) {
          // canvasDraw.drawArcnew(
          //   id,
          //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
          //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
          //   node.forwardRadius * config.routeCicleConfig.circleRM - 5 * config.routeCicleConfig.circleRM, node.buyColor, 0, 2);
        }

      }
    }

    var isOpen = node.isOpen;
    var isToFriend = node.isToFriend;
    var isToShare = node.isToShare;
    var isPush = node.isPush;
    var isLikePath = node.isLikePath;
    var isOpen2 = node.isOpen2;
    if (isOpen) {
      var childs = node.openChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {
          if (!node.isColseToOpen) {
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   node.toOpenLineColor,
            //   2);
          } else {

            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   lineIsCloseToOpen, 2);
          }

          this_.readTree(childs[i], category, id);

        }
      }

    }
    if (isPush) {
      var childs = node.pushChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {
          if (!node.isColseToPush) {
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   node.toPushLineColor, 2);
          } else {
            // canvasDraw.drawLine(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToPush, 2);
          }
          this_.readTree(childs[i], category, id);
        }
      }

    }
    if (isLikePath) {
      var childs = node.likePathChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {
          if (!node.isColseToLikePath) {
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   node.toLikePathLineColor, 2);
          } else {
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   lineIsCloseToLikePath, 2);
          }

          this_.readTree(childs[i], category, id);
        }
      }

    }
    if (isToFriend) {
      var childs = node.friendChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {
          if (!node.isColseToFriend) {
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   node.toFriendLineColor);
          } else {

            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   lineIsCloseToFriend);
          }

          this_.readTree(childs[i], category, id);
        }

      }
    }
    if (isToShare) {
      var childs = node.shareChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {

          if (!node.isColseToShare) {
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   node.toShareLineColor, 6);
          } else {

            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   lineIsCloseToShare, 6);
          }

          this_.readTree(childs[i], category, id);
        }

      }
    }
    if (isOpen2) {
      var childs = node.open2Childs;
      if (childs && childs.length) {

        for (var i = 0; i < childs.length; i++) {
          var rx = node.rightPoint[0] * config.routeCicleConfig.circleRM,
            ry = node.rightPoint[1] * config.routeCicleConfig.circleRM,
            lx = childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            ly = childs[i].leftPoint[1] * config.routeCicleConfig.circleRM

          this_.context.beginPath();
          if (!node.isColseToOpen2) {

            this_.context.setStrokeStyle(node.toOpen2LineColor)


            // canvasDraw.drawLine(
            //   id, node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   node.toOpen2LineColor);
          } else {
            this_.context.setStrokeStyle(config.routeCicleConfig.L_ISCLOSE_TOOPEN2)
            // canvasDraw.drawLine(
            //   id,
            //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
            //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
            //   lineIsCloseToOpen2);
          }
          this_.context.moveTo(rx, ry);
          this_.context.lineTo(lx, ly);
          this_.context.closePath();
          this_.context.stroke();

          this_.readTree(childs[i], category, id);
        }


      }
    }

  }


}
//收藏
var requirementKeep = {

  getKeepInfo: function() {



  },
  doKeepInfo: function() {



  }


} 
var configMsgInfo={

  url: config.requestUrl,
   
  getConfigMsg: function (url, pdata,  that, callback){
    var this_ = this;
    url = url || this_.url;
  
    rRequest.doRequest(url, pdata, that, function (rdata) {
      typeof callback == "function" && callback(rdata)
    })
    }

} 
var configCodeInfo={


} 


 //
var requirementMarkAction = {
  actionType: 'read',
  markAction: function(url, data, actionType, that, callback) {
    var this_ = this;
    actionType = actionType || this_.actionType;

    data = { ...data, actionType: actionType };
 
    rRequest.doRequest(url, data, that, function(rdata) {
      typeof callback == "function" && callback(rdata)
    })
  },

}
 



module.exports = {
  // doProgressRouteInfoImpl: doProgressRouteInfoImpl,
  canvaProgressRoute: canvaProgressRoute,
  requirementKeep: requirementKeep,
  requirementMarkAction: requirementMarkAction,
  configMsgInfo: configMsgInfo,

}
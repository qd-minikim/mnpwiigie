// 需求相关公共方法
var canvasDraw = require('canvas.js')
var config = require('../config.js')
var rRequest = require('rRequest.js')

//进展区
var canvaProgressRoute = {
  headImage: null,
  context: null,
  c: 0,
  n:0,
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
    for (var i = 0, j = 1; i < len; i++ , j++) {
      this_.drawImageInfo(i, id, that);
 
    }

  },
 

  /**下载图 */
  downloadImage: function(url) {
   
    return new Promise(function(resolve, reject) {
 
      wx.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
          
            resolve(res.tempFilePath);
          } else {

          }
        },
        fail: function() {}

      })

    });

  },
  /**画图 */
  drawImageInfo: function(i, id, that) {

    var this_ = this;
    var image = config.imageUrl + "/wiigie/background/icon/default_head.png";
    if (this_.headImage.url[i] != undefined) {
      image = this_.headImage.url[i];
    }
    
    image = image.replace('http:', 'https:')
    console.log("---------" + image)
    this_.downloadImage(image).then(function(value) {
     
      this_.headImage.resource[i] = value;
      this_.c = this_.c+1;
      console.log(this_.c + "--------" + this_.headImage.url.length)
      if (this_.c === this_.headImage.url.length) {

        this_.drawHeadImage(id, that);

      }

    }).catch(function(e) {
      console.log("------eee----" + e)
      
    });

  },

  drawHeadImage: function(id, that) {
    var this_ = this;
    var leng = this_.headImage.resource.length;
   
    for (var n = 0; n < leng; n++) {


      var r = this_.headImage.r[n] - 5;

      this_.context.save();


      if (this_.headImage.t[n] == '0') {
        this_.context.beginPath()
        this_.context.arc(this_.headImage.x[n], this_.headImage.y[n], r, 0, 2 * Math.PI);
        this_.context.stroke();
        this_.context.clip();
        this_.context.drawImage(this_.headImage.resource[n], this_.headImage.x[n] - r, this_.headImage.y[n] - r, 2 * r, 2 * r);
      } else {

        this_.context.drawImage(this_.headImage.resource[n], this_.headImage.x[n] - (r + 5) + 2, this_.headImage.y[n] - (r + 5) + 2, 2 * (r + 5) - 4, 2 * (r + 5) - 4);
      }
 
      this_.context.restore();

    }
   

    
    this_.context.draw(false, function() {

      wx.canvasToTempFilePath({
        canvasId: id, //canvasId和标签里面的id对应
        success: (res) => {

          that.setData({
            'canvasViewInfo.canvasSaveImage': res.tempFilePath,
            'downSuccess':true
          })

           
        }
      })

    });
  },
 
  /**读取树 */
  readTree: function(node, category, id) {
    var this_ = this;
    if (node.isRequirement) {

      if (category == 'content_12') {
 
        var x = node.circlePoint[0] * config.routeCicleConfig.circleRM;
        var y = node.circlePoint[1] * config.routeCicleConfig.circleRM;
        var r = node.forwardRadius * config.routeCicleConfig.circleRM;
        var url = node.userHeadUrl;

        this_.headImage.url.push(url);
        this_.headImage.x.push(x);
        this_.headImage.y.push(y);
        this_.headImage.r.push(r);
        this_.headImage.t.push(1);

        this_.context.beginPath();
        this_.context.setStrokeStyle(config.routeCicleConfig.requirementColor)
        // this_.context.arc(x, y, r, Math.PI * 0, Math.PI * 2)
        this_.context.rect(x - r, y - r, 2 * r, 2 * r)
        this_.context.stroke()


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
            this_.context.arc(x, y, r - 4, Math.PI * 0, Math.PI * 2, false)
            this_.context.stroke()
          }
        }
        if (node.isLike) {
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.likeColor)
          this_.context.arc(x, y, r - 4, Math.PI * 3 / 4, Math.PI * 5 / 4, false)
          this_.context.stroke()
        }
        if (node.isBuy) {
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.buyColor)
          this_.context.arc(x, y, r - 4, Math.PI * 0, Math.PI * 2)
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
          this_.context.beginPath();
          this_.context.setStrokeStyle(node.buyColor)
          this_.context.arc(x, y, r - 4, Math.PI * 0, Math.PI * 2)
          this_.context.stroke()
 
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
          var rx = node.rightPoint[0] * config.routeCicleConfig.circleRM,
            ry = node.rightPoint[1] * config.routeCicleConfig.circleRM,
            lx = childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            ly = childs[i].leftPoint[1] * config.routeCicleConfig.circleRM

          this_.context.beginPath();
          if (!node.isColseToOpen) {
            this_.context.setStrokeStyle(node.toOpenLineColor)
            
          } else {
            this_.context.setStrokeStyle(node.lineIsCloseToOpen)
      
          }
          this_.context.moveTo(rx, ry);
          this_.context.lineTo(lx, ly);
          this_.context.closePath();
          this_.context.stroke();
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
          var rx = node.rightPoint[0] * config.routeCicleConfig.circleRM,
            ry = node.rightPoint[1] * config.routeCicleConfig.circleRM,
            lx = childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            ly = childs[i].leftPoint[1] * config.routeCicleConfig.circleRM

          this_.context.beginPath();
          if (!node.isColseToLikePath) {
            this_.context.setStrokeStyle(node.toLikePathLineColor)
            
          } else {
            this_.context.setStrokeStyle(node.lineIsCloseToLikePath)
        
          }
          this_.context.moveTo(rx, ry);
          this_.context.lineTo(lx, ly);
          this_.context.closePath();
          this_.context.stroke();
          this_.readTree(childs[i], category, id);
        }
      }

    }
    if (isToFriend) {
      var childs = node.friendChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {
          var rx = node.rightPoint[0] * config.routeCicleConfig.circleRM,
            ry = node.rightPoint[1] * config.routeCicleConfig.circleRM,
            lx = childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            ly = childs[i].leftPoint[1] * config.routeCicleConfig.circleRM

          this_.context.beginPath();
          if (!node.isColseToFriend) {
            this_.context.setStrokeStyle(node.toFriendLineColor)
           
          } else {
            this_.context.setStrokeStyle(node.lineIsCloseToFriend)
           
          }
          this_.context.moveTo(rx, ry);
          this_.context.lineTo(lx, ly);
          this_.context.closePath();
          this_.context.stroke();
          this_.readTree(childs[i], category, id);
        }

      }
    }
    if (isToShare) {
      var childs = node.shareChilds;
      if (childs && childs.length) {
        for (var i = 0; i < childs.length; i++) {
          var rx = node.rightPoint[0] * config.routeCicleConfig.circleRM,
            ry = node.rightPoint[1] * config.routeCicleConfig.circleRM,
            lx = childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
            ly = childs[i].leftPoint[1] * config.routeCicleConfig.circleRM

          this_.context.beginPath();
          if (!node.isColseToShare) {
            this_.context.setStrokeStyle(node.toShareLineColor)
           
          } else {
            this_.context.setStrokeStyle(node.lineIsCloseToShare)
           
          }
          this_.context.moveTo(rx, ry);
          this_.context.lineTo(lx, ly);
          this_.context.closePath();
          this_.context.stroke();
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
 
          } else {
            this_.context.setStrokeStyle(config.routeCicleConfig.L_ISCLOSE_TOOPEN2)
       
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

var nolinkCanvaProgressRoute = {

  headImage: null,
  context: null,
  c: 0,
  doProgressRouteInfoImplNolink: function(data, category, id, that) {
    let info_ = data.rInfo_
    let this_ = this;
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
    for (let i = 0; i < info_.length; i++) {
      let node = info_[i];
      this_.readInfo(node, category, id);
    }
    let len = this_.headImage.url.length
    this_.c = 0;
    for (let n = 0; n < len; n++) {

      this_.drawImageInfo(n, id, that);
    }

  },
  readInfo: function(node, category, id) {
    let this_ = this;
    let x = node.circlepoint[0] * config.routeCicleConfig.circleRM;
    let y = node.circlepoint[1] * config.routeCicleConfig.circleRM;
    let r = 48 * config.routeCicleConfig.circleRM;
    let url = node.imagurl;


    this_.headImage.url.push(url);
    this_.headImage.x.push(x);
    this_.headImage.y.push(y);
    this_.headImage.r.push(r);


    this_.context.beginPath();
    this_.context.setStrokeStyle(config.routeCicleConfig.circleHf)
    this_.context.arc(x, y, r, Math.PI * 0, Math.PI * 2)
    this_.context.stroke()
  },
  /**下载图 */
  downloadImage: function (url) {
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: url,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {

          }
        },
        fail: function () { }

      })

    });

  },
  /**画图 */
  drawImageInfo: function(i, id, that) {

    let this_ = this;
    let image = config.imageUrl + "/wiigie/background/icon/default_head.png";
    if (this_.headImage.url[i] != undefined) {
      image = this_.headImage.url[i];
    }
    console.log("------xxx---" + image)
    image = image.replace('http:', 'https:')
    this_.downloadImage(image).then(function(value) {

      this_.headImage.resource[i] = value;
      this_.c = this_.c + 1;
      console.log(this_.c + "------xxxx----" + this_.headImage.url.length)
      if (this_.c == this_.headImage.url.length) {

        this_.drawHeadImage(id, that);

      }

    }).catch(function(e) {
      console.log( "------eee----" + e)

    });


  },
  drawHeadImage: function(id, that) {
    let this_ = this;
    let leng = this_.headImage.resource.length;

    for (let n = 0; n < leng; n++) {


      let r = this_.headImage.r[n] - 5;

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
            'nolinkCanvasViewInfo.canvasSaveImage': res.tempFilePath,
            'downNoLinkSuccess': true
          })
        }
      })

    });
  },
}


//收藏
var requirementKeep = {

  getKeepInfo: function() {

  },
  doKeepInfo: function() {

  }

}
var userDefAddr = {
  getUserDefAddr: function(that, userid) {

    var url = config.requestUrl;

    var data = {
      code_: 'x_getDefAddr',
      userid: userid,
    }
    rRequest.doRequest(url, data, that, function(rdata) {

      if (rdata.info.v_info) {
        wx.setStorage({
          key: 'userDefAddr',
          data: rdata.info.v_info,
        })
      } else {
        wx.setStorage({
          key: 'userDefAddr',
          data: null,
        })

      }
    })
  }
}

var configMsgInfo = {
  url: config.requestUrl,

  getConfigMsg: function(url, pdata, that, callback) {
    var this_ = this;
    url = url || this_.url;

    rRequest.doRequest(url, pdata, that, function(rdata) {
      typeof callback == "function" && callback(rdata)
    })
  }

}
var configCodeInfo = {


}


//
var requirementMarkAction = {
  actionType: 'read',
  markAction: function(url, data, actionType, that, callback) {
    var this_ = this;
    actionType = actionType || this_.actionType;
    data = { ...data,
      actionType: actionType
    };

    rRequest.doRequest(url, data, that, function(rdata) {
      typeof callback == "function" && callback(rdata)
    })
  },

}

var doOrder = {
  /**订单操作--(确认收货、取消订单) */
  orderAction: function(that, data, callback) {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    var url = config.requestUrl;
    rRequest.doRequest(url, data, that, function(rdata) {
      wx.hideLoading();
      typeof callback == "function" && callback(rdata)
    })

  }
}

module.exports = {
  // doProgressRouteInfoImpl: doProgressRouteInfoImpl,
  canvaProgressRoute: canvaProgressRoute,
  nolinkCanvaProgressRoute: nolinkCanvaProgressRoute,
  requirementKeep: requirementKeep,
  requirementMarkAction: requirementMarkAction,
  configMsgInfo: configMsgInfo,
  userDefAddr: userDefAddr,
  doOrder: doOrder,
}
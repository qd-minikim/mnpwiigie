var canvasDraw = require('canvas.js')
var config = require('../config.js')
var headImage = null
var context = null

var c = 0;
function doProgressRouteInfoImpl(data, category, id, that) {
  var info_ = data.info_
  headImage = {
    url: [],
    x: [],
    y: [],
    r: [],
    t: [],
    resource: []
  };
  context = wx.createCanvasContext(id)
  context.save()
  for (var i = 0; i < info_.length; i++) {
    var node = info_[i];
    readTree(node, category, id);
  }

  var len = headImage.url.length
  c = 0;
  for (var n = 0; n < len; n++) {

    drawImageInfo(n,  id,that);

  
  }
 
}

function downloadImage(url  ) {
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
}
 
function drawImageInfo(i, id,that) {

 
  var image = config.routeCicleConfig.headImage;
  if (headImage.url[i] != undefined) {

  }

  downloadImage(headImage.url[i] ).then(function(value) {

     headImage.resource[i] = value;
    c++;
  
    if (c == headImage.url.length   ) {
     
      drawHeadImage(id, that );

     }

  }).catch(function(){});

 
}
 
var n 
function drawHeadImage(id,that) {

  var leng = headImage.resource.length;
  
  for (var n = 0; n < leng; n++) {

    
    var r = headImage.r[n] - 5;
    
    context.save();
     
    context.beginPath()
    context.arc(headImage.x[n], headImage.y[n], r, 0, 2 * Math.PI);
    context.stroke();
    context.clip();
    context.drawImage(headImage.resource[n], headImage.x[n] - r, headImage.y[n] - r, 2 * r, 2 * r);
    
     context.restore(); 

  }
   
  context.draw(false,function(){

    wx.canvasToTempFilePath({
      canvasId: id, //canvasId和标签里面的id对应
      success: (res) => {

        that.setData({
          'canvasViewInfo.canvasSaveImage': res.tempFilePath,

        })
      }
    })

  });
 
 
}






function readTree(node, category, id) {

  // var node = this.data.currentnode;

  if (node.isRequirement) {

    if (category == 'content_12') {

      // canvasDraw.drawRect(
      //   id,
      //   node.circlePoint[0] - node.forwardRadius - 1,
      //   node.circlePoint[1] - node.forwardRadius - 1,
      //   2 * (node.forwardRadius) - 4,
      //   2 * (node.forwardRadius) - 4,
      //   node.requirementColor);

      headImage.t.push(1);
    } else {

      headImage.t.push(0);
    }


  } else {

    var x = node.circlePoint[0] * config.routeCicleConfig.circleRM;
    var y = node.circlePoint[1] * config.routeCicleConfig.circleRM;
    var r = node.forwardRadius * config.routeCicleConfig.circleRM;
    var url = node.userHeadUrl;


    headImage.url.push(url);
    headImage.x.push(x);
    headImage.y.push(y);
    headImage.r.push(r);
    headImage.t.push(0);


    // context.beginPath();
    // context.setStrokeStyle(config.routeCicleConfig.circleYd)
    // context.arc(x, y, r, Math.PI * 0, Math.PI * 2 )
    // context.stroke()

    // if (node.isForward) {


    //   context.beginPath();
    //   context.setStrokeStyle(node.forwardColor)
    //   context.arc(x, y, r, Math.PI * 7 / 4, Math.PI * 1 / 4 )
    //   context.stroke()


    //   if (node.isAid) {


    //     context.setStrokeStyle(node.aidColor)
    //     context.arc(x, y, r, Math.PI * 5 / 4, Math.PI * 7 / 4 )

    //   }
    //   if (node.isReply) {
    //     context.restore()

    //     context.setStrokeStyle(node.replyColor)
    //     context.arc(x, y, r, Math.PI * 1 / 4, Math.PI * 3 / 4, false)


    //     if (node.isReplyAccept) {

    //       context.restore()

    //       context.setStrokeStyle(node.replyColor)
    //       context.arc(x, y, r - 5, Math.PI * 0, Math.PI * 2, false)

    //     }
    //   }
    //   if (node.isLike) {
    //     context.restore()

    //     context.setStrokeStyle(node.likeColor)
    //     context.arc(x, y, r - 5, Math.PI * 3 / 4, Math.PI * 5 / 4, false)

    //   }
    //   if (node.isBuy) {
    //     context.beginPath();

    //     context.setStrokeStyle(node.buyColor)
    //     context.arc(x, y, r - 5, Math.PI * 0, Math.PI * 2  )
    //     // canvasDraw.drawArcnew(
    //     //   id,
    //     //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //     //   node.forwardRadius * config.routeCicleConfig.circleRM - 5 * config.routeCicleConfig.circleRM,
    //     //   node.buyColor, 0, 2);
    //   }

    //   if (node.isOpen2) {


    //     context.beginPath();
    //     context.setStrokeStyle(node.open2Color)
    //     context.arc(x, y, r, Math.PI * 7 / 4, Math.PI * 1 / 4 )
    //     context.stroke()

    //     // canvasDraw.drawArcnew(
    //     //   id, node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //     //   node.forwardRadius * config.routeCicleConfig.circleRM,
    //     //   node.open2Color, 7 / 4, 1 / 4);
    //   }
    // } else {

    //   if (node.openChildsOnlyRead) {

    //     // canvasDraw.drawWord(
    //     //   id,
    //     //   "(" + node.openChildsOnlyReadNum + ")",
    //     //   node.circlePoint[0] * config.routeCicleConfig.circleRM + 48 * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM + 15 * config.routeCicleConfig.circleRM, "#6b6a6a", true);



    //   }

    //   if (node.isAid) {
    //     // canvasDraw.drawArcnew(id,
    //     //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //     //   node.forwardRadius * config.routeCicleConfig.circleRM,
    //     //   node.aidColor, 5 / 4, 7 / 4);

    //   }
    //   if (node.isReply) {



    //     // canvasDraw.drawArcnew(
    //     //   id,
    //     //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //     //  node.forwardRadius * config.routeCicleConfig.circleRM, node.replyColor, 1 / 4, 3 / 4);

    //     if (node.isReplyAccept) {

    //       // canvasDraw.drawArcnew(
    //       //   id,
    //       //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //       //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //       //   node.forwardRadius * config.routeCicleConfig.circleRM - 5 * config.routeCicleConfig.circleRM,
    //       //   node.replyColor, 0, 2);
    //     }


    //   }
    //   if (node.isLike) {
    //     // canvasDraw.drawArcnew(
    //     //   id, node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //     //   node.forwardRadius * config.routeCicleConfig.circleRM,
    //     //   node.likeColor, 3 / 4, 5 / 4);

    //   }
    //   if (node.isBuy) {
    //     // canvasDraw.drawArcnew(
    //     //   id,
    //     //   node.circlePoint[0] * config.routeCicleConfig.circleRM,
    //     //   node.circlePoint[1] * config.routeCicleConfig.circleRM,
    //     //   node.forwardRadius * config.routeCicleConfig.circleRM - 5 * config.routeCicleConfig.circleRM, node.buyColor, 0, 2);
    //   }

    // }
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

        readTree(childs[i], category, id);

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
        readTree(childs[i], category, id);
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

        readTree(childs[i], category, id);
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

        readTree(childs[i], category, id);
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

        readTree(childs[i], category, id);
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

        context.beginPath();
        if (!node.isColseToOpen2) {

          context.setStrokeStyle(node.toOpen2LineColor)


          // canvasDraw.drawLine(
          //   id, node.rightPoint[0] * config.routeCicleConfig.circleRM,
          //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
          //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
          //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
          //   node.toOpen2LineColor);
        } else {
          context.setStrokeStyle(config.routeCicleConfig.L_ISCLOSE_TOOPEN2)
          // canvasDraw.drawLine(
          //   id,
          //   node.rightPoint[0] * config.routeCicleConfig.circleRM,
          //   node.rightPoint[1] * config.routeCicleConfig.circleRM,
          //   childs[i].leftPoint[0] * config.routeCicleConfig.circleRM,
          //   childs[i].leftPoint[1] * config.routeCicleConfig.circleRM,
          //   lineIsCloseToOpen2);
        }
        context.moveTo(rx, ry);
        context.lineTo(lx, ly);
        context.closePath();
        context.stroke();

        readTree(childs[i], category, id);
      }


    }
  }

}

module.exports = {
  doProgressRouteInfoImpl: doProgressRouteInfoImpl
}

var canvasDraw = require('canvas.js')
var config = require('../config.js')
var headImage = { url: [], x: [], y: [], r: [], t: [] };
function doProgressRouteInfoImpl(data, category,id) {

  var info_ = data.info_;
  headImage = { url: [], x: [], y: [], r: [], t: [] };
 
  for (var i = 0; i < info_.length; i++) {
    var node = info_[i];

    readTree(node, category,id);

  }
  //drawImage(0, id);
  
}
function drawImage(i, id) {

  if (i == headImage.x.length) { return; }

  var r = headImage.r[i] - 10;
  
  var context = wx.createCanvasContext(id)

  var image = new Image();

  image.onload = function () {
    context.save();
    context.beginPath();




    if (headImage.t[i] == '0') {

      context.arc(headImage.x[i], headImage.y[i], r, 0, Math.PI * 2, true);
      context.clip();
      context.closePath();

      context.drawImage(image, headImage.x[i] - r, headImage.y[i] - r, 2 * r, 2 * r);
    } else {
      
      context.drawImage(image, headImage.x[i] - (r + 10) + 2, headImage.y[i] - (r + 10) + 2, 2 * (r + 10) - 12, 2 * (r + 10) - 12);

    }



    context.restore();
    i++;

    drawImage(i, id);
  };


  if (headImage.url[i] == undefined) {
    image.src = "../images/figure_12.png";
  } else {

    image.src = headImage.url[i];
  }



}


function readTree(node, category, id) {

  // var node = this.data.currentnode;

  if (node.isRequirement) {

    headImage.url.push(node.userHeadUrl);
    headImage.x.push(node.circlePoint[0]);
    headImage.y.push(node.circlePoint[1]);
    headImage.r.push(node.forwardRadius);
    if (category == 'content_12') {

      canvasDraw.drawRect(id, node.circlePoint[0] - node.forwardRadius - 1, node.circlePoint[1] - node.forwardRadius - 1, 2 * (node.forwardRadius) - 4, 2 * (node.forwardRadius) - 4, node.requirementColor);

      headImage.t.push(1);
    } else {

      headImage.t.push(0);
    }


  } else {

    canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, config.routeCicleConfig.circleYd, 0, 2);


    canvasDraw.drawImage(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.userHeadUrl);



    headImage.url.push(node.userHeadUrl);
    headImage.x.push(node.circlePoint[0]);
    headImage.y.push(node.circlePoint[1]);
    headImage.r.push(node.forwardRadius);
    headImage.t.push(0);

    if (node.isForward) {

      canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.forwardColor, 7 / 4, 1 / 4);

      if (node.isAid) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.aidColor, 5 / 4, 7 / 4);
      }
      if (node.isReply) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.replyColor, 1 / 4, 3 / 4);
        if (node.isReplyAccept) {
          canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius - 5, node.replyColor, 0, 2);
        }
      }
      if (node.isLike) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.likeColor, 3 / 4, 5 / 4);
      }
      if (node.isBuy) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius - 5, node.buyColor, 0, 2);
      }

      if (node.isOpen2) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.open2Color, 7 / 4, 1 / 4);
      }
    } else {

      if (node.openChildsOnlyRead) {

        canvasDraw.drawArcnew(id, "(" + node.openChildsOnlyReadNum + ")", node.circlePoint[0] + 48, node.circlePoint[1] + 15, "#6b6a6a", true);

      }

      if (node.isAid) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.aidColor, 5 / 4, 7 / 4);

      }
      if (node.isReply) {



        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.replyColor, 1 / 4, 3 / 4);

        if (node.isReplyAccept) {

          canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius - 5, node.replyColor, 0, 2);
        }


      }
      if (node.isLike) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius, node.likeColor, 3 / 4, 5 / 4);

      }
      if (node.isBuy) {
        canvasDraw.drawArcnew(id, node.circlePoint[0], node.circlePoint[1], node.forwardRadius - 5, node.buyColor, 0, 2);
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
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], node.toOpenLineColor, 2);
        } else {

          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToOpen, 2);
        }

        readTree(childs[i]);
        // this.setData({

        //   currentnode: childs[i]
        // })
        // this.readTree();
      }
    }

  }
  if (isPush) {
    var childs = node.pushChilds;
    if (childs && childs.length) {
      for (var i = 0; i < childs.length; i++) {
        if (!node.isColseToPush) {
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], node.toPushLineColor, 2);
        } else {
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToPush, 2);
        }
        readTree(childs[i]);
      }
    }

  }
  if (isLikePath) {
    var childs = node.likePathChilds;
    if (childs && childs.length) {
      for (var i = 0; i < childs.length; i++) {
        if (!node.isColseToLikePath) {
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], node.toLikePathLineColor, 2);
        } else {
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToLikePath, 2);
        }

        readTree(childs[i]);
      }
    }

  }
  if (isToFriend) {
    var childs = node.friendChilds;
    if (childs && childs.length) {
      for (var i = 0; i < childs.length; i++) {
        if (!node.isColseToFriend) {
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], node.toFriendLineColor);
        } else {

          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToFriend);
        }

        readTree(childs[i]);
      }

    }
  }
  if (isToShare) {
    var childs = node.shareChilds;
    if (childs && childs.length) {
      for (var i = 0; i < childs.length; i++) {

        if (!node.isColseToShare) {
          // dash_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], node.toShareLineColor, 6);
        } else {

          // dash_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToShare, 6);
        }

        readTree(childs[i]);
      }

    }
  }
  if (isOpen2) {
    var childs = node.open2Childs;
    if (childs && childs.length) {

      for (var i = 0; i < childs.length; i++) {
        if (!node.isColseToOpen2) {
          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], node.toOpen2LineColor);
        } else {

          // draw_line(id, node.rightPoint[0], node.rightPoint[1], childs[i].leftPoint[0], childs[i].leftPoint[1], lineIsCloseToOpen2);
        }

        readTree(childs[i]);
      }


    }
  }

}

module.exports = {
  doProgressRouteInfoImpl: doProgressRouteInfoImpl
}
 
 var context = null
 function drawRect(id, x, y, w, h, rgba) {

   var context = wx.createCanvasContext(id)
   context.setStrokeStyle(rgba)
   context.strokeRect(x, y, w, h)
   context.stroke();
   context.draw();

  //  var canvas = document.getElementById(id);
  //  if (canvas == null)
  //    return false;
  //  var context = canvas.getContext("2d");
  //  context.beginPath();
  //  context.strokeStyle = rgba;
 
  //  context.strokeRect(x, y, w, h);
  //  context.closePath();
 }

 /**
  * 绘制 圆弧
  */
function drawArcnew( id, x, y, r, rgba, starAngle, endAngle) {
  //  var context = wx.createCanvasContext(id)

  if (!context){
    context = wx.createCanvasContext(id)
  }
   context.beginPath();
   context.setStrokeStyle(rgba)
   context.arc(x, y, r, Math.PI * starAngle, Math.PI * endAngle, true)
   context.closePath();
   context.stroke();
   context.draw();
   
 
 }
function drawImage(id, x, y, r,image) {
  //  if (userHeadUrl == undefined) {
  //    return;
  //  }
  //  r = r - 2;
  //  var canvas = document.getElementById(id);
  //  if (canvas == null) {
  //    return false;
  //  }
  //  var context = canvas.getContext('2d');

  //  image = new Image();
  //  circle = {
  //    x: x,
  //    y: y,
  //    r: r
  //  };
  //  image.onload = function() {

  //    context.beginPath();
  //    context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
  //    context.closePath();
  //    context.clip();

  //    context.drawImage(image, circle.x - circle.r, circle.y - circle.r, 2 * circle.r, 2 * circle.r);
  //  };
  //  image.src = userHeadUrl;
  const ctx = wx.createCanvasContext(id)
  // ctx.save()
  // ctx.beginPath()
  // ctx.arc(x, y, r, 0, Math.PI * 2, true)
  // ctx.clip()
  // ctx.drawImage(image, x - r, y - r, 2 * r, 2 * r)
  ctx.drawImage(image, 0, 0, 300, 200)
  // ctx.restore()
  ctx.draw()
 }

 /**
  *  写字
  */
 function drawWord(id, text, x, y, clor, isMargin) {
  //  var canvas = document.getElementById(id);
  //  if (canvas == null)
  //    return false;
  //  var context = canvas.getContext("2d");
 
  //  context.fillStyle = clor;
  //  context.font = " 30px sans-serif";
  //  context.textBaseline = 'center';
  //  context.textAlign = "center";
  //  context.marginLeft = '110px';
   //填充字符串
   var txt = text;

   if (isMargin) {
     var length = context.measureText(txt).width;

     var h = Number(length) / 2;

     x = Number(x) + Number(h) + 2;

   }
   const ctx = wx.createCanvasContext(id)
   
   ctx.setFontSize(20)
  
   ctx.fillText(txt, x, y); 
   ctx.draw()
  
 }

 /**
  * 绘制 直线
  */

 function drawLine(id, x, y, to_x, to_y, rgba) {
  //  var canvas = document.getElementById(id);
  //  if (canvas == null)
  //    return false;
   const context = wx.createCanvasContext(id)
  //  context.beginPath();
  //  context.lineWidth = 3;
  //  context.strokeStyle = rgba; //边框样式
  //  context.fillStyle = rgba; ////填充的样式
   //实验证明第一次lineTo的时候和moveTo功能一样
   context.beginPath();
   context.moveTo(x, y);
   context.lineTo(to_x, to_y);
   context.closePath();
   context.stroke();
   context.draw()
 }





// function drawImage(id, x, y, r,image) {
//   //  if (userHeadUrl == undefined) {
//   //    return;
//   //  }
//   //  r = r - 2;
//   //  var canvas = document.getElementById(id);
//   //  if (canvas == null) {
//   //    return false;
//   //  }
//   //  var context = canvas.getContext('2d');

//   //  image = new Image();
//   //  circle = {
//   //    x: x,
//   //    y: y,
//   //    r: r
//   //  };
//   //  image.onload = function() {

//   //    context.beginPath();
//   //    context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
//   //    context.closePath();
//   //    context.clip();

//   //    context.drawImage(image, circle.x - circle.r, circle.y - circle.r, 2 * circle.r, 2 * circle.r);
//   //  };
//   //  image.src = userHeadUrl;
//    const ctx = wx.createCanvasContext(id)
//    ctx.drawImage(image, 0, 0, 150, 100)
//    ctx.draw()
//  }







//  function drawArcfill(id, x, y, r, rgba, starAngle, endAngle) {
//    var canvas = document.getElementById(id);
//    if (canvas == null) {
//      return false;
//    }
//    var context = canvas.getContext('2d');
//    context.beginPath();
//    context.lineWidth = 3;
//    context.strokeStyle = rgba;
//    //context.arc(x, y, r, Math.PI * starAngle, Math.PI * endAngle, true);
//    context.arc(x, y, r, Math.PI * starAngle, Math.PI * endAngle, false);
//    context.stroke();
//    //不关闭路径路径会一直保留下去，当然也可以利用这个特点做出意想不到的效果
//    context.closePath();
//    context.fillStyle = rgba;
//    context.fill();
//  }
//  /**
//   * 绘制 圆弧
//   */

//  function draw_arc(id, x, y, r, rgba) {
//    var canvas = document.getElementById(id);
//    if (canvas == null) {
//      return false;
//    }
//    var context = canvas.getContext('2d');
//    context.beginPath();
//    context.arc(x, y, r, 0, Math.PI * 2, true);
//    //不关闭路径路径会一直保留下去，当然也可以利用这个特点做出意想不到的效果
//    context.closePath();
//    context.fillStyle = rgba;
//    context.fill();
//  }


//  /**
//   * 绘制 虚线
//   */

//  function dashLine(id, x, y, to_x, to_y, rgba, pattern) {
//    var canvas = document.getElementById(id);
//    if (canvas == null)
//      return false;
//    var context = canvas.getContext('2d');
//    context.strokeStyle = rgba;
//    context.fillStyle = rgba;
//    //  var pattern = 2; 
//    // dashedLineTo(context,x, y, to_x, to_y, pattern);       

//    drawDashLine(context, x, y, to_x, to_y, pattern);

//  }
//  /**
//   *  虚线
//   */

//  function dashedLineTo(context, fromX, fromY, toX, toY, pattern) {
//    // default interval distance -> 5px  

//    // calculate the delta x and delta y  
//    var dx = (toX - fromX);
//    var dy = (toY - fromY);
//    var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
//    var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
//    var deltay = (dy / distance) * pattern;
//    var deltax = (dx / distance) * pattern;

//    // draw dash line  
//    context.beginPath();
//    for (var dl = 0; dl < dashlineInteveral; dl++) {
//      if (dl % 2) {
//        context.lineTo(fromX + (deltax / dashlineInteveral) * dl, fromY + dl * deltay);
//      } else {
//        context.moveTo(fromX + (deltax / dashlineInteveral) * dl, fromY + dl * deltay);
//      }
//    }
//    context.stroke();
//  };

//  //求斜边长度  
//  function getBeveling(x, y) {
//    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
//  }

//  function drawDashLine(context, x1, y1, x2, y2, dashLen) {
//    dashLen = dashLen === undefined ? 5 : dashLen;
//    //得到斜边的总长度  
//    var beveling = getBeveling(x2 - x1, y2 - y1);
//    //计算有多少个线段  
//    var num = Math.floor(beveling / dashLen);
//    context.beginPath();
//    for (var i = 0; i < num; i++) {
//      context[i % 2 == 0 ? 'moveTo' : 'lineTo'](x1 + (x2 - x1) / num * i, y1 + (y2 - y1) / num * i);
//    }
//    context.stroke();
//  }





//  /**
//   * 给Canvas元素绑定事件
//   */
//  function addCanvasListener() {
//    var cvs = document.getElementById('dr');


//    handler = function(e) {
//      var pointPosition = getEventPosition(e);
//      showPointInfo(pointPosition);

//      if (cvs.removeEventListener) {
//        cvs.removeEventListener("click", handler, false);
//      }
//      if (cvs.addEventListener) {
//        cvs.addEventListener("click", handler, false);
//      }
//    };
//    if (cvs.removeEventListener) {
//      cvs.removeEventListener("click", handler, false);
//    }
//    if (cvs.addEventListener) {
//      cvs.addEventListener("click", handler, false);

//    }

//  }

//  function getEventPosition(ev) {
//    var x, y;
//    if (ev.layerX || ev.layerX == 0) {
//      x = ev.layerX;
//      y = ev.layerY;
//    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
//      x = ev.offsetX;
//      y = ev.offsetY;
//    }
//    return {
//      x: x,
//      y: y
//    };
//  }

//  //====================================================================================================
//  /**
//   * 给Canvas元素绑定事件
//   */
//  function addUnLinkCanvasListener() {
//    var cvs = document.getElementById('unlinkfriend_dr');

//    Uhandler = function(e) {
//      var pointPosition = getEventPosition(e);
//      showUnLinkPointInfo(pointPosition);

//      if (cvs.removeEventListener) {
//        cvs.removeEventListener("click", Uhandler, false);
//      }
//      if (cvs.addEventListener) {
//        cvs.addEventListener("click", Uhandler, false);
//      }
//    };
//    if (cvs.removeEventListener) {
//      cvs.removeEventListener("click", Uhandler, false);
//    }
//    if (cvs.addEventListener) {
//      cvs.addEventListener("click", Uhandler, false);

//    }

//  }

 module.exports = {
     drawImage: drawImage,
  //  drawRect: drawRect,
     drawArcnew: drawArcnew,
   drawWord: drawWord,
  //  drawArcfill: drawArcfill,
  //  drawArc: drawArc,
     drawLine: drawLine,
  //  dashLine: dashLine,
  //  dashedLineTo: dashedLineTo,
  //  getBeveling: getBeveling,
  //  drawDashLine: drawDashLine,
  //  drawWord: drawWord,
  //  addCanvasListener: addCanvasListener,
  //  getEventPosition: getEventPosition,
  //  addUnLinkCanvasListener: addUnLinkCanvasListener,
 }
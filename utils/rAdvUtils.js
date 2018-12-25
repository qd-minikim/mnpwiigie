var config = require('../config.js')
var rRequest = require('../utils/rRequest.js');
//  广告渠道
var adv = {
  url: config.requestUrl,
  code: 'x_doadv',
  doadv: function(that, pdata) {
    var this_ = this;
    var url = this_.url;

  
    var data = { ...pdata, 'code_': this_.code };

    rRequest.doRequest(url, data, that, function(rdata) {


    })
  }
}


module.exports = {
  adv: adv,

}
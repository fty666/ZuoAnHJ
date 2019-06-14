//logs.js
const util = require('../../utils/util.js')
var template = require('../../template/template.js');
Page({
  data: {
    logs: []
  },
  onLoad: function () {
      template.tabbar("tabBar", 1, this,2)//1表示第二个tabbar
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})

// pages/trader/trader1/trader.js
const util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remove: '',//开通经销商
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 申请经销售
   */
  kai: function () {
    if (this.data.remove == true) {
      // util.myWxRequest(app.globalData.insertDealerUrl, { userId: app.globalData.userId, remark: '' }, function (res) {

      //     wx.showModal({
      //         title: '申请已提交，请耐心等待1~2个工作日',
      //         showCancel: false,
      //         success: function (res) {
      //             if (res.confirm) {
      //                 wx.navigateTo({
      //                     url: '/pages/trader/index/index',
      //                 })
      //             }
      //         }
      //     })
      // });
      wx.navigateTo({
        url: '/pages/trader/select/select',
      })
    } else {
      wx.showToast({
        title: '请阅读规则',
        icon: 'none'
      })
    }
  },

  /**
   *阅读规则 
   */
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'true') {
      this.setData({
        remove: true
      })
    } else {
      wx.showToast({
        title: '请阅读规则',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
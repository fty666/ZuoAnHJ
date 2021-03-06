const util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank: '',//银行卡卡号
    sumprices: 0,//总金额
    px2rpxHeight: '',
    px2rpxWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      sumprices: options.sumprices
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    // 获取默认银行卡
    util.myWxRequest(app.globalData.getCardByDefaultUrl, { user_id: app.globalData.userId }, function (res) {
      console.log(res)
      that.setData({
        bank: res.data.data,
      });
    });
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        // console.log(res)
        let heigh = 'height:' + res.data.px2rpxHeight * 1700 + 'px';
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
          heigh: heigh
        })
      }
    })
  },

  /**
   *体现跳转 
   */
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let sumMoney = e.detail.value.cash;
    let sumprices = this.data.sumprices;
    console.log(sumprices)
    if (sumMoney > sumprices) {
      wx.showToast({
        title: '账户余额不足',
        icon: 'none'
      })
      return false;
    }
    let banks = this.data.bank;
    util.myWxRequest(app.globalData.addDealerWithdraw, { card_no: banks.card_no, owner: banks.owner, bank: banks.bank, mobile: banks.mobile, moneys: sumMoney, dealerCode: app.globalData.dealerCode }, function (res) {
      console.log(res)
      wx.showToast({
        title: '提现成功',
      })
      wx.navigateTo({
        url: '/pages/trader/note/note',
      })
    });

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
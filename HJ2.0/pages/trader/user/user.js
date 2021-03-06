// pages/trader/user/user.js
var template = require('../../../template/template.js');
var util = require('../../../utils/util.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pending_payment: 0,
    userinfo: "",
    to_be_shipped: 1,
    to_be_received: 2,
    to_be_evaluated: 3,
    serverUrl: app.globalData.aliyunServerURL,
    px2rpxWidth: '',//手机页面比例
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.vipLevel);
    template.tabbar("tabBar", 3, this, app.globalData.vipLevel);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    util.myWxRequest(app.globalData.getUserInfoUrl, { userId: app.globalData.userId }, function (res) {
      console.log(res)
      app.globalData.dealerCode = res.data.data.dealerCode;
      that.setData({
        userinfo: res.data.data
      })
    });

    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        console.log(res)
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
  },

  /**
   *库存跳转 
   */
  inventory: function () {
    wx.navigateTo({
      url: '/pages/goods_stock/goods_stock?dealerCode=' + this.data.userinfo.dealerCode,
    })
  },

  /**
   *回购跳转 
   */
  buyBack: function () {
    wx.navigateTo({
      url: '/pages/buyback/buyback?dealerCode=' + this.data.userinfo.dealerCode,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  /**
   *客服电话 
   */
  custom: function () {
    wx.makePhoneCall({
      phoneNumber: '18722405700',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
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
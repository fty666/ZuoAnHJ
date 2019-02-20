// pages/seckill/seckill.js
var utils = require('../../utils/util.js');
const app = getApp();
var page = 1;
var pageSize = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.globalData.aliyunServerURL,
    killinfo: '',//秒杀商品
    px2rpxHeight: '',
    px2rpxWidth: '',
    price: '',//满多少
    full: '',//减
    activityId: '',//满减活动ID
  },

  //  商品详情
  info: function (e) {
    let id = e.currentTarget.dataset.id
    // console.log(e)
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options) {
      this.setData({
        price: options.term,
        full: options.money,
        activityId: options.activityId
      })
    }
    //查询满减活动商品 
    let that = this;
    utils.myWxRequest(app.globalData.getActivityGoods, { page: page, pageSize: pageSize, activityId: options.activityId }, function (res) {
      console.log(res.data.data)
      that.setData({
        killinfo: res.data.data.pageInfo.list
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //活动数据   
    let that = this;
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function (res) {
        // console.log(res)
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })

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
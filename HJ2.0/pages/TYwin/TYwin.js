const utils = require('../../utils/util.js');
const app = getApp();
var pageSize = 20;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stock: '',
    serverUrl: app.globalData.aliyunServerURL,
    height: 0,
    px2rpxHeight: '',
    px2rpxWidth: '',
    dealerCode: '',//经销商编码
    status: '',//状态值
  },

  // 库存详情
  kcinfo: function () {
    wx.navigateTo({
      url: '/pages/stock_detail/stock_detail'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this;
    that.setData({
      dealerCode: options.dealerCode
    })
    // 获取库存商品
    utils.myWxRequest(app.globalData.getDealerGoods, { userId: app.globalData.userId }, function (res) {
      console.log(res)
      console.log(res.data.data.goods);
      that.setData({
        stock: res.data.data.goods,
        status: res.data.data.status
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })

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

  },

  /**
   * scroll-view 滚动到底部
   */
  scrolltolower: function () {
    // pageSize += 20;
    // let that = this;
    // // 获取库存商品
    // utils.myWxRequest(app.globalData.getCountUrl, { dealerCode: that.data.dealerCode, page: page, pageSize: pageSize }, function (res) {
    //   that.setData({
    //     stock: res.data.data
    //   });
    // });
  },

  /**
   * 跳转到库存详情
   */
  stockDetail: function (e) {
    // 获取商品id
    let gid = e.currentTarget.dataset.gid;
    console.log(e);
    console.log(gid)
    // 跳转
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id='+gid,
    })
  },
})
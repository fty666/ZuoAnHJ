const app = getApp();
var utils = require('../../utils/util.js');
var myPageSize = 20;
var goodsid = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allComment: [],
    serverUrl: app.globalData.aliyunServerURL,
    px2rpxWidth: '',
    px2rpxHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    goodsid = options.goodsId;
    // console.log(goodsid);     
    utils.myWxRequest(app.globalData.QueryCommentUrl, { goodsId: goodsid, page: 1, pageSize: myPageSize }, function (res) {
      // console.log(res.data.data.PageInfo.list)
      let allComment = res.data.data.PageInfo.list;
      // console.log(allComment.length)
      for (let i = 0; i < allComment.length; i++) {
        // console.log(allComment[i].img)
        allComment[i].commentimg = allComment[i].img.split(',');
        // console.log(allComment[i].commentimg)
      }
      console.log(allComment)
      that.setData({
        allComment: allComment
      });
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
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
   * 滚动到底部，触发 scrolltolower 事件
   */
  getCommet: function () {
    let that = this;
    myPageSize += 10;
    utils.myWxRequest(app.globalData.QueryCommentUrl, { goodsId: goodsid, page: 1, pageSize: myPageSize }, function (res) {
      that.setData({
        allComment: res.data.data.PageInfo.list
      });
    });
  }
})
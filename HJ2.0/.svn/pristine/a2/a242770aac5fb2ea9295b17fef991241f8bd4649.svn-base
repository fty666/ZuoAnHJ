const util = require('../../../utils/util.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    card: null,
    glo_is_load: true,
    hasData: false,
    shopcode: '',
    px2rpxHeight: '',
    px2rpxWidth: '',
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
    let that = this;
    // 获取银行卡
    this.info();
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

  // 获取银行卡信息
  info: function () {
    // 获取银行卡
    let that = this;
    util.myWxRequest(app.globalData.getCardByUserUrl, { user_id: app.globalData.userId }, function (res) {
      console.log(res)
      that.setData({
        card: res.data.data,
        hasData: true,
        glo_is_load: false
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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
   * 选择银行卡
   */
  // selectBankCard:function(e){
  //     let prevUrl = util.getPrevPageUrl();
  //     // pages/myself/myMoney/myMoney
  //     // console.log(prevUrl);
  //     wx.navigateTo({
  //         url: '/' + util.getPrevPageUrl() + '?cid=' + e.currentTarget.dataset.cid
  //     })

  // },

  /**
   * 添加银行卡
   */
  addCard: function () {
    wx.navigateTo({
      url: '/pages/bankCard/addBankCard/addBankCard'
    })
  },

  /**
   * 设置默认
   */
  setCardDefault: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    let card = that.data.card;
    let len = card.length;
    if (len > 1) {
      util.myWxRequest(app.globalData.updateCardDefaultUrl, { card_id: cid, user_id: app.globalData.userId }, function (res) {
        console.log(res)
        that.info();
        wx.showToast({
          title: '设置成功',
        })
      });
    } else {
      util.myWxRequest(app.globalData.updateCardDefaultByOneUrl, { card_id: cid, user_id: app.globalData.userId }, function (res) {
        console.log(res)
        that.info();
        wx.showToast({
          title: '设置成功',
        })
      });
    }
  },

  /**
   * 解除绑定
   */
  unbindBankCard: function (e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    util.myWxRequest(app.globalData.deleteCardUrl, { card_id: cid }, function (res) {
      console.log(res)
      that.setData({
        card: res.data.data,
        hasData: true,
        glo_is_load: false
      });
      that.info();
      wx.showToast({
        title: '解绑成功',
      })

    });
  },
})
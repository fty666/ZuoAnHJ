// pages/after_sale/after_sale.js
const app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {
      img: '../../images/comment-img.png',
      gname: '奔富洛神山庄设拉子赤霞珠红葡萄酒750ml进口红酒葡萄酒',
      specification: '750ml 6*1箱'
    },
    serverUrl: app.globalData.aliyunServerURL,
    back: '',//退换货
    uuid: '',//订单号
    status: '',//5退货6换货

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      uuid: options.uuid
    })
    let that = this;
    let goodsInfo = { id: options.goodsId, gname: options.goodsName, img: options.goodsImg, specification: options.specification };
    that.setData({
      goodsInfo: goodsInfo
    });
    // 获取商品信息
    // utils.myWxRequest(app.globalData.getGoodsDetailUrl, {id:options.goodsId}, function(res){
    //     that.setData({
    //         goodsInfo:res.data.data
    //     });
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   *退换货 
   */
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'tui') {
      this.setData({
        back: 'false',
        status: 6,
      })
    } else if (e.detail.value == 'huan') {
      this.setData({
        back: 'true',
        status: 5
      })
    }

  },

  /**
   *退换货原因 
   */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let content = e.detail.value.content;
    let that = this;
    // 获取商品信息
    utils.myWxRequest(app.globalData.returnOrderUrl, { uuid: that.data.uuid, status: that.data.status, reason: content }, function (res) {
      wx.showToast({
        title: '申请成功，耐心等待',
      })
      wx.navigateTo({
        url: '/pages/myorder/myorder?status=-1',
      })
    });

  },


  /**
*客服 
*/
  custom: function () {
    wx.makePhoneCall({
      phoneNumber: '022-27357010',
    })
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
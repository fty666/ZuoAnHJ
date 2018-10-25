// pages/users/nechen/nechen.js
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
        name:'',
  },
  formSubmit: function (e) {
    // 修改昵称
    var date = e.detail.value.input;
    console.log(date)
    let leng=date.length;
    console.log(leng)
    if(leng==0||leng>=20){
        wx.showToast({
            title: '请填写正确的昵称',
        })
    }
    util.myWxRequest(app.globalData.updateUserInfoNickName, { userId: app.globalData.userId, nickName:date }, function (res) {
      wx.showToast({
        icon: 'success',
        title: '修改成功'
      });
      wx.navigateTo({
        url: '/pages/users/users/users?nechen=' + e.detail.value.input
      })
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log(options)
        this.setData({
            name: options.name
        })
  
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
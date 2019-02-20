// pages/trader/select/select.js
const util = require('../../../utils/util.js');
const app = getApp();
var flag = true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 5,
    drink: '',//酒
    serverUrl: app.globalData.aliyunServerURL,
    dealers: '',//选择好的酒
    dealerCode: '',//经销商码
    px2rpxHeight: '',
    px2rpxWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let dealerCode = options.dealerCode;
    this.setData({
      dealerCode: dealerCode
    })
    let that = this;
    util.myWxRequest(app.globalData.getRecommendGoodsUrl, { page: 1, pageSize: 5 }, function (res) {
      console.log(res)
      let lists = res.data.data.PageInfo.list;
      let len = lists.length;
      for (let i = 0; i < len - 1; i++) {
        lists[i].checked = false;
      }
      that.setData({
        drink: lists
      })
      console.log(lists)
    });
  },

  /**
   * 重新和获取买的酒
   */
  align: function () {
    this.setData({
      dealers: ''
    })
    console.log(this.data.dealers)
    let that = this;
    let page = 1;
    flag = !flag;
    console.log(flag)
    if (flag == true) {
      page = 1;
    } else {
      page = 2;
    }

    util.myWxRequest(app.globalData.getRecommendGoodsUrl, { page: page, pageSize: 5 }, function (res) {
      console.log(res)
      let lists = res.data.data.PageInfo.list;
      let len = lists.length;
      for (let i = 0; i < len - 1; i++) {
        lists[i].checked = false;
      }
      that.setData({
        drink: lists
      })
      console.log(lists)
    });
  },

  /**
   * 
   *选择要买的酒 
   */
  checkboxChange: function (e) {
    let drinks = '';
    drinks += e.detail.value + ',';
    console.log(drinks)
    this.setData({
      dealers: drinks
    })
  },

  /**
   *确认提交 
   */
  formSubmit: function (e) {
    let that = this;
    if (that.data.dealers == '') {
      wx.showModal({
        title: '请选择商品',
        icon: 'none'
      })
      return false;
    }
    if (app.globalData.SQjin == '') {
      util.myWxRequest(app.globalData.insertDealerUrl, { userId: app.globalData.userId, goodsId: that.data.dealers, remark: '' }, function (res) {
        wx.showModal({
          title: '申请已提交',
          showCancel: false,
          success: function (res) {
            app.globalData.SQjin == '111111';
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/trader/index/index',
              })
            }
          }
        })
      });
    } else {
      wx.showToast({
        title: '已经申请过了',
      })
    }


    //请求数据 
    // wx.request({
    //   url: 'http://192.168.1.153:8080/redwine/dealer/insertDealer', 
    //   method: 'POST',
    //   data: {
    //     userId: app.globalData.userId,
    //     goodsId: that.data.dealers,
    //     remark: ''
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success(res) {
    //     console.log(res)
    //     if (res.data.state==0) {
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'none'
    //       })
    //     } else {
    //       wx.showModal({
    //         title: '申请已提交',
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.navigateTo({
    //               url: '/pages/trader/index/index',
    //             })
    //           }
    //         }
    //       })
    //     }

    //   },
    // })
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
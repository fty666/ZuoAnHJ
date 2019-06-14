const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    px2rpxHeight: '', //页面高度
    px2rpxWidth: '', //页面宽度
    counponList: [], //优惠券
    page: 1,
    pageSize: 10,
    preUrl: '', //上一层跳转来的页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    // 获取优惠券
    let data = {
      page: that.data.page,
      pageSize: that.data.pageSize,
      userId: app.globalData.userId,
    }
    util.myWxRequest(app.globalData.selecCoupon, data, function(res) {
      that.setData({
        counponList: res.data.data.PageInfo.list
      });
    });
    //获取缓存
    wx.getStorage({
      key: 'PX_TO_RPX',
      success: function(res) {
        that.setData({
          px2rpxHeight: res.data.px2rpxHeight,
          px2rpxWidth: res.data.px2rpxWidth,
        })
      }
    })
    let preUrl = util.getPrevPageUrl();
    that.setData({
      preUrl: preUrl
    })
  },
  byback(e) {
    let that = this;
    returns(e, that);
  },
  byback2(e) {
    let that = this;
    returns(e, that);
  },
  byback3(e) {
    let that = this;
    returns(e, that);
  },
  byback4(e) {
    let that = this;
    returns(e, that);
  },
  /**
   *加载数据 
   */
  scrollToLower: function() {
    let that = this;
    let pageSize = that.data.pageSize;
    pageSize += 10;
    // 相关推荐  
    let data = {
      page: that.data.page,
      pageSize: that.data.pageSize,
      userId: app.globalData.userId,
    }
    util.myWxRequest(app.globalData.selecCoupon, data, function(res) {
      that.setData({
        counponList: res.data.data.PageInfo.list
      });
    });
  },

})

function returns(e, that) {
  if (that.data.preUrl == 'pages/commit_order/commit_order') {
    wx.navigateTo({
      url: '/pages/commit_order/commit_order?id=' + e.target.dataset.index.coupon_id + '?money=' + e.target.dataset.index.money,
    })
  }
}
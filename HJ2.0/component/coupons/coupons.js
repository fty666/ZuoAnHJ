const app = getApp();
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
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
   * 生命周期函数--监听页面初次渲染完成
   */
  created: function() {
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
  /**
   * 组件的方法列表
   */
  methods: {
    // 选择优惠券
    radioChange(e) {
      let that = this;
      let datas = e.target.dataset.index;
      console.log(datas.conditions);
      console.log(app.globalData.prcirCounp)
      if (datas.conditions > app.globalData.prcirCounp){
        this.triggerEvent('myevent', '');
      }else{
        this.triggerEvent('myevent', datas);
      }
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

  }
})
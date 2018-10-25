var util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    typeId: 0,
    pages: 1,
    pagesize: 15,
    collectList: [],
    upload_file_url: app.globalData.aliyunServerURL

  },
  onLoad: function (options) {

  },

  onReady: function () {
    this.collect();
  },

  collect: function () {
    let that = this;
    util.myWxRequest(app.globalData.getCollectionUrl, { userId: app.globalData.userId, page: that.data.pages, pageSize: that.data.pagesize }, function (res) {
      that.setData({
        collectList: res.data.data.PageInfo.list
      })
      // console.log(res.data.data.PageInfo.list)
    });
  },

  /**
   *取消收藏 
   */
  remove: function (e) {
    // console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.gid
    util.myWxRequest(app.globalData.deleteCollectionUrl, { id: id }, function (res) {
      wx.showToast({
        title: '取消收藏成功',
      })
      that.collect();
    });
  },

  /**
   *商品跳转 
   */
  goshop: function (e) {
    let id = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + id
    })
  },

  /**
   *滚动下滑 
   */
  scrollToLower: function () {
    console.log('llll')
    let that = this;
    let pagesize = that.data.pagesize;
    pageSize += 20;
    that.setData({
      pageSize: pageSize
    })
    that.collect();
  },

  onShow: function () {

  },


  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },


  openGoods(event) {

    let that = this;
    let goodsId = this.data.collectList[event.currentTarget.dataset.index].value_id;

    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除吗？',
        success: function (res) {
          if (res.confirm) {

            util.request(api.CollectAddOrDelete, { typeId: that.data.typeId, valueId: goodsId }, 'POST').then(function (res) {
              if (res.errno === 0) {
                console.log(res.data);
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getCollectList();
              }
            });
          }
        }
      })
    } else {

      wx.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId,
      });
    }
  },
  //按下事件开始  
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },
})
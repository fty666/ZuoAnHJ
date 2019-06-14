// pages/trader/sell/sell.js
var util = require('../../../utils/util.js');
var Charts = require('.././../../utils/charts');
const app = getApp();
var undercarriage_flag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sell: [],
    goods_num: 1,
    undercarriage: true,
    serverUrl: app.globalData.aliyunServerURL,
    num: 1,//下架数量
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
    var that = this;
    // 获取正在销售的商品
    util.myWxRequest(app.globalData.getIsSaleUrl, { userId: app.globalData.userId, }, function (data) {
      console.log(data)
      let sell = data.data.data;
      console.log(sell)
      let len = sell.length;
      for (let i = len - 1; i >= 0; i--) {
        if (sell[i]) {
          sell[i].soldnum = 1;
        }
      }
      that.setData({
        sell: sell,
      });
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
   * 下架
   */
  undercarriage: function (e) {
    console.log(e)
    let dealerCode = e.currentTarget.dataset.dealercode;
    let goodsId = e.currentTarget.dataset.goodsid;
    console.log(dealerCode)
    console.log(e)
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要下架此商品吗',
      success: function (res) {
        if (res.confirm) {
          util.myWxRequest(app.globalData.deleteDealerStock, { num: that.data.num, goodsId: goodsId, dealerCode: dealerCode }, function () {
            wx.showToast({
              title: '成功',
              icon: 'success'
            })

            util.myWxRequest(app.globalData.getIsSaleUrl, { userId: app.globalData.userId, }, function (data) {
              let sell = data.data.data;
              console.log(sell)
              let len = sell.length;
              for (let i = len - 1; i >= 0; i--) {
                if (sell[i]) {
                  sell[i].soldnum = 1;
                }
              }
              that.setData({
                sell: sell,
                num: 1
              });
            })

          });
        } else if (res.cancel) {
          wx.showToast({
            title: '取消成功',
          })
        }
      }
    })
  },

  /**
   * 取消下架
   */
  cancleUndercarriage: function (e) {
    let index = e.currentTarget.dataset.index;
    let sell = this.data.sell;
    let that = this;
    sell[index].selected = true;
    // 获取正在销售的商品
    util.myWxRequest(app.globalData.getIsSaleUrl, { userId: app.globalData.userId, }, function (data) {
      console.log(data)
      let sell = data.data.data;
      console.log(sell)
      let len = sell.length;
      for (let i = len - 1; i >= 0; i--) {
        // if (sell[i].goods){
        //     sell.splice(i-1,1);
        // } 
        if (sell[i]) {
          sell[i].selected = true;
          sell[i].num = 1;
        }
      }
      console.log(sell);
      that.setData({
        sell: data.data.data,
      });
    })
  },

  /**
    * 增加数量
    */
  addCount: function (e) {
    let index = e.currentTarget.dataset.index;
    let sell = this.data.sell;
    let num = parseInt(sell[index].num);
    console.log(num)
    let soldnum = parseInt(sell[index].soldnum);
    console.log(soldnum)
    soldnum = soldnum + 1;
    // 最大数量不能大于销售中的数量
    if (soldnum > num) {
      soldnum = num;
    }
    // sell[index].num = num;
    sell[index].soldnum = soldnum;
    this.setData({
      sell: sell,
      num: soldnum
    });
  },

  /**
   * 减少数量
   */
  minusCount: function (e) {
    let index = e.currentTarget.dataset.index;
    let sell = this.data.sell;
    let soldnum = parseInt(sell[index].soldnum);
    soldnum = soldnum - 1;
    if (soldnum < 1) {
      soldnum = 1;
    }
    // sell[index].num = soldnum; 
    sell[index].soldnum = soldnum;
    this.setData({
      sell: sell,
      num: soldnum
    });
  },

  /**
   * 修改商品数量
   */
  // inputNum: function (e) {
  //   console.log(666666666666)
  //   let index = e.currentTarget.dataset.index;
  //   let sell = this.data.sell;
  //   if (e.detail.value == '') {
  //     sell[index].soldnum = 1;
  //     sell[index].num = 1;
  //     this.setData({
  //       sell: sell,
  //       num:1
  //     });
  //   }
  // },

  blurNum: function (e) {
    console.log(8888888)
    let index = e.currentTarget.dataset.index;
    let sell = this.data.sell;
    let soldnum = parseInt(e.detail.value);
    console.log(soldnum)
    // 最大数量不能大于销售中的数量
    let num = sell[index].num;
    console.log(num)
    if (soldnum > num) {
      soldnum = num;
    }
    if (/^[1-9]+[0-9]*]*$/.test(soldnum)) {
      sell[index].soldnum = soldnum;
    } else {
      sell[index].soldnum = 1;
    }
    this.setData({
      sell: sell,
      num: soldnum
    });

  },
})
// pages/trader/note/note.js
var util = require('../../../utils/util.js');
var math = require('../../../utils/calculate.js');
const app = getApp();
var page=1;
var pageSize=10;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 账户余额年月
    Mtime: "",
    Ytime: "",
    two: "12",
    one: "01",
    // 订单明细参数
    order: "",
    // 本月成交额参数
    yprice: 0,
    // 时间参数
    times: "",
    serverUrl: app.globalData.aliyunServerURL,
    sumprices: 0,//总金额
    deposit: 0,//可提现金额
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

    // 账户余额日期时间
    var years = util.formatDate(new Date().getTime(), 'YY')
    var months = util.formatDate(new Date().getTime(), 'MM')
    this.setData({
      Mtime: months,
      Ytime: years
    });

    //订单详细  按月份查找数据
    util.myWxRequest(app.globalData.getDealerOrders, { dealerCode: app.globalData.dealerCode, pageSize: pageSize,page:page},function (res) {
      console.log(res.data.data.PageInfo.list)
        that.setData({
          order: res.data.data.PageInfo.list
        });
      })

    //查找本月的金额
    util.myWxRequest(app.globalData.getBusiness, { dealerCode: app.globalData.dealerCode, time: 1 },
      function (res) {
        console.log(res)
        that.setData({
          yprice: res.data.data.soldPrice
        })
      })


    // 查找总金额
    util.myWxRequest(app.globalData.getBusiness, { dealerCode: app.globalData.dealerCode, time: 2 },
      function (res) {
        console.log(res)
        that.setData({
          sumprices: res.data.data.soldPrice
        })
      })

    // 查找可提现的金额
    util.myWxRequest(app.globalData.getBalance, { dealerCode: app.globalData.dealerCode },
      function (res) {
        console.log(res)
        that.setData({
          deposit: res.data.data.soldPrice
        })
      })




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
   *  账户余额月份前进
   */
  go: function () {
    let MM = parseInt(this.data.Mtime)
    let YY = parseInt(this.data.Ytime)
    MM++
    if (MM < 10) {
      this.setData({
        Mtime: "0" + MM
      })
    } else {
      this.setData({
        Mtime: MM
      })
    }
    if (MM > 12) {
      this.setData({
        Ytime: YY + 1,
        Mtime: this.data.one
      })
    }

    //  具体月份订单
    var that = this
    util.myWxRequest(app.globalData.getSaleTrackByMonthkUrl, { dealerCode: app.globalData.dealerCode, createTime: that.data.Ytime + '-' + that.data.Mtime },
      function (res) {
        that.setData({
          order: res.data.data
        });
        // 转化时间戳
        let arrays = res.data.data
        let lengths = res.data.data.length
        let sum = 0;

        if (lengths >= 1) {
          for (var i = 0; i < lengths; i++) {
            // 转化时间格式
            var createTime = arrays[i].createTime
            var time = util.formatDate(createTime, 'YY-MM-DD hh:mm:ss')
            // var years = util.formatDate(createTime, 'YY-MM')
            that.setData({
              times: time
            });

            //本月成交额
            // sum += parseFloat(parseInt((arrays[i].num)) * parseFloat((arrays[i].price)))
            let orderSum = math.calcMul(arrays[i].num, arrays[i].price);
            sum = math.calcAdd(orderSum, sum).toFixed(2);
            console.log(sum)
            that.setData({
              yprice: sum
            });
          }
        } else {
          that.setData({
            yprice: 0
          });
        }

      })

  },

  /**
   *  月份后退
   */
  back: function () {
    let MM = parseInt(this.data.Mtime)
    let YY = parseInt(this.data.Ytime)
    MM--
    if (MM < 10) {
      this.setData({
        Mtime: "0" + MM
      })
    } else {
      this.setData({
        Mtime: MM
      })
    }
    if (MM <= 0) {
      this.setData({
        Ytime: YY - 1,
        Mtime: this.data.two
      })
    }


    /**
     * 具体月份订单
    */
    var that = this
    util.myWxRequest(app.globalData.getSaleTrackByMonthkUrl, { dealerCode: app.globalData.dealerCode, createTime: that.data.Ytime + '-' + that.data.Mtime },
      function (res) {
        that.setData({
          order: res.data.data
        });
        // 转化时间戳
        let arrays = res.data.data;
        console.log(arrays)
        var lengths = res.data.data.length
        let sum = 0;

        if (lengths >= 1) {
          for (var i = 0; i < lengths; i++) {
            // 转化时间格式
            var createTime = arrays[i].createTime
            var time = util.formatDate(createTime, 'YY-MM-DD hh:mm:ss')
            // var years = util.formatDate(createTime, 'YY-MM')
            that.setData({
              times: time
            });
            //本月成交额
            // sum += parseFloat(parseInt((arrays[i].num)) * parseFloat((arrays[i].price)))
            let orderSum = math.calcMul(arrays[i].num, arrays[i].price);
            sum = math.calcAdd(orderSum, sum).toFixed(2);
            console.log(sum)
            that.setData({
              yprice: sum
            });
          }
        } else {
          that.setData({
            yprice: 0
          });
        }

      })

  },

  /**
   *提现跳转 
   */
  cash: function () {
    console.log(this.data.sumprices)
    wx.navigateTo({
      url: '/pages/trader/tixian/tixian?sumprices=' + this.data.sumprices,
    })
  },

  /**
   * 下拉事件
   * */

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
    // console.log('kkkk')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
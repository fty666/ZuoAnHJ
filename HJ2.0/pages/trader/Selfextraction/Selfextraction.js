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
        page:1,
        pageSize:20,
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
        util.myWxRequest(app.globalData.getMyOrder, { userId: app.globalData.userId, page: that.data.page, pageSize: that.data.pageSize }, function (data) {
            console.log(data)
            that.setData({
                sell: data.data.data.PageInfo.list
            });
            console.log(data.data.data.PageInfo.list)
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
        let index = e.currentTarget.dataset.index;
        let sell = this.data.sell;
        sell[index].selected = false;
        this.setData({
            sell: sell
        });
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
        // let num=1;
        num = num + 1;
        // 最大数量不能大于销售中的数量
        let sale_num = sell[index].dealer.num;
        console.log(sale_num)
        if (num > sale_num) {
            num = sale_num;
        }
        sell[index].num = num;
        this.setData({
            sell: sell,
            num: num
        });
    },

    /**
     * 减少数量
     */
    minusCount: function (e) {
        let index = e.currentTarget.dataset.index;
        let sell = this.data.sell;
        let num = parseInt(sell[index].num);
        if (num <= 1) {
            return false;
        }
        num = num - 1;
        sell[index].num = num;
        this.setData({
            sell: sell,
            num: num
        });
    },

    /**
     * 修改商品数量
     */
    inputNum: function (e) {
        let index = e.currentTarget.dataset.index;
        let sell = this.data.sell;
        if (e.detail.value == '') {
            sell[index].num = 1;
            this.setData({
                sell: sell
            });
        }
    },

    blurNum: function (e) {
        let index = e.currentTarget.dataset.index;
        let sell = this.data.sell;
        let num = parseInt(e.detail.value);
        // 最大数量不能大于销售中的数量
        let sale_num = sell[index].dealer.num;
        if (num > sale_num) {
            num = sale_num;
        }
        if (/^[1-9]+[0-9]*]*$/.test(num)) {
            sell[index].num = num;
        } else {
            sell[index].num = 1;
        }
        this.setData({
            sell: sell
        });

    },

    /**
     * 确定下架
    */
    confirmUndercarriage: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let sell = that.data.sell[index];
        let sid = sell.dealer.sid;  // 下架的库存号
        let num = sell.num;  // 下架的数量
        util.myWxRequest(app.globalData.updateStockUrl, { id: sid, num: num }, function () {
            wx.showToast({
                title: '成功',
                icon: 'success'
            })
            sales();
        });
    },
})

function sales() {
    var that = this;
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
}
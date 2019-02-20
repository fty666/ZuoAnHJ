// pages/not_pay/not_pay.js
const util = require('../../utils/util.js');
const app = getApp();
var page = 1;
var pageSize = 20;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myorder: null,
        pending_payment: 0,
        serverUrl: app.globalData.aliyunServerURL
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
    
        let  mydata = {
            page: page, pageSize: pageSize, userId: app.globalData.userId, stauts: that.data.pending_payment
        }
        // 获取订单
        util.myWxRequest(app.globalData.QueryOrderUrl, mydata, function (res) {
            // 获取订单
            let order = res.data.data.PageInfo.list;
            for (let i = 0; i < order.length; i++) {
                let goods = order[i].goods;
                let len = goods.length;
                var sumPrice = 0;
                for (let j = 0; j < len; j++) {
                    order[i].status = goods[j].status;
                    order[i].createTime = goods[j].createTime;
                    sumPrice += parseInt(goods[j].num) * parseFloat(goods[j].price);
                    order[i].goodsnum = len;
                }
                order[i].sumPrice = sumPrice;
            }
            that.setData({
                myorder: order
            });
        });
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
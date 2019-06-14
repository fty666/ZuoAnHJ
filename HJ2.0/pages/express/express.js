var util = require('../../utils/util.js');
var app = getApp();

Page({
    data: {
        orderId: 1,
        express: {},
        expressTraces: []
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({
            orderId: options.uuid
        });
        this.getExpressInfo();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示

    },
    getExpressInfo() {
        let that = this;
        util.myWxRequest(app.globalData.getTransInfoUrl, { orderUUID: that.data.orderId }, function (res) {
            console.log(res)
            that.setData({
                express: res.data.data,
                expressTraces: res.data.data.Traces
            });
        });
    },
    updateExpress() {
        this.getExpressInfo();
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})
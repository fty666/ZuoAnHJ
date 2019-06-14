// pages/address/insert/insert.js
var util = require('../../../utils/util.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: "",
        prevUrl: '',
        goodsId: '',
        px2rpxHeight: '',
        px2rpxWidth: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let prevUrl = util.getPrevPageUrl();
        that.setData({
            prevUrl: prevUrl,
            goodsId: options.goodsId
        })

        // 按钮修改
        var pages = getCurrentPages() // 获取页面栈
        var prevPage = pages[pages.length - 2] // 上一个页面
        prevPage.setData({ // 给上一个页面变量赋值
            isRouteMy: '2'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 请求获取所有数据
        this.every()
        let that = this;
        //获取缓存
        wx.getStorage({
            key: 'PX_TO_RPX',
            success: function (res) {
                that.setData({
                    px2rpxHeight: res.data.px2rpxHeight,
                    px2rpxWidth: res.data.px2rpxWidth,
                })
            }
        })
    },

    /**
     *请求所有数据 
     */
    every: function () {
        var that = this
        util.myWxRequest(app.globalData.getAddrUrl, { user_id: app.globalData.userId }, function (res) {
            that.setData({
                array: res.data.data
            })
        });
    },

    // 设置默认
    moren: function (e) {
        let that = this;
        util.myWxRequest(app.globalData.updateAddrDefault, { id: e.currentTarget.dataset.id, userId: app.globalData.userId }, function (res) {
            // 重新获取数据
            that.every()
            wx.showToast({
                icon: 'success',
                title: '设置成功'
            });
        });
    },

    // 删除地址
    deletes: function (e) {
        let that = this;
        util.myWxRequest(app.globalData.deleteAddrUrl, { id: e.currentTarget.dataset.id }, function (res) {
            // 重新获取数据
            that.every()
            wx.showToast({
                icon: 'success',
                title: '删除成功'
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 选择地址再跳转回去 
     */
    selectAddr: function (e) {
        // 获取选择地址的id
        let addrId = e.currentTarget.dataset.addrid;
        let addrCity = e.currentTarget.dataset.addrcity;
        // 获取上一个地址url
        let prevUrl = this.data.prevUrl;

        if (prevUrl == 'pages/goods_detail/goods_detail') {
            // 返回到商品详情
            let goodsId = this.data.goodsId;
            let myurl = '/' + prevUrl + '?addrId=' + addrId + '&id=' + goodsId;
            wx.navigateTo({
                url: myurl,
            })
        } else if (prevUrl == 'pages/commit_order/commit_order') {
            // 返回提交订单
            app.globalData.buyGoods.addressId = addrId;
            app.globalData.buyGoods.addrCity = addrCity;
            wx.navigateTo({
                url: '/pages/commit_order/commit_order',
            })
        } else if (prevUrl == 'pages/self_extraction/self_extraction') {
            // 返回自提订单
            app.globalData.buyGoods.addressId = addrId;
            wx.navigateTo({
                url: '/pages/self_extraction/self_extraction',
            })
        }

    }
})
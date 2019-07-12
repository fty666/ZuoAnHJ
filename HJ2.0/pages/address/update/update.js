// pages/address/add/add.js
var util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        arrays: "",
        region: ['广东省', '广州市', '海珠区'],
        px2rpxHeight: '',//手机尺寸
        px2rpxWidth: '',
    },

    // 选择地区
    bindRegionChange: function (e) {
        this.setData({
            diqu: e.detail.value,
        })
    },
    // 地址提交数据
    formSubmit: function (e) {
        var that = this
        var addrCity = e.detail.value.addrCity
        var addrDetail = e.detail.value.addrDetail
        var phone = e.detail.value.phone
        var receiveName = e.detail.value.receiveName
        var id = e.detail.target.dataset.id
        util.myWxRequest(app.globalData.updateAddrUrl, { id: id, addrCity: addrCity, addrDetail: addrDetail, phone: phone, receiveName: receiveName }, function (res) {
            if (app.globalData.shopId != '') {
                wx.showToast({
                    icon: 'success',
                    title: '修改成功'
                })
                wx.navigateTo({
                    url: '/pages/goods_detail/goods_detail?id=' + app.globalData.shopId,
                })
            } else {
                wx.redirectTo({
                    url: '/pages/myinfo/myinfo',
                })
                wx.showToast({
                    icon: 'success',
                    title: '修改成功'
                });
            }
        });
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //  获取单挑数据
        var that = this
        util.myWxRequest(app.globalData.getAddrByIdUrl, { id: options.id }, function (res) {
            that.setData({
                arrays: res.data.data,
                diqu: res.data.data.addrCity
            })
        })
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
                that.setData({
                    px2rpxHeight: res.data.px2rpxHeight,
                    px2rpxWidth: res.data.px2rpxWidth,
                })
            }
        })
    },
})
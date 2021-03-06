const util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bank:'',
        shopcode:'',
        px2rpxHeight: '',
        px2rpxWidth:'',
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
      let that=this;
      // let uid = app.globalData.user_id;
      //   function scode(res){
      //     console.log(res)
      //     that.setData({
      //       shopcode: res.shop.shop_code
      //     });
      //   }
      //   funData.getShopByCode(uid,this,scode)

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

    },

    /**
     * 选择银行
     */
    selectBank: function (e) {
        console.log(e.currentTarget.dataset.bank)
        this.setData({
            bank: e.currentTarget.dataset.bank
        });
    },

    // /**
    //  * 添加银行卡
    //  */
    addBankCard: function (e) {
        let that = this;
        let cardInfo = e.detail.value;
        // 所有信息不能为空
        if (cardInfo.owner == "" || cardInfo.mobile == "" || cardInfo.ID_card == "" || cardInfo.card_no == "" || that.data.bank == ""){
            wx.showToast({
                title: '请填写正确信息',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        console.log(cardInfo);
        // 验证身份证和银行卡号
        if ((!util.checkReg(2, cardInfo.ID_card)) || (!util.checkReg(3, cardInfo.card_no))) {
            wx.showToast({
                title: '请填卡号或身份证号有误',
                icon: 'none',
                duration: 1000
            })
            return;
        } else if (that.data.bank  == ''){
            wx.showToast({
                title: '请选择正确开户行',
                icon: 'none',
                duration: 1000
            })
            return;
        } 
        let uid = app.globalData.userId;
        let bank=that.data.bank;
        cardInfo.user_id = uid;
        cardInfo.bank = bank;
        console.log(cardInfo)
        // 添加银行卡
        util.myWxRequest(app.globalData.insertCardUrl, cardInfo, function (res) {
            wx.showToast({
                title: '添加成功',
            })
            wx.navigateTo({
              url: '/pages/trader/note/note',
            })
        });
    },

    
})
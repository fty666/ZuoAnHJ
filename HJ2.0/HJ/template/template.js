//初始化数据
function tabbarinit(flag) {
    // vipLevel 1用户  2经销商
    if(flag == 1){
        return [
            {
                "current": 0,
                "pagePath": "/pages/trader/index/index",
                "text": "首页",
                "iconPath": "/images/icon_home.png",
                "selectedIconPath": "/images/icon_home_active.png"
            },
            {
                "current": 0,
                "pagePath": "/pages/goods_cate/goods_cate",
                "text": "分类",
                "iconPath": "/images/icon_catalog.png",
                "selectedIconPath": "/images/icon_catalog_active.png"

            },
            {
                "current": 0,
                "pagePath": "/pages/cart/cart",
                "text": "购物车",
                "iconPath": "/images/icon_cart.png",
                "selectedIconPath": "/images/icon_cart_active.png"
            },
            {
                "current": 0,
                "pagePath": "/pages/myinfo/myinfo",
                "text": "我的",
                "iconPath": "/images/icon_member.png",
                "selectedIconPath": "/images/icon_member_active.png"
            }
        ]
    } else if(flag == 2){
        return [
            {
                "current": 0,
                "pagePath": "/pages/trader/index/index",
                "text": "首页",
                "iconPath": "/images/icon_home.png",
                "selectedIconPath": "/images/icon_home_active.png"
            },
            {
                "current": 0,
                "pagePath": "/pages/goods_cate/goods_cate",
                "text": "分类",
                "iconPath": "/images/icon_catalog.png",
                "selectedIconPath": "/images/icon_catalog_active.png"

            },
            {
                "current": 0,
                "pagePath": "/pages/cart/cart",
                "text": "购物车",
                "iconPath": "/images/icon_cart.png",
                "selectedIconPath": "/images/icon_cart_active.png"
            },
            {
                "current": 0,
                "pagePath": "/pages/trader/user/user",
                "text": "我的",
                "iconPath": "/images/icon_member.png",
                "selectedIconPath": "/images/icon_member_active.png"
            }
        ]
    }

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target,flag) {
    var that = target;
    var bindData = {};
    var otabbar = tabbarinit(flag);
    otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']; //换当前的icon
    otabbar[id]['current'] = 1;
    bindData[bindName] = otabbar;
    that.setData({ bindData });
}

module.exports = {
    tabbar: tabbarmain
}
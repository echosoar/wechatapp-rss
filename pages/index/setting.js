// pages/index/setting.js

const config = require('core/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowCollectIndex: 0,
    configList: [
      {
        title: '字体',
        child: [
          {
            title: 'feed标题大小',
            itemType: 'fontsize',
            key: 'titleSize',
            defaultValue: 12,
            min: 8,
            max: 72
          },
          {
            title: '文章标题大小',
            itemType: 'fontsize',
            key: 'contentTitleSize',
            defaultValue: 18,
            min: 8,
            max: 72
          },
          {
            title: '文章文字大小',
            itemType: 'fontsize',
            key: 'contentTextSize',
            defaultValue: 12,
            min: 8,
            max: 72
          }
        ]
      }
    ],
    config: {}
  },
  onLoad: function (options) {
    config.getConfig().then(config => {
      this.setData({
        config
      });
    });
  },
  fontSizeJian: function(e) {
    let { key, now, min } = e.target.dataset;

    if (now <= min) {
      wx.showToast({
        icon: 'none',
        title: '最小字体大小为 ' + min
      });
      return;
    }
    config.setConfig({
      [key]: Math.round(now - 1)
    }).then(config => {
      this.setData({
        config
      });
    });
  },
  fontSizeJia: function (e) {
    let { key, now, max } = e.target.dataset;

    if (now >= max) {
      wx.showToast({
        icon: 'none',
        title: '最大字体大小为 ' + max
      });
      return;
    }
    config.setConfig({
      [key]: Math.round(now + 1)
    }).then(config => {
      this.setData({
        config
      });
    });
  }
})
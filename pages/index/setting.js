// pages/index/setting.js
const origin = require('core/origin.js');
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
      },
      {
        title: '获取数据',
        child: [
          {
            title: '数据源更新间隔时长',
            itemType: 'size',
            key: 'UpdateTimeout',
            defaultValue: 10,
            unit: '秒',
            min: 1,
            max: 3600
          },
          {
            title: '获取数据接口超时时长',
            itemType: 'size',
            key: 'getDataTimeout',
            defaultValue: 60,
            unit: '秒',
            min: 1,
            max: 300
          }
        ]
      },
      {
        title: '缓存',
        child: [
          {
            title: '单数据源消息最多存储数',
            itemType: 'size',
            key: 'MaxLength',
            defaultValue: 300,
            step: 10,
            unit: '条',
            min: 10,
            max: 500
          },
          {
            itemType: 'btn',
            btnName: 'clearCache',
            preFix: '清理共 ',
            valueKey: 'cacheTotalSize',
            endFix: ' 条缓存'
          }
        ]
      }
    ],
    config: {},
    data: {}
  },
  onShow: function (options) {
    this.getConfig();

  },
  getConfig() {
    config.getConfig().then(config => {
      this.setData({
        config
      });
    });

    origin.getAllOriginCacheSize().then(size => {
      let newData = Object.assign(this.data.data, { cacheTotalSize: size });
      this.setData({
        data: newData
      });
    });
  },
  collectTap(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.nowCollectIndex) return;
    this.setData({
      nowCollectIndex: index
    })
  },
  sizeJian: function(e) {
    let { key, now, min, step } = e.target.dataset;

    if (now <= min) {
      wx.showToast({
        icon: 'none',
        title: '最小大小为 ' + min
      });
      return;
    }
    config.setConfig({
      [key]: Math.round(now - (step || 1))
    }).then(config => {
      this.setData({
        config
      });
    });
  },
  sizeJia: function (e) {
    let { key, now, max, step } = e.target.dataset;

    if (now >= max) {
      wx.showToast({
        icon: 'none',
        title: '最大大小为 ' + max
      });
      return;
    }
    config.setConfig({
      [key]: Math.round(now + (step || 1))
    }).then(config => {
      this.setData({
        config
      });
    });
  },
  btnClick: function(e) {

  }
})
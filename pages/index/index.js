//index.js
//获取应用实例
const app = getApp();
const collect = require('core/collect.js');
const origin = require('core/origin.js');
const update = require('core/update.js');
const config = require('core/config.js');

Page({
  data: {
    nowCollectIndex: 0,
    collectList: [],
    list: [],
    config: {
      titleSize: 12
    },
    isLoading: false,
    loadingTop: false,
    loadingBottom: false
  },
  onLoad: function() {
    
  },
  onShow: function() {
    config.getConfig().then(config => {
      this.setData({
        config: Object.assign(this.data.config, config)
      });
    });
    this.loadData({
      notBackTop: true
    });
  },
  loadData(config) {
    collect.getCollectList().then(data => {
      this.setData({
        collectList: data
      }, this.renderMain.bind(this, config));
    });
  },
  onPullDownRefresh() {
    this.loadNewData();
  },
  loadNewData() {
    let { collectList, nowCollectIndex } = this.data;
    let childOrigin = collectList[nowCollectIndex].childOrigin;
    if (!childOrigin || !childOrigin.length) return;
    this.setData({
      isLoading: true
    });
    update.update(childOrigin).then(updateCount => {
      this.setData({
        isLoading: false
      });
      wx.stopPullDownRefresh();
      wx.showToast({
        icon: 'none',
        title: updateCount ? `更新${updateCount}条新内容` : (childOrigin.length + '个来源暂无新内容'),
      });
      if (updateCount) {
        this.loadData();
      }
    });
  },
  renderMain(config) {
    this.getCache(config);
  },
  getCache(config) {
    let { collectList, nowCollectIndex } = this.data;
    let childOrigin = collectList[nowCollectIndex].childOrigin;
    if (!childOrigin || !childOrigin.length) {
      this.setData({
        list: []
      });
    } else {
      origin.getByIds(childOrigin).then(data => {
        this.setData({
          list: data
        }, () => {
          if (config && config.notBackTop) return;
          wx.pageScrollTo({
            scrollTop: 0
          });
        });
      });
    }
  },
  toast(toastType, text) {

  },
  collectTap(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.nowCollectIndex) return;
    this.setData({
      nowCollectIndex: index
    }, this.getCache)
  },
  viewImg(e) {
    wx.previewImage({
      urls: e.target.dataset.imgs.map(img => (img.large || img.img)),
      current: e.target.dataset.src
    });
  },
  refreshTap() {
    wx.startPullDownRefresh({
      success: () => {
        this.loadNewData();
      }
    });
  }
})

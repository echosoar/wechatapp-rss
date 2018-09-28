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
    noMore: false,
    nowPage: 1,
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
  onReachBottom: function() {
    if (this.data.isLoading || this.data.noMore) return;

    this.setData({
      isLoading: true,
      nowPage: this.data.nowPage + 1
    }, this.getCache.bind(this, { notBackTop: true }));
  },
  loadData(config) {
    collect.getCollectList().then(data => {
      this.setData({
        noMore: false,
        nowPage: 1,
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
      
      wx.stopPullDownRefresh();
      wx.showToast({
        icon: 'none',
        title: updateCount ? `更新${updateCount}条新内容` : (childOrigin.length + '个来源暂无新内容'),
      });
      if (updateCount) {
        this.setData({
          isLoading: false,
          nowPage: 1,
          noMore: false
        }, this.loadData.bind(this));
      } else {
        this.setData({
          isLoading: false
        });
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
      origin.getByIds(childOrigin, this.data.nowPage).then(data => {

        let newData = data;
        if (this.data.nowPage > 1) newData = this.data.list.concat(data);
        this.setData({
          isLoading: false,
          list: newData,
          noMore: data.length == 0
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
      nowCollectIndex: index,
      nowPage: 1,
      noMore: false
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

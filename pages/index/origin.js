// pages/index/origin.js
const collect = require('core/collect.js');
const origin = require('core/origin.js');
const Time = require('core/time.js');
Page({
  data: {
    nowCollectIndex: 0,
    collectList: [],
    list: []
  },
  onLoad: function () {
    this.loadData();
  },
  onShow: function () {
    this.loadData();
  },
  loadData() {
    collect.getCollectList().then(data => {
      this.setData({
        collectList: data
      }, this.renderMain);
    });
  },
  collectTap(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.nowCollectIndex) return;
    this.setData({
      nowCollectIndex: index
    }, this.renderMain);
  },

  renderMain() {
    let { collectList, nowCollectIndex } = this.data;
    let childOrigin = collectList[nowCollectIndex].childOrigin;
    origin.getByIdsOnlyInfo(childOrigin).then(data => {
      this.setData({
        list: data.map(item => {
          let addmap = Time.toArrByStamp(item.addTime);
          item.addTimeStr = `${addmap[1]}/${addmap[2]} ${addmap[3]}:${addmap[4]}`;
          let updatemap = Time.toArrByStamp(item.updateTime);
          item.updateTimeStr = `${updatemap[1]}/${updatemap[2]} ${updatemap[3]}:${updatemap[4]}`;
          return item;
        })
      });
    })
  },

  deleteOrigin(e) {
    
    wx.showModal({
      title: '真的要删除这个来源吗？',
      content: e.target.dataset.originname,
      success: (res) => {
        if (!res || !res.confirm) return;
        let { nowCollectIndex } = this.data;
        collect.removeOrigin(nowCollectIndex, e.target.dataset.originid).then(() => {
          origin.deleteOrigin(e.target.dataset.originid).then(() => {
            this.loadData();
          });
        });
      }
    });
  }
})
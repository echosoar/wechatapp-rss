// pages/index/origin.js
const collect = require('core/collect.js');
const origin = require('core/origin.js');
const Time = require('core/time.js');
Page({
  data: {
    openedChangeCategoryName: false,
    isAdd: false,
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
  loadData(index) {
    collect.getCollectList().then(data => {
      let newData = {
        collectList: data
      };
      if (index != null && index >= 0) {
        newData.nowCollectIndex = index;
      }
      this.setData(newData, this.renderMain);
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
  },

  openChangeCategoryName() {
    this.tmpCategoryName = '';
    this.setData({
      openedChangeCategoryName: true
    });
  },
  closeChangeCategoryName() {
    this.tmpCategoryName = '';
    this.setData({
      isAdd: false,
      openedChangeCategoryName: false
    });
  },
  saveChangeCategory: function () {
    if (this.tmpCategoryName) {
      if (this.data.isAdd) {
        collect.add(this.tmpCategoryName).then(list => {
          this.closeChangeCategoryName();
          this.loadData();
        });
      } else {
        collect.changeInfo(this.data.nowCollectIndex, 'name', this.tmpCategoryName).then(() => {
          this.closeChangeCategoryName();
          this.loadData();
        }).catch(e => {
          this.closeChangeCategoryName();
        });
      }
    } else {
      wx.showToast({
        title: '请填写分类名称!',
        icon: 'none',
        duration: 1000
      });
    }
  },
  handleChangeCategoryInput: function (e) {
    this.tmpCategoryName = e.detail.value;
  },
  deleteCategory() {
    let { collectList, nowCollectIndex } = this.data;
    let name = collectList[nowCollectIndex].name;
    wx.showModal({
      title: '真的要删除这个分类吗？',
      content: name,
      success: (res) => {
        if (!res || !res.confirm) return;
        collect.deleteCollect(this.data.nowCollectIndex).then(data => {
          this.loadData(this.data.nowCollectIndex - 1);
        });
      }
    });
    
  },
  addCategory() {
    this.tmpCategoryName = '';
    this.setData({
      isAdd: true,
      openedChangeCategoryName: true
    });
  }
})
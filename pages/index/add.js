// pages/index/add.js
const collect = require('core/collect.js');
const Get = require('core/getData.js');
const Origin = require('core/origin.js');
const config = require('core/config.js');
Page({
  data: {
    list: [],
    range: [],
    noIndex: 0,
    loading: false,
    loadText: '',
    openAddCategory: false
  },
  onLoad: function (query) {
    let category = query.category || 0;
    collect.getCollectList().then(data => {
      this.setData({
        list: data,
        range: data.map( item => item.name),
        noIndex: category
      });
    });
  },
  categoryChange: function(event) {
    this.setData({
      noIndex: event.detail.value
    });
  },
  openAddCategory: function() {
    this.setData({
      openAddCategory: true
    });
  },
  handleAddCategoryInput: function(e) {
    this.tmpCategoryName = e.detail.value;
  },
  saveAddCategory: function() {
    if (this.tmpCategoryName) {
      collect.add(this.tmpCategoryName).then(list => {
        this.setData({
          list,
          range: list.map(item => item.name),
          noIndex: list.length - 1,
          openAddCategory: false
        });
      });
    } else {
      wx.showToast({
        title: '请填写分类名称!',
        icon: 'none',
        duration: 1000
      });
    }
  },
  cancelAddCategory: function() {
    this.tmpCategoryName = '';
    this.setData({
      openAddCategory: false
    });
  },
  handleNameInput: function(e) {
    this.tmpName = e.detail.value;
  },
  handleOriginInput: function (e) {
    this.tmpOrigin = e.detail.value;
  },
  handleAdd: function() {
    if (!this.tmpOrigin) {
      wx.showToast({
        title: '请填写URL地址!',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    this.setData({
      loading: true
    }, () => {
      wx.showLoading({
        mask: true,
        title: '正在读取源信息'
      });
      config.getConfig().then(configData => {
        Get.getData(this.tmpOrigin, configData.getDataTimeout).then(data => {
          let dataItemIdPrefix = Date.now() + '-' + Math.random() + '-';
          let linkMap = {};
          Origin.add({
            title: this.tmpName || data.title || '未知来源',
            description: data.description || '',
            link: data.link || '',
            originLink: this.tmpOrigin,
            list: data.items.map((item, index) => {
              let oneId = dataItemIdPrefix + index;
              let mapKey = item.link || item.title || oneId;
              item.oneId = oneId;
              linkMap[mapKey] = true;
              return item
            }),
            linkMap
          }).then(originId => {
            collect.addOrigin(this.data.noIndex, originId).then(result => {
              wx.hideLoading();
              wx.navigateBack({ delta: 1 });
            })
          });
        }).catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: e,
            icon: 'none'
          });
          this.setData({
            loading: false
          });
        })
      });
      
    });
  }
})
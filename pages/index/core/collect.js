const getCollectList = () => {
  return new Promise((resolve, reject )=> {
    wx.getStorage({
      key: 'collect',
      success: (data) => {
        if (!data || !data.data || !data.data.length) {
          autoAddBottomCollect(resolve, reject);
        } else {
          resolve(data.data);
        }
      },
      fail: () => {
        autoAddBottomCollect(resolve, reject);
      }
    });
  });
}

const autoAddBottomCollect = (resolve, reject) => {
  // 自动添加打底收藏夹
  let collect = [
    {
      name: '默认',
      updateTime: Date.now(),
      addTime: Date.now(),
      childOrigin: []
    }
  ];
  wx.setStorage({
    key: 'collect',
    data: collect,
    success: () => {
      getCollectList().then(data => {
        resolve(data);
      });
    },
    fail: () => {
      reject('初始化分类失败');
    }
  })
}

const add = name => {
  return new Promise((resolve, reject) => {
    getCollectList().then(list => {
      list.push({
        name: name || '暂无名称',
        updateTime: Date.now(),
        addTime: Date.now(),
        childOrigin: []
      });
      wx.setStorage({
        key: 'collect',
        data: list,
        success: () => {
          resolve(list);
        },
        fail: () => {
          reject('添加分类失败');
        }
      });
    }).catch(e => {
      reject('添加分类失败');
    });
  });
}

const addOrigin = (collectId, originId) => {
  return new Promise((resolve, reject) => {
    getCollectList().then(list => {
      list[collectId].childOrigin.push(originId);
      wx.setStorage({
        key: 'collect',
        data: list,
        success: () => {
          resolve(true);
        },
        fail: () => {
          reject('添加源失败 - collect');
        }
      });
    }).catch(reject);
  });
}

const removeOrigin = (collectId, originId) => {
  return new Promise((resolve, reject) => {
    getCollectList().then(list => {
      list[collectId].childOrigin = list[collectId].childOrigin.filter(id => {
        return originId != id;
      });
      wx.setStorage({
        key: 'collect',
        data: list,
        success: () => {
          resolve(true);
        },
        fail: () => {
          reject('删除源失败 - collect');
        }
      });
    }).catch(reject);
  });
}

module.exports = {
    getCollectList,
    add,
    addOrigin,
    removeOrigin
}
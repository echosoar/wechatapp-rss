const Origin = require('./origin.js');
const Get = require('./getData.js');
const Config = require('./config.js');

const updateById = id => {
  return new Promise((resolve) => {
    Config.getConfig().then(config => {
      // 每个来源最多存贮300条数据
      let MaxLength = config.MaxLength || 300;
      // 10s内只能更新一次
      let UpdateTimeout = (config.UpdateTimeout || 10) * 1000;
      // 获取数据超时时间，默认3秒
      let getDataTimeout = config.getDataTimeout || 3;
      Origin.getById(id).then(originInfo => {

        let originLink = originInfo.originLink;
        if (Date.now() - originInfo.updateTime < UpdateTimeout) {
          resolve(0);
          return;
        }
        if (!originLink) {
          resolve(0);
          return;
        }
        Get.getData(originLink, getDataTimeout).then(data => {
          let dataItemIdPrefix = Date.now() + '-' + Math.random() + '-';
          let newItems = (data.items || []).filter((item, index) => {
            let oneId = dataItemIdPrefix + index;
            let mapKey = item.link || item.title || oneId;
            if (originInfo.linkMap[mapKey]) return false;
            item.oneId = oneId;
            originInfo.linkMap[mapKey] = true;
            return true;
          });

          let updateSize = newItems.length;

          if (updateSize) {
            // 删除要删除的map
            originInfo.list.slice(MaxLength - updateSize).map(item => {
              delete originInfo.linkMap[item.link || item.oneId];
            });
            originInfo.list = newItems.concat(originInfo.list.slice(0, MaxLength - updateSize));
          }

          originInfo.updateTime = Date.now();

          Origin.updateOrigin(id, originInfo).then(() => {
            resolve(updateSize);
          }).catch(e => {
            resolve(0);
          });

        }).catch(() => {
          resolve(0);
        });
      }).catch(e => {
        resolve(0);
      });
    });
    
  });
}

const update = (ids) => {
  let doingStep = ids.slice(0, 3);
  let needToGet = ids.slice(3);
  
  return new Promise((resolve) => {
    Promise.all(doingStep.map(id => {
      return updateById(id);
    })).then(data => {
      let sum = data.reduce((a, b) => a + b, 0);
      if (needToGet.length) {
        update(needToGet).then(sum2 => {
          resolve(sum + sum2);
        });
      } else {
        resolve(sum);
      }
    });
  });
}

module.exports = {
  update
}
const SSR = require('regularjs/lib/server');

module.exports = (Component) => {
  return new Promise((resolve, reject) => {
    var promises = [];
    var __transmitPromise__ = [];

    var makeup = '';
    try {
      makeup = SSR.render(Component, {
        data: {
          __transmitPromise__
        }
      })
      Promise.all(__transmitPromise__).then(__transmitData__ => {

        makeup = SSR.render(Component, {
          data: {
            __transmitData__
          }
        })
        resolve(makeup);
      }).catch(err => reject(err))
    } catch (err) {
      reject(err);
    }
    
  })
}
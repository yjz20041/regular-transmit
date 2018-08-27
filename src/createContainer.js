const util = require('util');
var transmitPromise = [];
var transimitData = [];
module.exports = (Component, options) => {
  return Component.extend({
    name: Component.prototype.name,
    config (data) {
      if (this.data.__transmitData__) {
        transimitData = this.data.__transmitData__;
      } else if (this.data.__transmitPromise__) {
        transmitPromise = this.data.__transmitPromise__;
      }

      Object.assign(this.data, transimitData.shift());

      var initFetches = this.getInitData();

      var promises = [];
      Object.keys(initFetches).forEach(key => {
        var q = initFetches[key];
        if (this.data[key] === undefined) {
          promises.push(Promise.resolve(typeof q === 'function' ? q() : q).then(ret => {
            this.data[key] = ret;
            var o = {}
            o[key] = ret;
            return o;
          }));
        }
      })
      transmitPromise.push(Promise.all(promises).then(ret => {
        transmitPromise.splice(transmitPromise.indexOf(promises, 1))
        return ret.reduce((accumulator, currentValue) => Object.assign(accumulator, currentValue), {}); 
      }).catch(err => {
        transmitPromise.splice(transmitPromise.indexOf(promises, 1))
        throw err
      }));

      this.supr(data);
    }

  })
}
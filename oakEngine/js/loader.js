//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
import { OAK } from "./oakEngine";
OAK.Loader = function (engine) {
  this.urls = {}
  this.toGet = [];
  this.loaded = 0;
  this.engine = engine;
};

OAK.Loader.prototype.constructor = OAK.Loader;

OAK.Loader.prototype.add = function (iid, iurl, model) {
  this.toGet.push(iid);
  this.urls[iid] = { url: iurl, data: "", model: model };
}
OAK.Loader.prototype.loadModels = function (iurls) {
  for (var key in iurls)
    if (iurls.hasOwnProperty(key) && iurls[key].model) this.engine.loadModel(key, iurls[key].data);
};

OAK.Loader.prototype.load = function () {
  var link = this;
  var lurls = this.urls;
  function getOne() {
    if (link.toGet.length <= 0) {
      link.loadModels(lurls);
      link.callback(lurls);
      return
    }
    var link2 = lurls[link.toGet.pop()];
    var xhr = new XMLHttpRequest();
    xhr.open("get", link2.url, true);

    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        link2.data = xhr.response
      } else {
        console.error("not loaded: " + link2.url);
      }
      link.loaded += 1;
      getOne();
    };
    xhr.send();
  }
  getOne();
};
OAK.Loader.prototype.onLoad = function (callFunc) {
  this.callback = callFunc;
};
OAK.Loader.prototype.onError = function () {

};
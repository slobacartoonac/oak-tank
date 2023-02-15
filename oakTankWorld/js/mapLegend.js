//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
export function MapLegend() {
    this.clear();
    this.tMesh = 0;
    this.tTex = 1;
    this.itemNum = 0;
}
MapLegend.prototype.clear = function () {
    this.data = { legend: {}, resource: {} };
}
MapLegend.prototype.addItem = function (id, meshes, textures, lvl, ydisp, width) {
    this.data.legend[id] = { mes: meshes, tex: textures, lvl: lvl, ydisp: ydisp ? ydisp : 0, width: width + 1 };
    this.itemNum += 1;
}
MapLegend.prototype.getWidth = function (id) {
    if (!this.data.legend[id] || !this.data.legend[id].width) return -1;
    return this.data.legend[id].width - 1;
}
MapLegend.prototype.getLevel = function (id) {
    if (!this.data.legend[id] || !this.data.legend[id].lvl) return 0;
    return this.data.legend[id].lvl;
}
MapLegend.prototype.getItem = function (id) {
    if (!this.data.legend[id]) return this.data.legend[0];
    return this.data.legend[id];
};
MapLegend.prototype.getYDisp = function (id) {
    if (!this.data.legend[id]) return this.data.legend[0].ydisp;
    return this.data.legend[id].ydisp;
};
MapLegend.prototype.addResource = function (id, url, type) {
    this.data.resource[id] = { url: url, type: type };
}
MapLegend.prototype.save = function () {
    var data = JSON.stringify(this.data);
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
    window.open(url, '_blank');
    window.focus();
}
MapLegend.prototype.load = function (jsonstring) {
    this.data = JSON.parse(jsonstring);
}
MapLegend.prototype.getToLoad = function (type) {
    var ret = [];
    var i = 0;
    for (var key in this.data.resource) {
        if (this.data.resource.hasOwnProperty(key) && this.data.resource[key].type == type) {
            ret.push({ id: key, num: i++, url: this.data.resource[key].url });
        }
    }
    return ret;
}
//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";

import { colide } from "./globalFunctions";

export function Physics(map) {
    this.map = map;
    this.coliders = [];
    this.pickables = [];
    this.teamMembers = [0, 0, 0, 0];
}
Physics.prototype.free = function (el, dist) {
    var dist2 = dist / 2;
    var ret = { map: 0, coliders: [], pickables: [] };
    if (this.map) {
        var my = { x: (el.x / 20.0 + 0.5) << 0, y: (el.z / 20.0 + 0.5) << 0 };
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var nx = my.x + i;
                var ny = my.y + j;
                var getm = this.map.getPos(nx, ny);
                if (getm > ret.map) {
                    if (colide(el, { x: nx * 20, y: 0, z: ny * 20 }, dist2 + 10)) ret.map = getm;
                }
            }
        }
    }
    for (var i = 0; i < this.coliders.length; i++) {
        var test = this.coliders[i];
        if (colide(el, test.model.position, dist2 + test.size / 2))
            ret.coliders.push(test);
    }
    for (var i = 0; i < this.pickables.length; i++) {
        var test1 = this.pickables[i];
        if (colide(el, test1.model.position, dist2 + test1.size / 2))
            ret.pickables.push(test1);
    }
    return ret;
}
Physics.prototype.getWorldSlice = function (position, size) {
    var ret = { actors: [], map: [] };
    var my = { x: (position.x / 20.0 + 0.5) << 0, y: (position.z / 20.0 + 0.5) << 0 };
    var size2 = (size / 2) << 0;
    if (this.map) {
        for (var i = -size2; i <= size2; i++) {
            for (var j = -size2; j <= size2; j++) {
                var nx = my.x + i;
                var ny = my.y + j;
                ret.map.push(this.map.getPos(nx, ny));
            }
        }
    }
    for (var i = 0; i < this.coliders.length; i++) {
        var test = this.coliders[i];
        if (colide(position, test.model.position, size2 + test.size / 2))
            ret.actors.push({ x: test.model.position.x - position.x, y: test.model.position.y - position.y, z: test.model.position.z - position.z, t: test.team });
    }
    return ret;
}
Physics.prototype.getYDisp = function (position) {
    return this.map.getYDisp((position.x / 20.0 + 0.5) << 0, (position.z / 20.0 + 0.5) << 0);
}
Physics.prototype.addColider = function (veh) {
    veh.phyEnable = true;
    this.coliders.push(veh);
}
Physics.prototype.removeColider = function (veh) {
    this.coliders = this.coliders.filter(function (el) { return el != veh; });
    this.pickables = this.pickables.filter(function (el) { return el != veh; });
}
Physics.prototype.addPickable = function (pick) {
    pick.phyEnable = true;
    this.pickables.push(pick);
}
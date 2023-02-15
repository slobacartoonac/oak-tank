//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";

import { Choper } from "./choper";
import { Enemy, Player } from "./enemy";
import { Tank, TankGun } from "./tank";
import { Truper } from "./truper";
import { PhysicalObject } from "./vehicle";

export function VehicleControler(engine, controler, physics) {
    this.engine = engine;
    this.controler = controler;
    this.physics = physics;
    this.patern = {};
}
VehicleControler.prototype.addType = function (id, vehclass, modellist, textlist, modellist1, textlist1) {
    this.patern[id] = { type: vehclass, models: modellist, models1: modellist1, texts: textlist, texts1: textlist1 }
}
VehicleControler.prototype.getVehicle = function (id, pos, driver) {
    var veh = null;
    if (!this.patern[id]) return;
    var model = this.engine.getAObject(pos, this.patern[id].models, this.patern[id].texts, true);
    console.log("this.patern[id].type", this.patern[id].type)
    if (this.patern[id].models1) {
        var model1 = this.engine.getAObject({ x: pos.x, y: pos.y + 5, z: pos.z }, this.patern[id].models1, this.patern[id].texts1, true);
        veh = new (resolveType(this.patern[id].type))(model, model1, this.controler);
    }
    else
        veh = new (resolveType(this.patern[id].type))(model, this.controler);
    if (driver) veh.setDriver(driver);
    this.physics.addColider(veh);
    this.controler.add(veh);
    return veh;
}

export function resolveType(typ) {
    switch (typ) {
        case 'Choper': return Choper;
        case 'Tank': return Tank;
        case 'TankGun': return TankGun;
        case 'Truper': return Truper;
        case 'PhysicalObject': return PhysicalObject;
        case 'Enemy': return Enemy;
        case 'Player': return Player;
    }

} 
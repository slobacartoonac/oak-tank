//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";

import { resolveType } from "./vehicleControler";

export function UnitLegend(physics, controler, vehicleControler) {
    this.physics = physics;
    this.controler = controler
    this.vehicleControler = vehicleControler;
    this.units = {};
    this.onHold = [];
}
//unitsLegend.add(1,'tank','Enemy',1);
UnitLegend.prototype.add = function (id, type, driver, team) {
    this.units[id] = { type: type, driver: driver, team: team }
}

UnitLegend.prototype.draw = function (unitlist) {
    unitlist = unitlist.concat(this.onHold);
    this.onHold = [];
    for (var i = 0; i < unitlist.length; i++) {
        var veh = null;
        var unit = unitlist[i];
        var cind = this.units[unit.t];
        if (cind) {
            var coli = this.physics.free(unit, 20);
            if (coli.coliders.length == 0) {
                if (cind.driver) {
                    console.log("cind.driver", cind.driver)
                    veh = this.vehicleControler.getVehicle(cind.type, unit,
                        new (resolveType(cind.driver))(cind.team));
                }
                else
                    veh = this.vehicleControler.getVehicle(cind.type, unit);
            }
            else this.onHold.push(unit);

        }
    }
}
//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";

import { neerestAngle } from "./globalFunctions";
import { Vehicle } from "./vehicle";

export function Tank(model, controler) {
    Vehicle.call(this, model, controler);
    this.dest = { x: model.position.x, y: model.position.y, z: model.position.z };
    this.stable = { x: model.position.x, y: model.position.y, z: model.position.z };
    this.upgrade = [0, 0, 0, 0];//4upgrades speed refresh helth invinsability 
    this.speed = 30.0;
    this.turn_speed = 8;
    this.driver = null;
    this.helth = 100;
    this.shootTimeOut = 1;
    this.shootSpeed = 2;
};
Tank.prototype = Object.create(Vehicle.prototype);

Tank.prototype.update = function (time, physics) {
    if (!this.driver) return;
    if (!this.controler.sceneScope(this.model.position)) return;
    this.shootTimeOut -= time;
    var thisSpeed = this.runPickables(time);
    //{a,w,s,d,f,e}
    var instructions = this.driver.getInstructions(this, physics);
    if (instructions.e)
        this.exitVehicle = true;
    if (instructions.f) this.shoot();

    var model = this.model;
    if (this.exitVehicle) {
        var toExit = {
            x: model.position.x + Math.sin(model.rotation + Math.PI) * this.size * 0.65,
            y: physics.getYDisp(model.position),
            z: model.position.z + Math.cos(model.rotation + Math.PI) * this.size * 0.65
        };
        var cleer = physics.free(toExit, 2);
        if (cleer.map == 0 && cleer.coliders.length == 0) {
            this.controler.exit(toExit, this.driver);
            this.driver = null;
            this.exitVehicle = false;
            return;
        }
    }

    var dX = -instructions.a + instructions.d;
    var dZ = -instructions.s + instructions.w;
    var angle = Math.atan2(dX, dZ);
    var link = this;
    if (dX == 0 && dZ == 0)
        return;


    if (Math.abs(neerestAngle(model.rotation, angle)) > this.turn_speed * time) {
        this.turn(time, angle);
    }
    else {
        model.rotation = angle;
        var podN = {
            x: model.position.x + Math.sin(model.rotation) * thisSpeed * time,
            y: physics.getYDisp(model.position),
            z: model.position.z + Math.cos(model.rotation) * thisSpeed * time
        };
        if (this.validNewPostion(podN, physics)) {
            model.position = podN;
            this.stable = { x: (((podN.x + 10) / 20) << 0) * 20, y: podN.y, z: (((podN.z + 10) / 20) << 0) * 20 };
        }
        else this.corectPostition(physics, time);
    }
}

Tank.prototype.shoot = function () {
    if (this.shootTimeOut < 0) {
        this.shootTimeOut = this.shootSpeed;
        this.controler.shoot(this, this.size / 2.15, this.model.rotation + Math.random() * 0.1 - 0.05, 80, 115 + Math.random() * 10, 45);
    }
}

export function TankGun(model, controler) {
    Tank.call(this, model, controler);
    this.upgrade = [0, 0, 0, 0];//4upgrades speed refresh helth invinsability 
    this.speed = 35.0;
    this.turn_speed = 10;
    this.driver = null;
    this.helth = this.size * 4;
    this.helthMax = 80;
    this.shootTimeOut = 2;
    this.shootSpeed = 0.1;
};
TankGun.prototype = Object.create(Tank.prototype);
TankGun.prototype.shoot = function () {
    if (this.shootTimeOut < 0) {
        this.shootTimeOut = this.shootSpeed;
        this.controler.shootB(this, this.size / 2.5, this.model.rotation + Math.random() * 0.2 - 0.1, 85 + Math.random() * 5, 5);
    }
}

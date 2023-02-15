//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
import { OAK } from "./oakEngine";
import { vecmath } from "./vecmath";
OAK.Rendable = function (gl, model, texture, position, rotation, shaderid) {
    this.gl = gl;
    this.model = model;
    this.texture = texture;
    this.position = position;
    this.rotation = rotation;
    if (shaderid)
        this.shaderid = shaderid;
    else
        this.shaderid = 'defolt';
    this.size = 1.0;
    this.checks = this.size + rotation + position.x >> 1 + position.y >> 2 + position.z >> 3;
    this.mov_matrix = [this.size, 0, 0, 0, 0, this.size, 0, 0, 0, 0, this.size, 0, this.position.x, this.position.y, this.position.z, 1];
    this.mov_matrix = vecmath.rotate(this.mov_matrix, this.rotation, [0, 1, 0]);
    this.inv_trans = vecmath.inverse_transpose3x3from4(this.mov_matrix);
}
OAK.Rendable.prototype.constructor = OAK.Rendable;

OAK.lastModel = [];
OAK.Rendable.prototype.Draw = function (shaderProgram) {
    var gl = this.gl;
    if (this.checks != this.size + this.rotation + this.position.x + this.position.y * 2.57 + this.position.z * 3.22) {
        this.checks = this.size + this.rotation + this.position.x + this.position.y * 2.57 + this.position.z * 3.22;
        this.mov_matrix = [this.size, 0, 0, 0, 0, this.size, 0, 0, 0, 0, this.size, 0, this.position.x, this.position.y, this.position.z, 1];
        if (this.rotation != 0)
            this.mov_matrix = vecmath.rotatef(this.mov_matrix, this.rotation, [0, 1, 0]);
        if (shaderProgram.inv_trans)
            vecmath.inverse_transpose3x3from4(this.mov_matrix, this.inv_trans);
    }
    gl.uniformMatrix4fv(shaderProgram.Mmatrix, false, this.mov_matrix);
    if (shaderProgram.inv_trans)
        gl.uniformMatrix3fv(shaderProgram.inv_trans, false, this.inv_trans);
    this.texture.Draw(shaderProgram);
    this.model.Draw(shaderProgram);
}
OAK.Rendable.prototype.Draw1 = function (shaderProgram) {
    var gl = this.gl;
    if (this.checks != this.size.x * 0.255 + this.size.y * 0.689 + this.size.z * 0.245 + this.rotation + this.position.x + this.position.y * 2.57 + this.position.z * 3.22) {
        this.checks = this.size.x * 0.255 + this.size.y * 0.689 + this.size.z * 0.245 + this.rotation + this.position.x + this.position.y * 2.57 + this.position.z * 3.22;
        this.mov_matrix = [this.size.x, 0, 0, 0, 0, this.size.y, 0, 0, 0, 0, this.size.z, 0, this.position.x, this.position.y, this.position.z, 1];
        if (this.rotation != 0)
            this.mov_matrix = vecmath.rotatef(this.mov_matrix, this.rotation, [0, 1, 0]);
        if (shaderProgram.inv_trans)
            vecmath.inverse_transpose3x3from4(this.mov_matrix, this.inv_trans);
    }
    gl.uniformMatrix4fv(shaderProgram.Mmatrix, false, this.mov_matrix);
    if (shaderProgram.inv_trans)
        gl.uniformMatrix3fv(shaderProgram.inv_trans, false, this.inv_trans);

    this.texture.Draw(shaderProgram);
    this.model.Draw(shaderProgram);
}

OAK.ARendable = function (gl, model, texture, position, rotation, shaderid) {
    this.gl = gl;
    this.model = model;
    this.texture = texture;
    this.numModel = model.length;
    this.numText = texture.length;
    this.curModel = 0;
    this.curText = 0;
    if (shaderid)
        this.shaderid = shaderid;
    else
        this.shaderid = 'defolt';
    this.position = position;
    this.rotation = rotation;
    this.size = 1.0;
    this.checks = this.size + rotation + position.x >> 1 + position.y >> 2 + position.z >> 3;
    this.mov_matrix = [this.size, 0, 0, 0, 0, this.size, 0, 0, 0, 0, this.size, 0, this.position.x, this.position.y, this.position.z, 1];
    this.mov_matrix = vecmath.rotate(this.mov_matrix, this.rotation, [0, 1, 0]);
    this.inv_trans = vecmath.inverse_transpose3x3from4(this.mov_matrix);
}
OAK.ARendable.prototype.constructor = OAK.ARendable;
OAK.ARendable.prototype.Draw = function (shaderProgram) {
    var gl = this.gl;
    if (this.checks != this.size + this.rotation + this.position.x + this.position.y * 2.57 + this.position.z * 3.22) {
        this.checks = this.size + this.rotation + this.position.x + this.position.y * 2.57 + this.position.z * 3.22;
        this.mov_matrix = [this.size, 0, 0, 0, 0, this.size, 0, 0, 0, 0, this.size, 0, this.position.x, this.position.y, this.position.z, 1];
        if (this.rotation != 0)
            this.mov_matrix = vecmath.rotatef(this.mov_matrix, this.rotation, [0, 1, 0]);
        if (shaderProgram.inv_trans)
            vecmath.inverse_transpose3x3from4(this.mov_matrix, this.inv_trans);
    }
    gl.uniformMatrix4fv(shaderProgram.Mmatrix, false, this.mov_matrix);
    if (shaderProgram.inv_trans >= 0)
        gl.uniformMatrix3fv(shaderProgram.inv_trans, false, this.inv_trans);
    this.lastTexture = this.texture[this.curText % this.numText];
    this.lastTexture.Draw(shaderProgram);
    this.model[this.curModel % this.numModel].Draw(shaderProgram);
}
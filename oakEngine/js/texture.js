//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
import { OAK } from "./oakEngine";
OAK.Texture = function (gl, texture, texture2) {
    this.gl = gl;
    this.texture = texture;
    this.lastTexture = texture;
    this.texture2 = texture2;
}
OAK.Texture.prototype.constructor = OAK.Texture;
OAK.Texture.prototype.Draw = function (shaderProgram) {
    var gl = this.gl;
    if (OAK.lastTexture !== this.texture || OAK.lastShader == shaderProgram) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        OAK.lastTexture = this.texture;
    }
    if (OAK.lastTexture2 !== this.texture2 || OAK.lastShader == shaderProgram) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.texture2);
        OAK.lastTexture2 = this.texture2;
    }
}

OAK.ATexture = function (gl, texture) {
    this.gl = gl;
    this.texture = texture;
    this.numModel = model.length;
    this.numText = texture.length;
    this.curText = 0;
}
OAK.ATexture.prototype.constructor = OAK.ATexture;
OAK.ATexture.prototype.Draw = function (shaderProgram) {
    var gl = this.gl;
    this.lastTexture = this.texture[this.curText % this.numText];
    if (OAK.lastTexture != this.lastTexture || OAK.lastShader == shaderProgram) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.lastTexture);
        OAK.lastTexture = this.lastTexture;
    }
}

OAK.NTexture = function (gl, texture, number) {
    this.gl = gl;
    this.texture = texture;
    this.number = number;
}
OAK.NTexture.prototype.constructor = OAK.NTexture;
OAK.NTexture.prototype.Draw = function (shaderProgram) {
    var gl = this.gl;
    this.lastTexture = this.texture;
    if (OAK.lastTexture != this.lastTexture || OAK.lastShader == shaderProgram) {
        gl.activeTexture(gl["TEXTURE" + this.number]);
        gl.bindTexture(gl.TEXTURE_2D, this.lastTexture);
    }
}
"use strict";
import { OAK } from "./oakEngine";
import { minus3, V3crossProduct, V3dotProduct, V3Normalise } from "./utils";
import { vecmath } from "./vecmath";
OAK.Camera = function () {
    this.position = { x: 5, y: 5, z: 5 };
    this.target = { x: 0, y: 0, z: 0 };
    this.up = { x: 0, y: 1, z: 0 };
    this.mat = vecmath.getInit();
    this.proj_matrix = vecmath.orthogonal(5, 1, 1, 100);
    this.light_proj_matrix = vecmath.orthogonal(512, 1, -256, 256);
    this.light_mat = vecmath.getInit();
    //this.invtrans=vecmath.inverse_transpose3x3from4(this.mat);
    this.light = { x: 1, y: 1, z: 1 };
    this.perspective = false;
    this.fov = 1;
}

OAK.Camera.prototype.constructor = OAK.Camera;
OAK.Camera.prototype.SetPosition = function (fx, fy, fz) {
    this.x = fx;
    this.y = fy;
    this.z = fz;
}
OAK.Camera.prototype.SetTarget = function (ftx, fty, ftz) {
    this.tx = ftx;
    this.ty = fty;
    this.tz = ftz;
}
OAK.Camera.prototype.matCalctulate = function () {
    var f = V3Normalise(minus3(this.target, this.position));
    var u = V3Normalise(this.up);
    var s = V3Normalise(V3crossProduct(f, u));
    u = V3crossProduct(s, f);

    this.mat[0] = s.x;
    this.mat[4] = s.y;
    this.mat[8] = s.z;
    this.mat[1] = u.x;
    this.mat[5] = u.y;
    this.mat[9] = u.z;
    this.mat[2] = -f.x;
    this.mat[6] = -f.y;
    this.mat[10] = -f.z;
    this.mat[12] = -V3dotProduct(s, this.position);
    this.mat[13] = -V3dotProduct(u, this.position);
    this.mat[14] = V3dotProduct(f, this.position);

    var lpos = { x: this.light.x + this.target.x, y: this.light.y + this.target.y, z: this.light.z + this.target.z }
    f = V3Normalise(minus3(this.target, lpos));
    u = V3Normalise({ x: 0, y: 1, z: 0 });
    s = V3Normalise(V3crossProduct(f, u));
    u = V3crossProduct(s, f);
    this.light_mat[0] = s.x;
    this.light_mat[4] = s.y;
    this.light_mat[8] = s.z;
    this.light_mat[1] = u.x;
    this.light_mat[5] = u.y;
    this.light_mat[9] = u.z;
    this.light_mat[2] = -f.x;
    this.light_mat[6] = -f.y;
    this.light_mat[10] = -f.z;
    this.light_mat[12] = -V3dotProduct(s, lpos);
    this.light_mat[13] = -V3dotProduct(u, lpos);
    this.light_mat[14] = V3dotProduct(f, lpos);

    //vecmath.inverse_transpose3x3from4(this.mat,this.invtrans);

    return this.mat;
}
OAK.Camera.prototype.getMat = function () {
    return this.mat;
}
/*OAK.Camera.prototype.getInvTrans=function()
{
    return this.invtrans;
}*/

OAK.Camera.prototype.lookAt = function (eyex, eyey, eyez,
    atx, aty, atz,
    upx, upy, upz) {
    this.position = { x: eyex, y: eyey, z: eyez };
    this.target = { x: atx, y: aty, z: atz };
    this.up = { x: upx, y: upy, z: upz };
    return this.matCalctulate();

}
OAK.Camera.prototype.getLight = function () {
    return this.light_mat;
}
OAK.Camera.prototype.setLightDirection = function (x, y, z) {
    this.light = { x: x, y: y, z: z };
}
OAK.Camera.prototype.getLightProj = function () {
    return this.light_proj_matrix;
}
OAK.Camera.prototype.setLightProj = function (height, ration, zmin, zmax) {
    this.light_proj_matrix = vecmath.orthogonal(height, ration, zmin, zmax);
}
OAK.Camera.prototype.calcProjection = function () {
    if (this.perspective)
        this.proj_matrix = vecmath.perspective(this.fov, this.width / this.height, this.near, this.far);
    else
        this.proj_matrix = vecmath.orthogonal(this.fov, this.width / this.height, this.near, this.far);
    return this.proj_matrix;
}

OAK.Camera.prototype.setProjection = function (fov, width, height, near, far, isPerspective) {
    this.perspective = isPerspective;
    this.fov = fov;
    this.width = width;
    this.height = height;
    this.near = near;
    this.far = far;
    this.calcProjection();
    return this.proj_matrix;
}
OAK.Camera.prototype.getProj = function () {
    return this.proj_matrix;
}
OAK.Camera.prototype.cameraPosition = function () {
    return [this.position.x, this.position.y, this.position.z];
}


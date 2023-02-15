//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
export function VNormalise(inp) {
	var length = Math.sqrt(inp.x * inp.x + inp.y * inp.y);
	inp.x = inp.x / length;
	inp.y = inp.y / length;
}

export function V3Normalise(inp) {
	var length = Math.sqrt(inp.x * inp.x + inp.y * inp.y + inp.z * inp.z);
	inp.x = inp.x / length;
	inp.y = inp.y / length;
	inp.z = inp.z / length;
	return inp;
}
export function V3dotProduct(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function V3crossProduct(a, b) {

	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	};

}

export function minus3(a, b) {
	var xp = a.x - b.x;
	var yp = a.y - b.y;
	var zp = a.z - b.z;
	return { x: xp, y: yp, z: zp };
}
export function minus2(a, b) {
	var xp = a.x - b.x;
	var yp = a.y;
	var zp = a.z - b.z;
	return { x: xp, y: yp, z: zp };
}
export function plus3(a, b) {
	var xp = a.x + b.x;
	var yp = a.y + b.y;
	var zp = a.z + b.z;
	return { x: xp, y: yp, z: zp };
}
export function puta1(a, b) {
	return { x: a.x * b, y: a.y * b, z: a.z * b };
}
export function V3distance(a, b) {
	var xp = a.x - b.x;
	var yp = a.y - b.y;
	var zp = a.z - b.z;
	return Math.sqrt(xp * xp + yp * yp + zp * zp);
}
export function V2distance(a, b) {
	var xp = a.x - b.x;
	//var yp=Math.abs(a.y-b.y);
	var zp = a.z - b.z;
	return Math.sqrt(xp * xp + zp * zp);
}
export function TriangleScope(vtx0, vtx1, vtx2) {
	var rez = { lx: vtx0.x, ly: vtx0.y, lz: vtx0.z, bx: vtx0.x, by: vtx0.y, bz: vtx0.z };
	if (rez.lx > vtx1.x)
		rez.lx = vtx1.x;
	if (rez.ly > vtx1.y)
		rez.ly = vtx1.y;
	if (rez.lz > vtx1.z)
		rez.lz = vtx1.z;

	if (rez.bx < vtx1.x)
		rez.bx = vtx1.x;
	if (rez.by < vtx1.y)
		rez.by = vtx1.y;
	if (rez.bz < vtx1.z)
		rez.bz = vtx1.z;


	if (rez.lx > vtx2.x)
		rez.lx = vtx2.x;
	if (rez.ly > vtx2.y)
		rez.ly = vtx2.y;
	if (rez.lz > vtx2.z)
		rez.lz = vtx2.z;

	if (rez.bx < vtx2.x)
		rez.bx = vtx2.x;
	if (rez.by < vtx2.y)
		rez.by = vtx2.y;
	if (rez.bz < vtx2.z)
		rez.bz = vtx2.z;
	return rez;
};


export function VertexInTriangleScope(vtxPoint,
	vtx0,
	vtx1,
	vtx2) {
	var scope = TriangleScope(vtx0, vtx1, vtx2);
	if (vtxPoint.x < scope.lx || vtxPoint.y < scope.ly || vtxPoint.z < scope.lz || vtxPoint.x > scope.bx || vtxPoint.y > scope.by || vtxPoint.z > scope.bz)
		return false;
	return true;
}
export function VertexInTriangle(vtxPoint,
	vtx0,
	vtx1,
	vtx2, scope) {

	if (vtxPoint.x < scope.lx || vtxPoint.y < scope.ly || vtxPoint.z < scope.lz || vtxPoint.x > scope.bx || vtxPoint.y > scope.by || vtxPoint.z > scope.bz)
		return false;
	var dAngle;

	var vec0 = minus3(vtxPoint, vtx0);
	var vec1 = minus3(vtxPoint, vtx1);
	var vec2 = minus3(vtxPoint, vtx2);
	V3Normalise(vec0);
	V3Normalise(vec1);
	V3Normalise(vec2);
	dAngle =
		Math.acos(V3dotProduct(vec0, vec1)) +
		Math.acos(V3dotProduct(vec1, vec2)) +
		Math.acos(V3dotProduct(vec2, vec0));
	var dabs = Math.abs(dAngle - 2 * Math.PI);
	if (x_rot > dabs) x_rot = dabs;
	if (dabs < 0.05)
		return true;
	else
		return false;
}

export function CalculateNormal(p1, p2, p3) {

	var U = minus3(p2, p1);
	var V = minus3(p3, p1);
	var Normal = { x: 0, y: 0, z: 0 };
	Normal.x = (U.y * V.z) - (U.z * V.y);
	Normal.y = (U.z * V.x) - (U.x * V.z);
	Normal.z = (U.x * V.y) - (U.y * V.x);
	V3Normalise(Normal)
	return Normal;
}
export function GenInvertTranspose(A, result) {

	var determinant = A[0] * (A[5] * A[10] - A[9] * A[6])
		- A[1] * (A[4] * A[10] - A[6] * A[8])
		+ A[2] * (A[4] * A[9] - A[5] * A[8]);
	if (Math.abs(determinant) < 0.0001) {
		if (determinant < 0)
			determinant = -0.0001;
		else
			determinant = 0.0001;
	}
	var invdet = 1 / determinant;

	result[0] = (A[5] * A[10] - A[9] * A[6]) * invdet;

	result[3] = -(A[1] * A[10] - A[2] * A[9]) * invdet;

	result[6] = (A[1] * A[6] - A[2] * A[5]) * invdet;

	result[1] = -(A[4] * A[10] - A[6] * A[8]) * invdet;

	result[4] = (A[0] * A[10] - A[2] * A[8]) * invdet;

	result[7] = -(A[0] * A[6] - A[4] * A[2]) * invdet;

	result[2] = (A[4] * A[9] - A[8] * A[5]) * invdet;

	result[5] = -(A[0] * A[9] - A[8] * A[1]) * invdet;

	result[8] = (A[0] * A[5] - A[4] * A[1]) * invdet;
	return result;
}

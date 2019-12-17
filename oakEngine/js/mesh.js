//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
var OAK=OAK||{};
OAK.Mesh=function(gl)
{
    this.gl=gl;
    this.id=Math.random();
}
OAK.Mesh.prototype.constructor= OAK.Mesh;
OAK.lastMesh=0;
OAK.lastShader=0;
OAK.Mesh.prototype.Draw=function(shaderProgram)
{
    var gl=this.gl;
    if(OAK.lastMesh!=this.id||OAK.lastShader!=shaderProgram){
        OAK.lastMesh=this.id;
        OAK.lastShader=shaderProgram;
        if(shaderProgram.position>=0){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
            gl.vertexAttribPointer(shaderProgram.position, 3, gl.FLOAT, false,0,0) ;
            gl.enableVertexAttribArray(shaderProgram.position);
        }
        if(shaderProgram.uv>=0){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texcords_buffer);
            gl.vertexAttribPointer(shaderProgram.uv, 2, gl.FLOAT, false,0,0) ;
            gl.enableVertexAttribArray(shaderProgram.uv);
        }
        if(shaderProgram.normal>=0){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_buffer);
            gl.vertexAttribPointer(shaderProgram.normal, 3, gl.FLOAT, false,0,0) ;
            gl.enableVertexAttribArray(shaderProgram.normal);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
    }
    
    
    gl.drawElements(gl.TRIANGLES, this.index_buffer.len, gl.UNSIGNED_SHORT, 0);
}
OAK.Mesh.prototype.SetMesh=function(vertices,textcords,normals,indices)
{
    var gl=this.gl;
    var vertex_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertex_buffer=vertex_buffer;

    var texcords_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcords_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textcords), gl.STATIC_DRAW);
    this.texcords_buffer=texcords_buffer;

         // Create and store data into color buffer
         var normals_buffer = gl.createBuffer ();
         gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
         this.normals_buffer=normals_buffer;
         // Create and store data into index buffer
         var index_buffer = gl.createBuffer ();
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.index_buffer=index_buffer;
    this.index_buffer.len=indices.length;

}
OAK.Mesh.prototype.SetColors=function(colors)
{
    var gl=this.gl;
}

OAK.Mesh.prototype.SetTextureCords=function(cords)
{
    var gl=this.gl;
this.triangleVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cords), gl.STATIC_DRAW);
        this.triangleVertexTextureCoordBuffer.itemSize = 2;
        this.triangleVertexTextureCoordBuffer.numItems = cords.length/2;
		return this.triangleVertexTextureCoordBuffer;
}
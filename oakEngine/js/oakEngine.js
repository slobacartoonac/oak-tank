//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
var OAK=OAK||{};
OAK.gameResize=function(){};
OAK.Engine=function()
{
    this.canvas=null;
    this.preview=[512,512]
    this.curShader="defolt";
    this.shaders={defolt:{}};
    this.shaderProgram=null;
    this.models={};
    this.textures={};
    this.renables=[];
    this.efects=[];
    this.camera=new OAK.Camera();
    this.lights=new OAK.Lights();
    this.tReady=0;
    this.onload=null;
    this.keysDown={};
    this.keysUp={};
    var link=this;
    function resize(){
        if(!link.canvas)return;
            link.preview[0]=link.canvas.viewportWidth = canvas.width;
            link.preview[1]=link.canvas.viewportHeight = canvas.height;
            OAK.gameResize();
			}resize();
    document.addEventListener("keydown", function(e){link.keyPressed(e)});
    document.addEventListener("keyup", function(e){link.keyReleased(e)});
    window.addEventListener('resize', resize, true);
}
OAK.Engine.prototype.constructor = OAK.Engine;
OAK.Engine.prototype.onLoaded=function (fun) {
    this.onload=fun;
    this.onloadToDo=true;
}
OAK.Engine.prototype.onKey=function (key,funDown,funUp) {
    this.keysDown[key]=funDown;
    this.keysUp[key]=funUp;
}
OAK.Engine.prototype.keyPressed=function (e) {
    var key=e.keyCode
    if(this.keysDown[key]) this.keysDown[key]();
    e.preventDefault()
}
OAK.Engine.prototype.keyReleased=function (e) {
    var key=e.keyCode
    if(this.keysUp[key]){
        this.keysUp[key]();
        e.preventDefault();
    }
}


OAK.Engine.prototype.selectCanvas=function (canvas) {
    var link=this;
    if(this.canvas) throw "WebGL allready initialised";
        try {
            this.canvas =  canvas.getContext('experimental-webgl',{ antialias: true
                   /*,depth: true*/ });
			if (!this.canvas)
				this.canvas =  canvas.getContext('experimental-webgl');
			if (!this.canvas)
				this.canvas =  canvas.getContext('webgl');
			window.dispatchEvent(new Event('resize'));
        } catch (e) {
        }
        if (!this.canvas) {
            throw "We could not intitialise WebGL on your browser";
        }
	//this.canvas.getExtension("EXT_frag_depth");	
    //this.canvas.enable('EXT_frag_depth');
    }
OAK.Engine.prototype.vertexShader=function (shaderScript) {
        if (!shaderScript) {
            throw "no vertex shader code";
        }
        if(!this.canvas) throw "select canvas first"
        var shader;
        var shader=this.compileShader(this.canvas, shaderScript, this.canvas.VERTEX_SHADER);
        this.shaders[this.curShader].vertex=shader;
        return shader;
    }
OAK.Engine.prototype.fragmentShader=function (shaderScript) {
        if (!shaderScript) {
            throw "no vertex shader code";
        }
        if(!this.canvas) throw "select canvas first"
        var shader=this.compileShader(this.canvas, shaderScript, this.canvas.FRAGMENT_SHADER);

        this.shaders[this.curShader].fragment=shader;
        return shader;
    }
OAK.Engine.prototype.selectShader=function(cur) {
        
        this.curShader=cur;
        if(!this.shaders[this.curShader]) this.shaders[this.curShader]={};
        if(!this.shaders[this.curShader].program) return;
        this.shaderProgram=this.shaders[this.curShader].program;
        this.shaderProgram.select();
    }

OAK.Engine.prototype.compileShader = function(gl, shaderSource, shaderType) {
        // Create the shader object
        var shader = gl.createShader(shaderType);
        
        // Set the shader source code.
        gl.shaderSource(shader, shaderSource);
        
        // Compile the shader
        gl.compileShader(shader);
        
        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            // Something went wrong during compilation; get the error
            throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }
        
        return shader;
    }
    

OAK.Engine.prototype.initShaders=function() {
        var gl=this.canvas;
        if(!gl) throw "canvas not selected";
        if(!this.shaders[this.curShader]) throw "shaders not compiled for selection "+this.curShader;
        if(!this.shaders[this.curShader].fragment) throw " fragment shader not compiled for selection "+this.curShader;
        if(!this.shaders[this.curShader].vertex) throw " vertex shader not compiled for selection "+this.curShader;
        var fragmentShader = this.shaders[this.curShader].fragment;
        var vertexShader = this.shaders[this.curShader].vertex;
        this.shaderProgram=new Shader(gl,vertexShader,fragmentShader,
            this.shaders[this.curShader].uniform,
            this.shaders[this.curShader].attribute);
        this.shaders[this.curShader].program=this.shaderProgram;
        gl.uniform1i(this.shaderProgram.sampler, 0);
        gl.uniform1i(this.shaderProgram.samplerShadowMap, 1);
        var lightd={x:5,y:7,z:5};
        lightd=V3Normalise(lightd);
        OAK.LIGHTDIR=[lightd.x,lightd.y,lightd.z];
        this.camera.light=lightd;
        this.camera.matCalctulate();
        gl.uniform3fv(this.shaderProgram.source_direction, OAK.LIGHTDIR);
		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
        gl.clearDepth(1.0);
        
		gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        
			//gl.depthFunc(gl.LESS);
    }
OAK.Engine.prototype.initShadersPackage=function(shaderPackage) {
        var gl=this.canvas;
        if(!gl) throw "canvas not selected";

        shaderPackage.program=new Shader(gl,this.vertexShader(shaderPackage.vertex),this.fragmentShader(shaderPackage.fragment),
        shaderPackage.uniform,
        shaderPackage.attribute);
        this.shaders[shaderPackage.name]=shaderPackage;
        this.shaderProgram=shaderPackage.program;
        gl.uniform1i(this.shaderProgram.sampler, 0);
        gl.uniform1i(this.shaderProgram.samplerShadowMap, 1);
        var lightd={x:5,y:7,z:5};
        lightd=V3Normalise(lightd);
        OAK.LIGHTDIR=[lightd.x,lightd.y,lightd.z];
        this.camera.light=lightd;
        this.camera.matCalctulate();
        gl.uniform3fv(this.shaderProgram.source_direction, OAK.LIGHTDIR);
		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
        gl.clearDepth(1.0);
        
		gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        
			//gl.depthFunc(gl.LESS);
    }
OAK.Engine.prototype.loadTexture=function(textureID,url)
{
    var gl=this.canvas;
    var link=this;
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload=function (params) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR)
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        link.tReady--;
    }
    link.tReady++;
    texture.image.src=url;
    link.textures[textureID]=texture;
}
OAK.Engine.prototype.loadModel=function(name,dataOrJson)
{

    var model=null;
    if (typeof dataOrJson === 'string' || dataOrJson instanceof String)
        model=JSON.parse(dataOrJson);
    else
        model=dataOrJson;
    var mesh=new OAK.Mesh(this.canvas);
    mesh.SetMesh(model.vertices,model.textcords,model.normals ,model.indices );
    this.models[name]=model;
    this.models[name].mesh=mesh;
    var link=this;
    var gl=this.canvas;
		
}
OAK.framecount=0;
OAK.framelast=0;
OAK.framerate=0;
OAK.bindTexture=0;
OAK.bindTextureCount=0;
setInterval(
function(){
 OAK.framerate=OAK.framecount-OAK.framelast;
 OAK.framelast=OAK.framecount;
},
1000);
OAK.Engine.prototype.render=function () {
    
    var link=this;
    if(this.tReady<1){
        if(this.onloadToDo)
        {
            this.onload();
            this.onloadToDo=false;
        }
    OAK.framecount+=1;
    var gl=this.canvas;
    var cam=this.camera;
    var fb=null;
    if(this.shaders.shadow)
    {
        if(!this.texture_rtt){
        fb=this.fb=gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

        var rb=this.rb=gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16 , 1024, 1024);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                             gl.RENDERBUFFER, rb);

        var texture_rtt=this.texture_rtt=gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture_rtt);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //var borderColor= [ 1.0, 1.0, 1.0, 1.0 ];
        //GL.texParameterfv(GL.TEXTURE_2D, GL.TEXTURE_BORDER_COLOR, borderColor);


        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024,
                0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                          gl.TEXTURE_2D, texture_rtt, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
   
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        this.selectShader('shadow');
        var shaderProgram=this.shaderProgram;
//gl.clearDepth(1.0);
        gl.viewport(0.0, 0.0, 1024,1024);
        gl.clearColor(1.0, 0.0, 0.0, 1.0); //red -> Z=Zfar on the shadow map
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(shaderProgram.Pmatrix, false, cam.getLightProj());
        gl.uniformMatrix4fv(shaderProgram.Lmatrix, false, cam.getLight());
        for(var key in this.renables){
        if(!this.renables.hasOwnProperty(key))continue;
            var sh=this.renables[key];
            for(var r=0;r<sh.length;r++)
            {
                sh[r].Draw(shaderProgram);
            }
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
     }
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0.0, 0.0, this.preview[0], this.preview[1]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    for(var key in this.renables){
        if(!this.renables.hasOwnProperty(key))continue;
    this.selectShader(key);
    var renables=this.renables[key];
    var shaderProgram=this.shaderProgram;
    if(shaderProgram.time) gl.uniform1f(shaderProgram.time,OAK.framecount/10.0);
    gl.uniformMatrix4fv(shaderProgram.Pmatrix, false, cam.getProj());
    gl.uniformMatrix4fv(shaderProgram.Vmatrix, false, cam.getMat());
    gl.uniformMatrix4fv(shaderProgram.PmatrixLight, false, cam.getLightProj());
    gl.uniformMatrix4fv(shaderProgram.Lmatrix, false, cam.getLight());
    if(this.texture_rtt){
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_rtt);
    }
    this.lights.Draw(gl,shaderProgram);
    for(var r=0;r<renables.length;r++){
        renables[r].Draw(shaderProgram);
        }
    }
    if(this.efects.length>0){    
        this.selectShader('efects');
        shaderProgram=this.shaderProgram;
        gl.uniformMatrix4fv(shaderProgram.Pmatrix, false, cam.getProj());
        gl.uniformMatrix4fv(shaderProgram.Vmatrix, false, cam.getMat());
        /*gl.cullFace(gl.FRONT);    
        for(var r=0;r<this.efects.length;r++){
            this.efects[r].Draw(shaderProgram);
        }*/
        gl.cullFace(gl.BACK);    
        for(var r=0;r<this.efects.length;r++){
            this.efects[r].Draw(shaderProgram);
        }
    }
    //OAK.bindTextureCount=OAK.bindTexture;
    //OAK.bindTexture=0;
    gl.flush();
    };
    
   // setTimeout(function(){
    window.requestAnimationFrame(function(){link.render();});
    //},33);
}
OAK.Engine.prototype.getCamera=function (id,perspective) {
    return this.camera;
}
OAK.Engine.prototype.getObject=function (position,modelID,textureID,toRender,shader) {
    var ren=new OAK.Rendable(this.canvas,this.models[modelID].mesh,this.textures[textureID],position,0,shader);
    if(toRender) this.addRender(ren);
    return ren;
}
OAK.Engine.prototype.getAObject=function (position,modelIDs,textureIDs,toRender,shader) {
    var mods=[];
    var texs=[];
    for(var i=0;i<modelIDs.length;i++) mods.push(this.models[modelIDs[i]].mesh);
    for(var j=0;j<textureIDs.length;j++) texs.push(this.textures[textureIDs[j]]);
    var ren=new OAK.ARendable(this.canvas,mods,texs,position,0,shader);
    if(toRender) this.addRender(ren);
    return ren;
}
OAK.Engine.prototype.addRender=function(item)
{
    /*var i;
    for(i=0;i<this.renables.length&&this.renables[i].position.y<=item.position.y;i++);
    this.renables.splice(i, 0, item);*/
    var shader=item.shaderid;
        if(!this.renables[shader])this.renables[shader]=[];
         this.renables[shader].push(item);
         this.renables[shader]=this.renables[shader].sort(function(a,b){return a.position.y>b.position.y?1:a.position.y<b.position.y?-1:0});
        
    //this.renables.sort(function(a,b){return a.position.y>b.position.y?1:a.position.y<b.position.y?-1:a.lastTexture>b.lastTexture?1:a.lastTexture<b.lastTexture?-1:0;});
    
}

OAK.Engine.prototype.getEfect=function (position,modelID,textureID,toRender) {
    var ren=new OAK.Rendable(this.canvas,this.models[modelID].mesh,this.textures[textureID],position,0);
    if(toRender) this.efects.push(ren);
    return ren;
}
OAK.Engine.prototype.getObjectsStatic=function (position,positions,modelID,textureID,toRender,shader) {
    
    var nmodel={vertices:[],textcords:[],normals:[],indices:[]};
    var base=this.models[modelID];
    for(var i=0;i<positions.length;i++){
        nmodel.vertices=nmodel.vertices.concat(base.vertices);
        nmodel.textcords=nmodel.textcords.concat(base.textcords);
        nmodel.normals=nmodel.normals.concat(base.normals);
        nmodel.indices=nmodel.indices.concat(base.indices);
    }
    for(var i=0;i<positions.length;i++){
            for(var j=0;j<base.indices.length;j++)
            {
                nmodel.indices[i*base.indices.length+j]+=i*base.vertices.length/3;
            }
            for(var j=0;j<base.vertices.length;j++)
            {
                if(j%3==0)
                    nmodel.vertices[i*base.vertices.length+j]=parseFloat(nmodel.vertices[i*base.vertices.length+j])+positions[i].x;
                else if(j%3==1)
                    nmodel.vertices[i*base.vertices.length+j]=parseFloat(nmodel.vertices[i*base.vertices.length+j])+positions[i].y;
                else
                    nmodel.vertices[i*base.vertices.length+j]=parseFloat(nmodel.vertices[i*base.vertices.length+j])+positions[i].z;
            }
        }
    var mesh=new OAK.Mesh(this.canvas);
    mesh.SetMesh(nmodel.vertices,nmodel.textcords,nmodel.normals ,nmodel.indices );
    var ren=new OAK.Rendable(this.canvas,mesh,this.textures[textureID],position,0,shader);
    if(toRender) this.addRender(ren);
    return ren;
}
OAK.Engine.prototype.remObject=function (obj) {
for(var key in this.renables){
        if(!this.renables.hasOwnProperty(key))continue;
    this.renables[key]=this.renables[key].filter(function (elem) {
        return elem!=obj;
    })};
    this.efects=this.efects.filter(function (elem) {
        return elem!=obj;
    });
}

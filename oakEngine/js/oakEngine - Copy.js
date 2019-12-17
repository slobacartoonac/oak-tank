//written by Slobodan Zivkovic slobacartoonac@gmail.com
var OAK=OAK||{};
OAK.Engine=function()
{
    this.canvas=null;
    this.curShader="defolt";
    this.shaders={defolt:{}};
    this.shaderProgram=null;
    this.models={};
    this.textures={};
    this.renables=[];
    this.camera=new OAK.Camera();
    this.tReady=0;
    this.onload=null;
    this.keysDown={};
    this.keysUp={};
    var link=this;
    document.addEventListener("keydown", function(e){link.keyPressed(e)});
    document.addEventListener("keyup", function(e){link.keyReleased(e)});
}
OAK.Engine.prototype.constructor = OAK.Engine;
OAK.Engine.prototype.onLoaded=function (fun) {
    this.onload=fun;
}
OAK.Engine.prototype.onKey=function (key,funDown,funUp) {
    this.keysDown[key]=funDown;
    this.keysUp[key]=funUp;
}
OAK.Engine.prototype.keyPressed=function (e) {
    key=e.keyCode
    if(this.keysDown[key]) this.keysDown[key]();
}
OAK.Engine.prototype.keyReleased=function (e) {
    key=e.keyCode
    if(this.keysUp[key]) this.keysUp[key]();
}


OAK.Engine.prototype.selectCanvas=function (canvas) {
    if(this.canvas) throw "WebGL allready initialised";
	    function resize(){
            this.canvas.viewportWidth = canvas.width;
            this.canvas.viewportHeight = canvas.height;
			perspective_set=false;
			}
        try {
            this.canvas =  canvas.getContext('experimental-webgl',{ antialias: true,
                   depth: true });
			if (!this.canvas)
				this.canvas =  canvas.getContext('experimental-webgl');
			if (!this.canvas)
				this.canvas =  canvas.getContext('webgl');
			resize();
			window.onresize=resize;
        } catch (e) {
        }
        if (!this.canvas) {
            throw "We could not intitialise WebGL on your browser";
        }
		
    }
OAK.Engine.prototype.vertexShader=function (shaderScript) {
        if (!shaderScript) {
            throw "no vertex shader code";
        }
        if(!this.canvas) throw "select canvas first"
        var shader;
        var gl=this.canvas;
        shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "vertex shader compile faild: "+gl.getShaderInfoLog(shader);
        }
        this.shaders[this.curShader].vertex=shader;
        return shader;
    }
OAK.Engine.prototype.fragmentShader=function (shaderScript) {
        if (!shaderScript) {
            throw "no vertex shader code";
        }
        if(!this.canvas) throw "select canvas first"
        var shader;
        var gl=this.canvas;
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "fragment shader compile faild: "+gl.getShaderInfoLog(shader);
        }
        this.shaders[this.curShader].fragment=shader;
        return shader;
    }
OAK.Engine.prototype.selectShader=function(cur) {
        
        this.curShader=cur;
        if(!this.shaders[this.curShader]) this.shaders[this.curShader]={};
        if(!this.shaders[this.curShader].compiled) return;
        this.shaderProgram=this.shaders[this.curShader].program;
        gl.useProgram(this.shaderProgram);
    }

OAK.Engine.prototype.initShaders=function() {
        var shaderProgram;
        var gl=this.canvas;
        if(!gl) throw "canvas not selected";
        if(!this.shaders[this.curShader]) throw "shaders not compiled for selection "+this.curShader;
        if(!this.shaders[this.curShader].fragment) throw " fragment shader not compiled for selection "+this.curShader;
        if(!this.shaders[this.curShader].vertex) throw " vertex shader not compiled for selection "+this.curShader;
        var fragmentShader = this.shaders[this.curShader].fragment;
        var vertexShader = this.shaders[this.curShader].vertex;
        
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw "Could not initialise shaders";
        }

        this.shaderProgram={};
        var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
        this.shaderProgram.Pmatrix=Pmatrix;
         var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
         this.shaderProgram.Vmatrix=Vmatrix;
         var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
         this.shaderProgram.Mmatrix=Mmatrix;

         this.shaderProgram.position = gl.getAttribLocation(shaderProgram, "position");

         this.shaderProgram.textcords =gl.getAttribLocation(shaderProgram, "texCoord");

         this.shaderProgram.normals = gl.getAttribLocation(shaderProgram, "normals");
         // Position
         
         gl.useProgram(shaderProgram);

		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
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

OAK.Engine.prototype.render=function () {
    
    var link=this;
    if(this.tReady<1){
        if(this.onload)
        {
            this.onload();
            this.onload=null;
        }
    var gl=this.canvas;
    var cam=this.camera;
    var shaderProgram=this.shaderProgram;
    var renables=this.renables;
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniformMatrix4fv(shaderProgram.Pmatrix, false, cam.getProj());
    gl.uniformMatrix4fv(shaderProgram.Vmatrix, false, cam.getMat());
    for(var r=0;r<this.renables.length;r++)
        this.renables[r].Draw(shaderProgram);
    };
    window.requestAnimationFrame(function(){link.render();});
}
OAK.Engine.prototype.getCamera=function (id,perspective) {
    return this.camera;
}
OAK.Engine.prototype.getObject=function (position,modelID,textureID,toRender) {
    var ren=new OAK.Rendable(this.canvas,this.models[modelID].mesh,this.textures[textureID],position,0);
    if(toRender) this.renables.push(ren);
    return ren;
}
OAK.Engine.prototype.getObjectsStatic=function (position,positions,modelID,textureID,toRender) {
    
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
    var ren=new OAK.Rendable(this.canvas,mesh,this.textures[textureID],position,0);
    if(toRender) this.renables.push(ren);
    return ren;
}
OAK.Engine.prototype.remObject=function (obj) {

    this.renables=this.renables.filter(function (elem) {
        return elem!=obj;
    });
}

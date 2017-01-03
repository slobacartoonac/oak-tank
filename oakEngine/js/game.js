function colide(a,b,dist)
{
//tests if a and b are colliding
if(Math.abs(a.x-b.x)<dist)
	{
	if(Math.abs(a.z-b.z)<dist)
		{
				return true;
		}
	}
return false;
}
function testPath(posn,dist)
{
var avelable=true;
bricks.forEach(function(e)
			{
				if(colide(posn,e.position,dist))
				{
				avelable=false;
				}
			});

enemies.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		avelable=false;	
	}
	}
	);
vehicles.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		avelable=false;		
	}
	}
	);
return avelable;
}
function getObject(posn,dist)
{
var ret=null;
bricks.forEach(function(e)
			{
				if(colide(posn,e.position,dist))
				{
				ret=e;
				}
			});

enemies.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		ret=e;	
	}
	}
	);
vehicles.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		ret=e;	
	}
	}
	);
return ret;
}
function gameOver()
{
    if(vehicles.length==0)
    {
        gameSay("<h1>Game over!<h1>");
    }
    else gameSay("<h1>You won!<h1>");
    setTimeout(function(){window.location.reload();},3000);
    
}
function gameSay(text)
{
    document.getElementById("say").innerHTML=text;
}


function createEnemy(model){
    model.dest={x:model.position.x,y:model.position.z,angle: 0};
    enemies.push(model);
    return model;
}
function shoot(model,friend)
{
    {
        var proj=engine.getObject({x:model.position.x+Math.sin(model.rotation)*12 ,y:8,z:model.position.z+Math.cos(model.rotation)*12},'proj','to2',true);
        proj.rotation=model.rotation;
        proj.friend=friend;
        projectiles.push(proj);
    }
}
function updateEnemy(model,raz){
    if(Math.abs(-model.dest.angle*Math.PI/2+Math.PI/2-model.rotation)>Math.PI*1.25)
    {
        if(model.rotation<-Math.PI*0.75)
            model.rotation+=Math.PI*2;
        else model.rotation-=Math.PI*2;
    }
    if(model.rotation!=-model.dest.angle*Math.PI/2+Math.PI/2)
    {
        if(Math.abs(-model.dest.angle*Math.PI/2+Math.PI/2-model.rotation)>0.2){
            if((-model.dest.angle*Math.PI/2+Math.PI/2-model.rotation)>0)
                model.rotation+=0.15;
            else
                model.rotation-=0.15;
        }
        else model.rotation=-model.dest.angle*Math.PI/2+Math.PI/2;
    }
    else
    {
        
		if(raz.x!=0)
		{
			if(raz.x<0) model.position.x-=1;
			else model.position.x+=1;
		}
		if(raz.y!=0)
		{
			if(raz.y<0) model.position.z-=1;
			else model.position.z+=1;
		}
        
    }
    return ;
}
function deside()
{
    enemies.forEach(
	function(e1)
	{
        e=e1.position;
		var raz={x: e1.dest.x-e.x, y: e1.dest.y-e.z};

        if(Math.random()<0.01)shoot(e1,false);


		if(raz.x!=0||raz.y!=0)
            updateEnemy(e1,raz);
		if(raz.x==0&&raz.y==0)
		{

				var av=[];
				var way=false;
				if(testPath({x:e.x+20,z:e.z},19)){av.push({x:e.x+20,z:e.z,angle:0}); if(e1.dest.angle!=2)way=true;};
				if(testPath({x:e.x-20,z:e.z},19)){av.push({x:e.x-20,z:e.z,angle:2}); if(e1.dest.angle!=0)way=true;};
				if(testPath({x:e.x,z:e.z+20},19)){av.push({x:e.x,z:e.z+20,angle:1}); if(e1.dest.angle!=3)way=true;};
				if(testPath({x:e.x,z:e.z-20},19)){av.push({x:e.x,z:e.z-20,angle:3}); if(e1.dest.angle!=1)way=true;};
				if(av.length>0){
					if(way)
					{
						av=av.filter(function(en){return en.angle!=((e1.dest.angle+2)%4);});
                        var aa=av.filter(function(en){return en.angle==e1.dest.angle;});
                        if(aa.length>0)
                        {
                            av.push(aa[0]);
                        }
						ndir=Math.floor(Math.random()*av.length);
						e1.dest.x=av[ndir].x;
						e1.dest.y=av[ndir].z;
						e1.dest.angle=av[ndir].angle;
					}
					else{
						e1.dest.x=av[0].x;
						e1.dest.y=av[0].z;
						e1.dest.angle=av[0].angle;
					}
				
				
			}
		
		
		}
	}
);
}

var vertCode = ['attribute vec3 position;',
            'uniform mat4 Pmatrix;',
            'uniform mat4 Vmatrix;',
            'uniform mat4 Mmatrix;',
            'attribute vec3 normals;',//the color of the point
            'attribute vec2 texCoord;',
            'varying float vColor;',
            'varying float specCol;',
            'varying vec2 vTexCoord;',
			
            'void main(void) { ',//pre-built function
               'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);',
               "vec4 transformedNormal4 = Mmatrix *vec4(normals, 0.);",
               "vec4 transformedNormal5 = Vmatrix*Mmatrix *vec4(normals, 0.);",
               "vec4 lv = Vmatrix*vec4(1.,0.8,0.5, 0.); lv=normalize(lv);",

               "specCol=max(0.,1.-1.3*length((vec4(0.,0.,1.,0.) - 2.*dot(vec4(0.,0.,1.,0.) , transformedNormal5)*transformedNormal5)+lv));",
               //"specCol=1-(dot(vec4(0.,0.,1.,0) , transformedNormal5)+dot(vec4(1.,1.,1.,0) , transformedNormal4));",
               "vec3 transformedNormal = vec3(transformedNormal4.x,transformedNormal4.y,transformedNormal4.z);",
               "vColor = (atan(dot(transformedNormal, normalize (vec3(1.,0.8,0.5))))+1.571)/1.8;",
               'vTexCoord=texCoord;',
            '}'].join('\n');

         var fragCode = ['precision mediump float;',
            'varying float vColor;',
            'varying vec2 vTexCoord;',
            'uniform sampler2D sTexture;',
            'varying float specCol;',
            'void main(void) {',
               'gl_FragColor = texture2D(sTexture, vTexCoord)*vColor+vec4(0.,0.,0.,1.)*(1.-vColor)+vec4(0.5,0.5,0.5,0.)*specCol;',
            '}'].join('\n');



function start(){
engine = new OAK.Engine();
var canvas=document.getElementById("canvas");
//var loadScrean=document.getElementById("loadScrean");
engine.selectCanvas(canvas);
engine.selectShader("defolt");
engine.vertexShader(vertCode);
engine.fragmentShader(fragCode);
engine.initShaders();
var loader=new OAK.Loader();
loader.add("tank2","./data/tank2.json")
loader.add("plane","./data/plane.json")
loader.add("proj","./data/projectile.json")
loader.add("brick","./data/brick.json")
loader.add("level","./data/level.json")

loader.onLoad(function (data) {
       
        
     engine.loadModel("tank2",data.tank2.data);
    engine.loadModel("plane",data.plane.data);
    engine.loadModel("proj",data.proj.data);
     engine.loadModel("brick",data.brick.data);
     map=JSON.parse(data.level.data);
    
    engine.loadTexture("to2","./img/rest3.png");
    engine.loadTexture("tankg","./img/tankg.png");
    engine.loadTexture("tankb","./img/tankb.png");
    engine.loadTexture("brick","./img/mbrick1.png");
    engine.loadTexture("grass","./img/grass.png");
    engine.loadTexture("base","./img/base.png");

    run();
});
engine.onLoaded(
	function()
	{
        var loading=document.getElementById("loading");
		loading.innerHTML="";
	}
)
loader.load();



//cam.fov=10;
//cam.position={x,y,z};
//cam.tartget={x,y,z};
//cam.setProjection(5, canvas.width/canvas.height, 1, 100,false);
//cam.lookAt(Math.sin(i)*5,2,Math.cos(i)*5,1,0,1,.0,1,.0);
var cam=engine.getCamera("camId",false);
function run(params) {
    setInterval(
    function (params) {
        j=0;
        //model.rotation=Math.PI/2;
        player.load-=0.03

        if(!player.veh)return;
        var raz={x: player.veh.dest.x-player.veh.position.x, y: player.veh.dest.y-player.veh.position.z};
		if(raz.x!=0||raz.y!=0||player.veh.rotation!=-player.veh.dest.angle*Math.PI/2+Math.PI/2)
            updateEnemy(player.veh,raz);
        else
        {
            av={x:player.veh.dest.x,z:player.veh.dest.y,angle:player.veh.dest.angle}
            if(player.direction.wa<0) {
                av.angle++;
                av.angle%=4;
            }
            else if(player.direction.wa>0) {
                av.angle--;
                if(av.angle<0)av.angle+=4;
            }
            if(player.direction.t>0) {
                av.z-=20*(av.angle%2)*(av.angle%4-2);
                av.x-=20*((av.angle+1)%2)*(av.angle%4-1);
            }
            else if(player.direction.t<0)
            {
                av.z+=20*(av.angle%2)*(av.angle%4-2);
                av.x+=20*((av.angle+1)%2)*(av.angle%4-1);
            }
            

            if(testPath(av,19)||(player.veh.dest.x==av.x&&
			    player.veh.dest.y==av.z)){
                player.veh.dest.x=av.x;
			    player.veh.dest.y=av.z;
			    player.veh.dest.angle=av.angle;
            }
        }
        
        cam.target.x=player.veh.position.x;
        cam.target.z=player.veh.position.z;

        var nPos=plus3(puta1(V3Normalise(minus3(cam.position,cam.target)),Math.max(200,cam.position.y+10)),cam.target);
        nPos.y=cam.position.y;
        cam.position=nPos;


        cam.matCalctulate();
        var rem=[];
         for(var i=0;i<projectiles.length;i++)
         {
            var proj=projectiles[i];
            proj.position.x+=Math.sin(proj.rotation)*3;
            proj.position.z+=Math.cos(proj.rotation)*3;
            if(!testPath(proj.position,10)) rem.push(proj);
         }
         projectiles=projectiles.filter(function(e)
         {
             return rem.indexOf(e)==-1;
         });
         for(var i=0;i<rem.length;i++)
         {
             engine.remObject(rem[i]);
             var d=getObject(rem[i].position,10);
             if(d)
             {
                 if(rem[i].friend&&enemies.indexOf(d)!=-1){
                    engine.remObject(d);
                    enemies=enemies.filter(function(e){return e!=d;});
                    if(enemies.length==0)gameOver();
                }
                 else if(!rem[i].friend&&vehicles.indexOf(d)!=-1){
                    engine.remObject(d);
                    vehicles=vehicles.filter(function(e){return e!=d;});
                    if(player.veh==d)
                        player.veh=null;
                }
                 
                 
             }
         }
         deside();
/*if(false)
         */



        //model.position.y=6+Math.sin(i*5);
    },30)
    cam.lookAt(100,100,100,0,0,0,.0,1,.0);
    cam.setProjection(0.7, canvas.width,canvas.height, 1., 1000.,true);
    var i=0;
    vehicles=[];
    projectiles=[];
    vNum=0;
    //vehicles.push(engine.getObject({x:0,y:10,z:0},"sphere","patern",true));
    player={};
    player.direction={wa:0,w:0,t:0,s:0,load:0};
    player.veh=null;
    bricks=[];
    enemies=[];
			var ix=20;
			var iy=20;
			var maxx=0;
			map.forEach(function(e)
			{
				e.forEach(function(ee)
				{
					if(ee==1)
					{
					bricks.push(engine.getObject({x:ix,y:-4,z:iy},'brick','brick',true));
					}
					if(ee==2)
					{
                        var p=engine.getObject({x:ix,y:0,z:iy},'tank2','tankg',true);
                        p.dest={x:p.position.x,y:p.position.z,angle:1};
                    vehicles.push(p);
                    engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
					//player={x:ix,y:iy,sx:0,sy:0,kr:0,kb:0,kg:0,div: createDiv(ix,iy,'char.png')};
					//spawn={x:ix,y:iy};
					}
					if(ee==3)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
                        createEnemy(engine.getObject({x:ix,y:0,z:iy},'tank2','tankb',true));
					//keys.push({x:ix,y:iy,t:1,div: createDiv(ix,iy,'keyr.png')});
					}
					if(ee==4)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
                        
					//gates.push({x:ix,y:iy,t:1,div:createBrick(ix,iy,'./wall/completeg_r1.png')});
					}
					if(ee==5)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
                         createEnemy(engine.getObject({x:ix,y:0,z:iy},'tank2','tankb',true));
					//keys.push({x:ix,y:iy,t:2,div: createDiv(ix,iy,'keyb.png')});
					}
					if(ee==6)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//gates.push({x:ix,y:iy,t:2,div:createBrick(ix,iy,'./wall/completeg_b1.png')});
					}
					if(ee==7)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
                         createEnemy(engine.getObject({x:ix,y:0,z:iy},'tank2','tankb',true));
					//keys.push({x:ix,y:iy,t:3,div: createDiv(ix,iy,'keyg.png')});
					}
					if(ee==8)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//gates.push({x:ix,y:iy,t:3,div:createBrick(ix,iy,'./wall/completeg_g1.png')});
					}
					if(ee==9)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//goal={x:ix,y:iy,div:createDiv(ix,iy,'charf.png')};
					}
					if(ee==10)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//enemies.push({x:ix,y:iy,angle:0,dest:{x:ix,y:iy},div:createDiv(ix,iy,'ork.png')});
					}
                    if(ee==0)
					{
                        engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//enemies.push({x:ix,y:iy,angle:0,dest:{x:ix,y:iy},div:createDiv(ix,iy,'ork.png')});
					}
					ix+=20;
				}
				)
				if(maxx<ix)maxx=ix;
				iy+=20;
				ix=20;
			}
			)

    engine.render();
    }

engine.onKey('W'.charCodeAt(0),function(){
cam.position.x+=5;
cam.matCalctulate();
});
engine.onKey('S'.charCodeAt(0),function(){
cam.position.x-=5;
cam.matCalctulate();
});
engine.onKey('A'.charCodeAt(0),function(){
cam.position.z-=5;
cam.matCalctulate();
});
engine.onKey("D".charCodeAt(0),function(){
cam.position.z+=5;
cam.matCalctulate();
});
engine.onKey('Q'.charCodeAt(0),function(){
cam.position.y-=5;
cam.matCalctulate();
});
engine.onKey("E".charCodeAt(0),function(){
cam.position.y+=5;
cam.matCalctulate();
});
engine.onKey("R".charCodeAt(0),function(){
//if(player.direction.s!=0) return;
vNum++;
vNum%=vehicles.length;
player.veh=vehicles[vNum];
gameSay("");
});
engine.onKey(32,function(){
if(!player.veh)
{
    if(vehicles.length<1){
        gameOver();
        return;
    }
    vNum++;
    vNum%=vehicles.length;
    player.veh=vehicles[vNum];
    gameSay("");
    return;
}
if(player.load>0) return;
player.load=1;
shoot(player.veh,true);
});

engine.onKey(38,function(){
    player.direction.t=1;
        
},function(){
    player.direction.t=0;
        
});
engine.onKey(40,function(){
    player.direction.t=-1
},function(){
    player.direction.t=0;
        
});
engine.onKey(37,function(){
player.direction.wa=1;
},function(){
    player.direction.wa=0;
        
});
engine.onKey(39,function(){
player.direction.wa=-1;
},function(){
    player.direction.wa=0;
        
});


/*
engine.onUpdate(
	function(t)
	{
		model.rotation.x+=0.1;
	}
)*/

};
window.onload=start;

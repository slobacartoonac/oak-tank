//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
var gameScore=0;
var gameTime=0;
var leName='0';
var camera=null;
var player=null;
var scorediv=null;
var windiv=null;document.getElementById("windiv");
var showgamecounter=0;
function gameDeclare(ta,tb,todo)
{
    if(showgamecounter==ta+tb) return;
    showgamecounter==ta+tb;
    scorediv.innerHTML="Green "+ta+" - "+tb+" Blue";
    if(tb<=0&&todo==0)
    {
        windiv.style.visibility='visible';
    }
    //console.log("Green "+ta+" - "+tb+" Blue");
}
function gameRemoveLoading(){
        var loading=document.getElementById("loading");
		loading.parentNode.removeChild(loading);
};
function eventRight()
{

    player.direction(-20,null);
}

function eventLeft()
{

    player.direction(20,null);
}

function eventUp()
{

    player.direction(null,20);
}

function eventDown()
{

   player.direction(null,-20);
}
function eventStop()
{
    player.direction(0,0);
    console.log('stop');
}

function eventStopUpDown()
{
    player.direction(null,0);
    console.log('stop');
}
function eventStopLeftRight()
{
    player.direction(0,null);
    console.log('stop');
}




function eventClicked()
{
    player.shoot=1;
    console.log('clicked');
}

function eventShoot()
{
    player.shoot=2;
    console.log('eventShoot');
}
function eventDontShot()
{
    player.shoot=0;
    console.log('eventdShoot');
}
function eventExit()
{
    player.exit=true;
}
var vehicle=null;
function force(arg)
{

}

function start(){
var engine = new OAK.Engine();
var canvas=document.getElementById("canvas");
scorediv=document.getElementById("scorediv");
windiv=document.getElementById("windiv");
var touch=new Touch(canvas,20);
touch.sub('up',eventUp);
touch.sub('down',eventDown);
touch.sub('left',eventRight);
touch.sub('right',eventLeft);
touch.sub('click',eventClicked);
touch.sub('stop',eventStop);
touch.sub('force',force);

//var loadScrean=document.getElementById("loadScrean");
engine.selectCanvas(canvas);
    engine.initShadersPackage(
        {
        name: "defolt",
        program:null,
        vertex: shader_vertex_source,
        fragment: shader_fragment_source,
        uniform: shader_uniform_source1,
        attribute: shader_attribure_source1,
        }
        );
    // engine.selectShader("water");
    // engine.vertexShader(shader_vertex_water);
    // engine.fragmentShader(shader_fragment_water);
    // engine.initShaders();
    // engine.selectShader("shadow");
    // engine.vertexShader(shader_vertex_source_shadowMap);
    // engine.fragmentShader(shader_fragment_source_shadowMap);
    // engine.initShaders();
    // engine.selectShader("efects");
    // engine.vertexShader(efectVert);
    // engine.fragmentShader(efectFrag);
    // engine.initShaders();

myAudio.init();
myAudio.requestSound('shot','../oakTankWorld/data/shot.wav');
myAudio.requestSound('explosion','../oakTankWorld/data/explosion.wav');
myAudio.requestSound('launch','../oakTankWorld/data/launch.wav');

var mapLeg=new MapLegend();

setLegend(mapLeg);


var toload=mapLeg.getToLoad(mapLeg.tMesh);

var loader=new OAK.Loader(engine);

toload.forEach(function(element) {
    loader.add(element.id,element.url,1);
}, this);




loader.onLoad(function (data) {
     

     engine.loadTexture("explosion","../oakTankWorld/img/explosion1.png");
     engine.loadTexture("barrel","../oakTankWorld/img/barrel.png");
    engine.loadTexture("water","../oakTankWorld/img/water6.png");
     engine.loadTexture("kucica","../oakTankWorld/img/kucica2.png");
    engine.loadTexture("to2","../oakTankWorld/img/rest3.png");
    engine.loadTexture("tankg","../oakTankWorld/img/tankg.png");
    engine.loadTexture("tankb","../oakTankWorld/img/tankb.png");
    engine.loadTexture("brick","../oakTankWorld/img/mbrick2.png");
    engine.loadTexture("mine","../oakTankWorld/img/mine.png");
    engine.loadTexture("grass","../oakTankWorld/img/grass1.png");
    engine.loadTexture("base","../oakTankWorld/img/base.png");
    engine.loadTexture("fanceb","../oakTankWorld/img/fanceb.png");
    engine.loadTexture("fence1","../oakTankWorld/img/fence1.png");
    engine.loadTexture("fence2","../oakTankWorld/img/fence2.png");
    engine.loadTexture("concrete","../oakTankWorld/img/concrete.png");
    engine.loadTexture("power","../oakTankWorld/img/power.png");
    engine.loadTexture("power1","../oakTankWorld/img/power1.png");
    engine.loadTexture("grid","../oakTankWorld/img/grid.png");
    engine.loadTexture("star","../oakTankWorld/img/star.png");
    engine.loadTexture("dirt","../oakTankWorld/img/dirt.png");

    engine.loadTexture("pgun","../oakTankWorld/img/pgun.png");
    engine.loadTexture("phelth","../oakTankWorld/img/phelth.png");
    engine.loadTexture("pinvins","../oakTankWorld/img/pinvins.png");
    engine.loadTexture("pspeed","../oakTankWorld/img/pspeed.png");
    engine.loadTexture("trail","../oakTankWorld/img/trail.png");
    engine.loadTexture("mans","../oakTankWorld/img/mans.png");
    engine.loadTexture("mangreen","../oakTankWorld/img/mangreen.png");
    engine.loadTexture("manblue","../oakTankWorld/img/manblue.png");

    engine.loadTexture("tankgunr","../oakTankWorld/img/tankgunr.png");
    engine.loadTexture("tankgunb","../oakTankWorld/img/tankgunb.png");
    engine.loadTexture("tankgung","../oakTankWorld/img/tankgung.png");

    engine.loadTexture("choperb","../oakTankWorld/img/choperb.png");
    engine.loadTexture("choperg","../oakTankWorld/img/choperg.png");

    engine.loadTexture("elise","../oakTankWorld/img/elise.png");
    engine.loadTexture("elise1","../oakTankWorld/img/elise1.png");

    engine.loadTexture("road","../oakTankWorld/img/road.png");
    engine.loadTexture("road2","../oakTankWorld/img/road2.png");
    engine.loadTexture("cursor","../oakTankWorld/img/cursor.png");
    engine.loadTexture("bloodstain","../oakTankWorld/img/bloodstain.png");
    
    run();
});
engine.onLoaded(
        gameRemoveLoading
)
loader.load();
camera=engine.getCamera("camId",false);
function run(params) {

    camera.lookAt(0,150,-40,0,0,0,.0,1,.0);
    camera.setProjection(0.6, canvas.width,canvas.height, 1., 1000.,true);
    OAK.gameResize=function(){camera.setProjection(0.6, engine.preview[0],engine.preview[1], 1., 1000.,true);};

   
    var moremap=JSON.parse(mapFirstlevel);
     var map=new Map(engine,mapLeg);
var array2d = [];
for (var i = 0; i <= 50; i += 1) {
    var subarray = [];
    for (var j = 0; j <= 50; j += 1) {
        subarray.push(3);
    }
    array2d.push(subarray);
}

    map.map=moremap[0];
    map.units=moremap[1];
    map.removeCopys();
    map.makeStatic();
    //map.units=[{t:11,x:220,y:0,z:20},{t:6,x:240,y:0,z:40},{t:7,x:260,y:0,z:40},
    //            {t:13,x:220,y:0,z:40},{t:14,x:240,y:0,z:60},{t:15,x:260,y:0,z:60},{t:16,x:260,y:0,z:80},{t:16,x:800,y:0,z:80},
    //           {t:1,x:220,y:0,z:260},{t:2,x:240,y:0,z:280},{t:3,x:260,y:0,z:260},{t:16,x:260,y:0,z:260}]

    var palyerpp=map.units.filter(function(e){return e.t>=9&&e.t<=12;});


    var physics=new Physics(map);
    player=new Player(0);
    player.lastPos={x:palyerpp[0].x,y:palyerpp[0].y,z:palyerpp[0].z};
    var sound=new Sound(myAudio,player);

    var controler=new tempControler(engine,physics,sound);
    var vehC=new VehicleControler(engine,controler,physics);
    setVehicleControler(vehC);
    var unitsLegend=new UnitLegend(physics,controler,vehC);
    setUnitLegend(unitsLegend);

    
    var rrr=0;
    var rate=1/60;
    var finishflag=true;
    var updatetime=0;
    setInterval(function()
    {
        //elise.rotation+=0.05;
        updatetime+=rate;
        if(!finishflag) return;
        finishflag=false;
        var thisTime=updatetime;
        updatetime=0;
        rrr+=1;
        camera.target.x=camera.position.x=player.lastPos.x;
        camera.target.z=player.lastPos.z;
        camera.position.z=player.lastPos.z-50;
        camera.matCalctulate();
        controler.update(thisTime);
        gameDeclare(physics.teamMembers[0],physics.teamMembers[1],map.units.length);
        map.drawStatic(camera.target.x,camera.target.z);
        unitsLegend.draw(map.getUnits(camera.target.x,camera.target.z));
        physics.teamMembers[0]=0;
        physics.teamMembers[1]=0;
        sound.update();
        if(rrr%500==0){
            console.log(OAK.framerate);
    }
    
        finishflag=true;
    },16);
    engine.render();
    }


engine.onKey('W'.charCodeAt(0),function(){
eventUp();
},function(){eventStopUpDown();});
engine.onKey('S'.charCodeAt(0),function(){
eventDown();
},function(){eventStopUpDown();});
engine.onKey('A'.charCodeAt(0),function(){
eventLeft();
},function(){eventStopLeftRight();});
engine.onKey("D".charCodeAt(0),function(){
eventRight();
},function(){eventStopLeftRight();});
engine.onKey('U'.charCodeAt(0),function(){
camera.position.y-=5;
camera.matCalctulate();
});
engine.onKey("I".charCodeAt(0),function(){
camera.position.y+=5;
camera.matCalctulate();
});

engine.onKey("E".charCodeAt(0),function(){
	eventExit();
});
engine.onKey(27,function(){
	ReloadGame()
});
engine.onKey(13,function(){
    eventExit();
});
engine.onKey(32,eventShoot,eventDontShot);

engine.onKey(38,function(){
    eventUp();      
},function(){ 
    eventStopUpDown();    
});
engine.onKey(40,function(){
    eventDown();
},function(){   eventStopUpDown();    
});
engine.onKey(37,function(){
        eventLeft();
},function(){    eventStopLeftRight();
});
engine.onKey(39,function(){
    eventRight();
},function(){   
    eventStopLeftRight();
});
};
window.onload=start;

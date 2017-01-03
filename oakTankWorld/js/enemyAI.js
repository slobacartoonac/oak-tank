function EnemyAI(team)
{
    this.team=team;
    this.envioerment={actors:null,map:null};
    this.toword={x:0,y:0};
    this.lastPos={x:0,y:0,z:0};
    this.exit=false;
    this.pasive=0;
    this.shield=1;
    this.evry=0;
}

function httpGetAsync(theUrl,data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.responseText);
            callback( JSON.parse(xmlHttp.responseText));
        }
    }
    xmlHttp.open("GET", theUrl+"?data="+encodeURIComponent(JSON.stringify(data)), true); // true for asynchronous 
    xmlHttp.send();
}


EnemyAI.prototype.update=function(vehicle,physics)
{
    physics.teamMembers[this.team]+=1;

    var state=physics.getWorldSlice(vehicle.model.position,6);
    state.helth=vehicle.helth;
    var link=this;
    this.evry+=1;
    if(this.evry%20==0){
    httpGetAsync("http://127.0.0.1:6060/",state,
    function(data){
        link.direction(20*data.right-20*data.left,20*data.up-20*data.down);
        link.shoot=data.shoot;
        link.exit=data.exit;
    }
    );}
    this.pasive=0;
    physics.teamMembers[this.team]+=1;
    vehicle.moveToword(this.toword.x,this.toword.y);
    this.lastPos=vehicle.model.position;
    if(this.shoot)
        vehicle.shoot();
    if(this.shoot==1) this.shoot=0;
    if(this.exit)
        vehicle.exit();
    this.exit=false;

}
EnemyAI.prototype.killed=function(unit)
{
    if(unit.team==this.team)
        this.shield-=1;
    else this.shield+=1;
    if(this.shield<1)this.shield=1;
}
EnemyAI.prototype.direction=function(x,y)
{
    this.toword={x:x,y:y};
}
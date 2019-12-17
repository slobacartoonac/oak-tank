function Map(engine)
{
	this.engine=engine;
	this.enem=[];
	this.empty=[];
            //boxswarm
            //groundswarm
}
Map.prototype.generateMap=function(x,y)
{
	this.map=[];
	for(var i=0;i<y;i++){
		var row=[];
		for(var j=0;j<x;j++)
		{
			if(j==0||j==x-1||i==0||i==y-1)
				row.push(1);
			else if(j>0&&j<4&&i<y-1&&i>y-6)
				row.push(0);
			else if(i<=5) row.push(0);
			else
				{
					var ran=Math.floor(Math.random()*80);
					if(ran>12)ran=0;
					if(ran>9){ran-=8;
						if(ran==3) ran=1;
						}
					if(i<10&&ran==3) ran=0;
					row.push(ran);
				}
		}
		this.map.push(row);
	}
}
Map.prototype.getPos=function(x,y)
{
	if(x<0||y<0||x>=this.map[0].length||y>=this.map.length)
		return 2;
	var area=this.map[y][x];
	if(area==1)
		return 2;
	if(area==4)
		return 1;
	return 0;
}
Map.prototype.draw=function()
{
	var engine=this.engine;
	var boxswarm=[];
	var groundswarm=[];
	var groundboxes=[];
	var baseswarm=[];
	var waterswarm=[];
	var ix=0;
	var iy=0;
	var maxx=0;
	var link=this;
	    this.map.forEach(function(e)
			{
				e.forEach(function(ee)
				{
					if(ee==1)
					{
                    boxswarm.push({x:ix,y:0,z:iy});
					groundswarm.push({x:ix,y:0,z:iy});
					}
					if(ee==2)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                       //link.enem.push(engine.getObject({x:ix,y:0,z:iy},'tank2','tankg',true));
					    link.empty.push(engine.getObject({x:ix,y:0,z:iy},'barrel','barrel',true));
					}
					if(ee==3)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //createEnemy(
						link.enem.push({x:ix,y:0,z:iy,t:0});//);
					}

					if(ee==4)
					{
                        waterswarm.push({x:ix,y:-5,z:iy});
                        //holeswarm.push({x:ix,y:0,z:iy});
					}
					if(ee==5)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //createEnemy(
						link.enem.push({x:ix,y:0,z:iy,t:1});//);
					}
					if(ee==6)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //createEnemy(
						link.enem.push({x:ix,y:0,z:iy,t:2});//);
					}
					if(ee==7)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //createEnemy(
						link.enem.push({x:ix,y:0,z:iy,t:3});//);
					}
					if(ee==8)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //createEnemy(
						link.enem.push({x:ix,y:0,z:iy,t:4});//);
					}
					if(ee==9)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //createEnemy(
						link.enem.push({x:ix,y:0,z:iy,t:5});//);
					}
                    if(ee==0)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
					}
					ix+=20;
				}
				)
				if(maxx<ix)maxx=ix;
				iy+=20;
				ix=0;
			}
			);

			function neerWater(el)
			{
				var ret=false;
					for(var i=0;i<waterswarm.length;i++)
					{
						var wat=waterswarm[i];
						if(distanceZ(wat,el)<39)
							ret=true;
					}
				return ret;
			}
			groundswarm=groundswarm.filter(function(el){
				if(neerWater(el))
				{
					groundboxes.push(el);
					return false;
				}
				else return true;
			});
			baseswarm=baseswarm.filter(function(el){
				if(neerWater(el))
				{
					groundboxes.push(el);
					return false;
				}
				else return true;
			});
	        engine.getObjectsStatic({x:0,y:0,z:0},boxswarm,'kucica','kucica',true);
            engine.getObjectsStatic({x:0,y:0,z:0},groundswarm,'plane','grass',true);
            engine.getObjectsStatic({x:0,y:0,z:0},baseswarm,'plane','base',true);
			engine.getObjectsStatic({x:0,y:0,z:0},groundboxes,'brick','grass',true);
            engine.getObjectsStatic({x:0,y:0,z:0},waterswarm,'plane','water',true,"water");
}
function Map(engine,legend)
{
	this.engine=engine;
	this.units=[];
	this.objects=[];
	this.oldx=-1;
	this.oldy=-1;
	this.curType=0;
	this.legend=legend;
	this.chunkSize=6;
	this.nChunks=3;
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
	return this.legend.getLevel(area);
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
            engine.getObjectsStatic({x:0,y:0,z:0},waterswarm,'plane','water',true);
}
Map.prototype.makeStatic=function()
{
	var group=[];
	var types=[];
	this.chunks=[];
	var maxx=0;
	var maxy=0;
	var size=this.chunkSize;
	for(var iy=0;iy<this.map.length;iy++){
	 var row=this.map[iy]
	 for(var ix=0;ix<row.length;ix++){
		 	ee=row[ix];
			if(types.indexOf(ee)==-1)types.push(ee);
			maxx=maxx<Math.floor(ix/size)?Math.floor(ix/size):maxx;
			maxy=maxy<Math.floor(iy/size)?Math.floor(iy/size):maxy;
			group.push({bx:Math.floor(ix/size),by:Math.floor(iy/size),t:ee,p:{x:ix*20,y:this.legend.getItem(ee).ydisp,z:iy*20}});
			var width=this.legend.getWidth(ee);
			if(width>=0) 
				{
					group.push({bx:Math.floor(ix/size),by:Math.floor(iy/size),t:width,p:{x:ix*20,y:this.legend.getItem(width).ydisp,z:iy*20}});
					if(types.indexOf(width)==-1)types.push(width);
				}
			}
		}
	for(var by=0;by<maxy;by++)
		for(var bx=0;bx<maxx;bx++)
			for(var t=0;t<types.length;t++)
			{
				iType=types[t];
				var specific=group.filter(function(element){return by==element.by&&bx==element.bx&&iType==element.t;})
				if(specific.length==0) continue;
				var cordinates=[];
				specific.forEach(function(element){ cordinates.push(element.p); });
				var tType=this.legend.getItem(iType);
				this.chunks.push({bx:bx,by:by,t:t,ren: engine.getObjectsStatic({x:0,y:0,z:0},cordinates,tType.mes,tType.tex,false)});
			}
}
Map.prototype.drawStatic=function(x,y)
{
	var size=this.chunkSize;
	var link=this;
	var nx=Math.floor(x/20/size);
	var ny=Math.floor(y/20/size);
	if(nx==this.oldx&&ny==this.oldy) return;
	this.oldx=nx;
	this.oldy=ny;
	this.objects.forEach(function(element) {
		link.engine.remObject(element);
	}, this);
	this.objects=[];
	this.chunks.forEach(function(element)
	{
		if(Math.abs(element.bx-nx)<link.nChunks&&Math.abs(element.by-ny)<link.nChunks)
			link.engine.addRender(element.ren);
			link.objects.push(element.ren);
	}
	);
}

Map.prototype.drawEdit=function(x,y)
{
	if(Math.floor(x/20)==this.oldx&&Math.floor(y/20)==this.oldy) return;
	this.oldx=Math.floor(x/20);
	this.oldy=Math.floor(y/20);
	var link=this;
	this.objects.forEach(function(element) {
		link.engine.remObject(element);
	}, this);
	this.objects=[];
	var ix=0;
	var iy=0;
	var maxx=0;
	this.map.forEach(function(e)
			{
				e.forEach(function(ee)
				{
					if(Math.abs(ix-x)<200&&Math.abs(iy-y)<200){
						link.objects.push(link.getObject(ee,{x:ix,y:0,z:iy}));
						var width=link.legend.getWidth(ee);
						if(width>=0) link.objects.push(link.getObject(width,{x:ix,y:0,z:iy}));
					}
					ix+=20;
				}
				)
				if(maxx<ix)maxx=ix;
				iy+=20;
				ix=0;
			}
	);
}

Map.prototype.getObject=function(num,pos)
{
	var item=null;
	var link=this;
	var ee=num;
	var tocr=this.legend.getItem(num);
	pos.y+=tocr.ydisp;
	if(ee<this.legend.itemNum)item=engine.getObject(pos, tocr.mes, tocr.tex, true);
	return item;
}
Map.prototype.setObject=function(cursor)
{
	this.map[Math.floor(cursor.position.z/20)][Math.floor(cursor.position.x/20)]=this.curType;
	this.oldx=-1;
	return cursor;
}
Map.prototype.clickBolck=function(cursor)
{
	if(this.map[Math.floor(cursor.position.z/20)][Math.floor(cursor.position.x/20)]==this.curType)
		return this.changeType(cursor);
	else return this.setObject(cursor);
}
Map.prototype.changeType=function(cursor,down)
{
	if(down)
		this.curType+=1;
	else
		this.curType-=1;
	if(this.curType<0) this.curType=this.legend.itemNum-1;

	this.curType%=this.legend.itemNum;

	this.engine.remObject(cursor);

	cursor=this.getObject(this.curType,cursor.position);
	return cursor;
}
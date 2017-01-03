//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function Touch(div,deadzone)
{
	var link=this;
	this.deadzone=deadzone;
	this.clear();
    function distance2d(a,b)
	{
		return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
	}
    var startMove=null;
	var thisMove=null;
	var mouseDown=false;
	function moveTouchT(e)
	{
		e.preventDefault();
		moveTouch({x:e.touches[0].pageX,y:e.touches[0].pageY});
	}
	function moveTouchM(e)
	{
		e.preventDefault();
		if(mouseDown)
			moveTouch({x:e.pageX,y:e.pageY});
	}
	function moveTouch(e)
	{
		
		if(startMove==null)
		{
			startMove={x:e.x,y:e.y};
			thisMove={x:e.x,y:e.y};
		}
		else
		{
			thisMove={x:e.x,y:e.y};
			var direction={x:thisMove.x-startMove.x,y:thisMove.y-startMove.y};
			link.triger('force',direction);
			if(distance2d(startMove,thisMove)>link.deadzone)
			{
				if(Math.abs(direction.x)>Math.abs(direction.y))
				{
					if(direction.x>0)
					{
						link.triger('left');
					}
					else
					{
						link.triger('right');
					}
				}
				else
				{
					if(direction.y>0)
					{
						link.triger('down');
					}
					else
					{
						link.triger('up');
					}
				
				}
				
			}
			
		}
	}
//={up:[],down:[],left:[],right:[],stop:[],click:[],force:[]}
	function stopTouch(e){
		e.preventDefault();
		if(startMove==null||startMove==null||distance2d(startMove,thisMove)<link.deadzone){
			if(e.button)
				{
					if(e.button==1)
						link.triger('bmiddle');
					if(e.button==2)
						link.triger('bright');
				}
			else link.triger('click');
			}
		link.triger('stop');
		startMove=null;
		thisMove=null;
		mouseDown=false;
		}
    div.addEventListener("touchstart", function(e){e.preventDefault();}, false);
    div.addEventListener("touchmove", moveTouchT, false);
    div.addEventListener("touchend",stopTouch,false);
    div.addEventListener("mousemove", moveTouchM);
    div.addEventListener("mouseup", stopTouch);
    div.addEventListener("mousedown", function(){mouseDown=true;});
}
Touch.prototype.sub=function(ev,func)
{
	if(this.events[ev])
		this.events[ev].push(func);
}
Touch.prototype.unsub=function(ev,func)
{
	if(this.events[ev])
		this.events[ev]=this.events[ev].filter(function(fu){return fu!=func;});
}
Touch.prototype.clearEvlent=function(ev)
{
	if(this.events[ev])
		this.events[ev]=[];
}
Touch.prototype.clear=function()
{
	this.events={up:[],down:[],left:[],right:[],stop:[],click:[],force:[],bmiddle:[],bright:[]};
}
Touch.prototype.triger=function(ev,args)
{
	if(this.events[ev])
		this.events[ev].forEach(function(func){func(args);});
}
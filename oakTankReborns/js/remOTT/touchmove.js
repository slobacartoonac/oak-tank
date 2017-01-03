
function Touch(div,deadzone)
{
	var link=this;
	this.deadzone=deadzone;
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
		if(distance2d(startMove,thisMove)>link.deadzone)
		{
			if(Math.abs(direction.x)>Math.abs(direction.y))
			{
				if(direction.x>0)
				{
					eventTurnLeft();
				}
				else
				{
					eventTurnRight();
				}
			}
			else
			{
				if(direction.y>0)
				{
					eventBackward();
				}
				else
				{
                    eventForward();
				}
			
			}
			
		}
		
	}
}

function stopTouch(e){
	e.preventDefault();
	if(startMove==null||startMove==null||distance2d(startMove,thisMove)<link.deadzone)
		eventClicked();
    eventStop();
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

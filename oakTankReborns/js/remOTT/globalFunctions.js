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
function neerestAngle(a,b)
{
	var side=a-b;
    var side2=a-b+2*Math.PI;
    var side3=a-b-2*Math.PI;
    if(Math.abs(side)>Math.abs(side2))
        side=side2;
    if(Math.abs(side)>Math.abs(side3))
        side=side3;
	return side;
}
function distanceZ(a,b)
			{
				return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.z-b.z)*(a.z-b.z));
			}
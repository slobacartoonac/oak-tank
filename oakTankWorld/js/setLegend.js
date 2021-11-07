function setLegend(mapLeg)
{
mapLeg.addResource("tank2","../oakTankWorld/data/tank2.txt",mapLeg.tMesh)
mapLeg.addResource("plane","../oakTankWorld/data/plane.txt",mapLeg.tMesh)
mapLeg.addResource("proj","../oakTankWorld/data/projectile.txt",mapLeg.tMesh)
mapLeg.addResource("brick","../oakTankWorld/data/groundbox.txt",mapLeg.tMesh)
mapLeg.addResource("explosion","../oakTankWorld/data/explosion12.txt",mapLeg.tMesh);
mapLeg.addResource("hole","../oakTankWorld/data/hole.txt",mapLeg.tMesh)
mapLeg.addResource("mine","../oakTankWorld/data/mine.txt",mapLeg.tMesh)
mapLeg.addResource("kucica","../oakTankWorld/data/kucica.txt",mapLeg.tMesh)
mapLeg.addResource("cone","../oakTankWorld/data/cone.txt",mapLeg.tMesh)
mapLeg.addResource("barrel","../oakTankWorld/data/barrel.txt",mapLeg.tMesh)
mapLeg.addResource("pcube","../oakTankWorld/data/pcube.txt",mapLeg.tMesh)
mapLeg.addResource("trail","../oakTankWorld/data/trail.txt",mapLeg.tMesh)
mapLeg.addResource("mans","../oakTankWorld/data/mans.txt",mapLeg.tMesh)
mapLeg.addResource("manr","../oakTankWorld/data/manr.txt",mapLeg.tMesh)
mapLeg.addResource("manl","../oakTankWorld/data/manl.txt",mapLeg.tMesh)
mapLeg.addResource("tankgun","../oakTankWorld/data/tankgun.txt",mapLeg.tMesh)
mapLeg.addResource("choper","../oakTankWorld/data/choperb.txt",mapLeg.tMesh)
mapLeg.addResource("bridge","../oakTankWorld/data/bridge.txt",mapLeg.tMesh)
mapLeg.addResource("bridge90","../oakTankWorld/data/bridge90.txt",mapLeg.tMesh)

mapLeg.addItem(0,'brick','grass');
mapLeg.addItem(1,'kucica','kucica',2,0,0);
mapLeg.addItem(2,'brick','cursor',2,20,0);
mapLeg.addItem(3,'plane','water',1,-9);
mapLeg.addItem(4,'bridge','road',0,1,3);
mapLeg.addItem(5,'bridge90','road',0,1,3);
mapLeg.addItem(6,'brick','road2',0,1,3);
}
//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
function setVehicleControler(vehC)
{
    vehC.addType('tank','Tank',['tank2'],['grid','tankg','tankb'])
    vehC.addType('tankgun','TankGun',['tankgun'],['grid','tankgung','tankgunb'])
    vehC.addType('choper','Choper',['choper'],['grid','choperg','choperb'],['plane'],['elise','elise1'])
    vehC.addType('Barrel','PhysicalObject',['barrel'],['barrel'])
    vehC.addType('truper','Truper',['mans','manl','mans','manr'],['mangreen','manblue','manred']);
}
function setUnitLegend(unitsLegend)
{
    unitsLegend.add(1,'tank','Enemy',1);
    unitsLegend.add(2,'tankgun','Enemy',1);
    unitsLegend.add(3,'choper','Enemy',1);
    unitsLegend.add(4,'truper','Enemy',1);
    unitsLegend.add(5,'tank','Enemy',0);
    unitsLegend.add(6,'tankgun','Enemy',0);
    unitsLegend.add(7,'choper','Enemy',0);
    unitsLegend.add(8,'truper','Enemy',0);
    unitsLegend.add(9,'tank','Player',0);
    unitsLegend.add(10,'tankgun','Player',0);
    unitsLegend.add(11,'choper','Player',0);
    unitsLegend.add(12,'truper','Player',0);
    unitsLegend.add(13,'tankgun');
    unitsLegend.add(14,'choper');
    unitsLegend.add(15,'tank');
    unitsLegend.add(16,'Barrel');
}
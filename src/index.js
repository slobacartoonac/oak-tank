import * as utils from "../oakEngine/js/utils.js"
import * as vecmath from "../oakEngine/js/vecmath.js"
import * as oakEngine from "../oakEngine/js/oakEngine.js"
import * as lights from "../oakEngine/js/lights.js"
import * as shader from "../oakEngine/js/shader.js"
import * as loader from "../oakEngine/js/loader.js"
import * as shadersimport from "../oakEngine/js/shadersimport.js"
import * as shaders2 from "../oakEngine/js/shaders2.js"

import * as mesh from "../oakEngine/js/mesh.js"
import * as texture from "../oakEngine/js/texture.js"
import * as camera from "../oakEngine/js/camera.js"
import * as rendable from "../oakEngine/js/rendable.js"
//import * from "../oakEngine/js/touch.js"


import * as audio from "../oakTankWorld/js/audio.js"
import * as sound from "../oakTankWorld/js/sound.js"
import * as score from "../oakTankWorld/js/score.js"
import * as globalFunctions from "../oakTankWorld/js/globalFunctions.js"
import * as vehicle from "../oakTankWorld/js/vehicle.js"
import * as tank from "../oakTankWorld/js/tank.js"
import * as choper from "../oakTankWorld/js/choper.js"
import * as enemy from "../oakTankWorld/js/enemy.js"
import * as enemyAI from "../oakTankWorld/js/enemyAI.js"
import * as physics from "../oakTankWorld/js/physics.js"
import * as mapLegend from "../oakTankWorld/js/mapLegend.js"
import * as setLegend from "../oakTankWorld/js/setLegend.js"
import * as map from "../oakTankWorld/js/map.js"
import * as unitLegend from "../oakTankWorld/js/unitLegend.js"
import * as tempControler from "../oakTankWorld/js/tempControler.js"
import * as projectile from "../oakTankWorld/js/projectile.js"
import * as pickable from "../oakTankWorld/js/pickable.js"
import * as truper from "../oakTankWorld/js/truper.js"
import * as vehicleControler from "../oakTankWorld/js/vehicleControler.js"
import * as levels from "../oakTankReborns/js/levels.js"
import * as game from "../oakTankReborns/js/game.js"

function resizeFunc() {
    var doc = document.getElementById('canvas')
    doc.style.width = window.innerWidth - 10
    doc.style.height = window.innerHeight - 10
    doc.width = window.innerWidth - 10
    doc.height = window.innerHeight - 10
    oakEngine.OAK.gameResize()
} resizeFunc();
window.addEventListener('resize', resizeFunc); 
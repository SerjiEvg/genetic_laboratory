
var cw_drawVirtualPoly = require("./draw-virtual-poly");
var cw_drawCircle = require("./draw-circle");

module.exports = function(car_constants, myCar, camera, ctx){
  var camera_x = camera.pos.x;
  var zoom = camera.zoom;

  var wheelMinDensity = car_constants.wheelMinDensity
  var wheelDensityRange = car_constants.wheelDensityRange

  if (!myCar.alive) {
    return;
  }
  var myCarPos = myCar.getPosition();

  if (myCarPos.x < (camera_x - 5)) {
    // Слишком далеко позади — не рисуем
    return;
  }

  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1 / zoom;

  var wheels = myCar.car.car.wheels;

  for (var i = 0; i < wheels.length; i++) {
    var b = wheels[i];
    for (var f = b.GetFixtureList(); f; f = f.m_next) {
      var s = f.GetShape();
      var color = Math.round(255 - (255 * (f.m_density - wheelMinDensity)) / wheelDensityRange).toString();
      var rgbcolor = "rgb(" + color + "," + color + "," + color + ")";
      cw_drawCircle(ctx, b, s.m_p, s.m_radius, b.m_sweep.a, rgbcolor);
    }
  }

  if (myCar.is_elite) {
    ctx.strokeStyle = "#3F72AF";
    ctx.fillStyle = "#DBE2EF";
  } else {
    ctx.strokeStyle = "#F7C873";
    ctx.fillStyle = "#FAEBCD";
  }
  ctx.beginPath();

  var chassis = myCar.car.car.chassis;

  for (f = chassis.GetFixtureList(); f; f = f.m_next) {
    var cs = f.GetShape();
    cw_drawVirtualPoly(ctx, chassis, cs.m_vertices, cs.m_vertexCount);
  }
  ctx.fill();
  ctx.stroke();

  // Номер автомобиля. Используется тот же индекс, что и в списке лидеров.
  var carNumber = myCar.index;
  if (carNumber !== undefined && carNumber !== null) {
    var carCenter = chassis.GetPosition();
    ctx.save();
    ctx.translate(carCenter.x, carCenter.y);
    // Контекст Canvas перевёрнут по вертикали вместе с миром Box2D,
    // поэтому дополнительно отражаем только текст, чтобы цифра была читаемой.
    ctx.scale(1, -1);
    ctx.fillStyle = "#16213E";
    ctx.font = "bold " + (12 / zoom) + "px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(carNumber), 0, 0);
    ctx.restore();
  }
}

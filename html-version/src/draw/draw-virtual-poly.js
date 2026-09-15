

module.exports = function(ctx, body, vtx, n_vtx) {
  // Перед вызовом задайте стиль контура и заливки
  // Перед вызовом выполните beginPath

  var p0 = body.GetWorldPoint(vtx[0]);
  ctx.moveTo(p0.x, p0.y);
  for (var i = 1; i < n_vtx; i++) {
    var p = body.GetWorldPoint(vtx[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineTo(p0.x, p0.y);
}

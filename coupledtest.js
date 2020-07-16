var diffEqX0 = function(time, x) {
  return [x[1], -9.8 * sin(x[1])];
}

var foo = new System();

foo.setStart(0.0);
foo.setStop(2.0);
foo.setInitX([0, 0, 0]);
foo.setFn(diffEqX0);

foo.solve();
console.log(foo.newX())
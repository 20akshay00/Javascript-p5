let blist = [];
let fSlider;

function setup() {
  createCanvas(500, 500)
  background(20)
  for (let i = 0; i < 3; i++) {
    blist.push(new body(random(width), random(height), 1, i))
    blist[i].draw()
  }

  fSlider = createSlider(1, 500, 50, 1); //frameskip slider
  fSlider.position(10, 10);
  fSlider.style('width', '90px');

}

function draw() {

  background(20)
  fill(255)
  text("Frameskip : " + fSlider.value(), 10, 50)

  for (let i = 0; i < fSlider.value(); i++) {
    for (let item of blist) {
      item.attract(blist)
    }
  }

  for (let item of blist) {
    item.draw()
  }
}
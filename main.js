var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
var fps = 60;


/*var map =
	[[2,1,2,1,2],
	[1,0,0,0,1],
	[2,0,2,0,2],
	[1,0,0,0,1],
	[2,1,2,1,2]]; */

var map =
        [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];



var walls = []; //array of walls
var rays = []; //array of rays for testing distance from player;
var nrays = 400; //number of arrays
var fov = Math.PI/5;
var viewDist = c.width;

//fills array
for(var ix = 0; ix<map[0].length; ix++){
	for(var iy = 0; iy<map.length; iy++){
  	if(map[iy][ix] == 1){
    	walls.push(new wall(ix*c.width/map[0].length, iy*c.height/map.length, c.width/map[0].length, c.height/map.length, 'black'));
    }
		if(map[iy][ix] == 2){
    	walls.push(new wall(ix*c.width/map[0].length, iy*c.height/map.length, c.width/map[0].length, c.height/map.length, 'lime'));
    }
  }
}


//wall object constructor
function wall(x, y, sizex, sizey, color){
	this.x = x;
  this.y = y;
  this.w = sizex;
  this.h = sizey;
	this.color = color;
  this.update = function(){
    ctx.beginPath();
    ctx.fillStyle = color;
  	ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.closePath();
  }

}






//player
var player ={
	size: (Math.min(c.width/map[0].length, c.height/map.length)/2)-10, //10px smaller than a square on the map
  x : (c.width/2),
  y : (c.height/2),
  xvel: 0, //x velocity
  yvel: 0, // y velocity
  facing : 0, //angle in radians player is facing
  speed : 250, //pixels a second
  colDist: .2, //distance in PU for wall detection
  update: function(){
  	if (key.isDown(key.UP)) {player.yvel = Math.sin(player.facing)*-(player.speed/fps);}
  	if (key.isDown(key.LEFT)) {player.xvel = -(player.speed/fps);}
  	if (key.isDown(key.DOWN)) {player.yvel = player.speed/fps;}
  	if (key.isDown(key.RIGHT)) {player.xvel = player.speed/fps;}
    if(!key.isDown(key.UP) && !key.isDown(key.DOWN)){player.yvel = 0;}
    if(!key.isDown(key.LEFT) && !key.isDown(key.RIGHT)){player.xvel = 0;}

    var colDist = .15;
    var pux = ((player.x/c.width)*map[0].length);
    var puy = ((player.y/c.height)*map.length);
    document.getElementById('coord').innerHTML = 'X:'+pux+' Y: '+puy;

    //from left
    if(map[Math.floor(puy)][Math.floor(pux-colDist)] >0){
      console.log('left');
      if(Math.round(pux) == Math.floor(pux)){
        player.xvel = 1;
      }
    }

    //from right
    if(map[Math.floor(puy)][Math.floor(pux+colDist)] >0){
      console.log('right');
      if(Math.round(pux) == Math.ceil(pux)){
        player.xvel = -1;
      }
    }

    //from top
    if(map[Math.floor(puy-colDist)][Math.floor(pux)] >0){
      console.log('top');
      if(Math.round(puy) == Math.floor(puy)){
        player.yvel = 1;
      }
    }

    //from bottom
    if(map[Math.floor(puy+colDist)][Math.floor(pux)] >0){
      console.log('bottom');
      if(Math.round(puy) == Math.ceil(puy)){
        player.yvel = -1;
      }
    }

    //keeps player on screen
    if(player.x > c.width)
    	player.x = c.width-1;
    if(player.y>c.height-1)
    	player.y = c.height-1;
    if(player.x < 0)
    	player.x =  0;
    if(player.y < 0)
    	player.y = 0;

      //crosshair
    //player.facing = Math.atan2(mouse.x-player.x,mouse.y-player.y)-Math.PI/2;
    if (key.isDown(key.RIGHTARROW)) {player.facing-=.05}
    if (key.isDown(key.LEFTARROW)) {player.facing +=.05}
    player.x +=player.xvel;
    player.y +=player.yvel;

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(player.x, player.y);
    ctx.lineTo((Math.cos(player.facing)*35)+player.x,-(Math.sin(player.facing)*35)+player.y);
    ctx.stroke();

    ctx.beginPath();
  	ctx.arc(player.x,player.y, player.size,0, 2*Math.PI);
  	//ctx.arc(mouse.x,mouse.y, player.size,0, 2*Math.PI);   //ball is on mouse position
  	ctx.fillStyle = 'green';
  	ctx.fill();
  	ctx.lineWidth = 5;
  	ctx.strokeStyle = '#003300';
  	ctx.stroke();
  }
}

for(var i = -fov/2; i<=fov/2; i+= (1/nrays)*fov){
  rays.push(new ray(i));
}

function ray(angleDiff){
  this.x = player.x;
  this.y = player.y;
  this.angleDiff = angleDiff;
  this.angle = player.facing + angleDiff;
  this.dist = 0; //distance from wall
	this.hitColor = 'black';
  this.update = function(){
    this.x = player.x;
    this.y = player.y;
    this.angle = player.facing +this.angleDiff;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(this.x, this.y);
    this.dist = this.findDist();
    ctx.lineTo((Math.cos(this.angle)*this.dist)+this.x,-(Math.sin(this.angle)*this.dist)+this.y);
    ctx.stroke();
  }
  this.findDist = function(){
    for (var i = 0; i < viewDist; i++) { // TODO: view distance here
      var sx= (Math.cos(this.angle)*i)+this.x;
      var sy = -(Math.sin(this.angle)*i)+this.y;
      var rux = Math.floor(((sx/c.width)*map[0].length));
      var ruy = Math.floor(((sy/c.height)*map.length));
      if(map[ruy][rux]==1){
				this.hitColor = 'black'
        return i;
      }
			if(map[ruy][rux]==2){
				this.hitColor = 'lime'
        return i;
      }
    }
    return i;
  }
}

//movement
var key = {
  _pressed: {},

  LEFT: 65,
  UP: 87,
  RIGHT: 68,
  DOWN: 83,
  LEFTARROW: 37,
  RIGHTARROW: 39,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

//mouse
var mouse = {
	x : 0,
  y : 0,
  onMove: function(event) {
  	this.x = event.clientX;
    this.y = event.clientY;
  }
}

//event handlers
window.addEventListener('mousemove', function(event) { mouse.onMove(event); }, false);
window.addEventListener('keyup', function(event) { key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { key.onKeydown(event); }, false);


//update
function update(){
  ctx.clearRect(0,0,c.width,c.height);
  dtx.clearRect(0,0,c.width,c.height);
  dtx.fillStyle = 'gray';
  dtx.fillRect(0,d.height/2,d.width,d.height);
  dtx.fillStyle = 'blue';
  dtx.fillRect(0,0,d.width,d.height/2);
	player.update();
  for(var i = 0; i<walls.length; i++){
  	walls[i].update();
  }
  for (var i = 0; i < rays.length; i++) {
    rays[i].update();
		dtx.fillStyle = rays[i].hitColor;
    dtx.fillRect((1-(i/rays.length))*d.width,(d.height/2)-(((1-(rays[i].dist/viewDist))*d.height)/2),(1/rays.length)*d.width,((1-(rays[i].dist/viewDist))*d.height));
  }

}

setInterval(function(){
	update();
}, 1000/fps);

var d = document.getElementById('canvas2');
var dtx = d.getContext('2d');

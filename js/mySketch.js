/* ORIGINAL: "Waves light" by Jubal smith – CC-BY 4.0
URL: https://openprocessing.org/sketch/2559208
Remixed by Charles Pelszyski, 2025-05-07
Purpose: animated hero background

This sketch creates an animated wave-like pattern using Perlin noise and particle systems.
The animation consists of multiple "mobiles" (particles) that move across the canvas,
creating flowing, organic patterns. The particles' movement and colors are influenced
by noise functions, creating a mesmerizing, wave-like effect.
*/

// Global variables
var nmobiles = 4000;  // Number of particles in the animation
var mobiles = [];    // Array to store all particle objects
var noisescale;      // Scale factor for noise calculations
var a1, a2, a3, a4, a5, amax;  // Parameters for noise and animation control
var bw = 0;       // Boolean for black and white mode toggle

function setup() {
  // Create canvas sized to hero height
  const canvas = createCanvas(windowWidth, windowHeight * 0.6);
  canvas.parent('hero'); // Attach canvas to <header id="hero"> 
}

function windowResized() {
  // Keep banner responsive on window resize
  resizeCanvas(windowWidth, windowHeight * 0.6);
}

function setup() {
  createCanvas(800, 800);
  background(0);
  noFill();  
  colorMode(HSB, 360, 255, 255, 255);  // Use HSB color mode for better color control
  strokeWeight(.1);
  reset();
}

function reset() {
  // Initialize or reset animation parameters
  noisescale = random(.08, .1);  // Random noise scale for variation
  noiseDetail(int(random(1,5))); // Set noise detail level
  amax = random(5);              // Maximum amplitude for wave movement
  // Initialize amplitude parameters for different aspects of the animation
  a1 = random(1, amax);  // Color hue variation
  a2 = random(1, amax);  // Saturation variation
  a3 = random(1, amax);  // Brightness variation
  a4 = random(1, amax);  // Movement variation
  a5 = 10;               // Base movement speed
  
  // Create new mobile particles
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i] = new Mobile(i);
  }
}

function draw() {
  // Main animation loop - update and display all particles
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i].run();
  }
}

function keyReleased() {
  // Keyboard controls
  if (key=="s" || key=="S") {
    // Save canvas as PNG with timestamp
    saveCanvas("POSTHELIOS_NOISE3_" + day() + "_" + month() + "_" + hour() + "_" + minute() + "_" + second() + ".png");
  }
  if (keyCode==32) reset();        // Space bar resets animation
  if(key=="r" || key=="R") setup(); // R key reinitializes
  if(key=="b" || key=="B") bw=!bw;  // B key toggles black/white mode
}

// Mobile class - represents each particle in the animation
function Mobile(index) {
  this.index = index;
  this.velocity = createVector(200, 200, 200);      // Initial velocity vector
  this.acceleration = createVector(200, 200, 200);  // Initial acceleration vector
  this.position0 = createVector(random(0, width), random(0, height), random(0, sin(height))); // Starting position
  this.position = this.position0.copy();            // Current position
  this.trans = random(50, 100);                     // Transparency value
  
  // Calculate initial color values using noise
  this.hu = (noise(a1*cos(PI*this.position.x*width), a1*sin(PI*this.position.y/height))*720)%random(360);
  this.sat = noise(a2*sin(PI*this.position.x*width), a2*sin(PI*this.position.y/height))*255;
  this.bri = noise(a3*cos(PI*this.position.x/width), a3*cos(PI*this.position.y/height))*255;
}

// Run method - updates and displays the particle
Mobile.prototype.run = function() {
  this.update();
  this.display();
};

// Update method - calculates new position based on noise
Mobile.prototype.update = function() {
  // Calculate velocity using noise functions
  this.velocity = createVector(
    1-2*noise(a4+a2*sin(TAU*this.position.x/width), a4+a2*sin(TAU*this.position.y/height)),
    1-2*noise(a2+a3*cos(TAU*this.position.x/width), a4+a3*cos(TAU*this.position.y/height))
  );
  
  this.velocity.mult(a5);  // Apply speed multiplier
  this.velocity.rotate(sin(100)*noise(a4+a3*sin(TAU*this.position.x/width))); // Add rotation
  this.position0 = this.position.copy();  // Store previous position
  this.position.add(this.velocity);       // Update position
};

// Display method - draws the particle
Mobile.prototype.display = function() {
  // Set stroke color based on mode (black/white or color)
  if(bw) {
    stroke(255, this.trans);  // White with transparency
  } else {
    stroke((frameCount*1.8)%360, (millis()%360), (frameCount)%360, this.trans%255);  // Dynamic color
  }
  
  // Draw line from previous position to current position
  line(this.position0.x, this.position0.y, this.position.x, this.position.y);
  
  // Reset particle if it goes off screen
  if (this.position.x>width || this.position.x<0 || this.position.y>height || this.position.y<0) {
    this.position0 = createVector(random(0, width), random(0, height), random(0, height*width));
    this.position = this.position0.copy();
  }
};
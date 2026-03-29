/**
 * Cyber Grid Particle System
 * Creates a connected-node network animation with a subtle grid,
 * inspired by cybersecurity / hacker-style visuals.
 */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ---- Configuration ---- */
  const CONFIG = {
    particleCount: 80,        // number of floating nodes
    connectionDist: 150,      // max distance to draw connection line
    particleRadius: 1.8,
    speed: 0.35,
    lineWidth: 0.5,
    colors: {
      particle: 'rgba(0, 212, 255, 0.7)',
      line: 'rgba(0, 212, 255, %%OPACITY%%)',  // template
      grid: 'rgba(0, 212, 255, 0.03)',
    },
    gridSize: 60,
    mouseRadius: 180,
  };

  let width, height, particles, mouse;

  /* ---- Resize handler ---- */
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  /* ---- Mouse tracking ---- */
  mouse = { x: -1000, y: -1000 };

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  /* ---- Particle class ---- */
  function Particle() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * CONFIG.speed * 2;
    this.vy = (Math.random() - 0.5) * CONFIG.speed * 2;
    this.radius = CONFIG.particleRadius * (0.6 + Math.random() * 0.8);
    this.baseAlpha = 0.4 + Math.random() * 0.6;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Mouse repulsion
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.mouseRadius) {
      var force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
      this.x += (dx / dist) * force * 2;
      this.y += (dy / dist) * force * 2;
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.colors.particle;
    ctx.globalAlpha = this.baseAlpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  /* ---- Init particles ---- */
  function init() {
    resize();
    // Scale particle count on smaller screens
    var count = width < 768 ? Math.floor(CONFIG.particleCount * 0.5) : CONFIG.particleCount;
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  /* ---- Draw background grid ---- */
  function drawGrid() {
    ctx.strokeStyle = CONFIG.colors.grid;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (var x = 0; x < width; x += CONFIG.gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (var y = 0; y < height; y += CONFIG.gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }

  /* ---- Draw connections ---- */
  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDist) {
          var opacity = (1 - dist / CONFIG.connectionDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0, 212, 255, ' + opacity + ')';
          ctx.lineWidth = CONFIG.lineWidth;
          ctx.stroke();
        }
      }

      // Mouse connections
      var dmx = particles[i].x - mouse.x;
      var dmy = particles[i].y - mouse.y;
      var distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
      if (distMouse < CONFIG.mouseRadius) {
        var mOpacity = (1 - distMouse / CONFIG.mouseRadius) * 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(123, 47, 247, ' + mOpacity + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  /* ---- Animation loop ---- */
  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawConnections();
    requestAnimationFrame(animate);
  }

  /* ---- Start ---- */
  init();
  animate();

  /* Reinit on resize (debounced) */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();

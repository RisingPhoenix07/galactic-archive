// ==========================================
// PHASER 3 MINI-GAME: APOLLO 11 LANDER (CHECKPOINT TRAJECTORY)
// ==========================================

let activePhaserGame = null;

function launchLanderMiniGame(onSuccessCallback, onFailureCallback) {
  const panelBox = document.getElementById("panel-box");
  const captionBox = document.getElementById("caption-box");
  const hudOverlay = document.getElementById("hud-overlay");
  const choicesContainer = document.getElementById("choices-container");
  const canvasView = document.getElementById("canvas-view");

  if (panelBox) panelBox.classList.add("hidden");
  if (captionBox) captionBox.classList.add("hidden");
  if (hudOverlay) hudOverlay.classList.add("hidden");
  if (choicesContainer) choicesContainer.classList.add("hidden");
  if (canvasView) canvasView.classList.remove("hidden");

  if (activePhaserGame) {
    activePhaserGame.destroy(true);
  }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: 'phaser-game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 38 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  let lander;
  let cursors;
  let landingPad;
  let engineParticles;
  let rcsLeftParticles;
  let rcsRightParticles;
  let surfaceLight;

  let checkpoints = [];
  let currentCheckpointIndex = 0;
  let checkpointText;

  let fuel = 100;
  let fuelText;
  let velYText;
  let velXText;
  let angleText;
  let alarmText;
  
  let alarmActive = false;
  let alarmCleared = false;
  let spaceKey;
  let gameEnded = false;

  function preload() {
    this.load.image('lunarBackground', 'assets/panels/lunarBackground.jpg');
    this.load.image('apolloLM', 'assets/panels/lm_lander.png');

    const g = this.make.graphics();
    
    // Particle Dot
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particleDot', 8, 8);
    g.clear();

    // Target Pad (160px)
    g.fillStyle(0x00ff88, 0.25);
    g.fillRect(0, 0, 160, 16);
    g.lineStyle(2, 0x00ff88, 1);
    g.strokeRect(0, 0, 160, 16);
    g.generateTexture('neonPad', 160, 16);
    g.clear();

    // Checkpoint Ring Texture (36x36 Ring)
    g.lineStyle(2, 0x38bdf8, 1);
    g.strokeCircle(18, 18, 16);
    g.fillStyle(0x38bdf8, 0.2);
    g.fillCircle(18, 18, 14);
    g.generateTexture('checkpointRing', 36, 36);
    g.clear();

    // Cleared Checkpoint Ring Texture (Green Ring)
    g.lineStyle(2, 0x4ade80, 1);
    g.strokeCircle(18, 18, 16);
    g.fillStyle(0x4ade80, 0.3);
    g.fillCircle(18, 18, 14);
    g.generateTexture('checkpointCleared', 36, 36);
    g.clear();
  }

  function create() {
    gameEnded = false;
    fuel = 100;
    alarmActive = false;
    alarmCleared = false;
    currentCheckpointIndex = 0;
    checkpoints = [];

    // --- 1. BACKGROUND ---
    if (this.textures.exists('lunarBackground')) {
      const bg = this.add.image(400, 225, 'lunarBackground');
      bg.setDisplaySize(800, 450);
    }

    surfaceLight = this.add.graphics();
    surfaceLight.setVisible(false);

    // --- 2. TARGET LANDING PAD (X = 580, Y = 418) ---
    landingPad = this.physics.add.staticGroup();
    const pad = landingPad.create(580, 418, 'neonPad');
    pad.setDisplaySize(160, 16);
    pad.refreshBody(); // Synchronizes physics body with display size

    this.add.text(515, 424, '▶ TARGET ZONE ◀', { 
      fontSize: '10px', 
      fill: '#00ff88', 
      fontFamily: 'Courier New',
      fontWeight: 'bold' 
    });

    // --- 3. TRAJECTORY CHECKPOINTS (CP-1, CP-2, CP-3) ---
    const cpCoords = [
      { x: 230, y: 120, label: 'CP-1: HIGH GATE' },
      { x: 400, y: 220, label: 'CP-2: APPROACH' },
      { x: 530, y: 320, label: 'CP-3: LOW GATE' }
    ];

    cpCoords.forEach((data, index) => {
      const ring = this.physics.add.sprite(data.x, data.y, 'checkpointRing');
      ring.body.setAllowGravity(false);
      ring.body.setImmovable(true);
      ring.cpIndex = index;
      
      const label = this.add.text(data.x, data.y - 24, data.label, {
        fontSize: '9px',
        fill: '#38bdf8',
        fontFamily: 'Courier New',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      ring.labelText = label;
      checkpoints.push(ring);
    });

    // --- 4. LANDER SPAWN ---
    lander = this.physics.add.sprite(100, 50, 'apolloLM');
    lander.setOrigin(0.5, 0.5);
    lander.setDisplaySize(54, 54);
    
    lander.body.setSize(42, 42);
    lander.body.setOffset(6, 6);

    lander.setCollideWorldBounds(true);
    lander.setBounce(0);
    lander.setDamping(true);
    lander.setDrag(0.98);
    lander.setAngularDrag(140);
    
    lander.setVelocityX(25); // Controlled initial entry drift

    // Particles
    engineParticles = this.add.particles(0, 0, 'particleDot', {
      speed: { min: 100, max: 220 },
      angle: { min: 80, max: 100 },
      scale: { start: 1.2, end: 0 },
      tint: [0xffba08, 0xd97706, 0xef4444],
      lifespan: 300,
      blendMode: 'ADD',
      emitting: false
    });
    engineParticles.startFollow(lander, 0, 22);

    rcsLeftParticles = this.add.particles(0, 0, 'particleDot', {
      speed: { min: 40, max: 80 },
      angle: { min: 170, max: 190 },
      scale: { start: 0.6, end: 0 },
      tint: 0x64ffda,
      lifespan: 180,
      blendMode: 'ADD',
      emitting: false
    });
    rcsLeftParticles.startFollow(lander, 20, -4);

    rcsRightParticles = this.add.particles(0, 0, 'particleDot', {
      speed: { min: 40, max: 80 },
      angle: { min: -10, max: 10 },
      scale: { start: 0.6, end: 0 },
      tint: 0x64ffda,
      lifespan: 180,
      blendMode: 'ADD',
      emitting: false
    });
    rcsRightParticles.startFollow(lander, -20, -4);

    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // --- 5. TELEMETRY HUD ---
    const hudFrame = this.add.graphics();
    hudFrame.fillStyle(0x030712, 0.88);
    hudFrame.lineStyle(1, 0x64ffda, 0.9);
    hudFrame.fillRect(10, 10, 380, 84);
    hudFrame.strokeRect(10, 10, 380, 84);

    fuelText = this.add.text(20, 16, 'PROPELLANT: 100%', { fontSize: '11px', fill: '#64ffda', fontFamily: 'Courier New', fontWeight: 'bold' });
    velYText = this.add.text(20, 30, 'VERT SPEED: 0 m/s (MAX 22)', { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    velXText = this.add.text(20, 44, 'LAT SPEED:  0 m/s (MAX 15)', { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    angleText = this.add.text(20, 58, 'TILT ANGLE: 0°    (MAX ±12°)', { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    checkpointText = this.add.text(20, 72, 'WAYPOINTS:  0 / 3 CLEARED', { fontSize: '11px', fill: '#fbbf24', fontFamily: 'Courier New', fontWeight: 'bold' });

    alarmText = this.add.text(400, 110, '⚠️ DSKY ALARM 1202: EXECUTIVE OVERFLOW! PRESS [SPACE] TO CLEAR ⚠️', {
      fontSize: '11px',
      fill: '#facc15',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      backgroundColor: '#000000d0',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setVisible(false);

    // Overlaps & Colliders
    checkpoints.forEach(ring => {
      this.physics.add.overlap(lander, ring, reachCheckpoint, null, this);
    });

    this.physics.add.collider(lander, landingPad, checkTouchdown, null, this);
  }

  function update() {
    if (gameEnded) return;

    const velY = Math.round(lander.body.velocity.y);
    const velX = Math.round(lander.body.velocity.x);
    let angle = Math.round(Phaser.Math.Angle.WrapDegrees(lander.angle));

    velYText.setText(`VERT SPEED: ${velY} m/s (MAX 22)`);
    velXText.setText(`LAT SPEED:  ${Math.abs(velX)} m/s (MAX 15)`);
    angleText.setText(`TILT ANGLE: ${angle}° (MAX ±12°)`);

    velYText.setStyle({ fill: velY > 22 ? '#ef4444' : '#00ff88' });
    velXText.setStyle({ fill: Math.abs(velX) > 15 ? '#ef4444' : '#00ff88' });
    angleText.setStyle({ fill: Math.abs(angle) > 12 ? '#ef4444' : '#00ff88' });

    // DSKY Alarm Challenge
    if (lander.y > 140 && !alarmActive && !alarmCleared) {
      alarmActive = true;
      alarmText.setVisible(true);
      if (window.audioManager && typeof audioManager.play === "function") {
        audioManager.play('alarm_1202');
      }
    }

    if (alarmActive && Phaser.Input.Keyboard.JustDown(spaceKey)) {
      alarmActive = false;
      alarmCleared = true;
      alarmText.setVisible(false);
    }

    // Low Fuel Challenge
    if (fuel <= 15 && fuel > 0) {
      fuelText.setStyle({ fill: '#ef4444' });
      fuelText.setText(`PROPELLANT: ${Math.round(fuel)}% (LOW FUEL BINGO!)`);
    }

    // MAIN ENGINE THRUST
    if (cursors.up.isDown && fuel > 0) {
      const angleRad = Phaser.Math.DegToRad(lander.angle - 90);
      const thrustPower = 150;
      lander.setAccelerationX(Math.cos(angleRad) * thrustPower);
      lander.setAccelerationY(Math.sin(angleRad) * thrustPower);

      fuel -= 0.28;
      if (fuel > 15) {
        fuelText.setText(`PROPELLANT: ${Math.max(0, Math.round(fuel))}%`);
      }
      engineParticles.emitting = true;

      surfaceLight.clear();
      surfaceLight.fillStyle(0xf59e0b, Math.max(0, (lander.y - 100) / 400 * 0.4));
      surfaceLight.fillCircle(lander.x, lander.y + 35, 60);
      surfaceLight.setVisible(true);

      if (window.audioManager && typeof audioManager.play === "function") {
        audioManager.play('ui_hover');
      }
    } else {
      lander.setAcceleration(0, 0);
      engineParticles.emitting = false;
      surfaceLight.setVisible(false);
    }

    // RCS ROTATION CONTROLS
    if (cursors.left.isDown && fuel > 0) {
      lander.setAngularVelocity(-70);
      fuel -= 0.05;
      rcsLeftParticles.emitting = true;
    } else if (cursors.right.isDown && fuel > 0) {
      lander.setAngularVelocity(70);
      fuel -= 0.05;
      rcsRightParticles.emitting = true;
    } else {
      lander.setAngularVelocity(0);
      rcsLeftParticles.emitting = false;
      rcsRightParticles.emitting = false;
    }

    // Boulder crash if missing designated pad
    if (lander.body.blocked.down && !gameEnded) {
      handleCrash("BOULDER IMPACT: Struck West Crater boulder field!");
    }
  }

  function reachCheckpoint(lander, checkpoint) {
    if (checkpoint.cpIndex === currentCheckpointIndex) {
      checkpoint.setTexture('checkpointCleared');
      checkpoint.labelText.setStyle({ fill: '#4ade80' });
      checkpoint.labelText.setText(`${checkpoint.labelText.text} ✓`);
      
      currentCheckpointIndex++;
      checkpointText.setText(`WAYPOINTS:  ${currentCheckpointIndex} / 3 CLEARED`);

      if (currentCheckpointIndex === 3) {
        checkpointText.setStyle({ fill: '#00ff88' });
      }

      if (window.audioManager && typeof audioManager.play === "function") {
        audioManager.play('ui_click');
      }
    }
  }

  function checkTouchdown() {
    if (gameEnded) return;

    const speedY = Math.abs(lander.body.velocity.y);
    const speedX = Math.abs(lander.body.velocity.x);
    const angle = Math.abs(Phaser.Math.Angle.WrapDegrees(lander.angle));

    // CHECKPOINT REQUIREMENT VERIFICATION
    if (currentCheckpointIndex < 3) {
      handleCrash(`APPROACH FAULT: Missed flight corridor waypoints (${currentCheckpointIndex}/3 cleared)!`);
      return;
    }

    // PHYSICAL TOLERANCE VERIFICATION
    if (speedY <= 22 && speedX <= 15 && angle <= 12) {
      gameEnded = true;
      stopParticles();

      lander.setVelocity(0, 0);
      lander.setAcceleration(0, 0);
      lander.setAngularVelocity(0);

      velYText.setText("TOUCHDOWN SUCCESSFUL! Tranquility Base Station Secured!");
      velYText.setStyle({ fill: '#00ff88' });

      setTimeout(() => {
        closeMiniGame();
        if (typeof onSuccessCallback === "function") onSuccessCallback();
      }, 2000);
    } else {
      let failReason = "";
      if (angle > 12) {
        failReason = `TIP-OVER CRASH: Tilt angle (${angle}°) exceeded 12° limit!`;
      } else if (speedY > 22) {
        failReason = `HARD IMPACT: Vertical speed (${Math.round(speedY)} m/s) exceeded 22 m/s!`;
      } else if (speedX > 15) {
        failReason = `SHEAR CRASH: Lateral velocity (${Math.round(speedX)} m/s) sheared landing legs!`;
      }

      handleCrash(failReason);
    }
  }

  function handleCrash(reason) {
    if (gameEnded) return;
    gameEnded = true;
    stopParticles();

    velYText.setText(`CRITICAL FAILURE: ${reason}`);
    velYText.setStyle({ fill: '#ef4444' });

    setTimeout(() => {
      closeMiniGame();
      if (typeof onFailureCallback === "function") onFailureCallback();
    }, 2400);
  }

  function stopParticles() {
    engineParticles.emitting = false;
    rcsLeftParticles.emitting = false;
    rcsRightParticles.emitting = false;
    surfaceLight.setVisible(false);
  }

  function closeMiniGame() {
    if (activePhaserGame) {
      activePhaserGame.destroy(true);
      activePhaserGame = null;
    }
    if (canvasView) canvasView.classList.add("hidden");
    if (panelBox) panelBox.classList.remove("hidden");
    if (choicesContainer) choicesContainer.classList.remove("hidden");
  }

  activePhaserGame = new Phaser.Game(config);
}
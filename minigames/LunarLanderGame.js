// ==========================================
// PHASER 3 MINI-GAME: APOLLO / LUNAR ROVER LANDER
// ==========================================
let activePhaserGame = null;

function launchLanderMiniGame(onSuccessCallback, onFailureCallback) {
  const panelBox = document.getElementById("panel-box");
  const captionBox = document.getElementById("caption-box");
  const hudOverlay = document.getElementById("hud-overlay");
  const choicesContainer = document.getElementById("choices-container");
  const canvasView = document.getElementById("canvas-view");

  // Prevent canvas duplication / memory leaks
  const container = document.getElementById("phaser-game-container");
  if (container) container.innerHTML = "";

  if (panelBox) panelBox.classList.add("hidden");
  if (captionBox) captionBox.classList.add("hidden");
  if (hudOverlay) hudOverlay.classList.add("hidden");
  if (choicesContainer) choicesContainer.classList.add("hidden");
  if (canvasView) canvasView.classList.remove("hidden");

  if (activePhaserGame) {
    activePhaserGame.destroy(true);
    activePhaserGame = null;
  }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: 'phaser-game-container',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 25 },
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
  let landingPadObj;
  let landingText;
  let engineParticles;
  let rcsLeftParticles;
  let rcsRightParticles;
  let checkpoints = [];
  let farLeftReached = false;
  let fuel = 100;
  let fuelText;
  let velYText;
  let velXText;
  let angleText;
  let statusText;
  let gameEnded = false;

  // Touch & Gyro Control States
  let touchUp = false;
  let touchLeft = false;
  let touchRight = false;
  let gyroTiltX = 0; // Gamma: Left/Right tilt
  let gyroTiltY = 0; // Beta: Forward/Back tilt
  let gyroActive = false;

  function handleOrientation(event) {
    gyroTiltX = event.gamma || 0;
    gyroTiltY = event.beta || 0;
    gyroActive = true;
  }

  function preload() {
    this.load.image('lunarBackground', 'assets/panels/lunarBackground.jpg');
    this.load.image('apolloLM', 'assets/panels/lm_lander.png');

    const g = this.make.graphics();
    // Particle Dot
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particleDot', 8, 8);
    g.clear();

    // White Landing Zone
    g.fillStyle(0xffffff, 0.35);
    g.fillRect(0, 0, 180, 40);
    g.lineStyle(3, 0xffffff, 1);
    g.strokeRect(0, 0, 180, 40);
    g.generateTexture('whiteLandingPad', 180, 40);
    g.clear();

    // Green Checkpoint (Safe Waypoint)
    g.lineStyle(3, 0x00ff88, 1);
    g.strokeCircle(18, 18, 16);
    g.fillStyle(0x00ff88, 0.25);
    g.fillCircle(18, 18, 14);
    g.generateTexture('checkpointGreen', 36, 36);
    g.clear();

    // Red Checkpoint (Crash Hazard Zone)
    g.lineStyle(3, 0xef4444, 1);
    g.strokeCircle(18, 18, 16);
    g.fillStyle(0xef4444, 0.35);
    g.fillCircle(18, 18, 14);
    g.generateTexture('checkpointRed', 36, 36);
    g.clear();

    // Cleared Checkpoint Ring
    g.lineStyle(3, 0x38bdf8, 1);
    g.strokeCircle(18, 18, 16);
    g.fillStyle(0x38bdf8, 0.4);
    g.fillCircle(18, 18, 14);
    g.generateTexture('checkpointCleared', 36, 36);
    g.clear();
  }

  function create() {
    gameEnded = false;
    fuel = 100;
    farLeftReached = false;
    checkpoints = [];
    gyroActive = false;

    // --- 1. BACKGROUND ---
    if (this.textures.exists('lunarBackground')) {
      const bg = this.add.image(400, 225, 'lunarBackground');
      bg.setDisplaySize(800, 450);
    }

    // --- 2. WHITE LANDING ZONE (HIDDEN UNTIL CP-2 TOUCHED) ---
    landingPad = this.physics.add.staticGroup();
    landingPadObj = landingPad.create(680, 260, 'whiteLandingPad');
    landingPadObj.setDisplaySize(180, 40);
    landingPadObj.refreshBody();
    landingPadObj.setVisible(false); // Initially Hidden
    landingPadObj.body.enable = false; // Initially Disabled Collision

    landingText = this.add.text(680, 260, '▶ LANDING ZONE ◀', {
      fontSize: '11px',
      fill: '#ffffff',
      fontFamily: 'Courier New',
      fontWeight: 'bold'
    }).setOrigin(0.5).setVisible(false);

    // --- 3. CHECKPOINTS & DANGER HAZARD ZONES ---
    const cpCoords = [
      { x: 375, y: 105, label: 'CP-1', isFarLeft: false, isHazard: false },
      { x: 60,  y: 110, label: 'CP-2 (FAR LEFT)', isFarLeft: true, isHazard: false },
      { x: 250, y: 290, label: '⚠️ DANGER: BOULDERS', isFarLeft: false, isHazard: true },
      { x: 470, y: 375, label: '⚠️ DANGER: CRATER', isFarLeft: false, isHazard: true }
    ];

    cpCoords.forEach((data, index) => {
      const textureKey = data.isHazard ? 'checkpointRed' : 'checkpointGreen';
      const ring = this.physics.add.sprite(data.x, data.y, textureKey);
      ring.body.setAllowGravity(false);
      ring.body.setImmovable(true);
      ring.cpIndex = index;
      ring.isFarLeft = data.isFarLeft;
      ring.isHazard = data.isHazard;

      const labelColor = data.isHazard ? '#ef4444' : '#00ff88';
      const label = this.add.text(data.x, data.y - 22, data.label, {
        fontSize: '9px',
        fill: labelColor,
        fontFamily: 'Courier New',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      ring.labelText = label;
      checkpoints.push(ring);
    });

    // --- 4. ROVER/LANDER STARTING POSITION (RED BOX TOP RIGHT) ---
    lander = this.physics.add.sprite(720, 60, 'apolloLM');
    lander.setOrigin(0.5, 0.5);
    lander.setDisplaySize(48, 48);
    lander.body.setSize(38, 38);
    lander.setCollideWorldBounds(true);
    lander.setBounce(0.1);
    lander.setDamping(true);
    lander.setDrag(0.98);
    lander.setAngularDrag(150);

    // Visual Spawn Indicator (Red Box Outline)
    const startBox = this.add.graphics();
    startBox.lineStyle(2, 0xff0000, 0.8);
    startBox.strokeRect(690, 30, 60, 60);

    // Particle FX
    engineParticles = this.add.particles(0, 0, 'particleDot', {
      speed: { min: 80, max: 160 },
      angle: { min: 80, max: 100 },
      scale: { start: 1.2, end: 0 },
      tint: [0xffba08, 0xef4444],
      lifespan: 250,
      blendMode: 'ADD',
      emitting: false
    });
    engineParticles.startFollow(lander, 0, 20);

    rcsLeftParticles = this.add.particles(0, 0, 'particleDot', {
      speed: { min: 40, max: 80 },
      angle: { min: 170, max: 190 },
      scale: { start: 0.6, end: 0 },
      tint: 0x64ffda,
      lifespan: 150,
      blendMode: 'ADD',
      emitting: false
    });
    rcsLeftParticles.startFollow(lander, 18, -4);

    rcsRightParticles = this.add.particles(0, 0, 'particleDot', {
      speed: { min: 40, max: 80 },
      angle: { min: -10, max: 10 },
      scale: { start: 0.6, end: 0 },
      tint: 0x64ffda,
      lifespan: 150,
      blendMode: 'ADD',
      emitting: false
    });
    rcsRightParticles.startFollow(lander, -18, -4);

    cursors = this.input.keyboard.createCursorKeys();

    // --- 5. TELEMETRY HUD ---
    const hudFrame = this.add.graphics();
    hudFrame.fillStyle(0x030712, 0.88);
    hudFrame.lineStyle(1, 0x64ffda, 0.9);
    hudFrame.fillRect(10, 10, 420, 84);
    hudFrame.strokeRect(10, 10, 420, 84);

    fuelText = this.add.text(20, 16, 'PROPELLANT: 100%', { fontSize: '11px', fill: '#64ffda', fontFamily: 'Courier New', fontWeight: 'bold' });
    velYText = this.add.text(20, 30, 'VERT SPEED: 0 m/s', { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    velXText = this.add.text(20, 44, 'LAT SPEED: 0 m/s', { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    angleText = this.add.text(20, 58, 'TILT ANGLE: 0°', { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    statusText = this.add.text(20, 72, 'MISSION: FLY TO FAR-LEFT CHECKPOINT TO UNLOCK LANDING ZONE', { fontSize: '9px', fill: '#fbbf24', fontFamily: 'Courier New', fontWeight: 'bold' });

    // Collisions & Overlaps
    checkpoints.forEach(ring => {
      this.physics.add.overlap(lander, ring, reachCheckpoint, null, this);
    });

    this.physics.add.collider(lander, landingPad, checkTouchdown, null, this);

    // --- 6. MOBILE TOUCH CONTROLS & GYRO INITIALIZATION ---
    if (this.sys.game.device.input.touch) {
      // Left RCS Button
      const leftBtn = this.add.text(60, 390, '◀ RCS', {
        fontSize: '16px',
        fill: '#64ffda',
        backgroundColor: '#030712d0',
        padding: { x: 14, y: 10 }
      }).setOrigin(0.5).setInteractive();

      leftBtn.on('pointerdown', () => { touchLeft = true; });
      leftBtn.on('pointerup', () => { touchLeft = false; });
      leftBtn.on('pointerout', () => { touchLeft = false; });

      // Right RCS Button
      const rightBtn = this.add.text(160, 390, 'RCS ▶', {
        fontSize: '16px',
        fill: '#64ffda',
        backgroundColor: '#030712d0',
        padding: { x: 14, y: 10 }
      }).setOrigin(0.5).setInteractive();

      rightBtn.on('pointerdown', () => { touchRight = true; });
      rightBtn.on('pointerup', () => { touchRight = false; });
      rightBtn.on('pointerout', () => { touchRight = false; });

      // Main Thruster Button
      const thrustBtn = this.add.text(710, 390, '🔥 THRUST', {
        fontSize: '18px',
        fill: '#00ff88',
        backgroundColor: '#030712d0',
        padding: { x: 18, y: 12 }
      }).setOrigin(0.5).setInteractive();

      thrustBtn.on('pointerdown', () => { touchUp = true; });
      thrustBtn.on('pointerup', () => { touchUp = false; });
      thrustBtn.on('pointerout', () => { touchUp = false; });
    }

    // Request Gyroscope Permission / Bind Listeners
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const gyroBtn = this.add.text(400, 390, '📱 GYRO CONTROLS', {
          fontSize: '13px',
          fill: '#64ffda',
          backgroundColor: '#030712d0',
          padding: { x: 12, y: 8 }
        }).setOrigin(0.5).setInteractive();

        gyroBtn.on('pointerdown', () => {
          DeviceOrientationEvent.requestPermission()
            .then(response => {
              if (response === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                gyroBtn.destroy();
              }
            })
            .catch(console.error);
        });
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }
  }

  function update() {
    if (gameEnded) return;

    const velY = Math.round(lander.body.velocity.y);
    const velX = Math.round(lander.body.velocity.x);
    let angle = Math.round(Phaser.Math.Angle.WrapDegrees(lander.angle));

    velYText.setText(`VERT SPEED: ${velY} m/s (MAX 35)`);
    velXText.setText(`LAT SPEED: ${Math.abs(velX)} m/s (MAX 25)`);
    angleText.setText(`TILT ANGLE: ${angle}° (MAX ±20°)`);

    // ZERO FUEL / PROPELLANT EXHAUSTION FAILURE
    if (fuel <= 0 && !lander.body.blocked.down) {
      fuel = 0;
      fuelText.setText('PROPELLANT: 0% (DEPLETED!)');
      fuelText.setStyle({ fill: '#ef4444' });

      handleCrash("PROPELLANT DEPLETED: Lander lost main thruster authority!");
      return;
    }

    // GYRO INPUT EVALUATION
    const isGyroThrusting = gyroActive && gyroTiltY < 25;
    const isGyroLeft = gyroActive && gyroTiltX < -10;
    const isGyroRight = gyroActive && gyroTiltX > 10;

    // MAIN ENGINE THRUST (Keyboard, Touch Button, or Gyro Tilt)
    if ((cursors.up.isDown || touchUp || isGyroThrusting) && fuel > 0) {
      const angleRad = Phaser.Math.DegToRad(lander.angle - 90);
      const thrustPower = 135;
      lander.setAccelerationX(Math.cos(angleRad) * thrustPower);
      lander.setAccelerationY(Math.sin(angleRad) * thrustPower);
      fuel -= 0.10;

      fuelText.setText(`PROPELLANT: ${Math.max(0, Math.round(fuel))}%`);
      engineParticles.emitting = true;

      if (window.audioManager && typeof audioManager.play === "function") {
        audioManager.play('ui_hover');
      }
    } else {
      lander.setAcceleration(0, 0);
      engineParticles.emitting = false;
    }

    // RCS ROTATION CONTROLS (Keyboard, Touch Buttons, or Gyro Tilt)
    if ((cursors.left.isDown || touchLeft || isGyroLeft) && fuel > 0) {
      lander.setAngularVelocity(-65);
      fuel -= 0.02;
      rcsLeftParticles.emitting = true;
    } else if ((cursors.right.isDown || touchRight || isGyroRight) && fuel > 0) {
      lander.setAngularVelocity(65);
      fuel -= 0.02;
      rcsRightParticles.emitting = true;
    } else {
      lander.setAngularVelocity(0);
      rcsLeftParticles.emitting = false;
      rcsRightParticles.emitting = false;
    }
  }

  function reachCheckpoint(lander, checkpoint) {
    if (gameEnded) return;

    // Trigger instant crash on Red Hazard Checkpoints (CP-3 & CP-4)
    if (checkpoint.isHazard) {
      handleCrash(`COLLISION FAULT: Struck hazard site (${checkpoint.labelText.text})!`);
      return;
    }

    // Safe Checkpoint Logic (CP-1 & CP-2)
    if (!checkpoint.cleared) {
      checkpoint.cleared = true;
      checkpoint.setTexture('checkpointCleared');
      checkpoint.labelText.setStyle({ fill: '#38bdf8' });
      checkpoint.labelText.setText(`${checkpoint.labelText.text} ✓`);

      if (checkpoint.isFarLeft) {
        farLeftReached = true;
        landingPadObj.setVisible(true);
        landingPadObj.body.enable = true;
        landingText.setVisible(true);

        statusText.setText('TARGET UNLOCKED! AVOID HAZARDS AND LAND ON THE WHITE ZONE');
        statusText.setStyle({ fill: '#00ff88' });
      }

      if (window.audioManager && typeof audioManager.play === "function") {
        audioManager.play('ui_click');
      }
    }
  }

  function checkTouchdown() {
    if (gameEnded) return;

    if (!farLeftReached) {
      handleCrash("ABORT: You must reach the far-left checkpoint before landing!");
      return;
    }

    const speedY = Math.abs(lander.body.velocity.y);
    const speedX = Math.abs(lander.body.velocity.x);
    const angle = Math.abs(Phaser.Math.Angle.WrapDegrees(lander.angle));

    if (speedY <= 35 && speedX <= 25 && angle <= 20) {
      gameEnded = true;
      stopParticles();
      lander.setVelocity(0, 0);
      lander.setAcceleration(0, 0);
      lander.setAngularVelocity(0);

      statusText.setText("TOUCHDOWN SUCCESSFUL! LANDING SITE SECURED!");
      statusText.setStyle({ fill: '#00ff88' });

      setTimeout(() => {
        closeMiniGame();
        if (typeof onSuccessCallback === "function") onSuccessCallback();
      }, 1500);
    } else {
      let failReason = "";
      if (angle > 20) failReason = `TIP-OVER CRASH: Tilt angle (${angle}°) exceeded limit!`;
      else if (speedY > 35) failReason = `HARD IMPACT: Vertical speed (${Math.round(speedY)} m/s) too fast!`;
      else if (speedX > 25) failReason = `SHEAR CRASH: Lateral speed (${Math.round(speedX)} m/s) too fast!`;
      handleCrash(failReason);
    }
  }

  function handleCrash(reason) {
    if (gameEnded) return;
    gameEnded = true;
    stopParticles();
    statusText.setText(`CRITICAL FAILURE: ${reason}`);
    statusText.setStyle({ fill: '#ef4444' });

    setTimeout(() => {
      closeMiniGame();
      if (typeof onFailureCallback === "function") onFailureCallback();
    }, 1800);
  }

  function stopParticles() {
    engineParticles.emitting = false;
    rcsLeftParticles.emitting = false;
    rcsRightParticles.emitting = false;
  }

  function closeMiniGame() {
    window.removeEventListener('deviceorientation', handleOrientation);
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
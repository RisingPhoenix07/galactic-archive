// ==========================================
// PHASER 3 MINI-GAME: APOLLO / LUNAR ROVER LANDER
// ==========================================
let activePhaserGame = null;

function launchLanderMiniGame(onSuccessCallback, onFailureCallback, assistCfg = null) {
  const panelBox = document.getElementById("panel-box");
  const captionBox = document.getElementById("caption-box");
  const hudOverlay = document.getElementById("hud-overlay");
  const choicesContainer = document.getElementById("choices-container");
  const canvasView = document.getElementById("canvas-view");

  // Adaptive Flight Computer Assist scaling
  const resolvedAssist = assistCfg ||
    ((window.assistManager && typeof assistManager.getAssistConfig === "function")
      ? assistManager.getAssistConfig("LAUNCH_LANDER_MINIGAME")
      : { difficultyScale: 1.0, toleranceBoost: 1.0, hudTag: "" });

  const scale = resolvedAssist.difficultyScale || 1.0;
  const boost = resolvedAssist.toleranceBoost || 1.0;
  const hudTag = resolvedAssist.hudTag || "";

  const maxVertSpeed = Math.round(55 * boost);
  const maxLatSpeed = Math.round(45 * boost);
  const maxTiltAngle = Math.round(28 * boost);
  const lunarGravity = Math.round(20 * scale);
  const fuelBurnRate = 0.055 * scale;

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
        gravity: { y: lunarGravity },
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
  let wasd;
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
  let gyroTiltX = 0;
  let gyroTiltY = 0;
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

    // White Landing Zone (Wider 210px target pad for fairer landings)
    g.fillStyle(0x00ff88, 0.25);
    g.fillRect(0, 0, 210, 40);
    g.lineStyle(3, 0x00ff88, 1);
    g.strokeRect(0, 0, 210, 40);
    g.generateTexture('whiteLandingPad', 210, 40);
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

    // --- 2. LANDING ZONE (HIDDEN UNTIL CP-2 TOUCHED) ---
    landingPad = this.physics.add.staticGroup();
    landingPadObj = landingPad.create(670, 265, 'whiteLandingPad');
    landingPadObj.setDisplaySize(210, 40);
    landingPadObj.refreshBody();
    landingPadObj.setVisible(false);
    landingPadObj.body.enable = false;

    landingText = this.add.text(670, 265, '▶ TRANQUILITY PAD ◀', {
      fontSize: '11px',
      fill: '#00ff88',
      fontFamily: 'Courier New',
      fontWeight: 'bold'
    }).setOrigin(0.5).setVisible(false);

    // --- 3. CHECKPOINTS & DANGER HAZARD ZONES ---
    const cpCoords = [
      { x: 375, y: 105, label: 'CP-1', isFarLeft: false, isHazard: false },
      { x: 65,  y: 110, label: 'CP-2 (FAR LEFT)', isFarLeft: true, isHazard: false },
      { x: 250, y: 300, label: '⚠️ DANGER: BOULDERS', isFarLeft: false, isHazard: true },
      { x: 465, y: 380, label: '⚠️ DANGER: CRATER', isFarLeft: false, isHazard: true }
    ];

    cpCoords.forEach((data, index) => {
      const textureKey = data.isHazard ? 'checkpointRed' : 'checkpointGreen';
      const ring = this.physics.add.sprite(data.x, data.y, textureKey);
      ring.body.setAllowGravity(false);
      ring.body.setImmovable(true);

      // Circular hitboxes: generous pickup radius for green checkpoints, fair inner radius for red hazards
      if (data.isHazard) {
        const hazardRadius = Math.max(8, Math.round(12 / boost));
        ring.body.setCircle(hazardRadius, 18 - hazardRadius, 18 - hazardRadius);
      } else {
        ring.body.setCircle(22, -4, -4);
      }

      ring.cpIndex = index;
      ring.isFarLeft = data.isFarLeft;
      ring.isHazard = data.isHazard;

      const labelColor = data.isHazard ? '#ef4444' : '#00ff88';
      const label = this.add.text(data.x, data.y - 24, data.label, {
        fontSize: '9px',
        fill: labelColor,
        fontFamily: 'Courier New',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      ring.labelText = label;
      checkpoints.push(ring);
    });

    // --- 4. ROVER/LANDER STARTING POSITION ---
    lander = this.physics.add.sprite(720, 60, 'apolloLM');
    lander.setOrigin(0.5, 0.5);
    lander.setDisplaySize(48, 48);
    lander.body.setSize(34, 34);
    lander.setCollideWorldBounds(true);
    lander.setBounce(0.05);
    lander.setDamping(true);
    lander.setDrag(0.86, 0.94);
    lander.setMaxVelocity(180, 180);

    // Visual Spawn Indicator
    const startBox = this.add.graphics();
    startBox.lineStyle(2, 0x64ffda, 0.6);
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
    wasd = this.input.keyboard.addKeys('W,A,S,D');

    // --- 5. TELEMETRY HUD ---
    const hudFrame = this.add.graphics();
    hudFrame.fillStyle(0x030712, 0.88);
    hudFrame.lineStyle(1, 0x64ffda, 0.9);
    hudFrame.fillRect(10, 10, 465, 84);
    hudFrame.strokeRect(10, 10, 465, 84);

    fuelText = this.add.text(20, 16, `PROPELLANT: 100%${hudTag}`, { fontSize: '11px', fill: '#64ffda', fontFamily: 'Courier New', fontWeight: 'bold' });
    velYText = this.add.text(20, 30, `VERT SPEED: 0 m/s (MAX ${maxVertSpeed})`, { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    velXText = this.add.text(20, 44, `LAT SPEED: 0 m/s (MAX ${maxLatSpeed})`, { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    angleText = this.add.text(20, 58, `TILT ANGLE: 0° (MAX ±${maxTiltAngle}°)`, { fontSize: '11px', fill: '#ffffff', fontFamily: 'Courier New' });
    statusText = this.add.text(20, 72, 'MISSION: FLY TO CP-2 (FAR LEFT) TO UNLOCK LANDING PAD', { fontSize: '9px', fill: '#fbbf24', fontFamily: 'Courier New', fontWeight: 'bold' });

    // Collisions & Overlaps
    checkpoints.forEach(ring => {
      this.physics.add.overlap(lander, ring, reachCheckpoint, null, this);
    });

    this.physics.add.collider(lander, landingPad, checkTouchdown, null, this);

    // --- 6. MOBILE TOUCH CONTROLS & GYRO INITIALIZATION ---
    if (this.sys.game.device.input.touch) {
      const leftBtn = this.add.text(60, 390, '◀ RCS', {
        fontSize: '16px', fill: '#64ffda', backgroundColor: '#030712d0', padding: { x: 14, y: 10 }
      }).setOrigin(0.5).setInteractive();
      leftBtn.on('pointerdown', () => { touchLeft = true; });
      leftBtn.on('pointerup', () => { touchLeft = false; });
      leftBtn.on('pointerout', () => { touchLeft = false; });

      const rightBtn = this.add.text(160, 390, 'RCS ▶', {
        fontSize: '16px', fill: '#64ffda', backgroundColor: '#030712d0', padding: { x: 14, y: 10 }
      }).setOrigin(0.5).setInteractive();
      rightBtn.on('pointerdown', () => { touchRight = true; });
      rightBtn.on('pointerup', () => { touchRight = false; });
      rightBtn.on('pointerout', () => { touchRight = false; });

      const thrustBtn = this.add.text(710, 390, '🔥 THRUST', {
        fontSize: '18px', fill: '#00ff88', backgroundColor: '#030712d0', padding: { x: 18, y: 12 }
      }).setOrigin(0.5).setInteractive();
      thrustBtn.on('pointerdown', () => { touchUp = true; });
      thrustBtn.on('pointerup', () => { touchUp = false; });
      thrustBtn.on('pointerout', () => { touchUp = false; });
    }

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const gyroBtn = this.add.text(400, 390, '📱 GYRO CONTROLS', {
          fontSize: '13px', fill: '#64ffda', backgroundColor: '#030712d0', padding: { x: 12, y: 8 }
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

    velYText.setText(`VERT SPEED: ${velY} m/s (MAX ${maxVertSpeed})`).setStyle({ fill: velY <= maxVertSpeed ? '#00ff88' : '#ef4444' });
    velXText.setText(`LAT SPEED: ${Math.abs(velX)} m/s (MAX ${maxLatSpeed})`).setStyle({ fill: Math.abs(velX) <= maxLatSpeed ? '#00ff88' : '#ef4444' });
    angleText.setText(`TILT ANGLE: ${angle}° (MAX ±${maxTiltAngle}°)`).setStyle({ fill: Math.abs(angle) <= maxTiltAngle ? '#00ff88' : '#ef4444' });

    // LANDING ZONE REGOLITH FRICTION
    const onLandingPad = landingPadObj.body.enable &&
      (lander.body.touching.down || lander.body.blocked.down) &&
      Math.abs(lander.x - landingPadObj.x) <= 110;

    if (onLandingPad) {
      lander.setDrag(0.02, 0.95);
      if (Math.abs(lander.body.velocity.x) < 10) {
        lander.setVelocityX(0);
      }
    } else {
      lander.setDrag(0.86, 0.94);
    }

    // ZERO FUEL CHECK
    if (fuel <= 0 && !lander.body.blocked.down) {
      fuel = 0;
      fuelText.setText(`PROPELLANT: 0% (DEPLETED!)${hudTag}`);
      fuelText.setStyle({ fill: '#ef4444' });
      handleCrash.call(this, "PROPELLANT DEPLETED: Lander lost main thruster authority!");
      return;
    }

    // INPUT EVALUATION (Supports Arrow Keys + WASD + Touch + Gyro)
    const isGyroThrusting = gyroActive && gyroTiltY < 25;
    const isGyroLeft = gyroActive && gyroTiltX < -10;
    const isGyroRight = gyroActive && gyroTiltX > 10;

    const thrustPressed = cursors.up.isDown || wasd.W.isDown || touchUp || isGyroThrusting;
    const leftPressed = cursors.left.isDown || wasd.A.isDown || touchLeft || isGyroLeft;
    const rightPressed = cursors.right.isDown || wasd.D.isDown || touchRight || isGyroRight;

    // MAIN ENGINE THRUST
    if (thrustPressed && fuel > 0) {
      const angleRad = Phaser.Math.DegToRad(lander.angle - 90);
      const thrustPower = 175;
      lander.setAccelerationX(Math.cos(angleRad) * thrustPower);
      lander.setAccelerationY(Math.sin(angleRad) * thrustPower);
      fuel -= fuelBurnRate;

      fuelText.setText(`PROPELLANT: ${Math.max(0, Math.round(fuel))}%${hudTag}`);
      engineParticles.emitting = true;
    } else {
      lander.setAcceleration(0, 0);
      engineParticles.emitting = false;
    }

    // RCS ROTATION + P66 AUTO-STABILIZER ASSIST
    if (leftPressed && fuel > 0) {
      lander.setAngularVelocity(-110);
      fuel -= 0.01 * scale;
      rcsLeftParticles.emitting = true;
      rcsRightParticles.emitting = false;
    } else if (rightPressed && fuel > 0) {
      lander.setAngularVelocity(110);
      fuel -= 0.01 * scale;
      rcsRightParticles.emitting = true;
      rcsLeftParticles.emitting = false;
    } else {
      rcsLeftParticles.emitting = false;
      rcsRightParticles.emitting = false;
      const currentDeg = Phaser.Math.Angle.WrapDegrees(lander.angle);
      if (Math.abs(currentDeg) > 1.5) {
        lander.setAngularVelocity(-currentDeg * 2.2);
      } else {
        lander.setAngularVelocity(0);
        lander.setAngle(0);
      }
    }
  }

  function reachCheckpoint(landerObj, checkpoint) {
    if (gameEnded) return;

    if (checkpoint.isHazard) {
      handleCrash.call(this, `COLLISION FAULT: Struck hazard site (${checkpoint.labelText.text})!`);
      return;
    }

    if (!checkpoint.cleared) {
      checkpoint.cleared = true;
      checkpoint.setTexture('checkpointCleared');
      checkpoint.labelText.setStyle({ fill: '#38bdf8' });
      checkpoint.labelText.setText(`${checkpoint.labelText.text} ✓`);

      this.tweens.add({
        targets: checkpoint,
        scale: 1.25,
        duration: 180,
        yoyo: true
      });

      if (checkpoint.isFarLeft) {
        farLeftReached = true;
        landingPadObj.setVisible(true);
        landingPadObj.body.enable = true;
        landingText.setVisible(true);

        statusText.setText('PAD UNLOCKED! FLY RIGHT & LAND GENTLY ON THE GREEN PAD');
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
      handleCrash.call(this, "ABORT: Reach CP-2 (Far Left) first to unlock Tranquility Pad!");
      return;
    }

    const speedY = Math.abs(lander.body.velocity.y);
    const speedX = Math.abs(lander.body.velocity.x);
    const angle = Math.abs(Phaser.Math.Angle.WrapDegrees(lander.angle));

    if (speedY <= maxVertSpeed && speedX <= maxLatSpeed && angle <= maxTiltAngle) {
      gameEnded = true;
      stopParticles();
      lander.setVelocity(0, 0);
      lander.setAcceleration(0, 0);
      lander.setAngularVelocity(0);
      lander.body.setAllowGravity(false);

      this.tweens.add({
        targets: lander,
        angle: 0,
        y: landingPadObj.y - 36,
        duration: 350,
        ease: 'Back.easeOut'
      });

      const dustBurst = this.add.particles(lander.x, landingPadObj.y - 18, 'particleDot', {
        speed: { min: 30, max: 110 },
        angle: { min: 190, max: 350 },
        scale: { start: 1.4, end: 0 },
        tint: [0xcbd5e1, 0x94a3b8],
        lifespan: 700,
        quantity: 22,
        emitting: false
      });
      dustBurst.explode(22);

      statusText.setText("🏆 CONTACT LIGHT! THE EAGLE HAS LANDED!");
      statusText.setStyle({ fill: '#00ff88' });

      if (window.audioManager && typeof audioManager.play === "function") {
        audioManager.play('choice_confirm');
      }

      setTimeout(() => {
        closeMiniGame();
        if (typeof onSuccessCallback === "function") onSuccessCallback();
      }, 1800);
    } else {
      let failReason = "";
      if (angle > maxTiltAngle) failReason = `TIP-OVER CRASH: Tilt angle (${Math.round(angle)}°) exceeded ±${maxTiltAngle}°!`;
      else if (speedY > maxVertSpeed) failReason = `HARD IMPACT: Vertical speed (${Math.round(speedY)} m/s) exceeded ${maxVertSpeed} m/s!`;
      else if (speedX > maxLatSpeed) failReason = `SHEAR CRASH: Lateral speed (${Math.round(speedX)} m/s) exceeded ${maxLatSpeed} m/s!`;
      handleCrash.call(this, failReason);
    }
  }

  function handleCrash(reason) {
    if (gameEnded) return;
    gameEnded = true;
    stopParticles();
    this.cameras.main.shake(450, 0.015);
    statusText.setText(`CRITICAL FAILURE: ${reason}`);
    statusText.setStyle({ fill: '#ef4444' });

    setTimeout(() => {
      closeMiniGame();
      if (typeof onFailureCallback === "function") onFailureCallback(reason);
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
  }

  activePhaserGame = new Phaser.Game(config);
}
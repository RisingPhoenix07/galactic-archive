function startMarsSkyCraneMiniGame(container, config, onWin, onLoss) {
  const width = container.clientWidth > 100 ? container.clientWidth : 800;
  const height = container.clientHeight > 100 ? container.clientHeight : 450;

  let fuel = 100, windForce = 0, isStarted = false, isGameOver = false;
  let crane, craneVisual, beaconRing, thrusterGlow, pad, padVisual, hudText, statusBanner, briefingOverlay, cursors, wasd, spaceKey;

  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: container, width: width, height: height, backgroundColor: '#1f0d08',
    physics: { default: 'arcade', arcade: { gravity: { y: 34 }, debug: false } }, // Gentler Martian gravity
    scene: { preload: preload, create: create, update: update }
  });

  function preload() {
    this.load.image('m6_bg', 'assets/minigames/m6_mars_bg.jpg');
    this.load.image('skycrane_sprite', 'assets/minigames/mars_skycrane.png');
  }

  // Strip pure chroma-key green background without clipping dark metallic hull pixels
  function makeGreenTransparent(scene, sourceKey, cleanKey) {
    const srcImg = scene.textures.get(sourceKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = srcImg.width;
    canvas.height = srcImg.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(srcImg, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (g > 135 && g > r * 1.45 && g > b * 1.45) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    scene.textures.addCanvas(cleanKey, canvas);
  }

  function create() {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 2, 2);
    gfx.generateTexture('px', 2, 2);

    const dotGfx = this.make.graphics({ x: 0, y: 0, add: false });
    dotGfx.fillStyle(0xffffff, 1);
    dotGfx.fillCircle(4, 4, 4);
    dotGfx.generateTexture('marsDustDot', 8, 8);

    if (this.textures.exists('m6_bg') && this.textures.get('m6_bg').key !== '__MISSING') {
      this.add.image(width / 2, height / 2, 'm6_bg').setDisplaySize(width, height).setAlpha(0.58);
    }

    // Martian regolith floor & wider 165px landing pad
    this.add.rectangle(width / 2, height - 12, width, 24, 0x7c2d12, 0.85);
    const padX = Phaser.Math.Between(210, width - 210);
    const padWidth = 165;
    pad = this.physics.add.staticSprite(padX, height - 28, 'px');
    pad.setDisplaySize(padWidth, 16).setVisible(false).refreshBody();

    padVisual = this.add.rectangle(padX, height - 28, padWidth, 12, 0x00ff88).setStrokeStyle(2, 0xffffff);
    this.add.text(padX, height - 46, 'SAFE LANDING ZONE', {
      fontFamily: 'monospace',
      fontSize: '11px',
      fontStyle: 'bold',
      fill: '#00ff88',
      backgroundColor: 'rgba(5,8,17,0.8)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5);

    crane = this.physics.add.sprite(width / 2, 70, 'px');
    crane.setDisplaySize(54, 54).setVisible(false);
    crane.setCollideWorldBounds(true);
    crane.setDrag(85, 22); // Stronger aerodynamic/FCS damping so lateral drift settles cleanly
    crane.setMaxVelocity(180, 175);
    crane.body.allowGravity = false;

    beaconRing = this.add.circle(crane.x, crane.y, 54, 0x00f0ff, 0.06).setStrokeStyle(1.5, 0x00f0ff, 0.45);
    thrusterGlow = this.add.ellipse(crane.x, crane.y + 42, 46, 18, 0xfbbf24, 0.9).setVisible(false);

    if (this.textures.exists('skycrane_sprite') && this.textures.get('skycrane_sprite').key !== '__MISSING') {
      makeGreenTransparent(this, 'skycrane_sprite', 'skycrane_clean');
      craneVisual = this.add.image(crane.x, crane.y, 'skycrane_clean').setDisplaySize(104, 116).setDepth(10);
    } else {
      craneVisual = this.add.rectangle(crane.x, crane.y, 56, 26, 0xe2e8f0).setStrokeStyle(2, 0x00f0ff).setDepth(10);
    }

    this.physics.add.overlap(crane, pad, () => {
      if (isGameOver || !isStarted) return;
      const vy = crane.body.velocity.y;
      const vx = Math.abs(crane.body.velocity.x);
      // Fairer touchdown tolerances: vy <= 70 m/s, vx <= 60 m/s
      if (vy <= 70 && vx <= 60) {
        thrusterGlow.setVisible(false);
        endGame.call(this, true, 'ROVER TOUCHDOWN CONFIRMED ON CHRYSE PLANITIA!');
      } else if (vy > 70) {
        endGame.call(this, false, `DESCENT SPEED TOO HIGH (${Math.round(vy)} m/s) — LANDER DAMAGED!`);
      } else {
        endGame.call(this, false, `LATERAL DRIFT TOO HIGH (${Math.round(vx)} m/s) — ROVER TIPPED!`);
      }
    });

    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('W,A,S,D');
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    hudText = this.add.text(16, 14, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#00f0ff',
      backgroundColor: 'rgba(5,8,17,0.78)',
      padding: { x: 8, y: 6 }
    }).setDepth(20);

    statusBanner = this.add.text(width / 2, height - 64, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      fill: '#00ff88',
      backgroundColor: 'rgba(5,8,17,0.85)',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '🪂 MISSION 6: MARS CHRYSE SKY CRANE DESCENT',
      'OBJECTIVE:\nCounter Martian dust-storm crosswinds and land softly on the\nGREEN LANDING ZONE (Descent <= 70 m/s, Lateral Drift <= 60 m/s).\n\nCONTROLS:\n[ W / UP ] Retro-Thrust (Slow Fall)   |   [ A/D or LEFT/RIGHT ] Steer',
      () => { isStarted = true; briefingOverlay.setVisible(false); crane.body.allowGravity = true; }
    );
  }

  function update(time, delta) {
    if (isGameOver) return;
    if (!isStarted) {
      if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
        isStarted = true;
        briefingOverlay.setVisible(false);
        crane.body.allowGravity = true;
      }
      return;
    }

    const dt = delta / 1000;
    // Gentler crosswind gusts (±32 instead of ±56) so steering stays crisp and predictable
    windForce = Math.sin(time / 1050) * 32;
    let ax = windForce, ay = 0;
    let thrusting = false;

    if (fuel > 0) {
      // Stronger retro-thrust (-125 vs 34 gravity) & lower fuel consumption (7.5%/s)
      if (cursors.up.isDown || wasd.W.isDown) {
        ay = -125;
        fuel -= 7.5 * dt;
        thrusting = true;
      }
      if (cursors.left.isDown || wasd.A.isDown) {
        ax -= 145;
        fuel -= 3.5 * dt;
        thrusting = true;
      }
      if (cursors.right.isDown || wasd.D.isDown) {
        ax += 145;
        fuel -= 3.5 * dt;
        thrusting = true;
      }
    }

    crane.setAcceleration(ax, ay);
    craneVisual.setPosition(crane.x, crane.y);
    craneVisual.setAngle(Phaser.Math.Clamp(crane.body.velocity.x * 0.10, -12, 12));

    beaconRing.setPosition(crane.x, crane.y);
    thrusterGlow.setPosition(crane.x, crane.y + 42);
    thrusterGlow.setVisible(thrusting && fuel > 0);
    if (thrusting) thrusterGlow.setScale(Phaser.Math.FloatBetween(0.85, 1.25), 1);

    if (crane.y >= height - 30) {
      thrusterGlow.setVisible(false);
      endGame.call(this, false, 'MISSED SAFE LANDING PAD — BOULDER IMPACT!');
      return;
    }

    const vy = Math.round(crane.body.velocity.y);
    const vx = Math.round(Math.abs(crane.body.velocity.x));
    const safeVel = vy <= 70 && vx <= 60;
    statusBanner.setText(
      safeVel
        ? '✅ DESCENT RATE SAFE — ALIGN OVER GREEN PAD'
        : (vy > 70 ? '⚠️ FALLING TOO FAST! HOLD [W / UP] TO BRAKE' : '⚠️ HIGH CROSSWIND DRIFT! COUNTER-STEER [A / D]')
    ).setFill(safeVel ? '#00ff88' : '#facc15');

    hudText.setText(
      `[MARS CHRYSE SKY CRANE DESCENT]\n` +
      `HYDRAZINE FUEL : ${Math.max(0, fuel).toFixed(0)}%\n` +
      `DESCENT RATE   : ${vy} m/s (<= 70) | DRIFT: ${vx} m/s (<= 60) | WIND: ${windForce.toFixed(0)} kt`
    );
  }

  function endGame(success, msg) {
    isGameOver = true;
    crane.setVelocity(0, 0);
    crane.setAcceleration(0, 0);
    crane.body.allowGravity = false;
    statusBanner.setText(success ? `🏆 ${msg}` : `💥 ${msg}`).setFill(success ? '#00ff88' : '#ff3b3b');

    if (!success) {
      this.cameras.main.shake(450, 0.015);
      setTimeout(() => { game.destroy(true); onLoss(); }, 1200);
      return;
    }

    // --- VICTORY COMPLETION ANIMATION (ROVER TOUCHDOWN & SKY CRANE FLY-AWAY) ---
    beaconRing.setVisible(false);

    // 1. Red Martian iron-dust burst on rover wheel contact
    const dustBurst = this.add.particles(crane.x, height - 32, 'marsDustDot', {
      speed: { min: 40, max: 130 },
      angle: { min: 190, max: 350 },
      scale: { start: 1.5, end: 0 },
      tint: [0xea580c, 0xc2410c, 0xfdba74],
      lifespan: 750,
      quantity: 26,
      emitting: false
    });
    dustBurst.explode(26);

    // 2. Deployed Rover remains anchored on Chryse Planitia pad
    const roverBox = this.add.rectangle(crane.x, height - 42, 34, 16, 0xe2e8f0)
      .setStrokeStyle(2, 0x00ff88)
      .setDepth(9);
    const mast = this.add.rectangle(crane.x + 10, height - 54, 4, 10, 0x00f0ff).setDepth(9);

    // 3. Sky Crane cuts bridles and executes programmed fly-away maneuver
    thrusterGlow.setVisible(true);
    this.tweens.add({
      targets: [craneVisual, thrusterGlow],
      y: '-=260',
      x: '+=140',
      angle: 22,
      alpha: 0,
      duration: 1500,
      delay: 300,
      ease: 'Quad.easeIn'
    });

    // 4. Victory Telemetry Readout Card
    const winCard = this.add.rectangle(width / 2, height * 0.24, Math.min(500, width - 40), 78, 0x050d1a, 0.92)
      .setStrokeStyle(2, 0x00ff88)
      .setDepth(40)
      .setAlpha(0);

    const winTitle = this.add.text(width / 2, height * 0.24 - 14, '✅ BRIDLE SEVERED — CHRYSE TOUCHDOWN SECURED', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      fill: '#00ff88'
    }).setOrigin(0.5).setDepth(41).setAlpha(0);

    const winSub = this.add.text(width / 2, height * 0.24 + 14, `Sky Crane Fly-Away Complete | Remaining Hydrazine: ${Math.max(0, fuel).toFixed(0)}%`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      fill: '#e2e8f0'
    }).setOrigin(0.5).setDepth(41).setAlpha(0);

    this.tweens.add({
      targets: [winCard, winTitle, winSub],
      alpha: 1,
      duration: 450,
      delay: 350
    });

    if (window.audioManager && typeof audioManager.play === 'function') {
      audioManager.play('choice_confirm');
    }

    this.time.delayedCall(2500, () => {
      game.destroy(true);
      onWin();
    });
  }
}
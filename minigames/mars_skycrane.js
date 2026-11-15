function startMarsSkyCraneMiniGame(container, config, onWin, onLoss) {
  const width = container.clientWidth > 100 ? container.clientWidth : 800;
  const height = container.clientHeight > 100 ? container.clientHeight : 450;

  let fuel = 100, windForce = 0, isStarted = false, isGameOver = false;
  let crane, craneVisual, beaconRing, thrusterGlow, pad, hudText, statusBanner, briefingOverlay, cursors, wasd, spaceKey;

  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: container, width: width, height: height, backgroundColor: '#1f0d08',
    physics: { default: 'arcade', arcade: { gravity: { y: 44 }, debug: false } },
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

    // Slightly lower background alpha (0.58) so the Sky Crane stands out clearly
    if (this.textures.exists('m6_bg') && this.textures.get('m6_bg').key !== '__MISSING') {
      this.add.image(width / 2, height / 2, 'm6_bg').setDisplaySize(width, height).setAlpha(0.58);
    }

    // Martian regolith floor & landing pad
    this.add.rectangle(width / 2, height - 12, width, 24, 0x7c2d12, 0.85);
    const padX = Phaser.Math.Between(180, width - 180);
    pad = this.physics.add.staticSprite(padX, height - 28, 'px');
    pad.setDisplaySize(120, 14).setVisible(false).refreshBody();
    this.add.rectangle(padX, height - 28, 120, 12, 0x00ff88).setStrokeStyle(2, 0xffffff);
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
    crane.setDrag(35, 10);
    crane.body.allowGravity = false;

    // Subtle HUD locator ring & thruster plume so the spacecraft is always easy to track
    beaconRing = this.add.circle(crane.x, crane.y, 54, 0x00f0ff, 0.06).setStrokeStyle(1.5, 0x00f0ff, 0.45);
    thrusterGlow = this.add.ellipse(crane.x, crane.y + 42, 42, 16, 0xfbbf24, 0.9).setVisible(false);

    if (this.textures.exists('skycrane_sprite') && this.textures.get('skycrane_sprite').key !== '__MISSING') {
      makeGreenTransparent(this, 'skycrane_sprite', 'skycrane_clean');
      craneVisual = this.add.image(crane.x, crane.y, 'skycrane_clean').setDisplaySize(104, 116);
    } else {
      craneVisual = this.add.rectangle(crane.x, crane.y, 56, 26, 0xe2e8f0).setStrokeStyle(2, 0x00f0ff);
    }

    this.physics.add.overlap(crane, pad, () => {
      if (isGameOver || !isStarted) return;
      const vy = crane.body.velocity.y;
      const vx = Math.abs(crane.body.velocity.x);
      if (vy <= 55 && vx <= 45) {
        thrusterGlow.setVisible(false);
        endGame(true, 'ROVER TOUCHDOWN CONFIRMED ON CHRYSE PLANITIA!');
      } else if (vy > 55) {
        endGame(false, `DESCENT SPEED TOO HIGH (${Math.round(vy)} m/s) — LANDER DAMAGED!`);
      } else {
        endGame(false, `LATERAL DRIFT TOO HIGH (${Math.round(vx)} m/s) — ROVER TIPPED!`);
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
    });

    statusBanner = this.add.text(width / 2, height - 64, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      fill: '#00ff88',
      backgroundColor: 'rgba(5,8,17,0.85)',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '🪂 MISSION 6: MARS CHRYSE SKY CRANE DESCENT',
      'OBJECTIVE:\nCounter Martian dust-storm crosswinds and land softly on the\nGREEN LANDING ZONE (Descent <= 55 m/s, Lateral Drift <= 45 m/s).\n\nCONTROLS:\n[ W / UP ] Retro-Thrust (Slow Fall)   |   [ A/D or LEFT/RIGHT ] Steer',
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
    windForce = Math.sin(time / 850) * 56;
    let ax = windForce, ay = 0;
    let thrusting = false;

    if (fuel > 0) {
      if (cursors.up.isDown || wasd.W.isDown) {
        ay = -82;
        fuel -= 12 * dt;
        thrusting = true;
      }
      if (cursors.left.isDown || wasd.A.isDown) {
        ax -= 115;
        fuel -= 5.5 * dt;
        thrusting = true;
      }
      if (cursors.right.isDown || wasd.D.isDown) {
        ax += 115;
        fuel -= 5.5 * dt;
        thrusting = true;
      }
    }

    crane.setAcceleration(ax, ay);
    craneVisual.setPosition(crane.x, crane.y);
    craneVisual.setAngle(Phaser.Math.Clamp(crane.body.velocity.x * 0.12, -14, 14));

    beaconRing.setPosition(crane.x, crane.y);
    thrusterGlow.setPosition(crane.x, crane.y + 42);
    thrusterGlow.setVisible(thrusting && fuel > 0);
    if (thrusting) thrusterGlow.setScale(Phaser.Math.FloatBetween(0.85, 1.25), 1);

    if (crane.y >= height - 34) {
      thrusterGlow.setVisible(false);
      endGame(false, 'MISSED SAFE LANDING PAD — BOULDER IMPACT!');
      return;
    }

    const vy = Math.round(crane.body.velocity.y);
    const vx = Math.round(Math.abs(crane.body.velocity.x));
    const safeVel = vy <= 55 && vx <= 45;
    statusBanner.setText(
      safeVel
        ? '✅ DESCENT RATE SAFE — ALIGN OVER GREEN PAD'
        : (vy > 55 ? '⚠️ FALLING TOO FAST! HOLD [W / UP] TO BRAKE' : '⚠️ HIGH CROSSWIND DRIFT! COUNTER-STEER [A / D]')
    ).setFill(safeVel ? '#00ff88' : '#facc15');

    hudText.setText(
      `[MARS CHRYSE SKY CRANE DESCENT]\n` +
      `HYDRAZINE FUEL : ${Math.max(0, fuel).toFixed(0)}%\n` +
      `DESCENT RATE   : ${vy} m/s (<= 55) | DRIFT: ${vx} m/s (<= 45) | WIND: ${windForce.toFixed(0)} kt`
    );
  }

  function endGame(success, msg) {
    isGameOver = true;
    statusBanner.setText(success ? `🏆 ${msg}` : `💥 ${msg}`).setFill(success ? '#00ff88' : '#ff3b3b');
    setTimeout(() => { game.destroy(true); success ? onWin() : onLoss(); }, 1100);
  }
}
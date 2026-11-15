function startEuropaCryobotMiniGame(container, config, onWin, onLoss) {
  const width = container.clientWidth > 100 ? container.clientWidth : 800;
  const height = container.clientHeight > 100 ? container.clientHeight : 450;

  container.classList.add('europa-diving-fx');
  container.classList.remove('deep-pressure');

  let depthKm = 0, hullIntegrity = 100, isStarted = false, isGameOver = false, isOceanBreakthrough = false;
  let probeX = width / 2, spawnTimer = 0, wakeTimer = 0, finaleTimer = 0, strataOffset = 0;
  let obstacles = [], wakeBubbles = [], bgBlooms = [], bgCrystals = [];
  let depthDarkness, probe, probeAura, thrusterPlume, thrusterCore;
  let leftWall, rightWall, wallStrataGraphics, oceanLayer, sonarGraphics;
  let hudText, statusBanner, briefingOverlay, cursors, wasd, spaceKey;

  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: container, width: width, height: height, backgroundColor: '#072f4e',
    scene: { preload: preload, create: create, update: update }
  });

  function preload() {
    this.load.image('cryobot_sprite', 'assets/minigames/europa_cryobot.png');
  }

  // Strip green chroma-key background AND auto-crop empty transparent margins
  function makeGreenTransparent(scene, sourceKey, cleanKey) {
    const srcImg = scene.textures.get(sourceKey).getSourceImage();
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = srcImg.width;
    rawCanvas.height = srcImg.height;
    const rawCtx = rawCanvas.getContext('2d');
    rawCtx.drawImage(srcImg, 0, 0);

    const imgData = rawCtx.getImageData(0, 0, rawCanvas.width, rawCanvas.height);
    const data = imgData.data;
    let minX = rawCanvas.width, minY = rawCanvas.height, maxX = 0, maxY = 0;

    for (let y = 0; y < rawCanvas.height; y++) {
      for (let x = 0; x < rawCanvas.width; x++) {
        const i = (y * rawCanvas.width + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (g > 135 && g > r * 1.45 && g > b * 1.45) {
          data[i + 3] = 0;
        } else if (data[i + 3] > 20) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    rawCtx.putImageData(imgData, 0, 0);

    const cropW = Math.max(1, maxX - minX + 1);
    const cropH = Math.max(1, maxY - minY + 1);
    const cleanCanvas = document.createElement('canvas');
    cleanCanvas.width = cropW;
    cleanCanvas.height = cropH;
    cleanCanvas.getContext('2d').drawImage(rawCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

    scene.textures.addCanvas(cleanKey, cleanCanvas);
  }

  function create() {
    // 1. Native Phaser vector shapes for true glacial blue water & parallax ice crystals
    for (let i = 0; i < 9; i++) {
      const bx = Phaser.Math.Between(90, width - 90);
      const by = Phaser.Math.Between(0, height);
      const br = Phaser.Math.Between(55, 115);
      const bloom = this.add.circle(bx, by, br, i % 2 === 0 ? 0x0ea5e9 : 0x0284c7, 0.11).setDepth(0);
      bloom.speedFactor = 0.35;
      bgBlooms.push(bloom);
    }

    for (let i = 0; i < 36; i++) {
      const cx = Phaser.Math.Between(82, width - 82);
      const cy = Phaser.Math.Between(0, height);
      const crystal = this.add.circle(cx, cy, Phaser.Math.FloatBetween(1.4, 3.2), i % 3 === 0 ? 0xe0f2fe : 0x7dd3fc, 0.34).setDepth(1);
      crystal.speedFactor = Phaser.Math.FloatBetween(0.7, 1.05);
      bgCrystals.push(crystal);
    }

    // Subtle deep-ocean blue tint overlay
    depthDarkness = this.add.rectangle(width / 2, height / 2, width, height, 0x031d38, 0.08).setDepth(2);

    // Subsurface ocean glow overlay on breakthrough
    oceanLayer = this.add.rectangle(width / 2, height / 2, width, height, 0x0ea5e9, 0).setDepth(5);
    sonarGraphics = this.add.graphics().setDepth(15);

    // Frosted glacial ice borehole walls
    leftWall = this.add.rectangle(36, height / 2, 72, height, 0x0369a1, 0.82).setStrokeStyle(2, 0x7dd3fc, 0.75).setDepth(6);
    rightWall = this.add.rectangle(width - 36, height / 2, 72, height, 0x0369a1, 0.82).setStrokeStyle(2, 0x7dd3fc, 0.75).setDepth(6);
    wallStrataGraphics = this.add.graphics().setDepth(7);

    const probeY = 110;
    const probeH = 104;

    probeAura = this.add.ellipse(probeX, probeY, 66, 108, 0x38bdf8, 0.18).setStrokeStyle(1.5, 0xbae6fd, 0.55).setDepth(10);

    // Top-mounted hydro-jet thruster plumes at the tail of the downward-diving probe
    const thrusterTopY = probeY - probeH * 0.48;
    thrusterPlume = this.add.triangle(probeX, thrusterTopY, 0, 26, 24, 26, 12, 0, 0x38bdf8, 0.92)
      .setOrigin(0.5, 1)
      .setDepth(11);
    thrusterCore = this.add.triangle(probeX, thrusterTopY, 0, 14, 12, 14, 6, 0, 0xffffff, 0.95)
      .setOrigin(0.5, 1)
      .setDepth(11);

    if (this.textures.exists('cryobot_sprite') && this.textures.get('cryobot_sprite').key !== '__MISSING') {
      makeGreenTransparent(this, 'cryobot_sprite', 'cryobot_clean');
      probe = this.add.image(probeX, probeY, 'cryobot_clean').setDisplaySize(60, probeH).setDepth(12);
    } else {
      probe = this.add.triangle(probeX, probeY, -16, -24, 16, -24, 0, 28, 0x38bdf8).setStrokeStyle(2, 0xffffff).setDepth(12);
    }

    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('A,D');
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    hudText = this.add.text(86, 14, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#7dd3fc',
      backgroundColor: 'rgba(6, 28, 48, 0.84)',
      padding: { x: 8, y: 6 }
    }).setDepth(20);

    statusBanner = this.add.text(width / 2, height - 26, 'DODGE RED CRYO-PRESSURE POCKETS TO REACH 15.0 KM', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      fill: '#00ff88',
      backgroundColor: 'rgba(6, 28, 48, 0.88)',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '🧊 MISSION 7: EUROPA SUBSURFACE CRYOBOT',
      'OBJECTIVE:\nMelt down to 15.0 km depth through Europa\'s ice crust.\nDodge RED tectonic cryo-pockets—pressure and bubble speed surge near the ocean!\n\nCONTROLS:\n[ A / LEFT ] Steer Left   |   [ D / RIGHT ] Steer Right',
      () => { isStarted = true; briefingOverlay.setVisible(false); }
    );
  }

  function update(time, delta) {
    if (isGameOver) return;
    if (!isStarted) {
      if (Phaser.Input.Keyboard.JustDown(spaceKey)) { isStarted = true; briefingOverlay.setVisible(false); }
      return;
    }

    const dt = delta / 1000;

    if (depthKm >= 15.0 && !isOceanBreakthrough) {
      isOceanBreakthrough = true;
      depthKm = 15.0;
      this.cameras.main.flash(350, 56, 189, 248);
      statusBanner.setText('🌊 ICE CRUST BREACHED — DEPLOYING HYDROTHERMAL SONAR SCANNER').setFill('#7dd3fc');
    }

    if (isOceanBreakthrough) {
      finaleTimer += dt;
      const t = Phaser.Math.Clamp(finaleTimer / 1.65, 0, 1);

      bgBlooms.forEach(b => { b.y -= 45 * dt; if (b.y < -120) b.y = height + 120; });
      bgCrystals.forEach(c => { c.y -= 95 * dt; if (c.y < -10) c.y = height + 10; });

      leftWall.x = 36 - t * 90;
      rightWall.x = (width - 36) + t * 90;
      wallStrataGraphics.clear();
      oceanLayer.setAlpha(t * 0.35);

      probe.x = Phaser.Math.Linear(probe.x, width / 2, 4 * dt);
      probe.y = Phaser.Math.Linear(probe.y, height * 0.44, 3 * dt);
      probe.setAngle(Phaser.Math.Linear(probe.angle, 0, 6 * dt));
      probeAura.setPosition(probe.x, probe.y);
      thrusterPlume.setVisible(false);
      thrusterCore.setVisible(false);

      sonarGraphics.clear();
      for (let r = 0; r < 3; r++) {
        const ringProgress = ((finaleTimer * 1.4 + r * 0.33) % 1);
        const radius = 35 + ringProgress * 220;
        const alpha = (1 - ringProgress) * 0.85;
        sonarGraphics.lineStyle(3, r % 2 === 0 ? 0x00ff88 : 0x7dd3fc, alpha);
        sonarGraphics.strokeCircle(probe.x, probe.y, radius);
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.setAlpha(Math.max(0, obs.alpha - 2.5 * dt));
        if (obs.alpha <= 0) {
          obs.destroy();
          obstacles.splice(i, 1);
        }
      }

      hudText.setText(
        `[EUROPA SUBSURFACE OCEAN — BREAKTHROUGH]\n` +
        `ICE DEPTH      : 15.0 / 15.0 km (OCEAN ENTRY)\n` +
        `SONAR TELEMETRY: BIO-THERMAL VENT DETECTED`
      );

      if (finaleTimer >= 1.65) {
        endGame(true, 'SUBSURFACE OCEAN REACHED — HYDROTHERMAL VENT AHEAD!');
      }
      return;
    }

    depthKm += 0.85 * dt;
    const progress = Phaser.Math.Clamp(depthKm / 15.0, 0, 1);
    const diveSpeed = 215 + Math.pow(progress, 1.35) * 145;

    // Scroll vector blooms and ice crystals upward
    bgBlooms.forEach(b => {
      b.y -= diveSpeed * b.speedFactor * dt;
      if (b.y < -120) {
        b.y = height + 120;
        b.x = Phaser.Math.Between(90, width - 90);
      }
    });

    bgCrystals.forEach(c => {
      c.y -= diveSpeed * c.speedFactor * dt;
      if (c.y < -10) {
        c.y = height + 10;
        c.x = Phaser.Math.Between(82, width - 82);
      }
    });

    depthDarkness.setAlpha(0.06 + progress * 0.22);

    strataOffset = (strataOffset + diveSpeed * dt) % 64;
    wallStrataGraphics.clear();
    wallStrataGraphics.lineStyle(2, 0xbae6fd, 0.45);
    for (let y = -strataOffset; y < height + 64; y += 64) {
      wallStrataGraphics.beginPath();
      wallStrataGraphics.moveTo(72, y);
      wallStrataGraphics.lineTo(54, y + 22);
      wallStrataGraphics.lineTo(72, y + 48);
      wallStrataGraphics.strokePath();

      wallStrataGraphics.beginPath();
      wallStrataGraphics.moveTo(width - 72, y + 16);
      wallStrataGraphics.lineTo(width - 54, y + 38);
      wallStrataGraphics.lineTo(width - 72, y + 60);
      wallStrataGraphics.strokePath();
    }

    wakeTimer += dt;
    if (wakeTimer >= 0.06) {
      wakeTimer = 0;
      const isThrusterExhaust = Math.random() < 0.5;
      const startX = isThrusterExhaust ? probeX + Phaser.Math.Between(-12, 12) : Phaser.Math.Between(82, width - 82);
      const startY = isThrusterExhaust ? probe.y - probe.displayHeight * 0.5 : height + 10;
      const bubble = this.add.circle(startX, startY, Phaser.Math.FloatBetween(1.5, 4), isThrusterExhaust ? 0xe0f2fe : 0x7dd3fc, isThrusterExhaust ? 0.72 : 0.38).setDepth(8);
      bubble.vy = diveSpeed * Phaser.Math.FloatBetween(1.15, 1.6);
      wakeBubbles.push(bubble);
    }

    for (let i = wakeBubbles.length - 1; i >= 0; i--) {
      const b = wakeBubbles[i];
      b.y -= b.vy * dt;
      b.x += Math.sin(time / 180 + i) * 18 * dt;
      if (b.y < -15) {
        b.destroy();
        wakeBubbles.splice(i, 1);
      }
    }

    let moveDir = 0;
    if (cursors.left.isDown || wasd.A.isDown) { probeX -= 255 * dt; moveDir = -1; }
    if (cursors.right.isDown || wasd.D.isDown) { probeX += 255 * dt; moveDir = 1; }
    probeX = Phaser.Math.Clamp(probeX, 95, width - 95);

    const bobY = 110 + Math.sin(time / 240) * 3;
    probe.setPosition(probeX, bobY);
    probe.setAngle(Phaser.Math.Linear(probe.angle, moveDir * 9, 10 * dt));
    probeAura.setPosition(probeX, bobY);

    const tailX = probeX + moveDir * 7;
    const tailY = bobY - probe.displayHeight * 0.47;
    const thrustBoost = moveDir !== 0 ? 1.28 : 1.0;
    thrusterPlume.setPosition(tailX, tailY);
    thrusterPlume.setAngle(probe.angle);
    thrusterPlume.setScale(Phaser.Math.FloatBetween(0.85, 1.2) * thrustBoost, Phaser.Math.FloatBetween(0.9, 1.35) * thrustBoost);

    thrusterCore.setPosition(tailX, tailY);
    thrusterCore.setAngle(probe.angle);
    thrusterCore.setScale(Phaser.Math.FloatBetween(0.8, 1.1) * thrustBoost, Phaser.Math.FloatBetween(0.85, 1.2) * thrustBoost);

    const currentSpawnInterval = 0.46 - progress * 0.19;
    spawnTimer += dt;
    if (spawnTimer >= currentSpawnInterval) {
      spawnTimer = 0;
      const ox = Phaser.Math.Between(102, width - 102);
      const radius = Phaser.Math.Between(18, 30);
      const rock = this.add.circle(ox, height + 24, radius, 0xef4444, 0.55).setStrokeStyle(2, 0xff3b3b).setDepth(9);
      rock.swayPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
      rock.swayAmp = progress > 0.65 ? Phaser.Math.Between(18, 38) : 0;
      obstacles.push(rock);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.y -= diveSpeed * dt;
      if (obs.swayAmp > 0) {
        obs.x = Phaser.Math.Clamp(obs.x + Math.cos(time / 320 + obs.swayPhase) * obs.swayAmp * dt, 98, width - 98);
      }

      if (Phaser.Math.Distance.Between(probe.x, probe.y, obs.x, obs.y) < obs.radius + 16) {
        hullIntegrity = Math.max(0, hullIntegrity - 35);
        this.cameras.main.shake(95, 0.007);
        obs.destroy();
        obstacles.splice(i, 1);
        continue;
      }

      if (obs.y < -35) { obs.destroy(); obstacles.splice(i, 1); }
    }

    if (depthKm >= 10.5) {
      container.classList.add('deep-pressure');
      statusBanner.setText('⚠️ HIGH ABYSSAL PRESSURE — THERMAL PLUME SURGING!').setFill('#facc15');
    }

    hudText.setText(
      `[EUROPA SUBSURFACE CRYOBOT — ICE MELT]\n` +
      `ICE DEPTH      : ${depthKm.toFixed(1)} / 15.0 km\n` +
      `HULL INTEGRITY : ${hullIntegrity}%`
    );

    if (hullIntegrity <= 0) endGame(false, 'TECTONIC ICE CRUSH — HULL BREACHED!');
  }

  function endGame(success, msg) {
    isGameOver = true;
    statusBanner.setText(success ? `🏆 ${msg}` : `💥 ${msg}`).setFill(success ? '#00ff88' : '#ff3b3b');
    setTimeout(() => {
      container.classList.remove('europa-diving-fx', 'deep-pressure');
      game.destroy(true);
      success ? onWin() : onLoss();
    }, 1100);
  }
}
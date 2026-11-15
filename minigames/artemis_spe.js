function startArtemisSpeMiniGame(container, config, onWin, onLoss) {
  const width = container.clientWidth > 100 ? container.clientWidth : 800;
  const height = container.clientHeight > 100 ? container.clientHeight : 450;

  // Adaptive Flight Computer Assist scaling
  const scale = (config && config.difficultyScale) || 1.0;
  const boost = (config && config.toleranceBoost) || 1.0;
  const hudTag = (config && config.hudTag) || "";

  const arcHalfAngle = Math.min(1.85, 0.95 * boost);
  const spawnInterval = 0.48 / Math.max(0.65, scale);
  const dosePerHit = Math.max(8, Math.round(14 * scale));

  let shieldAngle = Math.PI, radiationDose = 0, timeLeft = 20.0;
  let isStarted = false, isGameOver = false, isFullShield = false;
  let spawnTimer = 0, finaleTimer = 0;
  let lastSpawnAngle = Math.PI;
  let shieldArc, particles = [], hudText, statusBanner, briefingOverlay, cursors, wasd, spaceKey;

  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: container, width: width, height: height, backgroundColor: '#060913',
    scene: { preload: preload, create: create, update: update }
  });

  function preload() {
    this.load.image('m5_bg', 'assets/minigames/m5_spe_bg.jpg');
    this.load.image('gateway_sprite', 'assets/minigames/artemis_gateway.png');
  }

  // Strip green chroma-key square from PNG at runtime
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
      if (g > 110 && g > r * 1.35 && g > b * 1.35) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    scene.textures.addCanvas(cleanKey, canvas);
  }

  function create() {
    if (this.textures.exists('m5_bg') && this.textures.get('m5_bg').key !== '__MISSING') {
      this.add.image(width / 2, height / 2, 'm5_bg').setDisplaySize(width, height).setAlpha(0.75);
    }

    if (this.textures.exists('gateway_sprite') && this.textures.get('gateway_sprite').key !== '__MISSING') {
      makeGreenTransparent(this, 'gateway_sprite', 'gateway_clean');
      this.add.image(width / 2, height / 2, 'gateway_clean').setDisplaySize(96, 96);
    } else {
      this.add.circle(width / 2, height / 2, 26, 0x1e293b).setStrokeStyle(3, 0x00f0ff);
    }

    shieldArc = this.add.graphics();
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('A,D');
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.input.on('pointermove', (pointer) => {
      if (!isStarted || isGameOver || isFullShield) return;
      shieldAngle = Math.atan2(pointer.y - height / 2, pointer.x - width / 2);
    });
    this.input.on('pointerdown', (pointer) => {
      if (!isStarted || isGameOver || isFullShield) return;
      shieldAngle = Math.atan2(pointer.y - height / 2, pointer.x - width / 2);
    });

    hudText = this.add.text(16, 14, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#00f0ff',
      backgroundColor: 'rgba(5,8,17,0.78)',
      padding: { x: 8, y: 6 }
    });

    statusBanner = this.add.text(width / 2, height - 26, 'ROTATE MAGNETIC SHIELD ARC [A/D, ARROWS, OR MOUSE] TO BLOCK SOLAR PROTONS', {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      fill: '#00ff88',
      backgroundColor: 'rgba(5,8,17,0.85)',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '☀️ MISSION 5: ARTEMIS GATEWAY SOLAR STORM',
      'OBJECTIVE:\nRotate the magnetic radiation shield around Lunar Gateway to intercept\nincoming yellow solar flare particles for 20 seconds.\n\nCONTROLS:\n[ A / D ] or [ LEFT / RIGHT ] or [ MOUSE AIM ] Rotate Deflector Shield',
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
    timeLeft = Math.max(0, timeLeft - dt);

    // Activate 360-degree full-envelope magnetic shield once timer expires
    if (timeLeft <= 0 && !isFullShield) {
      isFullShield = true;
      statusBanner.setText('🛡️ FULL 360° MAGNETIC ENVELOPE DEPLOYED — DEFLECTING RESIDUAL FLARE').setFill('#00f0ff');
    }

    if (isFullShield) {
      finaleTimer += dt;
      const pulse = 74 + Math.sin(finaleTimer * 18) * 4;

      shieldArc.clear();
      // Outer cyan magnetic shockwave
      shieldArc.lineStyle(3, 0x00f0ff, 0.55);
      shieldArc.strokeCircle(width / 2, height / 2, pulse + 10);
      // Inner full-360° green deflector dome
      shieldArc.lineStyle(8, 0x00ff88, 0.95);
      shieldArc.strokeCircle(width / 2, height / 2, pulse);

      // Deflect any remaining inbound particles in flight
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.obj.x += Math.cos(p.angle) * p.speed * dt;
        p.obj.y += Math.sin(p.angle) * p.speed * dt;

        const d = Phaser.Math.Distance.Between(p.obj.x, p.obj.y, width / 2, height / 2);
        if (d <= pulse + 14) {
          p.obj.destroy();
          particles.splice(i, 1);
        }
      }

      hudText.setText(
        `[ARTEMIS GATEWAY — FULL SHIELD ONLINE]${hudTag}\n` +
        `CREW RAD DOSE  : ${Math.round(radiationDose)}% (STABILIZED)\n` +
        `SHIELD FIELD   : 360° FULL ENVELOPE ACTIVE`
      );

      if (finaleTimer >= 1.35) {
        endGame(true, 'SOLAR STORM PASSED — FULL SHIELD HOLDING!');
      }
      return;
    }

    // Light passive cabin scrubbing (0.5%/s)
    if (radiationDose > 0) {
      radiationDose = Math.max(0, radiationDose - 0.5 * dt);
    }

    // Balanced rotation speed (4.6 rad/s)
    if (cursors.left.isDown || wasd.A.isDown) shieldAngle -= 4.6 * dt;
    if (cursors.right.isDown || wasd.D.isDown) shieldAngle += 4.6 * dt;

    // Directional deflector arc scaled by assist boost
    shieldArc.clear();
    shieldArc.lineStyle(7, 0x00ff88, 0.95);
    shieldArc.beginPath();
    shieldArc.arc(width / 2, height / 2, 64, shieldAngle - arcHalfAngle, shieldAngle + arcHalfAngle);
    shieldArc.strokePath();

    // Wider flanking angles (±2.1 rad) and scaled storm cadence
    spawnTimer += dt;
    if (spawnTimer >= spawnInterval) {
      spawnTimer = 0;
      lastSpawnAngle = Phaser.Math.Angle.Wrap(lastSpawnAngle + Phaser.Math.FloatBetween(-2.1, 2.1));
      const dist = Math.max(width, height) * 0.56;
      const dot = this.add.circle(
        width / 2 + Math.cos(lastSpawnAngle) * dist,
        height / 2 + Math.sin(lastSpawnAngle) * dist,
        6,
        0xfacc15
      ).setStrokeStyle(1, 0xff4500);
      particles.push({
        obj: dot,
        angle: lastSpawnAngle + Math.PI,
        speed: Phaser.Math.Between(145, 195) * scale
      });
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.obj.x += Math.cos(p.angle) * p.speed * dt;
      p.obj.y += Math.sin(p.angle) * p.speed * dt;

      const d = Phaser.Math.Distance.Between(p.obj.x, p.obj.y, width / 2, height / 2);
      if (d <= 72 && d >= 52) {
        const incomingDir = Math.atan2(p.obj.y - height / 2, p.obj.x - width / 2);
        if (Math.abs(Phaser.Math.Angle.Wrap(incomingDir - shieldAngle)) <= arcHalfAngle + 0.05) {
          p.obj.destroy();
          particles.splice(i, 1);
          continue;
        }
      }

      if (d < 34) {
        radiationDose = Math.min(100, radiationDose + dosePerHit);
        this.cameras.main.shake(80, 0.005);
        p.obj.destroy();
        particles.splice(i, 1);
      }
    }

    hudText.setText(
      `[ARTEMIS GATEWAY — SOLAR PARTICLE STORM]${hudTag}\n` +
      `CREW RAD DOSE  : ${Math.round(radiationDose)}% (CRITICAL AT 100%)\n` +
      `STORM DURATION : ${timeLeft.toFixed(1)}s remaining`
    );

    if (radiationDose >= 100) {
      endGame(
        false,
        'CRITICAL RADIATION EXPOSURE!',
        'Unblocked Class X9 solar protons penetrated Lunar Gateway hull, exceeding 100% crew radiation dose limits.'
      );
    }
  }

  function endGame(success, msg, reason = '') {
    isGameOver = true;
    statusBanner.setText(success ? `🏆 ${msg}` : `💥 ${msg}`).setFill(success ? '#00ff88' : '#ff3b3b');
    setTimeout(() => { game.destroy(true); success ? onWin() : onLoss(reason); }, 1100);
  }
}
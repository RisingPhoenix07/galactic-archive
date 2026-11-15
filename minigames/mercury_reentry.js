function startMercuryReentryMiniGame(container, config, onWin, onLoss) {
  const width = (container && container.clientWidth > 100) ? container.clientWidth : 800;
  const height = (container && container.clientHeight > 100) ? container.clientHeight : 450;

  let pitch = -34;
  let angularVel = 0;
  let timeLeft = 18.0;
  let heatShieldIntegrity = 100;
  let isStarted = false;
  let isGameOver = false;

  let driftDirection = Math.random() < 0.5 ? -1 : 1;
  let gustTimer = 0;
  let activeGust = 0;

  let capsule, plasmaGlow, topThruster, botThruster, hudText, statusBanner, briefingOverlay;
  let plasmaStreaks = [];
  let cursors, wasd, spaceKey;

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width: width,
    height: height,
    backgroundColor: '#120604',
    scene: { preload: preload, create: create, update: update }
  });

  function preload() {
    this.load.image('m1_bg', 'assets/minigames/m1_reentry_bg.jpg');
    this.load.image('mercury_sprite', 'assets/minigames/mercury_capsule.png');
  }

  function create() {
    if (this.textures.exists('m1_bg') && this.textures.get('m1_bg').key !== '__MISSING') {
      this.add.image(width / 2, height / 2, 'm1_bg').setDisplaySize(width, height).setAlpha(0.75);
    }

    plasmaStreaks = [];
    for (let i = 0; i < 30; i++) {
      const line = this.add.rectangle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(50, 140),
        2,
        0xff6b35,
        Phaser.Math.FloatBetween(0.25, 0.7)
      );
      plasmaStreaks.push(line);
      this.tweens.add({
        targets: line,
        x: -120,
        duration: Phaser.Math.Between(350, 800),
        repeat: -1,
        onRepeat: () => { line.x = width + 100; }
      });
    }

    const cx = width * 0.48;
    const cy = height * 0.52;

    // Safe Attitude Corridor Guides (-42 deg to -26 deg)
    const upperBound = this.add.line(cx, cy, -155, 0, 155, 0, 0x00ff88, 0.35).setAngle(-42);
    const lowerBound = this.add.line(cx, cy, -155, 0, 155, 0, 0x00ff88, 0.35).setAngle(-26);
    const refLine = this.add.line(cx, cy, -165, 0, 165, 0, 0x00ff88, 0.85).setAngle(-34);

    this.add.text(cx - 175, cy + 78, 'SAFE HEAT-SHIELD CORRIDOR (-34°)', {
      fontFamily: 'monospace',
      fontSize: '11px',
      fill: '#00ff88',
      backgroundColor: 'rgba(5,8,17,0.75)'
    });

    capsule = this.add.container(cx, cy).setDepth(10);
    plasmaGlow = this.add.circle(-32, 0, 52, 0xff4500, 0.38);
    topThruster = this.add.triangle(38, -18, 0, 0, -6, -18, 6, -18, 0x00f0ff).setVisible(false);
    botThruster = this.add.triangle(38, 18, 0, 0, -6, 18, 6, 18, 0x00f0ff).setVisible(false);

    if (this.textures.exists('mercury_sprite') && this.textures.get('mercury_sprite').key !== '__MISSING') {
      const sprite = this.add.image(0, 0, 'mercury_sprite').setDisplaySize(110, 74);
      capsule.add([plasmaGlow, topThruster, botThruster, sprite]);
    } else {
      const body = this.add.triangle(8, 0, -30, -28, -30, 28, 38, 0, 0x334155).setStrokeStyle(2, 0x00f0ff);
      capsule.add([plasmaGlow, topThruster, botThruster, body]);
    }
    capsule.setAngle(pitch);

    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('W,S');
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    hudText = this.add.text(16, 14, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#00f0ff',
      backgroundColor: 'rgba(5, 8, 17, 0.78)',
      padding: { x: 8, y: 6 }
    }).setDepth(20);

    statusBanner = this.add.text(width / 2, height - 26, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      fill: '#00ff88',
      backgroundColor: 'rgba(5, 8, 17, 0.85)',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    // Inline Briefing Overlay
    briefingOverlay = this.add.container(width / 2, height / 2).setDepth(100);
    const box = this.add.rectangle(0, 0, Math.min(580, width - 36), 255, 0x070d19, 0.95).setStrokeStyle(2, 0x00f0ff);
    const title = this.add.text(0, -92, '🔥 MISSION 1: MANUAL FLY-BY-WIRE RE-ENTRY', {
      fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold', fill: '#00f0ff'
    }).setOrigin(0.5);
    const body = this.add.text(0, -10,
      'OBJECTIVE:\nHypersonic plasma torque will continuously pull the capsule off-axis!\nCounter the drift to keep Friendship 7 inside the GREEN -34° corridor for 18s.\n\nCONTROLS:\n[ W / UP ] Pitch Nose UP   |   [ S / DOWN ] Pitch Nose DOWN', {
      fontFamily: 'monospace', fontSize: '13px', fill: '#e2e8f0', align: 'center', lineSpacing: 5
    }).setOrigin(0.5);
    const btn = this.add.text(0, 90, '▶ PRESS [SPACE] OR CLICK TO START MISSION', {
      fontFamily: 'monospace', fontSize: '13px', fontStyle: 'bold', fill: '#050811',
      backgroundColor: '#00ff88', padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => startFlight());
    briefingOverlay.add([box, title, body, btn]);
  }

  function startFlight() {
    if (isStarted) return;
    isStarted = true;
    briefingOverlay.setVisible(false);
    angularVel = driftDirection * 24;
    activeGust = driftDirection * 28;
  }

  function update(time, delta) {
    if (isGameOver) return;
    if (!isStarted) {
      if (Phaser.Input.Keyboard.JustDown(spaceKey)) startFlight();
      return;
    }

    const dt = delta / 1000;
    timeLeft = Math.max(0, timeLeft - dt);

    gustTimer += dt;
    if (gustTimer >= 2.2) {
      gustTimer = 0;
      driftDirection = Math.random() < 0.5 ? -1 : 1;
      activeGust = driftDirection * Phaser.Math.Between(34, 52);
    }

    const continuousTorque = activeGust + Math.sin(time / 500) * 22 + Phaser.Math.FloatBetween(-25, 25);
    angularVel += continuousTorque * dt;

    topThruster.setVisible(false);
    botThruster.setVisible(false);

    if (cursors.up.isDown || wasd.W.isDown) {
      angularVel -= 115 * dt;
      botThruster.setVisible(true);
    }
    if (cursors.down.isDown || wasd.S.isDown) {
      angularVel += 115 * dt;
      topThruster.setVisible(true);
    }

    angularVel *= 0.965;
    pitch += angularVel * dt;
    capsule.setAngle(pitch);

    const deltaAngle = Math.abs(pitch - (-34));
    if (deltaAngle > 8) {
      heatShieldIntegrity = Math.max(0, heatShieldIntegrity - (deltaAngle * 1.45) * dt);
      plasmaGlow.setFillStyle(0xff0000, 0.72);
      const fixHint = pitch > -34 ? 'HOLD [W / UP] TO PITCH UP!' : 'HOLD [S / DOWN] TO PITCH DOWN!';
      statusBanner.setText(`⚠️ OFF-ANGLE! HEAT SHIELD BURNING — ${fixHint}`).setFill('#ff3b3b');
    } else {
      plasmaGlow.setFillStyle(0xff6b35, 0.35);
      statusBanner.setText('✅ ATTITUDE NOMINAL (-34°) — COUNTER DRIFT TO HOLD').setFill('#00ff88');
    }

    hudText.setText(
      `[FRIENDSHIP 7 — FLY-BY-WIRE TELEMETRY]\n` +
      `PITCH ANGLE   : ${pitch.toFixed(1)}°  (SAFE WINDOW: -42° to -26°)\n` +
      `HEAT SHIELD   : ${heatShieldIntegrity.toFixed(0)}%\n` +
      `BLACKOUT EXIT : ${timeLeft.toFixed(1)}s remaining`
    );

    if (heatShieldIntegrity <= 0) {
      endGame.call(this, false, 'HEAT SHIELD BURN-THROUGH!');
    } else if (timeLeft <= 0) {
      endGame.call(this, true, 'PLASMA BLACKOUT CLEARED — DROGUE CHUTE DEPLOYED!');
    }
  }

  function endGame(success, msg) {
    isGameOver = true;
    topThruster.setVisible(false);
    botThruster.setVisible(false);
    statusBanner.setText(success ? `🏆 ${msg}` : `💥 ${msg}`).setFill(success ? '#00ff88' : '#ff3b3b');

    if (!success) {
      this.cameras.main.shake(500, 0.015);
      setTimeout(() => {
        game.destroy(true);
        onLoss();
      }, 1100);
      return;
    }

    // --- VICTORY COMPLETION ANIMATION ---
    // 1. Cool plasma glow & fade out hypersonic fire streaks
    plasmaGlow.setFillStyle(0x38bdf8, 0.3);
    this.tweens.add({
      targets: plasmaGlow,
      alpha: 0,
      scale: 0.4,
      duration: 900,
      ease: 'Sine.easeOut'
    });

    this.tweens.add({
      targets: plasmaStreaks,
      alpha: 0,
      duration: 800
    });

    // 2. Burned retropack strap fragments separating away
    for (let i = 0; i < 3; i++) {
      const strap = this.add.rectangle(capsule.x - 24, capsule.y + (i - 1) * 14, 18, 3, 0xffaa00).setDepth(9);
      this.tweens.add({
        targets: strap,
        x: strap.x - Phaser.Math.Between(90, 150),
        y: strap.y + Phaser.Math.Between(-45, 45),
        angle: Phaser.Math.Between(-180, 180),
        alpha: 0,
        duration: 1100,
        ease: 'Quad.easeOut'
      });
    }

    // 3. Level capsule attitude & deploy drogue parachute
    this.tweens.add({
      targets: capsule,
      angle: 0,
      x: capsule.x + 25,
      y: capsule.y + 18,
      duration: 1200,
      ease: 'Sine.easeOut'
    });

    const chuteGroup = this.add.container(capsule.x + 25, capsule.y + 18).setDepth(8).setScale(0.05);
    const cordTop = this.add.line(0, 0, -24, 0, -95, -24, 0xe2e8f0, 0.9).setOrigin(0);
    const cordBot = this.add.line(0, 0, -24, 0, -95, 24, 0xe2e8f0, 0.9).setOrigin(0);
    const canopy = this.add.arc(-95, 0, 32, 90, 270, false, 0xff5500, 0.95).setStrokeStyle(2, 0xffffff);
    chuteGroup.add([cordTop, cordBot, canopy]);

    this.tweens.add({
      targets: chuteGroup,
      scaleX: 1,
      scaleY: 1,
      duration: 650,
      delay: 350,
      ease: 'Back.easeOut'
    });

    // 4. Victory Telemetry Readout Banner
    const winCard = this.add.rectangle(width / 2, height * 0.24, Math.min(480, width - 40), 78, 0x050d1a, 0.92)
      .setStrokeStyle(2, 0x00ff88)
      .setDepth(40)
      .setAlpha(0);

    const winTitle = this.add.text(width / 2, height * 0.24 - 14, '✅ RE-ENTRY CORRIDOR HELD — DROGUE DEPLOYED', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      fill: '#00ff88'
    }).setOrigin(0.5).setDepth(41).setAlpha(0);

    const winSub = this.add.text(width / 2, height * 0.24 + 14, `Heat Shield Integrity: ${heatShieldIntegrity.toFixed(0)}% | Preparing Main Chute...`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      fill: '#e2e8f0'
    }).setOrigin(0.5).setDepth(41).setAlpha(0);

    this.tweens.add({
      targets: [winCard, winTitle, winSub],
      alpha: 1,
      duration: 450,
      delay: 450
    });

    if (window.audioManager && typeof audioManager.play === 'function') {
      audioManager.play('choice_confirm');
    }

    // 5. Clean up Phaser instance and advance story
    this.time.delayedCall(2600, () => {
      game.destroy(true);
      onWin();
    });
  }
}
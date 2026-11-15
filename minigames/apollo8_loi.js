function startApollo8LoiMiniGame(container, config, onWin, onLoss) {
  const width = container.clientWidth > 100 ? container.clientWidth : 800;
  const height = container.clientHeight > 100 ? container.clientHeight : 450;

  const scale = (config && config.difficultyScale) || 1.0;
  const boost = (config && config.toleranceBoost) || 1.0;
  const hudTag = (config && config.hudTag) || "";

  let deltaV = 0;
  const targetMin = Math.round(890 - 30 * (boost - 1));
  const targetMax = Math.round(935 + 30 * (boost - 1));
  const maxPitchAllowed = Math.round(15 * boost);

  let burnStarted = false, isStarted = false, isGameOver = false;
  let pitchOffset = 0, pitchDriftDir = 1;
  let hudText, statusBanner, briefingOverlay, spaceKey, cursors, wasd, ship, flame, barFill, touch = {};

  const game = new Phaser.Game({
    type: Phaser.AUTO, parent: container, width: width, height: height, backgroundColor: '#04060e',
    scene: { preload: preload, create: create, update: update }
  });

  function preload() {
    this.load.image('m3_bg', 'assets/minigames/m3_loi_bg.jpg');
    this.load.image('apollo_sprite', 'assets/minigames/apollo_csm.png');
  }

  function create() {
    if (this.textures.exists('m3_bg') && this.textures.get('m3_bg').key !== '__MISSING') {
      this.add.image(width / 2, height / 2, 'm3_bg').setDisplaySize(width, height).setAlpha(0.75);
    }

    touch = typeof createMobileTouchControls === 'function'
      ? createMobileTouchControls(this, width, height, [
          { key: 'left', label: '◀ GIMBAL' },
          { key: 'burn', label: '🔥 HOLD BURN', color: '#00ff88' },
          { key: 'right', label: 'GIMBAL ▶' }
        ])
      : {};

    const isMobile = Object.keys(touch).length > 0;

    ship = this.add.container(width / 2, isMobile ? height * 0.38 : height * 0.44).setDepth(10);
    flame = this.add.triangle(-62, 0, 14, -10, 14, 10, -28, 0, 0xf97316).setVisible(false);
    if (this.textures.exists('apollo_sprite') && this.textures.get('apollo_sprite').key !== '__MISSING') {
      ship.add([flame, this.add.image(0, 0, 'apollo_sprite').setDisplaySize(115, 56)]);
    } else {
      ship.add([flame, this.add.rectangle(0, 0, 64, 24, 0x94a3b8).setStrokeStyle(2, 0x00f0ff)]);
    }

    const barX = width / 2 - 220, barY = isMobile ? height - 112 : height - 68, barW = 440;
    this.add.rectangle(width / 2, barY, barW, 24, 0x0f172a, 0.9).setStrokeStyle(2, 0x334155);
    const minX = barX + (targetMin / 1100) * barW;
    const zoneW = ((targetMax - targetMin) / 1100) * barW;
    this.add.rectangle(minX + zoneW / 2, barY, zoneW, 22, 0x00ff88, 0.4).setStrokeStyle(2, 0x00ff88);
    barFill = this.add.rectangle(barX, barY, 0, 16, 0x00f0ff).setOrigin(0, 0.5);

    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('A,D');

    hudText = this.add.text(16, 14, '', {
      fontFamily: 'monospace', fontSize: '14px', fill: '#00f0ff',
      backgroundColor: 'rgba(5,8,17,0.78)', padding: { x: 8, y: 6 }
    }).setDepth(20);

    statusBanner = this.add.text(width / 2, isMobile ? height - 76 : height - 26, '', {
      fontFamily: 'monospace', fontSize: '14px', fontStyle: 'bold', fill: '#00ff88',
      backgroundColor: 'rgba(5,8,17,0.85)', padding: { x: 10, y: 4 }
    }).setOrigin(0.5).setDepth(20);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '🌑 MISSION 3: APOLLO 8 FARSIDE LOI BURN',
      `OBJECTIVE:\nHold BURN / [SPACE] to fire the main SPS engine until the blue bar enters\nthe GREEN TARGET ZONE (${targetMin}–${targetMax} m/s), then RELEASE to cut off!\n\nCONTROLS:\n[ HOLD BURN / SPACE ] Fire Engine   |   [ GIMBAL / A-D ] Trim Pitch (±${maxPitchAllowed}°)`,
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
    const isBurning = spaceKey.isDown || touch.burn;

    if (isBurning) {
      burnStarted = true;
      flame.setVisible(true);
      deltaV += (190 * Math.max(0.75, scale)) * dt;
      pitchOffset += pitchDriftDir * (18 * scale) * dt;
      if (Math.abs(pitchOffset) > 12 * scale) pitchDriftDir *= -1;
    } else {
      flame.setVisible(false);
      if (burnStarted) { evaluateBurn.call(this); return; }
    }

    if (cursors.left.isDown || wasd.A.isDown || touch.left) pitchOffset -= 38 * dt;
    if (cursors.right.isDown || wasd.D.isDown || touch.right) pitchOffset += 38 * dt;
    ship.setAngle(pitchOffset);

    if (deltaV >= 1100) { evaluateBurn.call(this); return; }
    barFill.width = Math.min(440, (deltaV / 1100) * 440);

    const inWindow = deltaV >= targetMin && deltaV <= targetMax;
    statusBanner.setText(inWindow ? '✅ IN ORBIT CAPTURE WINDOW — RELEASE NOW!' : '🔥 HOLD BURN UNTIL BAR REACHES GREEN ZONE!').setFill(inWindow ? '#00ff88' : '#00f0ff');
    hudText.setText(
      `[APOLLO 8 FARSIDE LOI BURN — LOS BLACKOUT]${hudTag}\n` +
      `DELTA-V APPLIED : ${deltaV.toFixed(1)} m/s (TARGET: ${targetMin}–${targetMax} m/s)\n` +
      `GIMBAL PITCH    : ${pitchOffset.toFixed(1)}° (KEEP WITHIN ±${maxPitchAllowed}°)`
    );
  }

  function evaluateBurn() {
    isGameOver = true;
    flame.setVisible(false);
    barFill.width = Math.min(440, (deltaV / 1100) * 440);

    const success = deltaV >= targetMin && deltaV <= targetMax && Math.abs(pitchOffset) <= maxPitchAllowed;
    statusBanner.setText(success ? '🏆 LUNAR ORBIT CAPTURE CONFIRMED!' : '💥 BURN OFF-TARGET — ORBIT INSERTION FAILED!').setFill(success ? '#00ff88' : '#ff3b3b');

    if (!success) {
      let reason = `Applied ΔV (${deltaV.toFixed(1)} m/s) missed the ${targetMin}–${targetMax} m/s lunar capture corridor.`;
      if (Math.abs(pitchOffset) > maxPitchAllowed) {
        reason = `Gimbal pitch drifted to ${pitchOffset.toFixed(1)}° (exceeded ±${maxPitchAllowed}° limit), causing off-axis thrust vectoring.`;
      }
      this.cameras.main.shake(500, 0.015);
      setTimeout(() => { game.destroy(true); onLoss(reason); }, 1100);
      return;
    }

    const rcsTop = this.add.circle(ship.x + 12, ship.y - 18, 6, 0x00f0ff, 0.9).setDepth(11);
    const rcsBot = this.add.circle(ship.x + 12, ship.y + 18, 6, 0x00f0ff, 0.9).setDepth(11);
    this.tweens.add({ targets: [rcsTop, rcsBot], scale: 2.2, alpha: 0, duration: 550, ease: 'Quad.easeOut' });

    const orbitCx = width * 0.62;
    const orbitCy = height * 0.46;
    const orbitRing = this.add.ellipse(orbitCx, orbitCy, 250, 145)
      .setStrokeStyle(2.5, 0x00ff88, 0.9).setDepth(6).setScale(1.35).setAlpha(0);

    this.tweens.add({ targets: orbitRing, scaleX: 1, scaleY: 1, alpha: 1, duration: 950, ease: 'Cubic.easeOut' });
    this.tweens.add({ targets: ship, x: orbitCx - 85, y: orbitCy - 35, angle: -16, duration: 1300, ease: 'Sine.easeInOut' });

    const earthHorizon = this.add.circle(orbitCx + 75, orbitCy - 45, 18, 0x38bdf8, 0).setDepth(5);
    this.tweens.add({ targets: earthHorizon, alpha: 0.9, y: orbitCy - 62, duration: 1200, delay: 450, ease: 'Sine.easeOut' });

    const winCard = this.add.rectangle(width / 2, height * 0.22, Math.min(500, width - 40), 78, 0x050d1a, 0.92)
      .setStrokeStyle(2, 0x00ff88).setDepth(40).setAlpha(0);
    const winTitle = this.add.text(width / 2, height * 0.22 - 14, '✅ SPS CUTOFF NOMINAL — LUNAR ORBIT LOCKED', {
      fontFamily: 'monospace', fontSize: '14px', fontStyle: 'bold', fill: '#00ff88'
    }).setOrigin(0.5).setDepth(41).setAlpha(0);
    const winSub = this.add.text(width / 2, height * 0.22 + 14, `Applied ΔV: ${deltaV.toFixed(1)} m/s | Entering Farside Comms Blackout...`, {
      fontFamily: 'monospace', fontSize: '12px', fill: '#e2e8f0'
    }).setOrigin(0.5).setDepth(41).setAlpha(0);

    this.tweens.add({ targets: [winCard, winTitle, winSub], alpha: 1, duration: 450, delay: 400 });

    if (window.audioManager && typeof audioManager.play === 'function') {
      audioManager.play('choice_confirm');
    }

    this.time.delayedCall(2600, () => {
      game.destroy(true);
      onWin();
    });
  }
}
function startApollo8LoiMiniGame(container, config, onWin, onLoss) {
  const width = container.clientWidth > 100 ? container.clientWidth : 800;
  const height = container.clientHeight > 100 ? container.clientHeight : 450;

  let deltaV = 0;
  const targetMin = 890, targetMax = 935;
  let burnStarted = false, isStarted = false, isGameOver = false;
  let pitchOffset = 0, pitchDriftDir = 1;
  let hudText, statusBanner, briefingOverlay, spaceKey, cursors, wasd, ship, flame, barFill;

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

    ship = this.add.container(width / 2, height * 0.44);
    flame = this.add.triangle(-62, 0, 14, -10, 14, 10, -28, 0, 0xf97316).setVisible(false);
    if (this.textures.exists('apollo_sprite') && this.textures.get('apollo_sprite').key !== '__MISSING') {
      ship.add([flame, this.add.image(0, 0, 'apollo_sprite').setDisplaySize(115, 56)]);
    } else {
      ship.add([flame, this.add.rectangle(0, 0, 64, 24, 0x94a3b8).setStrokeStyle(2, 0x00f0ff)]);
    }

    const barX = width / 2 - 220, barY = height - 68, barW = 440;
    this.add.rectangle(width / 2, barY, barW, 24, 0x0f172a, 0.9).setStrokeStyle(2, 0x334155);
    const minX = barX + (targetMin / 1100) * barW;
    const zoneW = ((targetMax - targetMin) / 1100) * barW;
    this.add.rectangle(minX + zoneW / 2, barY, zoneW, 22, 0x00ff88, 0.4).setStrokeStyle(2, 0x00ff88);
    barFill = this.add.rectangle(barX, barY, 0, 16, 0x00f0ff).setOrigin(0, 0.5);

    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('A,D');

    hudText = this.add.text(16, 14, '', { fontFamily: 'monospace', fontSize: '14px', fill: '#00f0ff', backgroundColor: 'rgba(5,8,17,0.78)', padding: { x: 8, y: 6 } });
    statusBanner = this.add.text(width / 2, height - 26, '', { fontFamily: 'monospace', fontSize: '14px', fontStyle: 'bold', fill: '#00ff88', backgroundColor: 'rgba(5,8,17,0.85)', padding: { x: 10, y: 4 } }).setOrigin(0.5);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '🌑 MISSION 3: APOLLO 8 FARSIDE LOI BURN',
      'OBJECTIVE:\nHold [SPACE] to fire the main SPS engine until the blue bar enters\nthe GREEN TARGET ZONE (890–935 m/s), then RELEASE [SPACE] to cut off!\n\nCONTROLS:\n[ HOLD SPACE ] Fire Engine   |   [ A/D or LEFT/RIGHT ] Trim Gimbal Pitch (±15°)',
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
    if (spaceKey.isDown) {
      burnStarted = true;
      flame.setVisible(true);
      deltaV += 190 * dt;
      pitchOffset += pitchDriftDir * 18 * dt;
      if (Math.abs(pitchOffset) > 12) pitchDriftDir *= -1;
    } else {
      flame.setVisible(false);
      if (burnStarted) { evaluateBurn(); return; }
    }

    if (cursors.left.isDown || wasd.A.isDown) pitchOffset -= 38 * dt;
    if (cursors.right.isDown || wasd.D.isDown) pitchOffset += 38 * dt;
    ship.setAngle(pitchOffset);

    if (deltaV >= 1100) { evaluateBurn(); return; }
    barFill.width = Math.min(440, (deltaV / 1100) * 440);

    const inWindow = deltaV >= targetMin && deltaV <= targetMax;
    statusBanner.setText(inWindow ? '✅ IN ORBIT CAPTURE WINDOW — RELEASE [SPACE] NOW!' : '🔥 HOLD [SPACE] UNTIL BAR REACHES GREEN ZONE!').setFill(inWindow ? '#00ff88' : '#00f0ff');
    hudText.setText(
      `[APOLLO 8 FARSIDE LOI BURN — LOS BLACKOUT]\n` +
      `DELTA-V APPLIED : ${deltaV.toFixed(1)} m/s (TARGET: ${targetMin}–${targetMax} m/s)\n` +
      `GIMBAL PITCH    : ${pitchOffset.toFixed(1)}° (KEEP WITHIN ±15°)`
    );
  }

  function evaluateBurn() {
    isGameOver = true;
    flame.setVisible(false);
    const success = deltaV >= targetMin && deltaV <= targetMax && Math.abs(pitchOffset) <= 15;
    statusBanner.setText(success ? '🏆 LUNAR ORBIT CAPTURE CONFIRMED!' : '💥 BURN OFF-TARGET — ORBIT INSERTION FAILED!').setFill(success ? '#00ff88' : '#ff3b3b');
    setTimeout(() => { game.destroy(true); success ? onWin() : onLoss(); }, 1100);
  }
}

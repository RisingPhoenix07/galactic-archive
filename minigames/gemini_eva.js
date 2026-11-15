function startGeminiEvaMiniGame(container, config, onWin, onLoss) {
  const width = (container && container.clientWidth > 100) ? container.clientWidth : 800;
  const height = (container && container.clientHeight > 100) ? container.clientHeight : 450;

  const scale = (config && config.difficultyScale) || 1.0;
  const boost = (config && config.toleranceBoost) || 1.0;
  const hudTag = (config && config.hudTag) || "";

  const maxDockSpeed = Math.round(115 * boost);
  const o2BurnRate = 4.5 * scale;
  const patrolSpeed = 1.9 * scale;

  let oxygen = 100;
  let isStarted = false;
  let isGameOver = false;
  let hudText, statusBanner, briefingOverlay, astronaut, astroVisual, hatch, tetherGraphics, cursors, wasd, spaceKey, touch = {};
  let movingHazards = [];

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width: width,
    height: height,
    backgroundColor: '#050811',
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
  });

  function preload() {
    this.load.image('m2_bg', 'assets/minigames/m2_eva_bg.jpg');
    this.load.image('astro_sprite', 'assets/minigames/gemini_astronaut.png');
    this.load.image('capsule_sprite', 'assets/minigames/gemini_capsule.png');
  }

  function create() {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 4, 4);
    gfx.generateTexture('px4', 4, 4);

    if (this.textures.exists('m2_bg') && this.textures.get('m2_bg').key !== '__MISSING') {
      this.add.image(width / 2, height / 2, 'm2_bg').setDisplaySize(width, height).setAlpha(0.75);
    }

    const hatchX = width - 135;
    const hatchY = height / 2;

    if (this.textures.exists('capsule_sprite') && this.textures.get('capsule_sprite').key !== '__MISSING') {
      this.add.image(width - 75, hatchY, 'capsule_sprite').setDisplaySize(145, 190);
    } else {
      this.add.rectangle(width - 60, hatchY, 90, 180, 0x1e293b).setStrokeStyle(2, 0x00f0ff);
    }

    hatch = this.physics.add.staticSprite(hatchX, hatchY, 'px4');
    hatch.setVisible(false);
    hatch.body.setSize(Math.round(44 * boost), Math.round(84 * boost), true);

    const hatchZone = this.add.rectangle(hatchX, hatchY, 44, 84, 0x00ff88, 0.32).setStrokeStyle(2, 0x00ff88);
    this.tweens.add({ targets: hatchZone, alpha: 0.85, duration: 600, yoyo: true, repeat: -1 });
    this.add.text(hatchX, hatchY - 56, 'DOCK HATCH', {
      fontFamily: 'monospace', fontSize: '11px', fontStyle: 'bold', fill: '#00ff88', backgroundColor: 'rgba(5,8,17,0.8)'
    }).setOrigin(0.5);

    astronaut = this.physics.add.sprite(95, height / 2, 'px4');
    astronaut.setVisible(false);
    astronaut.body.setSize(26, 26, true);
    astronaut.setCollideWorldBounds(true);
    astronaut.setDrag(95, 95);
    astronaut.setMaxVelocity(135);

    if (this.textures.exists('astro_sprite') && this.textures.get('astro_sprite').key !== '__MISSING') {
      astroVisual = this.add.image(astronaut.x, astronaut.y, 'astro_sprite').setDisplaySize(52, 52);
    } else {
      astroVisual = this.add.circle(astronaut.x, astronaut.y, 14, 0xffffff).setStrokeStyle(2, 0x00f0ff);
    }

    tetherGraphics = this.add.graphics();

    const staticHazards = this.physics.add.staticGroup();
    const addStaticHazard = (hx, hy, radius, label) => {
      const body = staticHazards.create(hx, hy, 'px4');
      body.setVisible(false);
      const hitBox = Math.round((radius * 1.5) / boost);
      body.body.setSize(hitBox, hitBox, true);
      this.add.circle(hx, hy, radius, 0xff3b3b, 0.28).setStrokeStyle(2, 0xff3b3b);
      this.add.text(hx, hy, label, {
        fontFamily: 'monospace', fontSize: '10px', fontStyle: 'bold', fill: '#ff9999'
      }).setOrigin(0.5);
    };

    addStaticHazard(width * 0.30, height * 0.50, 26, 'DEBRIS');
    addStaticHazard(width * 0.48, height * 0.25, 28, 'SOLAR GLARE');
    addStaticHazard(width * 0.48, height * 0.78, 26, 'THRUSTER PLUME');

    const patrolX = width * 0.67;
    const patrolY = height * 0.50;
    const patrolBody = this.physics.add.sprite(patrolX, patrolY, 'px4');
    patrolBody.setVisible(false);
    const patrolHit = Math.round(34 / boost);
    patrolBody.body.setSize(patrolHit, patrolHit, true);

    const patrolCircle = this.add.circle(patrolX, patrolY, 22, 0xf97316, 0.35).setStrokeStyle(2, 0xff3b3b);
    const patrolLabel = this.add.text(patrolX, patrolY, 'SHARD', {
      fontFamily: 'monospace', fontSize: '10px', fontStyle: 'bold', fill: '#ffd8a8'
    }).setOrigin(0.5);

    movingHazards.push({
      body: patrolBody,
      circle: patrolCircle,
      label: patrolLabel,
      baseY: patrolY,
      range: height * 0.28,
      speed: patrolSpeed
    });

    this.physics.add.overlap(astronaut, hatch, () => {
      if (isGameOver || !isStarted) return;
      const speed = Math.round(astronaut.body.velocity.length());
      if (speed <= maxDockSpeed) {
        endGame(true, 'SOFT HATCH CAPTURE — EVA COMPLETE!');
      } else {
        endGame(
          false,
          `HATCH IMPACT TOO FAST (> ${maxDockSpeed} m/s)!`,
          `Hatch contact velocity reached ${speed} m/s (safe limit: <= ${maxDockSpeed} m/s), risking EVA visor and hatch seal damage.`
        );
      }
    });

    this.physics.add.overlap(astronaut, staticHazards, () => {
      if (!isGameOver && isStarted) {
        endGame(
          false,
          'ORBITAL HAZARD COLLISION!',
          'Spacewalk trajectory intersected orbital debris or thruster exhaust plume, tangling the EVA umbilical tether.'
        );
      }
    });

    this.physics.add.overlap(astronaut, patrolBody, () => {
      if (!isGameOver && isStarted) {
        endGame(
          false,
          'STRUCK DRIFTING ORBITAL SHARD!',
          'Uncontrolled HHMU drift led to impact with a drifting orbital fragment near the Gemini capsule.'
        );
      }
    });

    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys('W,A,S,D');
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    touch = typeof createMobileTouchControls === 'function'
      ? createMobileTouchControls(this, width, height, [
          { key: 'left', label: '◀' },
          { key: 'up', label: '▲' },
          { key: 'down', label: '▼' },
          { key: 'right', label: '▶' }
        ])
      : {};

    const isMobile = Object.keys(touch).length > 0;

    hudText = this.add.text(16, 14, '', {
      fontFamily: 'monospace', fontSize: '14px', fill: '#00f0ff',
      backgroundColor: 'rgba(5, 8, 17, 0.78)', padding: { x: 8, y: 6 }
    });

    statusBanner = this.add.text(width / 2, isMobile ? height - 76 : height - 26, '', {
      fontFamily: 'monospace', fontSize: '14px', fontStyle: 'bold', fill: '#00ff88',
      backgroundColor: 'rgba(5, 8, 17, 0.85)', padding: { x: 10, y: 4 }
    }).setOrigin(0.5);

    briefingOverlay = createBriefingOverlay(this, width, height,
      '👨‍🚀 MISSION 2: GEMINI 4 ZERO-G HHMU RETURN',
      `OBJECTIVE:\nWeave around the orbital debris, solar glare, and drifting shard\nto dock gently inside the GREEN HATCH (<= ${maxDockSpeed} m/s).\n\nCONTROLS:\n[ W A S D / ARROWS / TOUCH ] Fire HHMU Thrusters`,
      () => { isStarted = true; briefingOverlay.setVisible(false); }
    );
  }

  function update(time, delta) {
    if (isGameOver) return;
    if (!isStarted) {
      if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
        isStarted = true;
        briefingOverlay.setVisible(false);
      }
      return;
    }

    const dt = delta / 1000;
    const thrust = 195;
    let thrusting = false;

    if (oxygen > 0) {
      if (cursors.left.isDown || wasd.A.isDown || touch.left) { astronaut.setAccelerationX(-thrust); thrusting = true; }
      else if (cursors.right.isDown || wasd.D.isDown || touch.right) { astronaut.setAccelerationX(thrust); thrusting = true; }
      else astronaut.setAccelerationX(0);

      if (cursors.up.isDown || wasd.W.isDown || touch.up) { astronaut.setAccelerationY(-thrust); thrusting = true; }
      else if (cursors.down.isDown || wasd.S.isDown || touch.down) { astronaut.setAccelerationY(thrust); thrusting = true; }
      else astronaut.setAccelerationY(0);

      if (thrusting) oxygen = Math.max(0, oxygen - o2BurnRate * dt);
    } else {
      astronaut.setAcceleration(0, 0);
    }

    astroVisual.setPosition(astronaut.x, astronaut.y);

    movingHazards.forEach(h => {
      const newY = h.baseY + Math.sin(time / 1000 * h.speed) * h.range;
      h.body.setPosition(h.body.x, newY);
      h.circle.setPosition(h.body.x, newY);
      h.label.setPosition(h.body.x, newY);
    });

    const hatchX = width - 135;
    const hatchY = height / 2;
    tetherGraphics.clear();
    tetherGraphics.lineStyle(2, 0xfacc15, 0.85);

    const curve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(hatchX, hatchY),
      new Phaser.Math.Vector2((astronaut.x + hatchX) / 2, Math.max(astronaut.y, hatchY) + 45),
      new Phaser.Math.Vector2(astronaut.x, astronaut.y)
    );
    curve.draw(tetherGraphics);

    const speed = Math.round(astronaut.body.velocity.length());
    const safeSpeed = speed <= maxDockSpeed;
    statusBanner.setText(safeSpeed
      ? '✅ APPROACH SPEED SAFE — WEAVE AROUND HAZARDS TO GREEN HATCH'
      : '⚠️ MOVING FAST — RELEASE THRUSTERS TO SLOW DOWN'
    ).setFill(safeSpeed ? '#00ff88' : '#facc15');

    hudText.setText(
      `[GEMINI IV HHMU TELEMETRY]${hudTag}\n` +
      `O2 PROPELLANT: ${oxygen.toFixed(1)}%\n` +
      `APPROACH VEL : ${speed} m/s (${safeSpeed ? 'SAFE' : 'FAST'} <= ${maxDockSpeed})`
    );
  }

  function endGame(success, msg, reason = '') {
    isGameOver = true;
    statusBanner.setText(success ? `🏆 ${msg}` : `💥 ${msg}`).setFill(success ? '#00ff88' : '#ff3b3b');
    setTimeout(() => {
      game.destroy(true);
      if (success) onWin();
      else onLoss(reason);
    }, 1100);
  }
}
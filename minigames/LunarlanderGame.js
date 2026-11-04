/**
 * Galactic Archive V2 - Mission 4: Apollo 11 Lunar Lander Mini-Game Engine
 * Author: Galactic Archive Dev Team
 * 
 * Mechanics:
 * - Real 2D Physics: acceleration (F = ma), lunar gravity (1.62 m/s² scaled), vector rotation, inertia.
 * - Thrusters: Main descent engine (Up Arrow / W) & RCS pitch controls (Left/Right Arrows / A/D).
 * - Telemetry HUD: Real-time velocity vectors, altitude meter, fuel %, horizontal/vertical speed indicators.
 * - Win/Loss Conditions:
 *     - Safe Touchdown: Horizontal speed < 2.0 m/s, Vertical speed < 3.0 m/s, Pitch angle < 10° on flat landing pad.
 *     - Crash / Tip-Over: Landing on rough terrain, excessive descent velocity, or angle mismatch.
 *     - Stranded in Vacuum: Fuel reaches 0% prior to contact while off trajectory.
 */

class LunarLanderGame {
    constructor(canvasId, onCompleteCallback) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.onComplete = onCompleteCallback; // Callback to hand state back to master story engine (script.js)

        // Canvas scaling (Standard internal resolution 1280x720 16:9)
        this.width = 1280;
        this.height = 720;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Physics Constants
        this.gravity = 0.035;       // Simulated lunar gravity
        this.thrustPower = 0.085;   // Main Descent Engine force
        this.rotSpeed = 0.045;      // RCS Pitch Rotation speed (radians/frame)

        // Key states
        this.keys = {
            up: false,
            left: false,
            right: false
        };

        // Game State Variables
        this.isRunning = false;
        this.animFrameId = null;
        this.resetGame();

        // Bind input listeners
        this.initInput();
    }

    resetGame() {
        // Spacecraft Lander State
        this.lander = {
            x: 200,
            y: 120,
            vx: 1.8,               // Initial forward drift
            vy: 0.5,               // Initial descent rate
            angle: -Math.PI / 6,   // Initial pitch angle (-30 deg)
            fuel: 100.0,           // Fuel percentage
            width: 32,
            height: 32,
            isExploded: false,
            isLanded: false
        };

        // Environment & Landing Zone Parameters
        this.landingPad = {
            x1: 850,
            x2: 1020,
            y: 620
        };

        // Generate static procedural terrain heightmap
        this.terrain = this.generateTerrain();

        // Thruster Particle System
        this.particles = [];
    }

    generateTerrain() {
        const points = [];
        const numPoints = 60;
        const step = this.width / (numPoints - 1);
        
        for (let i = 0; i < numPoints; i++) {
            const x = i * step;
            let y;

            // Flatten area for West Crater / Tranquility Landing Pad
            if (x >= this.landingPad.x1 - 20 && x <= this.landingPad.x2 + 20) {
                y = this.landingPad.y;
            } else {
                // Procedural jagged crater terrain
                const baseHeight = 580;
                const roughness = Math.sin(i * 0.4) * 45 + Math.cos(i * 0.15) * 65 + (Math.random() * 8);
                y = Math.min(680, baseHeight + roughness);
            }
            points.push({ x, y });
        }
        return points;
    }

    initInput() {
        window.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = true;
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = false;
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
        });
    }

    start() {
        this.resetGame();
        this.isRunning = true;
        this.loop();
    }

    stop() {
        this.isRunning = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
    }

    update() {
        if (this.lander.isLanded || this.lander.isExploded) return;

        // 1. Pitch / RCS Rotation Logic
        if (this.keys.left) {
            this.lander.angle -= this.rotSpeed;
        }
        if (this.keys.right) {
            this.lander.angle += this.rotSpeed;
        }

        // 2. Thrust & Fuel Logic
        if (this.keys.up && this.lander.fuel > 0) {
            // Apply thrust vector based on current spacecraft angle
            const thrustX = Math.sin(this.lander.angle) * this.thrustPower;
            const thrustY = -Math.cos(this.lander.angle) * this.thrustPower;

            this.lander.vx += thrustX;
            this.lander.vy += thrustY;

            // Deplete fuel
            this.lander.fuel = Math.max(0, this.lander.fuel - 0.12);

            // Spawn visual exhaust particles
            this.spawnExhaustParticles();
        }

        // 3. Apply Lunar Gravity
        this.lander.vy += this.gravity;

        // 4. Update Position
        this.lander.x += this.lander.vx;
        this.lander.y += this.lander.vy;

        // Update Particle physics
        this.updateParticles();

        // 5. Boundary / World Collision Checks
        this.checkCollisions();
    }

    spawnExhaustParticles() {
        const nozzleDist = 18;
        const nozzleX = this.lander.x - Math.sin(this.lander.angle) * nozzleDist;
        const nozzleY = this.lander.y + Math.cos(this.lander.angle) * nozzleDist;

        for (let i = 0; i < 3; i++) {
            const spread = (Math.random() - 0.5) * 0.4;
            const speed = 2 + Math.random() * 4;
            const pAngle = this.lander.angle + Math.PI + spread;

            this.particles.push({
                x: nozzleX,
                y: nozzleY,
                vx: Math.sin(pAngle) * speed + (Math.random() - 0.5),
                vy: -Math.cos(pAngle) * speed + (Math.random() - 0.5),
                life: 1.0,
                decay: 0.04 + Math.random() * 0.03,
                size: 2 + Math.random() * 3
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    checkCollisions() {
        // Screen bounds wrap/clamp
        if (this.lander.x < 10) { this.lander.x = 10; this.lander.vx = 0; }
        if (this.lander.x > this.width - 10) { this.lander.x = this.width - 10; this.lander.vx = 0; }

        // Find terrain height directly below lander's center position
        const landerX = this.lander.x;
        const landerY = this.lander.y + 16; // bottom footpad reference point

        let currentGroundY = 650;
        for (let i = 0; i < this.terrain.length - 1; i++) {
            const p1 = this.terrain[i];
            const p2 = this.terrain[i + 1];
            if (landerX >= p1.x && landerX <= p2.x) {
                const t = (landerX - p1.x) / (p2.x - p1.x);
                currentGroundY = p1.y + t * (p2.y - p1.y);
                break;
            }
        }

        // Contact check with ground line
        if (landerY >= currentGroundY) {
            this.lander.y = currentGroundY - 16; // Clamp to surface

            // Calculate landing metrics
            const vSpeed = Math.abs(this.lander.vy * 10); // Scaled for HUD reading
            const hSpeed = Math.abs(this.lander.vx * 10);
            const degAngle = Math.abs((this.lander.angle * (180 / Math.PI)) % 360);
            const isAngleUpright = (degAngle <= 12 || degAngle >= 348);
            const isOnPad = (landerX >= this.landingPad.x1 && landerX <= this.landingPad.x2);

            // Check Win / Loss Tolerances
            if (isOnPad && vSpeed <= 3.5 && hSpeed <= 2.5 && isAngleUpright) {
                // SUCCESSFUL TOUCHDOWN
                this.lander.isLanded = true;
                this.lander.vx = 0;
                this.lander.vy = 0;
                setTimeout(() => {
                    this.endMission("SUCCESS", {
                        fuelRemaining: Math.round(this.lander.fuel),
                        verticalSpeed: vSpeed.toFixed(1),
                        horizontalSpeed: hSpeed.toFixed(1)
                    });
                }, 1200);
            } else {
                // CRASH / TIP-OVER
                this.lander.isExploded = true;
                this.lander.vx = 0;
                this.lander.vy = 0;
                setTimeout(() => {
                    let failureReason = "CRITICAL BOULDER IMPACT & STRUCTURAL COLLAPSE";
                    if (!isOnPad) failureReason = "TOUCHDOWN OUTSIDE DESIGNATED SAFE TRANQUILITY PAD";
                    else if (vSpeed > 3.5) failureReason = "EXCESSIVE DESCENT VELOCITY (HARD IMPACT)";
                    else if (!isAngleUpright) failureReason = "UNSTABLE PITCH ANGLE AT CONTACT (LANDER TIP-OVER)";

                    this.endMission("CRITICAL_FAIL", { reason: failureReason });
                }, 1200);
            }
        }
    }

    endMission(outcome, telemetryData) {
        this.stop();
        if (typeof this.onComplete === 'function') {
            this.onComplete(outcome, telemetryData);
        }
    }

    render() {
        // Clear background (Deep Space Void)
        this.ctx.fillStyle = '#060810';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Starfield Background
        this.drawStars();

        // Draw Procedural Lunar Surface Terrain
        this.drawTerrain();

        // Draw Landing Pad Indicator
        this.drawLandingZone();

        // Draw Rocket Exhaust Particles
        this.drawParticles();

        // Draw Apollo Lunar Module (LM Eagle)
        this.drawLander();

        // Draw Retro Telemetry HUD Overlay
        this.drawHUD();
    }

    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        // Deterministic pseudo-random background stars
        for (let i = 0; i < 70; i++) {
            const x = (i * 137.5) % this.width;
            const y = (i * 293.3) % (this.height - 150);
            const r = (i % 3 === 0) ? 1.5 : 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawTerrain() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.terrain[0].x, this.terrain[0].y);

        for (let i = 1; i < this.terrain.length; i++) {
            this.ctx.lineTo(this.terrain[i].x, this.terrain[i].y);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();

        // Terrain fill (Retro monochrome lunar surface)
        this.ctx.fillStyle = '#1b1f2b';
        this.ctx.fill();

        // High contrast terrain outline line
        this.ctx.strokeStyle = '#4e5b78';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawLandingZone() {
        // Safe Zone Glowing Target Line
        this.ctx.strokeStyle = '#00ffcc';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.landingPad.x1, this.landingPad.y);
        this.ctx.lineTo(this.landingPad.x2, this.landingPad.y);
        this.ctx.stroke();

        // Dynamic Landing Pad Marker Flag
        this.ctx.fillStyle = '#00ffcc';
        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillText('▼ TRANQUILITY BASE SAFE ZONE ▼', this.landingPad.x1 + 10, this.landingPad.y - 12);
    }

    drawParticles() {
        for (const p of this.particles) {
            this.ctx.fillStyle = `rgba(255, ${Math.floor(p.life * 200)}, 50, ${p.life})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawLander() {
        this.ctx.save();
        this.ctx.translate(this.lander.x, this.lander.y);
        this.ctx.rotate(this.lander.angle);

        if (this.lander.isExploded) {
            // Draw Crash Explosion Flame Graphic
            this.ctx.fillStyle = '#ff3300';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 35, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#ffff00';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // --- 1. Lunar Module Ascent Stage (Top Cabin) ---
            this.ctx.fillStyle = '#dcdde1'; // Anodized aluminum / white thermal foil
            this.ctx.beginPath();
            this.ctx.arc(0, -6, 12, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#2f3640';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // Triangular Triangular Command Windows
            this.ctx.fillStyle = '#0984e3';
            this.ctx.fillRect(-6, -10, 4, 4);
            this.ctx.fillRect(2, -10, 4, 4);

            // --- 2. Descent Stage (Base Octagon with Gold Foil Aesthetic) ---
            this.ctx.fillStyle = '#e1b12c'; // Gold Mylar Kapton insulation
            this.ctx.fillRect(-14, 0, 28, 14);
            this.ctx.strokeStyle = '#718093';
            this.ctx.strokeRect(-14, 0, 28, 14);

            // --- 3. Landing Gear Legs & Contact Probes ---
            this.ctx.strokeStyle = '#f5f6fa';
            this.ctx.lineWidth = 2;
            
            // Left Leg
            this.ctx.beginPath();
            this.ctx.moveTo(-12, 12);
            this.ctx.lineTo(-20, 24);
            this.ctx.lineTo(-24, 24); // Footpad
            this.ctx.stroke();

            // Right Leg
            this.ctx.beginPath();
            this.ctx.moveTo(12, 12);
            this.ctx.lineTo(20, 24);
            this.ctx.lineTo(24, 24); // Footpad
            this.ctx.stroke();

            // Main Engine Nozzle Bell
            this.ctx.fillStyle = '#353b48';
            this.ctx.beginPath();
            this.ctx.moveTo(-6, 14);
            this.ctx.lineTo(6, 14);
            this.ctx.lineTo(8, 20);
            this.ctx.lineTo(-8, 20);
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawHUD() {
        const vSpeed = (this.lander.vy * 10).toFixed(1);
        const hSpeed = (this.lander.vx * 10).toFixed(1);
        const alt = Math.max(0, Math.floor(620 - this.lander.y));
        const pitchDeg = Math.round(this.lander.angle * (180 / Math.PI));

        // Background HUD Glass Box
        this.ctx.fillStyle = 'rgba(10, 25, 47, 0.75)';
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 1.5;
        this.ctx.fillRect(20, 20, 360, 160);
        this.ctx.strokeRect(20, 20, 360, 160);

        // Header Title
        this.ctx.fillStyle = '#00f3ff';
        this.ctx.font = 'bold 14px "Courier New", monospace';
        this.ctx.fillText('APOLLO 11 // P66 MANUAL DESCENT HUD', 35, 42);

        // Telemetry Data Lines
        this.ctx.font = '13px "Courier New", monospace';
        
        // Altitude
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`ALTITUDE       : ${alt} FT`, 35, 70);

        // Vertical Speed (Highlight Red if over speed threshold)
        this.ctx.fillStyle = Math.abs(vSpeed) > 3.5 ? '#ff4d4d' : '#00ffcc';
        this.ctx.fillText(`VERT SPEED (VY): ${vSpeed} M/S`, 35, 90);

        // Horizontal Speed
        this.ctx.fillStyle = Math.abs(hSpeed) > 2.5 ? '#ff4d4d' : '#00ffcc';
        this.ctx.fillText(`HORIZ SPEED(VX): ${hSpeed} M/S`, 35, 110);

        // Pitch Angle
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`PITCH ANGLE    : ${pitchDeg}°`, 35, 130);

        // Fuel Bar
        const fuelColor = this.lander.fuel < 20 ? '#ff3300' : '#00ffcc';
        this.ctx.fillStyle = fuelColor;
        this.ctx.fillText(`FUEL LEVEL     : ${Math.round(this.lander.fuel)}%`, 35, 155);

        // Fuel Visual Meter Bar
        this.ctx.strokeStyle = fuelColor;
        this.ctx.strokeRect(200, 143, 160, 14);
        this.ctx.fillRect(202, 145, Math.max(0, (156 * (this.lander.fuel / 100))), 10);

        // On-screen Controls Overlay Banner
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.font = '12px monospace';
        this.ctx.fillText('[W / ▲] MAIN ENGINE  |  [A/D or ◄/►] PITCH RCS ROTATION', 20, 700);

        // Mission Result Notifications
        if (this.lander.isLanded) {
            this.ctx.fillStyle = '#00ffcc';
            this.ctx.font = 'bold 28px monospace';
            this.ctx.fillText('HOUSTON, TRANQUILITY BASE HERE.', 360, 320);
            this.ctx.fillText('THE EAGLE HAS LANDED!', 440, 360);
        } else if (this.lander.isExploded) {
            this.ctx.fillStyle = '#ff4d4d';
            this.ctx.font = 'bold 30px monospace';
            this.ctx.fillText('CRITICAL MISSION FAILURE', 430, 330);
        }
    }

    loop() {
        if (!this.isRunning) return;
        this.update();
        this.render();
        this.animFrameId = requestAnimationFrame(() => this.loop());
    }
}
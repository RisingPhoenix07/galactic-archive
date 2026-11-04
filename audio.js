class AudioManager {
  constructor() {
    // Check local storage or default to MUTED (true) for clean browser autoplay compliance
    const savedState = localStorage.getItem("galactic_archive_muted");
    this.isMuted = savedState !== null ? savedState === "true" : true;
    this.currentLoop = null;

    this.sounds = {
      ui_hover: new Audio('assets/sfx/ui_button_hover.mp3'),
      ui_click: new Audio('assets/sfx/ui_button_click.mp3'),
      choice_confirm: new Audio('assets/sfx/sfx_choice_confirm.mp3'),
      whoosh: new Audio('assets/sfx/warning_los_static.mp3'),
      theme_song: new Audio('assets/sfx/Last_Known_Orbit.mp3'),
      rocket_launch: new Audio('assets/sfx/env_rocket_launch.mp3'),
      rcs_thruster: new Audio('assets/sfx/env_rcs_thruster_burst.mp3'),
      alarm_1202: new Audio('assets/sfx/alarm_1202_buzz.mp3'),
      success: new Audio('assets/sfx/sfx_mission_success.mp3'),
      failure: new Audio('assets/sfx/sfx_mission_failure_crash.mp3')
    };

    if (this.sounds.ui_hover) this.sounds.ui_hover.volume = 0.3;
    if (this.sounds.ui_click) this.sounds.ui_click.volume = 0.5;
    if (this.sounds.choice_confirm) this.sounds.choice_confirm.volume = 0.6;
    if (this.sounds.theme_song) this.sounds.theme_song.volume = 0.5;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("galactic_archive_muted", this.isMuted);

    if (this.isMuted) {
      const activeLoop = this.currentLoop;
      this.stopAll();
      this.currentLoop = activeLoop;
    } else if (this.currentLoop) {
      this.play(this.currentLoop, true);
    } else {
      this.play('theme_song', true);
    }

    this.updateMuteButtonUI();
    return this.isMuted;
  }

  // In audio.js:
updateMuteButtonUI() {
  // Select explicit mute buttons only (excluding #info-btn)
  const btns = document.querySelectorAll("#mute-btn, #title-mute-btn");
  btns.forEach(btn => {
    btn.textContent = this.isMuted ? "🔇 MUTE" : "🔊 SOUND";
    btn.classList.toggle("muted", this.isMuted);
  });
}

  play(soundKey, loop = false) {
    if (loop) {
      this.currentLoop = soundKey;
    }

    if (this.isMuted) return;

    const sound = this.sounds[soundKey];
    if (!sound) return;

    sound.currentTime = 0;
    sound.loop = loop;
    sound.play().catch(err => console.warn(`Playback blocked for ${soundKey}:`, err));
  }

  stop(soundKey) {
    if (this.sounds[soundKey]) {
      this.sounds[soundKey].pause();
      this.sounds[soundKey].currentTime = 0;
    }
  }

  stopAll() {
    this.currentLoop = null;
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }
}

window.audioManager = new AudioManager();

// Auto-Unmute & Start Audio on First User Interaction Anywhere
const unlockAudioOnFirstInteraction = () => {
  if (window.audioManager) {
    // Unmute on first interaction unless player previously saved explicit mute preference
    if (localStorage.getItem("galactic_archive_muted") === null) {
      window.audioManager.isMuted = false;
      localStorage.setItem("galactic_archive_muted", "false");
    }

    Object.values(window.audioManager.sounds).forEach(s => {
      if (s) s.load();
    });

    window.audioManager.updateMuteButtonUI();

    // Start background theme song if on title or intro screen
    const titleScreen = document.getElementById("title-screen");
    if (titleScreen && !titleScreen.classList.contains("hidden")) {
      window.audioManager.play('theme_song', true);
    }
  }

  window.removeEventListener('click', unlockAudioOnFirstInteraction);
  window.removeEventListener('keydown', unlockAudioOnFirstInteraction);
};

window.addEventListener('click', unlockAudioOnFirstInteraction);
window.addEventListener('keydown', unlockAudioOnFirstInteraction);
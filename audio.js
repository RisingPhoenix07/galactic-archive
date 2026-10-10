class AudioManager {
    constructor() {
      this.isMuted = localStorage.getItem("galactic_archive_muted") === "true";
  
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
  
      this.sounds.ui_hover.volume = 0.3;
      this.sounds.ui_click.volume = 0.5;
      this.sounds.choice_confirm.volume = 0.6;
      this.sounds.theme_song.volume = 0.5;
    }
  
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem("galactic_archive_muted", this.isMuted);
  
      if (this.isMuted) {
        this.stopAll();
      }
  
      this.updateMuteButtonUI();
      return this.isMuted;
    }
  
    updateMuteButtonUI() {
      const btn = document.getElementById("mute-btn");
      if (btn) {
        btn.textContent = this.isMuted ? "🔇 MUTE" : "🔊 SOUND";
        btn.classList.toggle("muted", this.isMuted);
      }
    }
  
    play(soundKey, loop = false) {
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
      Object.values(this.sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });
    }
  }
  
  // Bind global instance
  window.audioManager = new AudioManager();
  
  // Load audio buffers and sync HUD button on first user gesture
  document.addEventListener('click', () => {
    if (window.audioManager) {
      Object.values(window.audioManager.sounds).forEach(s => s.load());
      window.audioManager.updateMuteButtonUI();
    }
  }, { once: true });
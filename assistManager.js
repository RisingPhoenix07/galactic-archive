// ==========================================
// ADAPTIVE FLIGHT COMPUTER ASSIST MANAGER
// ==========================================
window.assistManager = (function () {
  const STORAGE_KEY = "galactic_archive_session_fails";

  // Load current session failure counts (persists across mid-session retries, clears when tab closes)
  function loadState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore storage quota/private mode errors
    }
  }

  const failCounts = loadState();

  return {
    /**
     * Returns dynamic scaling parameters for the requested mini-game.
     * - 0–1 fails: Standard telemetry (difficultyScale: 1.0, toleranceBoost: 1.0)
     * - 2 fails  : Flight Computer Stabilized (difficultyScale: 0.55, toleranceBoost: 1.25)
     * - 3+ fails : Full Guidance Calibration (difficultyScale: 0.30, toleranceBoost: 1.50)
     */
    getAssistConfig(actionKey) {
      const fails = failCounts[actionKey] || 0;
      const assistLevel = fails >= 3 ? 2 : (fails >= 2 ? 1 : 0);

      return {
        actionKey,
        failCount: fails,
        assistLevel,
        assistActive: assistLevel > 0,
        difficultyScale: assistLevel === 2 ? 0.30 : (assistLevel === 1 ? 0.55 : 1.0),
        toleranceBoost: assistLevel === 2 ? 1.50 : (assistLevel === 1 ? 1.25 : 1.0),
        hudTag: assistLevel === 2
          ? " [AGC CALIBRATION: MAX STABILIZATION]"
          : (assistLevel === 1 ? " [FLIGHT COMPUTER ASSIST: ACTIVE]" : "")
      };
    },

    /**
     * Records a win (resets counter to 0) or loss (increments counter).
     */
    recordResult(actionKey, didWin) {
      if (!actionKey) return;
      if (didWin) {
        failCounts[actionKey] = 0;
      } else {
        failCounts[actionKey] = (failCounts[actionKey] || 0) + 1;
      }
      saveState(failCounts);
    },

    /**
     * Clears all session assist counters (call inside startNewGame() / resetSession()).
     */
    resetAll() {
      Object.keys(failCounts).forEach((key) => delete failCounts[key]);
      saveState(failCounts);
    }
  };
})();
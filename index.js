class Game {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.rank = "Novice";
    this.highScore = 0;
    this.unlockedRewards = [];

    // Configuration
    this.ranks = [
      { level: 1, title: "Novice" },
      { level: 5, title: "Clicker" },
      { level: 10, title: "Button Masher" },
      { level: 20, title: "Speed Demon" },
      { level: 50, title: "Grandmaster" },
      { level: 100, title: "Click God" }
    ];

    this.rewards = [
      { level: 2, icon: "🎨", title: "New Colors", id: "reward_colors" },
      { level: 5, icon: "🔥", title: "Flame Effect", id: "reward_flame" },
      { level: 10, icon: "⚡", title: "Lightning Mode", id: "reward_lightning" },
      { level: 25, icon: "👑", title: "Crown Badge", id: "reward_crown" },
      { level: 50, icon: "🚀", title: "Rocket Boost", id: "reward_rocket" }
    ];

    // DOM Elements
    this.elements = {
      score: document.getElementById('scoreValue'),
      level: document.getElementById('levelValue'),
      rank: document.getElementById('rankValue'),
      highScore: document.getElementById('highScoreValue'),
      button: document.getElementById('bigButton'),
      progressBar: document.getElementById('levelProgress'),
      nextLevelText: document.getElementById('nextLevelText'),
      rewardsList: document.getElementById('rewardsList'),
      clickEffects: document.getElementById('clickEffects')
    };

    this.loadProgress();
    this.init();
  }

  init() {
    this.elements.button.addEventListener('click', (e) => this.handleClick(e));
    this.updateUI();
    this.renderRewards();
  }

  handleClick(e) {
    this.score++;
    this.checkLevelUp();
    this.checkHighScore();
    this.saveProgress();
    this.updateUI();
    this.createClickEffect(e);
  }

  getLevelThreshold(level) {
    // Exponential growth: 10, 25, 48, 82...
    return Math.floor(10 * Math.pow(1.5, level - 1));
  }

  checkLevelUp() {
    const nextLevelThreshold = this.getLevelThreshold(this.level);
    if (this.score >= nextLevelThreshold) {
      this.level++;
      this.checkRankUp();
      this.checkRewards();
      this.triggerLevelUpEffect();
    }
  }

  checkRankUp() {
    const newRank = this.ranks.slice().reverse().find(r => this.level >= r.level);
    if (newRank && newRank.title !== this.rank) {
      this.rank = newRank.title;
      // Optional: Add rank up notification
    }
  }

  checkRewards() {
    this.rewards.forEach(reward => {
      if (this.level >= reward.level && !this.unlockedRewards.includes(reward.id)) {
        this.unlockedRewards.push(reward.id);
        this.renderRewards();
        // Optional: Add reward unlock notification
      }
    });
  }

  checkHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  saveProgress() {
    const data = {
      score: this.score,
      level: this.level,
      rank: this.rank,
      highScore: this.highScore,
      unlockedRewards: this.unlockedRewards
    };
    localStorage.setItem('buttonGameProgress', JSON.stringify(data));
  }

  loadProgress() {
    const saved = localStorage.getItem('buttonGameProgress');
    if (saved) {
      const data = JSON.parse(saved);
      this.score = data.score || 0;
      this.level = data.level || 1;
      this.rank = data.rank || "Novice";
      this.highScore = data.highScore || 0;
      this.unlockedRewards = data.unlockedRewards || [];
    }
  }

  updateUI() {
    this.elements.score.textContent = this.score;
    this.elements.level.textContent = this.level;
    this.elements.rank.textContent = this.rank;
    this.elements.highScore.textContent = this.highScore;

    // Progress Bar
    const currentLevelStart = this.level === 1 ? 0 : this.getLevelThreshold(this.level - 1);
    const nextLevelThreshold = this.getLevelThreshold(this.level);
    const progress = ((this.score - currentLevelStart) / (nextLevelThreshold - currentLevelStart)) * 100;

    this.elements.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    this.elements.nextLevelText.textContent = `Next Level: ${nextLevelThreshold}`;
  }

  renderRewards() {
    this.elements.rewardsList.innerHTML = '';
    this.rewards.forEach(reward => {
      const isUnlocked = this.unlockedRewards.includes(reward.id);
      const div = document.createElement('div');
      div.className = `reward-item ${isUnlocked ? 'unlocked' : 'locked'}`;
      div.title = isUnlocked ? reward.title : `Reach Level ${reward.level}`;
      div.textContent = isUnlocked ? reward.icon : '🔒';
      this.elements.rewardsList.appendChild(div);
    });
  }

  createClickEffect(e) {
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.left = `${e.clientX}px`;
    effect.style.top = `${e.clientY}px`;
    effect.style.pointerEvents = 'none';
    effect.style.color = '#fff';
    effect.style.fontSize = '20px';
    effect.style.fontWeight = 'bold';
    effect.style.animation = 'floatUp 1s ease-out forwards';
    effect.textContent = '+1';
    document.body.appendChild(effect);

    // Add keyframes for floatUp if not exists (or handle in CSS)
    // For simplicity, we'll assume CSS handles the animation or we inline it
    effect.animate([
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-50px)', opacity: 0 }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => effect.remove();
  }

  triggerLevelUpEffect() {
    const btn = this.elements.button;
    btn.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.2)' },
      { transform: 'scale(1)' }
    ], {
      duration: 300
    });
  }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});

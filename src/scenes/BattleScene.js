// BattleScene.js - Theatrical RPG Battle Arena Canvas Rendering
import { eventBus } from '../core/EventBus.js';
import { getPetAssetUrl, getPetConfig } from '../battle/CompanionPetAssets.js';

export class BattleScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Images
    this.bgImg = new Image();
    this.bgImg.src = './assets/backgrounds/battle_forest.png';

    this.playerImg = new Image();
    this.playerImg.src = './assets/sprites/wizard_apprentice.png';

    this.petImg = new Image();
    this.activePet = null;

    this.monsterImg = new Image();
    this.monsterImg.src = './assets/sprites/ember_fox.png';

    this.monster = null;
    this.player = null;

    this.timer = 0;
    this.damageTexts = [];
    this.screenShake = 0;

    // Visual FX: projectiles & impact particles
    this.projectiles = [];
    this.particles = [];

    // Combatant flash timers
    this.playerHurtTimer = 0;
    this.monsterHurtTimer = 0;
    this.petHurtTimer = 0;
    this.petJumpTimer = 0;
    this.petHp = 0;
    this.petMaxHp = 0;
    this.petIsFainted = false;

    // Puppet Master shadow hand snatch animation timer
    this.snatchedAnimTimer = 0;
    this.snatchedPetName = '';

    this.bindEvents();
  }

  setCombatants(player, monster, worldId = null) {
    this.player = player;
    this.monster = monster;
    const worldBgMap = {
      firefly_forest: './assets/backgrounds/battle_forest.png',
      shipwreck_shore: './assets/backgrounds/battle_shipwreck.png',
      shiverchill_mountain: './assets/backgrounds/battle_shiverchill.png',
      bonfire_spire: './assets/backgrounds/battle_bonfire.png',
      skywatch: './assets/backgrounds/battle_skywatch.png',
      lamplight_town: './assets/backgrounds/town_lamplight.png'
    };
    const targetWorld = worldId || monster?.worldId || player?.currentWorld || 'firefly_forest';
    if (worldBgMap[targetWorld]) {
      this.bgImg.src = worldBgMap[targetWorld];
    }
    if (player && player.avatarSprite) {
      this.playerImg.src = player.avatarSprite;
    }
    const activePets = player?.pets?.filter(p => (player.activePetIds || [player.activePetId]).includes(p.id)) || (player?.pets?.slice(0, 2) || []);
    this.activePet = activePets[0] || null;
    this.activePetB = activePets[1] || null;

    if (!this.petImgB) this.petImgB = new Image();

    if (this.activePet) {
      const petSprite = getPetAssetUrl(this.activePet.id, 'battle', 'player', this.activePet.sprite);
      this.petImg.src = petSprite;
      this.petMaxHp = this.activePet.maxHp || (60 + ((this.activePet.level || 1) - 1) * 15);
      this.petHp = this.activePet.hp !== undefined ? this.activePet.hp : this.petMaxHp;
      this.petIsFainted = !!this.activePet.isFainted;
    } else {
      this.petHp = 0;
      this.petMaxHp = 0;
      this.petIsFainted = false;
    }

    if (this.activePetB) {
      const petSpriteB = getPetAssetUrl(this.activePetB.id, 'battle', 'player', this.activePetB.sprite);
      this.petImgB.src = petSpriteB;
      this.petMaxHpB = this.activePetB.maxHp || (60 + ((this.activePetB.level || 1) - 1) * 15);
      this.petHpB = this.activePetB.hp !== undefined ? this.activePetB.hp : this.petMaxHpB;
      this.petIsFaintedB = !!this.activePetB.isFainted;
    } else {
      this.petHpB = 0;
      this.petMaxHpB = 0;
      this.petIsFaintedB = false;
    }
    if (monster) {
      const monsterSprite = getPetAssetUrl(monster.id, 'battle', 'enemy', monster.sprite);
      this.monsterImg.src = monsterSprite;
    }
    this.damageTexts = [];
    this.projectiles = [];
    this.particles = [];
    this.screenShake = 0;
    this.playerHurtTimer = 0;
    this.monsterHurtTimer = 0;
    this.petHurtTimer = 0;
    this.petJumpTimer = 0;
  }

  bindEvents() {
    eventBus.on('BATTLE_DAMAGE_DEALT', ({ attacker, target, damage, isCrit, monsterHp, playerHp, petHp, isFainted }) => {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const isCompact = h <= 500;
      const isPortrait = w < 600 || w / h < 1.0;

      const playerX = isPortrait ? Math.round(w * 0.20) : Math.round(w * 0.23);
      const petX = isPortrait ? Math.round(w * 0.39) : Math.round(w * 0.33);
      const monsterX = isPortrait ? Math.round(w * 0.78) : Math.round(w * 0.77);

      const groundY = isPortrait
        ? Math.round(h * 0.58)
        : Math.round(h - (isCompact ? 104 : 148) - (isCompact ? 18 : 26));

      const targetY = isPortrait ? Math.round(h * 0.53) : (isCompact ? h * 0.44 : h * 0.48);
      const playerSize = Math.round(isCompact 
        ? Math.min(w * 0.17, h * 0.32, 115) 
        : isPortrait
          ? Math.min(w * 0.28, h * 0.16, 110)
          : Math.min(w * 0.22, h * 0.30, 160));
      const petSize = Math.round(playerSize * (isPortrait ? 0.60 : 0.65));
      const petY = groundY - petSize + 10;

      if (target === 'monster') {
        const startX = attacker === 'pet' ? petX : playerX;
        const startY = attacker === 'pet' ? petY : targetY;
        if (attacker === 'pet') {
          this.petJumpTimer = 0.45;
        }

        this.spawnSpellProjectile(startX, startY, monsterX, targetY, () => {
          this.screenShake = isCrit ? 14 : 9;
          this.monsterHurtTimer = 0.35;
          const hitColor = isCrit ? '#ff4757' : (attacker === 'pet' ? '#2ed573' : '#ffa502');
          this.spawnImpactParticles(monsterX, targetY, hitColor);

          if (this.monster) {
            this.monster.hp = monsterHp;
          }

          this.damageTexts.push({
            text: isCrit ? `💥 暴擊 -${damage}!` : (attacker === 'pet' ? `🐾 -${damage}` : `-${damage}`),
            x: monsterX,
            y: targetY - 25,
            alpha: 1,
            color: isCrit ? '#ff3838' : (attacker === 'pet' ? '#2ed573' : '#ffa502'),
            size: isCrit ? (isCompact ? 30 : 36) : (isCompact ? 24 : 28)
          });
        });
      } else if (target === 'pet') {
        // Monster counter-attacks companion pet
        this.spawnSpellProjectile(monsterX, targetY, petX, petY, () => {
          this.screenShake = 10;
          this.petHurtTimer = 0.40;
          this.spawnImpactParticles(petX, petY, '#eb4d4b');

          if (petHp !== undefined) this.petHp = petHp;
          if (isFainted !== undefined) this.petIsFainted = isFainted;
          if (this.activePet) {
            if (petHp !== undefined) this.activePet.hp = petHp;
            if (isFainted !== undefined) this.activePet.isFainted = isFainted;
          }

          this.damageTexts.push({
            text: `🐾 -${damage}`,
            x: petX,
            y: petY - 25,
            alpha: 1,
            color: '#ff4757',
            size: isCompact ? 24 : 28
          });
        });
      } else {
        // Monster counter-attacks wizard
        this.spawnSpellProjectile(monsterX, targetY, playerX, targetY, () => {
          this.screenShake = 10;
          this.playerHurtTimer = 0.35;
          this.spawnImpactParticles(playerX, targetY, '#eb4d4b');

          if (this.player) {
            this.player.hp = playerHp;
          }

          this.damageTexts.push({
            text: `-${damage}`,
            x: playerX,
            y: targetY - 25,
            alpha: 1,
            color: '#eb4d4b',
            size: isCompact ? 25 : 30
          });
        });
      }
    });

    eventBus.on('BATTLE_PLAYER_HEAL', ({ amount, petHp }) => {
      if (this.player) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
      }
      if (this.activePet && petHp !== undefined) {
        this.petHp = petHp;
        this.activePet.hp = petHp;
        if (this.petHp > 0) this.petIsFainted = false;
      }
      const w = this.canvas.width;
      const h = this.canvas.height;
      const isCompact = h <= 500;
      const isPortrait = w < 600 || w / h < 1.0;
      const playerX = isPortrait ? Math.round(w * 0.20) : Math.round(w * 0.23);
      const petX = isPortrait ? Math.round(w * 0.39) : Math.round(w * 0.33);
      const targetY = isPortrait ? Math.round(h * 0.53) : (isCompact ? h * 0.44 : h * 0.48);

      this.spawnImpactParticles(playerX, targetY, '#2ed573');
      if (this.activePet) {
        this.spawnImpactParticles(petX, targetY, '#2ed573');
      }

      this.damageTexts.push({
        text: `+${amount} HP 💚`,
        x: playerX,
        y: targetY - 25,
        alpha: 1,
        color: '#2ed573',
        size: isCompact ? 26 : 32
      });
    });

    eventBus.on('BATTLE_SPELL_FIZZLE', () => {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const isCompact = h <= 500;
      const isPortrait = w < 600 || w / h < 1.0;
      const playerX = isPortrait ? Math.round(w * 0.20) : Math.round(w * 0.23);
      const targetY = isPortrait ? Math.round(h * 0.53) : (isCompact ? h * 0.44 : h * 0.48);

      this.screenShake = 6;
      // Smoke puff particles
      this.spawnImpactParticles(playerX, targetY, '#95a5a6');
      this.damageTexts.push({
        text: '💨 MISS!',
        x: playerX,
        y: targetY - 25,
        alpha: 1,
        color: '#e74c3c',
        size: isCompact ? 26 : 32
      });
    });

    eventBus.on('BATTLE_PLAYER_TURN', () => {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const isPortrait = w < 600 || w / h < 1.0;
      const auraX = isPortrait ? w * 0.20 : w * 0.28;
      const auraY = isPortrait ? h * 0.53 : h * 0.50;
      // Golden mana aura ring particles
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        this.particles.push({
          x: auraX + Math.cos(angle) * (isPortrait ? 24 : 32),
          y: auraY + Math.sin(angle) * (isPortrait ? 16 : 20),
          vx: Math.cos(angle) * 30,
          vy: Math.sin(angle) * 30 - 15,
          color: '#f1c40f',
          alpha: 1,
          size: 4.5,
          life: 0.6
        });
      }
    });

    eventBus.on('BATTLE_PET_SNATCHED', ({ petId, petName }) => {
      this.triggerPetSnatchedAnimation(petName);
    });
  }

  triggerPetSnatchedAnimation(petName) {
    this.screenShake = 18;
    this.snatchedAnimTimer = 1.6;
    this.snatchedPetName = petName;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const isPortrait = w < 600 || w / h < 1.0;
    const petX = isPortrait ? w * 0.36 : w * 0.32;
    const petY = isPortrait ? h * 0.58 : h * 0.50;

    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: petX + (Math.random() - 0.5) * 50,
        y: petY + (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 110,
        vy: -Math.random() * 150 - 40,
        radius: Math.random() * 8 + 4,
        color: ['#2c003e', '#511281', '#8854d0', '#2d3436', '#eb3b5a'][Math.floor(Math.random() * 5)],
        alpha: 1
      });
    }

    // Immediately remove primary companion visual so it's visibly gone from the field
    this.activePet = null;
    this.petHp = 0;
    this.petMaxHp = 0;
  }

  spawnSpellProjectile(startX, startY, targetX, targetY, onHit) {
    this.projectiles.push({
      x: startX,
      y: startY,
      startX,
      startY,
      targetX,
      targetY,
      progress: 0,
      speed: 2.8,
      onHit
    });
  }

  spawnImpactParticles(x, y, color) {
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 140 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color,
        alpha: 1
      });
    }
  }

  update(dt) {
    this.timer += dt * 3.5;

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 24);
    }

    if (this.playerHurtTimer > 0) this.playerHurtTimer -= dt;
    if (this.monsterHurtTimer > 0) this.monsterHurtTimer -= dt;
    if (this.petHurtTimer > 0) this.petHurtTimer -= dt;
    if (this.petJumpTimer > 0) this.petJumpTimer -= dt;

    // Update Projectiles
    this.projectiles.forEach(p => {
      p.progress += dt * p.speed;
      p.x = p.startX + (p.targetX - p.startX) * p.progress;
      p.y = p.startY + (p.targetY - p.startY) * p.progress - Math.sin(p.progress * Math.PI) * 45;

      // Spawn tail trail
      if (Math.random() < 0.7) {
        this.particles.push({
          x: p.x + (Math.random() - 0.5) * 8,
          y: p.y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          radius: Math.random() * 3 + 1.5,
          color: '#ffeaa7',
          alpha: 0.8
        });
      }

      if (p.progress >= 1) {
        p.onHit?.();
      }
    });
    this.projectiles = this.projectiles.filter(p => p.progress < 1);

    // Update Particles
    this.particles.forEach(pt => {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.alpha -= dt * 1.8;
    });
    this.particles = this.particles.filter(pt => pt.alpha > 0);

    // Update Damage Texts
    this.damageTexts.forEach(d => {
      d.y -= dt * 48;
      d.alpha -= dt * 0.85;
    });
    this.damageTexts = this.damageTexts.filter(d => d.alpha > 0);

    // Update Snatched Pet Animation Timer
    if (this.snatchedAnimTimer > 0) {
      this.snatchedAnimTimer = Math.max(0, this.snatchedAnimTimer - dt);
    }
  }

  render() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.save();

    // 1. Screen Shake
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    // 2. Battle Background (Aspect-Ratio Cover so pixel art is never vertically stretched)
    if (this.bgImg.complete && this.bgImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const imgW = this.bgImg.naturalWidth;
      const imgH = this.bgImg.naturalHeight;
      const scale = Math.max(w / imgW, h / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (w - drawW) / 2;
      const drawY = (h - drawH) / 2;
      ctx.drawImage(this.bgImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#2d98da';
      ctx.fillRect(0, 0, w, h);
    }

    // Ambient magical arena vignette
    const vignette = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.25, w * 0.5, h * 0.45, w * 0.75);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    const playerBob = Math.sin(this.timer) * 3;
    const monsterBob = Math.cos(this.timer) * 3.5;

    const isCompact = h <= 500;
    const isPortrait = w < 600 || w / h < 1.0;

    // In portrait mode, position combatants vertically centered in the viewport
    // In landscape/desktop mode, ground line sits right above bottom dock
    const groundY = isPortrait
      ? Math.round(h * 0.58)
      : Math.round(h - (isCompact ? 104 : 148) - (isCompact ? 18 : 26));

    const daisRadiusX = Math.round(Math.min(w * (isPortrait ? 0.13 : 0.075), isCompact ? 68 : (isPortrait ? 60 : 86)));
    const daisRadiusY = Math.round(Math.min(h * (isPortrait ? 0.030 : 0.045), isCompact ? 17 : (isPortrait ? 18 : 24)));

    // X coordinates: give ample breathing space in portrait
    const wizardX = isPortrait ? Math.round(w * 0.20) : Math.round(w * 0.23);
    const monsterX = isPortrait ? Math.round(w * 0.78) : Math.round(w * 0.77);

    // 3. Ground Summoning Dais for Player (Left)
    this.renderPlayerDais(wizardX, groundY, daisRadiusX, daisRadiusY);

    // 4. Ground Mossy Battle Plinth for Monster (Right)
    this.renderMonsterPlinth(monsterX, groundY, daisRadiusX, daisRadiusY);

    // 5. Render Player Wizard
    const playerSize = Math.round(isCompact 
      ? Math.min(w * 0.17, h * 0.32, 115) 
      : isPortrait
        ? Math.min(w * 0.28, h * 0.16, 110)
        : Math.min(w * 0.22, h * 0.30, 160));
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (this.playerHurtTimer > 0) {
      ctx.filter = 'brightness(2) drop-shadow(0 0 10px #ff4757)';
    }
    ctx.drawImage(
      this.playerImg,
      wizardX - playerSize / 2,
      groundY - playerSize + 12 + playerBob,
      playerSize,
      playerSize
    );
    ctx.restore();

    // 5.1 Render Active Companion Pet A (beside wizard, front-left)
    if (this.activePet && this.petImg.complete && this.petImg.naturalWidth > 0) {
      const isFainted = this.petIsFainted || this.petHp <= 0;
      const petCfg = getPetConfig(this.activePet.id);
      const cycleSpd = petCfg?.idleCycleSpeed || 1.3;
      const bobAmp = petCfg?.idleBobAmp || 2.5;
      let petBob = Math.sin(this.timer * cycleSpd + 1.2) * bobAmp;
      let jumpOffsetX = 0;
      let jumpOffsetY = 0;
      if (this.petJumpTimer > 0) {
        const jumpProgress = (0.45 - this.petJumpTimer) / 0.45;
        jumpOffsetX = Math.sin(jumpProgress * Math.PI) * (isPortrait ? 26 : 36);
        jumpOffsetY = -Math.sin(jumpProgress * Math.PI) * (isPortrait ? 16 : 22);
      }

      const scaleMult = petCfg?.scale || 1.0;
      const petSize = Math.round(playerSize * (isPortrait ? 0.58 : 0.65) * scaleMult);
      const petX = (isPortrait ? Math.round(w * 0.36) : Math.round(w * 0.32)) + jumpOffsetX;
      const petY = groundY - petSize + 10 + petBob + jumpOffsetY;

      // Ground shadow under active companion pet A
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
      ctx.beginPath();
      ctx.ellipse(petX, groundY + 4, Math.round(petSize * 0.36), Math.round(petSize * 0.13), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      if (isFainted) {
        ctx.globalAlpha = 0.42;
        ctx.filter = 'grayscale(0.9)';
      } else if (this.petHurtTimer > 0) {
        ctx.filter = 'brightness(2.2) drop-shadow(0 0 12px #ff4757)';
      }

      ctx.drawImage(
        this.petImg,
        petX - petSize / 2,
        petY,
        petSize,
        petSize
      );
      ctx.restore();

      this.renderPetHpPlate(petX, petY - 6, this.activePet.name.split(' ')[0], this.petHp, this.petMaxHp, isFainted);
    }

    // 5.2 Render Active Companion Pet B (back-left or flank, if present)
    if (this.activePetB && this.petImgB && this.petImgB.complete && this.petImgB.naturalWidth > 0) {
      const isFaintedB = this.petIsFaintedB || this.petHpB <= 0;
      const petCfgB = getPetConfig(this.activePetB.id);
      const cycleSpdB = petCfgB?.idleCycleSpeed || 1.4;
      const bobAmpB = petCfgB?.idleBobAmp || 2.5;
      let petBobB = Math.sin(this.timer * cycleSpdB + 2.5) * bobAmpB;

      const scaleMultB = petCfgB?.scale || 1.0;
      const petSizeB = Math.round(playerSize * (isPortrait ? 0.54 : 0.60) * scaleMultB);
      const petXB = isPortrait ? Math.round(w * 0.48) : Math.round(w * 0.42);
      const petYB = groundY - petSizeB - 14 + petBobB;

      // Ground shadow under companion pet B
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(petXB, groundY - 8, Math.round(petSizeB * 0.34), Math.round(petSizeB * 0.12), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      if (isFaintedB) {
        ctx.globalAlpha = 0.42;
        ctx.filter = 'grayscale(0.9)';
      }

      ctx.drawImage(
        this.petImgB,
        petXB - petSizeB / 2,
        petYB,
        petSizeB,
        petSizeB
      );
      ctx.restore();

      this.renderPetHpPlate(petXB, petYB - 6, this.activePetB.name.split(' ')[0], this.petHpB, this.petMaxHpB, isFaintedB);
    }

    // 6. Render Monster
    const monsterSize = Math.round(isCompact 
      ? Math.min(w * 0.19, h * 0.34, 125) 
      : isPortrait
        ? Math.min(w * 0.32, h * 0.18, 128)
        : Math.min(w * 0.25, h * 0.32, 175));
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (this.monsterHurtTimer > 0) {
      ctx.filter = 'brightness(2.2) drop-shadow(0 0 12px #ff4757)';
    }
    if (this.monster?.isFrogified) {
      // Render funny frog with mini wizard hat & Ribbit bubbles
      const frogY = groundY - 24 + monsterBob;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(monsterSize * 0.70)}px sans-serif`;
      ctx.fillText('🐸', monsterX, frogY);
      
      // Mini wizard hat
      ctx.font = `${Math.round(monsterSize * 0.32)}px sans-serif`;
      ctx.fillText('🧙‍♂️', monsterX + 2, frogY - monsterSize * 0.30);

      // Ribbit bubble
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#2ed573';
      ctx.fillText('Ribbit! 🫧', monsterX, frogY - monsterSize * 0.50);
      ctx.restore();
    } else {
      ctx.drawImage(
        this.monsterImg,
        monsterX - monsterSize / 2,
        groundY - monsterSize + 14 + monsterBob,
        monsterSize,
        monsterSize
      );
    }
    ctx.restore();

    // 7. Visual FX: Spell Projectiles
    this.projectiles.forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 18);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#ffeaa7');
      grad.addColorStop(0.8, '#f39c12');
      grad.addColorStop(1, 'rgba(230, 126, 34, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
      ctx.fill();
    });

    // 8. Visual FX: Impact Particles
    this.particles.forEach(pt => {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.alpha);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 8.5 Puppet Master Shadow Claw Snatch FX
    if (this.snatchedAnimTimer > 0) {
      const progress = Math.max(0, this.snatchedAnimTimer / 1.6);
      const clawY = groundY - 120 + (1 - progress) * 50;
      const clawX = isPortrait ? w * 0.36 : w * 0.32;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const glow = ctx.createRadialGradient(clawX, clawY, 10, clawX, clawY, 80);
      glow.addColorStop(0, 'rgba(81, 18, 129, 0.85)');
      glow.addColorStop(0.6, 'rgba(44, 0, 62, 0.5)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(clawX, clawY, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '54px sans-serif';
      ctx.shadowColor = '#511281';
      ctx.shadowBlur = 22;
      ctx.fillText('🖐️', clawX, clawY);

      ctx.font = 'bold 15px ProdigySans, sans-serif';
      ctx.fillStyle = '#ff4757';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText(`😱【${this.snatchedPetName}】被暗影抓走！`, clawX, clawY - 45);
      ctx.restore();
    }

    // 9. Diegetic RPG Battle Plates
    // In portrait mode, place plates neatly in the top quarter under HUD (y=78)
    const plateY = isPortrait
      ? 78
      : (isCompact ? Math.max(48, Math.round(h * 0.13)) : Math.round(h * 0.20));

    // Custom plate widths & anchors in portrait to guarantee 0px edge-bleed or center collision
    let playerPlateX = wizardX;
    let monsterPlateX = monsterX;
    let customPlateW = null;

    if (isPortrait) {
      customPlateW = Math.max(140, Math.min(195, Math.floor((w - 24) / 2)));
      playerPlateX = 8 + customPlateW / 2;
      monsterPlateX = w - 8 - customPlateW / 2;
    }

    if (this.player) {
      this.drawCombatantPlate(
        playerPlateX,
        plateY,
        this.player.name,
        this.player.hp,
        this.player.maxHp,
        'hero',
        'Lv.1 見習法師',
        customPlateW
      );
    }

    if (this.monster) {
      this.drawCombatantPlate(
        monsterPlateX,
        plateY,
        this.monster.name,
        this.monster.hp,
        this.monster.maxHp,
        'monster',
        `${this.monster.element ? this.monster.element.toUpperCase() : ''} ${this.monster.isBoss ? 'Boss' : '野生'}`,
        customPlateW
      );
    }

    // 10. Damage Text Floats
    this.damageTexts.forEach(d => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, d.alpha);
      ctx.font = `900 ${d.size}px ProdigySans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 5;
      ctx.strokeText(d.text, d.x, d.y);
      ctx.fillStyle = d.color;
      ctx.fillText(d.text, d.x, d.y);
      ctx.restore();
    });

    ctx.restore();
  }

  renderPlayerDais(x, y, rx = 75, ry = 22) {
    const { ctx } = this;
    ctx.save();

    // Dais outer shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y + 5, rx * 1.05, ry * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Carved Stone Base
    const stoneGrad = ctx.createLinearGradient(x - rx, y, x + rx, y);
    stoneGrad.addColorStop(0, '#3d4b57');
    stoneGrad.addColorStop(0.5, '#576574');
    stoneGrad.addColorStop(1, '#2f3542');
    ctx.fillStyle = stoneGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gilded Rim
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Glowing Mana Runes on Dais
    ctx.strokeStyle = 'rgba(0, 210, 211, 0.75)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(x, y, rx * 0.78, ry * 0.75, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  renderMonsterPlinth(x, y, rx = 75, ry = 22) {
    const { ctx } = this;
    ctx.save();

    // Plinth outer shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(x, y + 5, rx * 1.05, ry * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fiery Earth Rock Base
    const rockGrad = ctx.createLinearGradient(x - rx, y, x + rx, y);
    rockGrad.addColorStop(0, '#533529');
    rockGrad.addColorStop(0.5, '#784633');
    rockGrad.addColorStop(1, '#3e2723');
    ctx.fillStyle = rockGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fire Rim
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.restore();
  }

  drawCombatantPlate(x, y, name, hp, maxHp, type, subtitle, customWidth = null) {
    const { ctx } = this;
    const isHero = type === 'hero';
    const isCompact = this.canvas.height <= 500;
    const isPortrait = this.canvas.width < 600 || this.canvas.width / this.canvas.height < 1.0;
    const plateW = customWidth || (isCompact ? 190 : (isPortrait ? 180 : 230));
    const plateH = isCompact ? 40 : (isPortrait ? 46 : 54);

    ctx.save();

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect?.(x - plateW / 2 + 2, y + 3, plateW, plateH, 8);
    ctx.fill();

    // Carved Metal Plinth Body
    const bgGrad = ctx.createLinearGradient(x - plateW / 2, y, x - plateW / 2, y + plateH);
    if (isHero) {
      bgGrad.addColorStop(0, '#243342');
      bgGrad.addColorStop(1, '#151d26');
    } else {
      bgGrad.addColorStop(0, '#422424');
      bgGrad.addColorStop(1, '#241414');
    }
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect?.(x - plateW / 2, y, plateW, plateH, 8);
    ctx.fill();

    // Gilded Frame Border
    ctx.strokeStyle = isHero ? '#f1c40f' : '#e74c3c';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Header: Name & Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = (isCompact || isPortrait) ? 'bold 11px ProdigySans, sans-serif' : 'bold 12px ProdigySans, sans-serif';
    ctx.textAlign = 'left';
    let displayName = name;
    const maxChars = isPortrait ? 9 : (isCompact ? 11 : 14);
    if (displayName.length > maxChars) {
      displayName = displayName.substring(0, maxChars - 1) + '…';
    }
    ctx.fillText(displayName, x - plateW / 2 + 8, y + (isCompact ? 14 : (isPortrait ? 15 : 18)));

    ctx.textAlign = 'right';
    ctx.fillStyle = isHero ? '#7bed9f' : '#ff7675';
    ctx.font = (isCompact || isPortrait) ? 'bold 9.5px ProdigySans, sans-serif' : 'bold 11px ProdigySans, sans-serif';
    ctx.fillText(subtitle, x + plateW / 2 - 8, y + (isCompact ? 14 : (isPortrait ? 15 : 18)));

    // HP Bar Outer Groove
    const barX = x - plateW / 2 + 8;
    const barY = y + (isCompact ? 20 : (isPortrait ? 22 : 27));
    const barW = plateW - 16;
    const barH = isCompact ? 12 : (isPortrait ? 13 : 14);

    ctx.fillStyle = '#0b0e14';
    ctx.beginPath();
    ctx.roundRect?.(barX, barY, barW, barH, 6);
    ctx.fill();

    // HP Bar Liquid Fill
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    if (pct > 0) {
      const fillW = Math.max(8, barW * pct);
      const fillGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
      if (isHero) {
        fillGrad.addColorStop(0, '#7bed9f');
        fillGrad.addColorStop(1, '#2ed573');
      } else {
        fillGrad.addColorStop(0, '#ff7675');
        fillGrad.addColorStop(1, '#d63031');
      }
      ctx.fillStyle = fillGrad;
      ctx.beginPath();
      ctx.roundRect?.(barX, barY, fillW, barH, 6);
      ctx.fill();

      // Liquid Sheen Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(barX + 2, barY + 1.5, fillW - 4, 2.5);
    }

    // Diegetic 45% Rescue Notch on Monster HP Bar
    if (!isHero) {
      const rescueThresholdX = barX + barW * 0.45;
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rescueThresholdX, barY - 2);
      ctx.lineTo(rescueThresholdX, barY + barH + 2);
      ctx.stroke();

      // If HP is <= 45%, render pulsating Rescue Flag
      if (hp / maxHp <= 0.45 && hp > 0) {
        ctx.fillStyle = '#ff4757';
        ctx.font = 'bold 9px ProdigySans, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('💖 RESCUE READY', barX, barY - 4);
      }
    }

    // HP Text
    ctx.fillStyle = '#ffffff';
    ctx.font = isCompact ? 'bold 9px ProdigySans, sans-serif' : 'bold 10px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 3;
    ctx.fillText(`${hp} / ${maxHp} ❤️`, x, barY + (isCompact ? 9.5 : 11));

    ctx.restore();
  }

  renderPetHpPlate(x, y, name, hp, maxHp, isFainted) {
    const { ctx } = this;
    const isCompact = this.canvas.height <= 500;
    const plateW = isCompact ? 86 : 98;
    const plateH = isCompact ? 24 : 27;

    ctx.save();

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect?.(x - plateW / 2 + 1, y - plateH + 2, plateW, plateH, 6);
    ctx.fill();

    // Background Plinth
    ctx.fillStyle = isFainted ? '#2d3436' : '#1e272e';
    ctx.beginPath();
    ctx.roundRect?.(x - plateW / 2, y - plateH, plateW, plateH, 6);
    ctx.fill();

    // Border
    ctx.strokeStyle = isFainted ? '#747d8c' : '#2ed573';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Title / Status
    ctx.fillStyle = isFainted ? '#a4b0be' : '#ffffff';
    ctx.font = 'bold 9.5px ProdigySans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🐾 ${name}`, x - plateW / 2 + 5, y - plateH + 10);

    ctx.textAlign = 'right';
    if (isFainted) {
      ctx.fillStyle = '#ff4757';
      ctx.fillText('💫 昏迷', x + plateW / 2 - 5, y - plateH + 10);
    } else {
      ctx.fillStyle = '#7bed9f';
      ctx.fillText(`${hp}/${maxHp}`, x + plateW / 2 - 5, y - plateH + 10);
    }

    // Mini HP Bar Outer
    const barX = x - plateW / 2 + 5;
    const barY = y - plateH + 13;
    const barW = plateW - 10;
    const barH = isCompact ? 6 : 7;

    ctx.fillStyle = '#0b0e14';
    ctx.beginPath();
    ctx.roundRect?.(barX, barY, barW, barH, 3);
    ctx.fill();

    if (!isFainted && maxHp > 0) {
      const pct = Math.max(0, Math.min(1, hp / maxHp));
      if (pct > 0) {
        const fillW = Math.max(4, barW * pct);
        const fillGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH);
        if (pct > 0.45) {
          fillGrad.addColorStop(0, '#2ed573');
          fillGrad.addColorStop(1, '#10ac84');
        } else if (pct > 0.2) {
          fillGrad.addColorStop(0, '#ffa502');
          fillGrad.addColorStop(1, '#ff7f50');
        } else {
          fillGrad.addColorStop(0, '#ff4757');
          fillGrad.addColorStop(1, '#ee5253');
        }
        ctx.fillStyle = fillGrad;
        ctx.beginPath();
        ctx.roundRect?.(barX, barY, fillW, barH, 3);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}


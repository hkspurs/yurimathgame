// BattleScene.js - Theatrical RPG Battle Arena Canvas Rendering
import { eventBus } from '../core/EventBus.js';

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

    this.bindEvents();
  }

  setCombatants(player, monster) {
    this.player = player;
    this.monster = monster;
    if (player && player.avatarSprite) {
      this.playerImg.src = player.avatarSprite;
    }
    this.activePet = player?.pets?.find(p => p.id === player.activePetId) || (player?.pets?.[0] || null);
    if (this.activePet) {
      if (this.activePet.sprite) {
        this.petImg.src = this.activePet.sprite;
      }
      this.petMaxHp = this.activePet.maxHp || (60 + ((this.activePet.level || 1) - 1) * 15);
      this.petHp = this.activePet.hp !== undefined ? this.activePet.hp : this.petMaxHp;
      this.petIsFainted = !!this.activePet.isFainted;
    } else {
      this.petHp = 0;
      this.petMaxHp = 0;
      this.petIsFainted = false;
    }
    if (monster && monster.sprite) {
      this.monsterImg.src = monster.sprite;
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
      const playerX = w * 0.23;
      const petX = Math.round(w * 0.33);
      const monsterX = w * 0.77;
      const targetY = isCompact ? h * 0.44 : h * 0.48;
      const groundY = isCompact ? h * 0.82 : h * 0.75;
      const playerSize = Math.round(isCompact ? Math.min(w * 0.17, h * 0.32, 115) : Math.min(w * 0.22, h * 0.30, 160));
      const petSize = Math.round(playerSize * 0.65);
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
      const playerX = w * 0.23;
      const petX = Math.round(w * 0.33);
      const targetY = isCompact ? h * 0.44 : h * 0.48;

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
      const playerX = w * 0.23;
      const targetY = isCompact ? h * 0.44 : h * 0.48;

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
      // Golden mana aura ring particles
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        this.particles.push({
          x: w * 0.28 + Math.cos(angle) * 32,
          y: h * 0.50 + Math.sin(angle) * 20,
          vx: Math.cos(angle) * 30,
          vy: Math.sin(angle) * 30 - 15,
          color: '#f1c40f',
          alpha: 1,
          size: 4.5,
          life: 0.6
        });
      }
    });
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

    // 2. Battle Background
    if (this.bgImg.complete && this.bgImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.bgImg, 0, 0, w, h);
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
    // Position ground line higher than the bottom dock
    const groundY = Math.round(h - (isCompact ? 104 : 148) - (isCompact ? 18 : 26));
    const daisRadiusX = Math.round(Math.min(w * 0.075, isCompact ? 68 : 86));
    const daisRadiusY = Math.round(Math.min(h * 0.045, isCompact ? 17 : 24));

    const wizardX = Math.round(w * 0.23);
    const monsterX = Math.round(w * 0.77);

    // 3. Ground Summoning Dais for Player (Left)
    this.renderPlayerDais(wizardX, groundY, daisRadiusX, daisRadiusY);

    // 4. Ground Mossy Battle Plinth for Monster (Right)
    this.renderMonsterPlinth(monsterX, groundY, daisRadiusX, daisRadiusY);

    // 5. Render Player Wizard
    const playerSize = Math.round(isCompact 
      ? Math.min(w * 0.17, h * 0.32, 115) 
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

    // 5.1 Render Active Companion Pet (beside wizard)
    if (this.activePet && this.petImg.complete && this.petImg.naturalWidth > 0) {
      const isFainted = this.petIsFainted || this.petHp <= 0;
      let petBob = Math.sin(this.timer * 1.3 + 1.2) * 2.5;
      let jumpOffsetX = 0;
      let jumpOffsetY = 0;
      if (this.petJumpTimer > 0) {
        // Pet leap forward when attacking
        const jumpProgress = (0.45 - this.petJumpTimer) / 0.45;
        jumpOffsetX = Math.sin(jumpProgress * Math.PI) * 36;
        jumpOffsetY = -Math.sin(jumpProgress * Math.PI) * 22;
      }

      const petSize = Math.round(playerSize * 0.65);
      const petX = Math.round(w * 0.33) + jumpOffsetX;
      const petY = groundY - petSize + 10 + petBob + jumpOffsetY;

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

      // Render Pet Diegetic Health Bar & Name Plate (above pet)
      this.renderPetHpPlate(petX, petY - 8, this.activePet.name.split(' ')[0], this.petHp, this.petMaxHp, isFainted);
    }

    // 6. Render Monster
    const monsterSize = Math.round(isCompact 
      ? Math.min(w * 0.19, h * 0.34, 125) 
      : Math.min(w * 0.25, h * 0.32, 175));
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (this.monsterHurtTimer > 0) {
      ctx.filter = 'brightness(2.2) drop-shadow(0 0 12px #ff4757)';
    }
    ctx.drawImage(
      this.monsterImg,
      monsterX - monsterSize / 2,
      groundY - monsterSize + 14 + monsterBob,
      monsterSize,
      monsterSize
    );
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

    // 9. Diegetic RPG Battle Plates
    const plateY = isCompact ? Math.max(48, Math.round(h * 0.13)) : Math.round(h * 0.20);
    if (this.player) {
      this.drawCombatantPlate(
        wizardX,
        plateY,
        this.player.name,
        this.player.hp,
        this.player.maxHp,
        'hero',
        'Lv.1 見習法師'
      );
    }

    if (this.monster) {
      this.drawCombatantPlate(
        monsterX,
        plateY,
        this.monster.name,
        this.monster.hp,
        this.monster.maxHp,
        'monster',
        `${this.monster.element ? this.monster.element.toUpperCase() : ''} ${this.monster.isBoss ? 'Boss' : '野生'}`
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

  drawCombatantPlate(x, y, name, hp, maxHp, type, subtitle) {
    const { ctx } = this;
    const isHero = type === 'hero';
    const isCompact = this.canvas.height <= 500;
    const plateW = isCompact ? 190 : 230;
    const plateH = isCompact ? 40 : 54;

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
    ctx.font = isCompact ? 'bold 11px ProdigySans, sans-serif' : 'bold 12px ProdigySans, sans-serif';
    ctx.textAlign = 'left';
    let displayName = name;
    if (displayName.length > (isCompact ? 11 : 14)) {
      displayName = displayName.substring(0, isCompact ? 10 : 13) + '…';
    }
    ctx.fillText(displayName, x - plateW / 2 + 10, y + (isCompact ? 14 : 18));

    ctx.textAlign = 'right';
    ctx.fillStyle = isHero ? '#7bed9f' : '#ff7675';
    ctx.font = isCompact ? 'bold 9.5px ProdigySans, sans-serif' : 'bold 11px ProdigySans, sans-serif';
    ctx.fillText(subtitle, x + plateW / 2 - 10, y + (isCompact ? 14 : 18));

    // HP Bar Outer Groove
    const barX = x - plateW / 2 + 10;
    const barY = y + (isCompact ? 20 : 27);
    const barW = plateW - 20;
    const barH = isCompact ? 12 : 14;

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


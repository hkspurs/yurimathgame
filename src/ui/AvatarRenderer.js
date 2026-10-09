// AvatarRenderer.js - High-fidelity Procedural Paper-Doll Avatar Renderer for Prodigy Math RPG
// Renders dynamic Hair Style (1-6), Hair Color, Eye Color, Skin Tone (1-6), and Archetype

export const SKIN_TONES = {
  1: { base: '#ffeaa7', shadow: '#f3c68f', blush: '#ffb8b8' }, // Tone 1: Fair Peach
  2: { base: '#fed3a5', shadow: '#e5b282', blush: '#f8a5a5' }, // Tone 2: Warm Ivory
  3: { base: '#e0a97c', shadow: '#c48b5f', blush: '#d98282' }, // Tone 3: Sun-kissed Honey
  4: { base: '#ba7a47', shadow: '#9c5f32', blush: '#b06565' }, // Tone 4: Golden Tan
  5: { base: '#87522d', shadow: '#6a3c1e', blush: '#7f443b' }, // Tone 5: Rich Bronze
  6: { base: '#4a2c18', shadow: '#331c0d', blush: '#452119' }  // Tone 6: Deep Cocoa
};

export const HAIR_COLORS = {
  'Light Blonde': { base: '#f5cd79', highlight: '#fff3cd', shadow: '#e5b85a' },
  'Dark Blonde':  { base: '#d1a153', highlight: '#f5cd79', shadow: '#b38237' },
  'Light Brown':  { base: '#a06e4a', highlight: '#c4926f', shadow: '#7a4e2e' },
  'Brown':        { base: '#63391b', highlight: '#8a5229', shadow: '#43230e' },
  'Black':        { base: '#22252a', highlight: '#484f58', shadow: '#131518' },
  'Red':          { base: '#d63031', highlight: '#ff7675', shadow: '#9b1b1c' },
  'Orange':       { base: '#e67e22', highlight: '#f39c12', shadow: '#b85c10' },
  'Amber':        { base: '#f39c12', highlight: '#fed330', shadow: '#c77609' },
  'Green':        { base: '#27ae60', highlight: '#2ecc71', shadow: '#1e8449' },
  'Blue':         { base: '#2980b9', highlight: '#3498db', shadow: '#1c5980' }
};

export const EYE_COLORS = {
  'Light Brown': '#8d5524',
  'Dark Brown':  '#3d2314',
  'Orange':      '#e67e22',
  'Amber':       '#f39c12',
  'Green':       '#27ae60',
  'Blue':        '#2980b9'
};

export const ARCHETYPE_THEMES = {
  apprentice: {
    name: '星光學徒 (Astral Apprentice)',
    robe: '#2e5cb8',
    robeTrim: '#f1c40f',
    cape: '#1b3770',
    hat: '#2e5cb8',
    hatTrim: '#f1c40f',
    gem: '#54a0ff',
    sparkle: '#70a1ff'
  },
  pyro: {
    name: '烈焰術士 (Pyromancer)',
    robe: '#c0392b',
    robeTrim: '#f39c12',
    cape: '#781e14',
    hat: '#c0392b',
    hatTrim: '#f39c12',
    gem: '#ff6b6b',
    sparkle: '#ff9f43'
  },
  tidal: {
    name: '潮汐使者 (Tidal Caller)',
    robe: '#0984e3',
    robeTrim: '#74b9ff',
    cape: '#0c2461',
    hat: '#0984e3',
    hatTrim: '#dff9fb',
    gem: '#00cec9',
    sparkle: '#81ecec'
  },
  frost: {
    name: '極地冰皇 (Frostbringer)',
    robe: '#00cec9',
    robeTrim: '#ffffff',
    cape: '#0984e3',
    hat: '#00cec9',
    hatTrim: '#ffffff',
    gem: '#81ecec',
    sparkle: '#dff9fb'
  },
  scholar: {
    name: '奧術學者 (Arcane Scholar)',
    robe: '#1b8a5a',
    robeTrim: '#2ed573',
    cape: '#0f5234',
    hat: '#1b8a5a',
    hatTrim: '#2ed573',
    gem: '#1dd1a1',
    sparkle: '#10ac84'
  },
  storm: {
    name: '風暴領主 (Stormbringer)',
    robe: '#d4a017',
    robeTrim: '#f1f2f6',
    cape: '#8c680a',
    hat: '#d4a017',
    hatTrim: '#ffffff',
    gem: '#fed330',
    sparkle: '#feca57'
  },
  shadow: {
    name: '暗影魔導 (Shadow Mage)',
    robe: '#6c3483',
    robeTrim: '#a55eea',
    cape: '#3e1c4d',
    hat: '#6c3483',
    hatTrim: '#a55eea',
    gem: '#8854d0',
    sparkle: '#9b59b6'
  }
};

export class AvatarRenderer {
  /**
   * Generates a self-contained SVG string of the customized wizard doll
   */
  static renderSvg({ hairStyle = 1, hairColor = 'Light Brown', eyeColor = 'Dark Brown', skinTone = 1, archetype = 'apprentice', size = 160 }) {
    const skin = SKIN_TONES[skinTone] || SKIN_TONES[1];
    const hair = HAIR_COLORS[hairColor] || HAIR_COLORS['Light Brown'];
    const eye = EYE_COLORS[eyeColor] || EYE_COLORS['Dark Brown'];
    const arch = ARCHETYPE_THEMES[archetype] || ARCHETYPE_THEMES['apprentice'];

    // Hair Style SVG paths
    const hairPaths = this.getHairSvgPaths(Number(hairStyle) || 1, hair);

    return `
      <svg class="prodigy-avatar-doll" viewBox="0 0 160 160" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="doll-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.35" />
          </filter>
          <linearGradient id="wand-spark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="${arch.gem}" />
          </linearGradient>
        </defs>

        <!-- Magic Aura Rings -->
        <circle cx="80" cy="88" r="64" fill="none" stroke="${arch.sparkle}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.45" />

        <!-- Back Hair (Styles with long locks/ponytail) -->
        ${hairPaths.back}

        <!-- Flowing Cape -->
        <path d="M 46 88 C 42 120 48 144 58 146 L 102 146 C 112 144 118 120 114 88 Z" fill="${arch.cape}" filter="url(#doll-shadow)" />

        <!-- Body / Wizard Robe -->
        <path d="M 54 84 C 52 110 50 138 52 145 L 108 145 C 110 138 108 110 106 84 Z" fill="${arch.robe}" />
        <!-- Robe Central Trim & Gem -->
        <path d="M 76 84 L 76 145 L 84 145 L 84 84 Z" fill="${arch.robeTrim}" />
        <circle cx="80" cy="94" r="5" fill="${arch.gem}" stroke="#ffffff" stroke-width="1" />

        <!-- Wizard Sleeves & Hands -->
        <!-- Left Arm/Sleeve -->
        <path d="M 54 86 C 42 96 38 108 42 116 C 46 120 54 112 58 104 Z" fill="${arch.robe}" />
        <!-- Left Hand -->
        <circle cx="41" cy="118" r="6" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="1" />
        <!-- Magic Wand in Hand -->
        <line x1="38" y1="124" x2="26" y2="92" stroke="#8c531b" stroke-width="3" stroke-linecap="round" />
        <polygon points="26,88 29,95 36,95 30,99 32,106 26,102 20,106 22,99 16,95 23,95" fill="url(#wand-spark)" />

        <!-- Right Arm/Sleeve -->
        <path d="M 106 86 C 118 96 122 108 118 116 C 114 120 106 112 102 104 Z" fill="${arch.robe}" />
        <!-- Right Hand -->
        <circle cx="119" cy="118" r="6" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="1" />

        <!-- Neck -->
        <rect x="74" y="74" width="12" height="12" rx="2" fill="${skin.shadow}" />

        <!-- Head / Face -->
        <path d="M 52 50 C 52 30 108 30 108 50 C 108 68 100 80 80 80 C 60 80 52 68 52 50 Z" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="1.2" />

        <!-- Ears -->
        <circle cx="51" cy="54" r="5" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="1" />
        <circle cx="109" cy="54" r="5" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="1" />

        <!-- Blushing Cheeks -->
        <ellipse cx="61" cy="62" rx="5" ry="3" fill="${skin.blush}" opacity="0.65" />
        <ellipse cx="99" cy="62" rx="5" ry="3" fill="${skin.blush}" opacity="0.65" />

        <!-- Cute Anime Eyes -->
        <!-- Left Eye -->
        <g class="doll-eye-left">
          <ellipse cx="66" cy="52" rx="7" ry="8" fill="#ffffff" />
          <ellipse cx="66" cy="52" rx="5.5" ry="6.5" fill="${eye}" />
          <ellipse cx="66" cy="52" rx="3" ry="4" fill="#1b1c20" />
          <!-- Eye Catchlights -->
          <circle cx="64" cy="49" r="2.2" fill="#ffffff" />
          <circle cx="68" cy="55" r="1.2" fill="#ffffff" />
          <!-- Eyelash -->
          <path d="M 58 46 Q 66 43 74 46" fill="none" stroke="#2c1a0e" stroke-width="1.8" stroke-linecap="round" />
        </g>

        <!-- Right Eye -->
        <g class="doll-eye-right">
          <ellipse cx="94" cy="52" rx="7" ry="8" fill="#ffffff" />
          <ellipse cx="94" cy="52" rx="5.5" ry="6.5" fill="${eye}" />
          <ellipse cx="94" cy="52" rx="3" ry="4" fill="#1b1c20" />
          <!-- Eye Catchlights -->
          <circle cx="92" cy="49" r="2.2" fill="#ffffff" />
          <circle cx="96" cy="55" r="1.2" fill="#ffffff" />
          <!-- Eyelash -->
          <path d="M 86 46 Q 94 43 102 46" fill="none" stroke="#2c1a0e" stroke-width="1.8" stroke-linecap="round" />
        </g>

        <!-- Tiny Cute Nose & Smile -->
        <circle cx="80" cy="59" r="1" fill="${skin.shadow}" />
        <path d="M 76 65 Q 80 69 84 65" fill="none" stroke="#683418" stroke-width="1.5" stroke-linecap="round" />

        <!-- Front Hair Layers (Matching selected Hair Style & Color) -->
        ${hairPaths.front}

        <!-- Wizard Pointed Hat -->
        <g class="doll-wizard-hat" filter="url(#doll-shadow)">
          <!-- Hat Brim -->
          <ellipse cx="80" cy="34" rx="46" ry="11" fill="${arch.hat}" />
          <ellipse cx="80" cy="34" rx="44" ry="9.5" fill="none" stroke="${arch.hatTrim}" stroke-width="1.5" />
          <!-- Hat Cone -->
          <path d="M 44 32 C 54 14 62 -2 88 4 C 84 14 96 24 116 32 Z" fill="${arch.hat}" />
          <path d="M 52 30 C 60 16 68 2 88 4 C 86 10 94 18 108 30 Z" fill="${arch.robeTrim}" opacity="0.35" />
          <!-- Hat Band & Crest Gem -->
          <path d="M 48 33 Q 80 38 112 33 Q 80 29 48 33 Z" fill="${arch.hatTrim}" />
          <polygon points="80,26 84,33 80,40 76,33" fill="${arch.gem}" stroke="#ffffff" stroke-width="1" />
        </g>
      </svg>
    `;
  }

  static getHairSvgPaths(style, hair) {
    switch (style) {
      case 1:
        // Style 1: Classic Short Parted Anime Fringe
        return {
          back: `
            <path d="M 48 42 C 40 60 40 74 48 80 L 112 80 C 120 74 120 60 112 42 Z" fill="${hair.shadow}" />
          `,
          front: `
            <path d="M 48 40 C 54 48 62 52 68 46 C 74 54 86 52 92 44 C 98 52 108 46 112 40 C 110 32 50 32 48 40 Z" fill="${hair.base}" />
            <path d="M 56 38 Q 66 33 76 38" fill="none" stroke="${hair.highlight}" stroke-width="2" stroke-linecap="round" />
            <path d="M 84 38 Q 94 33 104 38" fill="none" stroke="${hair.highlight}" stroke-width="2" stroke-linecap="round" />
          `
        };

      case 2:
        // Style 2: Wild Spiky Adventurer Tuft Hair
        return {
          back: `
            <path d="M 44 40 L 38 52 L 44 58 L 40 72 L 50 78 L 110 78 L 120 72 L 116 58 L 122 52 L 116 40 Z" fill="${hair.shadow}" />
          `,
          front: `
            <!-- Left Spikes -->
            <polygon points="46,38 38,48 48,46" fill="${hair.base}" />
            <polygon points="46,46 40,56 50,52" fill="${hair.base}" />
            <!-- Front Spiky Bangs -->
            <polygon points="50,40 56,54 64,44" fill="${hair.base}" />
            <polygon points="62,42 72,56 78,42" fill="${hair.base}" />
            <polygon points="76,42 86,56 94,42" fill="${hair.base}" />
            <polygon points="92,42 104,54 110,40" fill="${hair.base}" />
            <!-- Right Spikes -->
            <polygon points="112,46 120,54 114,44" fill="${hair.base}" />
            <path d="M 58 36 Q 80 30 102 36" fill="none" stroke="${hair.highlight}" stroke-width="2.5" stroke-linecap="round" />
          `
        };

      case 3:
        // Style 3: Cute Bob / Twin Side Bangs
        return {
          back: `
            <path d="M 44 42 C 38 68 42 86 54 90 L 106 90 C 118 86 122 68 116 42 Z" fill="${hair.shadow}" />
          `,
          front: `
            <!-- Left framing lock -->
            <path d="M 46 36 C 44 52 42 68 50 74 C 54 74 52 56 56 46 Z" fill="${hair.base}" />
            <!-- Right framing lock -->
            <path d="M 114 36 C 116 52 118 68 110 74 C 106 74 108 56 104 46 Z" fill="${hair.base}" />
            <!-- Soft Arched Bangs -->
            <path d="M 52 38 Q 66 52 74 44 Q 86 52 108 38 Q 80 32 52 38 Z" fill="${hair.base}" />
            <path d="M 58 36 Q 80 32 102 36" fill="none" stroke="${hair.highlight}" stroke-width="2.5" stroke-linecap="round" />
          `
        };

      case 4:
        // Style 4: Fluffy Voluminous Curly Wizard Locks
        return {
          back: `
            <circle cx="42" cy="54" r="14" fill="${hair.shadow}" />
            <circle cx="44" cy="74" r="14" fill="${hair.shadow}" />
            <circle cx="118" cy="54" r="14" fill="${hair.shadow}" />
            <circle cx="116" cy="74" r="14" fill="${hair.shadow}" />
          `,
          front: `
            <circle cx="46" cy="46" r="11" fill="${hair.base}" />
            <circle cx="48" cy="62" r="10" fill="${hair.base}" />
            <circle cx="114" cy="46" r="11" fill="${hair.base}" />
            <circle cx="112" cy="62" r="10" fill="${hair.base}" />
            <!-- Curly bangs -->
            <path d="M 50 38 Q 64 48 72 40 Q 84 50 92 40 Q 104 48 110 38 Z" fill="${hair.base}" />
            <circle cx="66" cy="40" r="3" fill="${hair.highlight}" />
            <circle cx="94" cy="40" r="3" fill="${hair.highlight}" />
          `
        };

      case 5:
        // Style 5: Long Flowing Wizard Locks (over shoulders)
        return {
          back: `
            <path d="M 40 40 C 30 70 34 110 46 128 L 114 128 C 126 110 130 70 120 40 Z" fill="${hair.shadow}" />
          `,
          front: `
            <!-- Long locks draping on chest -->
            <path d="M 44 40 C 40 68 40 98 48 112 C 52 112 50 88 56 62 Z" fill="${hair.base}" />
            <path d="M 116 40 C 120 68 120 98 112 112 C 108 112 110 88 104 62 Z" fill="${hair.base}" />
            <!-- Royal swept bangs -->
            <path d="M 48 38 Q 68 50 78 40 Q 92 48 112 38 Z" fill="${hair.base}" />
            <path d="M 44 72 Q 46 88 48 104" fill="none" stroke="${hair.highlight}" stroke-width="2" stroke-linecap="round" />
            <path d="M 116 72 Q 114 88 112 104" fill="none" stroke="${hair.highlight}" stroke-width="2" stroke-linecap="round" />
          `
        };

      case 6:
      default:
        // Style 6: Side-Swept Braided Adventurer Fringe
        return {
          back: `
            <path d="M 44 42 C 38 64 40 82 48 94 L 112 94 C 120 82 122 64 116 42 Z" fill="${hair.shadow}" />
            <!-- Side braid hanging on right -->
            <path d="M 112 70 C 124 84 120 108 122 124 C 118 124 114 104 112 88 Z" fill="${hair.base}" />
            <circle cx="121" cy="122" r="3" fill="#f1c40f" />
          `,
          front: `
            <!-- Dynamic Side-Swept Bangs -->
            <path d="M 46 38 C 58 56 78 54 86 44 C 94 52 106 48 114 38 Z" fill="${hair.base}" />
            <path d="M 54 44 Q 72 40 84 34" fill="none" stroke="${hair.highlight}" stroke-width="2" stroke-linecap="round" />
          `
        };
    }
  }
}

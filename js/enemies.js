
export class Enemy {
    constructor(config) {
        this.width = config.width || 30;
        this.height = config.height || 31;
        this.moving = config.moving || false;
        this.frameX = 0;
        this.speed = config.speed || 7;
        this.frameY = config.frameY || 3;
        this.level = config.level || 1;
        this.hp = config.hp || 50;
        this.maxHp = config.hp || 50;
        this.mp = config.mp || 0;
        this.maxMp = config.mp || 0;
        this.atck = config.atck || 10;
        this.def = config.def || 5;
        this.xp = config.xp || 15;
        this.spells = config.spells || [];
        this.name = config.name || 'Enemy';
        this.type = config.type || 'normal';
        this.ai = config.ai || 'basic';
        this.statusEffects = [];
        this.image = config.image || null; // Add image property for enemy sprite
    }

    // Animation
    updateAnimation() {
        if (this.frameX < 3 && this.moving) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }
    }

    // Combat methods
    attack(target) {
        const damage = Math.max(1, this.atck - target.def);
        target.takeDamage(damage);
        return damage;
    }

    castSpell(spellIndex, target) {
        const spell = this.spells[spellIndex];
        if (spell && this.mp >= spell.custo) {
            this.mp -= spell.custo;
            if (target) {
                target.takeDamage(spell.efct);
            } else {
                this.heal(spell.efct);
            }
            return spell.efct;
        }
        return 0;
    }

    // Health and MP management
    takeDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    isDead() {
        return this.hp <= 0;
    }

    getHpPercentage() {
        return Math.round((this.hp / this.maxHp) * 100);
    }

    getMpPercentage() {
        if (this.maxMp === 0) return 0;
        return Math.round((this.mp / this.maxMp) * 100);
    }

    // AI behavior
    chooseAction(player) {
        if (this.ai === 'aggressive') {
            return this.aggressiveAI(player);
        } else if (this.ai === 'defensive') {
            return this.defensiveAI(player);
        } else if (this.ai === 'magic') {
            return this.magicAI(player);
        } else {
            return this.basicAI(player);
        }
    }

    basicAI(player) {
        // 70% chance to attack, 30% chance to use spell if available
        if (this.spells.length > 0 && Math.random() < 0.3 && this.mp >= this.spells[0].custo) {
            return { action: 'spell', target: player, spellIndex: 0 };
        } else {
            return { action: 'attack', target: player };
        }
    }

    aggressiveAI(player) {
        // 90% chance to attack, 10% chance to use spell
        if (this.spells.length > 0 && Math.random() < 0.1 && this.mp >= this.spells[0].custo) {
            return { action: 'spell', target: player, spellIndex: 0 };
        } else {
            return { action: 'attack', target: player };
        }
    }

    defensiveAI(player) {
        // Heal if HP is low, otherwise attack
        if (this.hp < this.maxHp * 0.3 && this.spells.some(spell => spell.nome === 'cura')) {
            const healSpellIndex = this.spells.findIndex(spell => spell.nome === 'cura');
            return { action: 'spell', target: this, spellIndex: healSpellIndex };
        } else {
            return { action: 'attack', target: player };
        }
    }

    magicAI(player) {
        // 80% chance to use spells, 20% chance to attack
        if (this.spells.length > 0 && Math.random() < 0.8 && this.mp >= this.spells[0].custo) {
            return { action: 'spell', target: player, spellIndex: 0 };
        } else {
            return { action: 'attack', target: player };
        }
    }

    // Status checks
    isAlive() {
        return this.hp > 0;
    }

    // Status effects
    addStatusEffect(effect) {
        this.statusEffects.push(effect);
    }

    removeStatusEffect(effectType) {
        this.statusEffects = this.statusEffects.filter(effect => effect.type !== effectType);
    }

    updateStatusEffects() {
        this.statusEffects.forEach(effect => {
            effect.duration--;
            if (effect.duration <= 0) {
                this.removeStatusEffect(effect.type);
            }
        });
    }
}

// Enemy factory - creates different enemy types with level-based spawning
export class EnemyFactory {
    // Define enemy templates with their base level and scaling properties
    static enemyTemplates = {
        1: { // Morcego (Bat) - Early game enemy
            name: "Morcego",
            type: "bat",
            baseLevel: 1,
            maxLevel: 5,
            baseHp: 30,
            baseMp: 0,
            baseAtck: 8,
            baseDef: 3,
            baseXp: 10,
            spells: [],
            image: 'bat.png',
            ai: 'basic'
        },
        2: { // Slime - Early to mid game
            name: "Slime",
            type: "slime",
            baseLevel: 3,
            maxLevel: 10,
            baseHp: 60,
            baseMp: 20,
            baseAtck: 12,
            baseDef: 8,
            baseXp: 25,
            spells: [],
            image: 'slime.png',
            ai: 'basic'
        },
        3: { // Bandido - Mid game
            name: "Bandido",
            type: "bandit",
            baseLevel: 6,
            maxLevel: 15,
            baseHp: 80,
            baseMp: 40,
            baseAtck: 15,
            baseDef: 10,
            baseXp: 50,
            spells: [
                {
                    nome: "cura",
                    afeito: "cura 10 de hp",
                    efct: 10,
                    sound: true,
                    custo: 10
                },
                {
                    nome: "Lança Eteril",
                    afeito: "Causa 15 de dano no inimigo",
                    efct: 15,
                    sound: true,
                    custo: 30
                }
            ],
            image: 'bat.png',
            ai: 'defensive'
        },
        4: { // Mago das Trevas - Mid to late game
            name: "Mago das Trevas",
            type: "dark_mage",
            baseLevel: 10,
            maxLevel: 25,
            baseHp: 120,
            baseMp: 80,
            baseAtck: 18,
            baseDef: 12,
            baseXp: 100,
            spells: [
                {
                    nome: "cura",
                    afeito: "cura 15 de hp",
                    efct: 15,
                    sound: true,
                    custo: 15
                },
                {
                    nome: "Lança Eteril",
                    afeito: "Causa 20 de dano no inimigo",
                    efct: 20,
                    sound: true,
                    custo: 35
                }
            ],
            image: 'slime.png',
            ai: 'magic'
        },
        5: { // Guerreiro Elite - Late game
            name: "Guerreiro Elite",
            type: "elite_warrior",
            baseLevel: 15,
            maxLevel: 35,
            baseHp: 200,
            baseMp: 60,
            baseAtck: 25,
            baseDef: 18,
            baseXp: 200,
            spells: [
                {
                    nome: "cura",
                    afeito: "cura 25 de hp",
                    efct: 25,
                    sound: true,
                    custo: 20
                },
                {
                    nome: "Lança Eteril",
                    afeito: "Causa 25 de dano no inimigo",
                    efct: 25,
                    sound: true,
                    custo: 40
                }
            ],
            image: 'bat.png',
            ai: 'aggressive'
        },
        6: { // Baltazar - Boss enemy
            name: "Baltazar",
            type: "boss",
            baseLevel: 25,
            maxLevel: 50,
            baseHp: 500,
            baseMp: 200,
            baseAtck: 35,
            baseDef: 25,
            baseXp: 1000,
            spells: [
                {
                    nome: "ad eforum",
                    afeito: "cura 100 de hp",
                    efct: 100,
                    sound: true,
                    custo: 50
                },
                {
                    nome: "Et Engler braur",
                    afeito: "Causa 80 de dano mágico",
                    efct: 80,
                    sound: true,
                    custo: 60
                },
                {
                    nome: "Sanctus Dominium",
                    afeito: "Causa 100 de dano mágico",
                    efct: 100,
                    sound: true,
                    custo: 80
                }
            ],
            image: 'slime.png',
            ai: 'magic'
        }
    };

    static createEnemy(type, targetLevel = null) {
        const template = this.enemyTemplates[type];
        if (!template) {
            return this.createDefaultEnemy();
        }

        // If no target level specified, use base level
        const enemyLevel = targetLevel || template.baseLevel;

        // Scale enemy stats based on level
        const scaledEnemy = this.scaleEnemyToLevel(template, enemyLevel);

        return new Enemy(scaledEnemy);
    }

    // Scale enemy stats based on level difference from base level
    static scaleEnemyToLevel(template, targetLevel) {
        const levelDifference = targetLevel - template.baseLevel;
        const scaleFactor = Math.max(1, 1 + (levelDifference * 0.15)); // 15% increase per level

        return {
            name: template.name,
            type: template.type,
            level: targetLevel,
            hp: Math.floor(template.baseHp * scaleFactor),
            maxHp: Math.floor(template.baseHp * scaleFactor),
            mp: Math.floor(template.baseMp * scaleFactor),
            maxMp: Math.floor(template.baseMp * scaleFactor),
            atck: Math.floor(template.baseAtck * scaleFactor),
            def: Math.floor(template.baseDef * scaleFactor),
            xp: Math.floor(template.baseXp * scaleFactor),
            spells: this.scaleSpells(template.spells, scaleFactor),
            image: template.image,
            ai: template.ai
        };
    }

    // Scale spell effects based on enemy level
    static scaleSpells(spells, scaleFactor) {
        return spells.map(spell => ({
            ...spell,
            efct: Math.floor(spell.efct * scaleFactor),
            custo: Math.max(5, Math.floor(spell.custo * scaleFactor * 0.8)) // Slightly reduce MP cost scaling
        }));
    }

    // Get appropriate enemies for player level
    static getAppropriateEnemiesForLevel(playerLevel) {
        const appropriateEnemies = [];

        Object.keys(this.enemyTemplates).forEach(enemyType => {
            const template = this.enemyTemplates[enemyType];
            const minLevel = template.baseLevel;
            const maxLevel = template.maxLevel;

            // Check if this enemy type can appear at player's level range
            // Enemy can appear if player is within enemy's level range, or if enemy can be scaled down
            if (playerLevel >= minLevel - 2 && playerLevel <= maxLevel + 3) {
                appropriateEnemies.push(parseInt(enemyType));
            }
        });

        return appropriateEnemies;
    }

    // Get level-appropriate random enemy
    static getLevelAppropriateEnemy(playerLevel) {
        console.log(`🎯 Spawning enemy for player level ${playerLevel}`);

        // Get enemies that can appear at this level
        const appropriateEnemyTypes = this.getAppropriateEnemiesForLevel(playerLevel);

        if (appropriateEnemyTypes.length === 0) {
            console.warn(`No appropriate enemies for level ${playerLevel}, using default`);
            return this.createDefaultEnemy();
        }

        // Select random enemy type from appropriate ones
        const randomType = appropriateEnemyTypes[Math.floor(Math.random() * appropriateEnemyTypes.length)];

        // Determine enemy level (player level ± 3, but within enemy's valid range)
        const template = this.enemyTemplates[randomType];
        const minEnemyLevel = Math.max(template.baseLevel, playerLevel - 1); // At most 1 level below player
        const maxEnemyLevel = Math.min(template.maxLevel, playerLevel + 3); // At most 3 levels above player

        const enemyLevel = minEnemyLevel + Math.floor(Math.random() * (maxEnemyLevel - minEnemyLevel + 1));

        console.log(`📊 Selected enemy: ${template.name} (Type ${randomType}) at level ${enemyLevel}`);
        console.log(`📈 Level range: ${minEnemyLevel}-${maxEnemyLevel}, Player: ${playerLevel}`);

        return this.createEnemy(randomType, enemyLevel);
    }

    // Fallback for legacy getRandomEnemy method
    static getRandomEnemy(playerLevel = 1) {
        return this.getLevelAppropriateEnemy(playerLevel);
    }

    // Create default enemy as fallback
    static createDefaultEnemy() {
        return new Enemy({
            name: "Morcego Fraco",
            type: "bat",
            level: 1,
            hp: 25,
            maxHp: 25,
            mp: 0,
            maxMp: 0,
            atck: 6,
            def: 2,
            xp: 8,
            spells: [],
            image: 'bat.png',
            ai: 'basic'
        });
    }

    // Get enemy difficulty rating for UI display
    static getEnemyDifficulty(enemyLevel, playerLevel) {
        const levelDiff = enemyLevel - playerLevel;

        if (levelDiff <= -2) return { text: "Muito Fácil", color: "#90EE90" };
        if (levelDiff === -1) return { text: "Fácil", color: "#32CD32" };
        if (levelDiff === 0) return { text: "Equilibrado", color: "#FFD700" };
        if (levelDiff === 1) return { text: "Desafiador", color: "#FFA500" };
        if (levelDiff === 2) return { text: "Difícil", color: "#FF6347" };
        if (levelDiff >= 3) return { text: "Muito Difícil", color: "#DC143C" };

        return { text: "Desconhecido", color: "#FFFFFF" };
    }
}

// Bestiary for reference
export const BESTIARY = {
    1: "morcego",
    2: "slime",
    3: "bandidos",
    4: "mago_das_trevas",
    5: "guerreiro_elite",
    6: "baltazar"
}; 
import { GAME_CONFIG } from './constants.js';

export class Player {
    constructor() {
        this.width = 30;
        this.height = 31;
        this.X = 300;
        this.Y = 168;
        this.moving = false;
        this.frameX = 0;
        this.speed = 7;
        this.frameY = 3;
        this.level = 1;
        this.hp = 50;
        this.maxHp = 50;
        this.mp = 50;
        this.maxMp = 50;
        this.atck = 11;
        this.def = 8;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.gold = 100; // Starting gold
        this.spells = [];
        this.inventory = [];
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };
    }

    // Movement and animation
    updateAnimation() {
        if (this.frameX < 3 && this.moving) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }
    }

    move(direction, worldEnvironment) {
        if (worldEnvironment.freeWalking < GAME_CONFIG.FREE_WALKING_LIMIT) {
            switch (direction) {
                case 'left':
                    this.X -= this.speed;
                    this.frameY = 1;
                    this.moving = true;
                    worldEnvironment.freeWalking += GAME_CONFIG.BATTLE_CHANCE_INCREMENT;
                    break;
                case 'up':
                    this.Y -= this.speed;
                    this.frameY = 3;
                    this.moving = true;
                    worldEnvironment.freeWalking += 1;
                    break;
                case 'right':
                    this.X += this.speed;
                    this.frameY = 2;
                    this.moving = true;
                    worldEnvironment.freeWalking += GAME_CONFIG.BATTLE_CHANCE_INCREMENT;
                    break;
                case 'down':
                    this.Y += this.speed;
                    this.frameY = 0;
                    this.moving = true;
                    worldEnvironment.freeWalking += 1;
                    break;
            }
            return false; // No battle triggered
        } else {
            console.log(`BATTLE TRIGGERED! FreeWalking: ${worldEnvironment.freeWalking} >= ${GAME_CONFIG.FREE_WALKING_LIMIT}`);
            return true; // Battle should be triggered
        }
    }

    stopWalking() {
        this.moving = false;
    }

    // Combat methods
    attack(enemy) {
        const damage = Math.max(1, this.atck - enemy.def);
        enemy.hp -= damage;
        return damage;
    }

    castSpell(spellIndex, target) {
        const spell = this.spells[spellIndex];
        if (spell && this.mp >= spell.custo) {
            this.mp -= spell.custo;
            if (target) {
                target.hp -= spell.efct;
            } else {
                this.hp = Math.min(this.maxHp, this.hp + spell.efct);
            }
            return spell.efct;
        }
        return 0;
    }

    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.def);
        this.hp -= actualDamage;
        return actualDamage;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    restoreMp(amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
    }

    // Experience and leveling
    gainExperience(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);

        // Increase stats
        this.maxHp += 10;
        this.hp = this.maxHp;
        this.maxMp += 5;
        this.mp = this.maxMp;
        this.atck += 2;
        this.def += 1;
    }

    // Status checks
    isAlive() {
        return this.hp > 0;
    }

    isDead() {
        return this.hp <= 0;
    }

    getHpPercentage() {
        return (this.hp / this.maxHp) * 100;
    }

    getMpPercentage() {
        return (this.mp / this.maxMp) * 100;
    }

    // Inventory methods
    addItem(item) {
        // Generate unique ID for item
        item.id = Date.now() + Math.random();
        this.inventory.push(item);
        console.log(`📦 Added ${item.name} to inventory`);
    }

    removeItem(itemIndex) {
        if (itemIndex >= 0 && itemIndex < this.inventory.length) {
            return this.inventory.splice(itemIndex, 1)[0];
        }
        return null;
    }

    useItem(itemId) {
        const itemIndex = this.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return false;

        const item = this.inventory[itemIndex];

        if (item.type === 'consumable' && item.effect === 'heal') {
            const healAmount = item.value;
            const actualHeal = Math.min(healAmount, this.maxHp - this.hp);
            this.hp += actualHeal;

            // Remove item from inventory
            this.inventory.splice(itemIndex, 1);

            console.log(`❤️ Used ${item.name}! Healed ${actualHeal} HP`);
            return true;
        }

        return false;
    }

    // Equipment methods
    equipItem(item) {
        if (item.type === 'weapon') {
            // Unequip current weapon if any
            if (this.equipment.weapon) {
                this.unequipItem('weapon');
            }
            this.equipment.weapon = item;
            this.atck += item.attackBonus || 0;
            console.log(`⚔️ Equipped ${item.name}! Attack increased by ${item.attackBonus}`);
        } else if (item.type === 'armor') {
            // Unequip current armor if any
            if (this.equipment.armor) {
                this.unequipItem('armor');
            }
            this.equipment.armor = item;
            this.def += item.defenseBonus || 0;
            console.log(`🛡️ Equipped ${item.name}! Defense increased by ${item.defenseBonus}`);
        }

        // Remove item from inventory
        const itemIndex = this.inventory.findIndex(invItem => invItem.id === item.id);
        if (itemIndex !== -1) {
            this.inventory.splice(itemIndex, 1);
        }
    }

    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return;

        if (slot === 'weapon') {
            this.atck -= item.attackBonus || 0;
        } else if (slot === 'armor') {
            this.def -= item.defenseBonus || 0;
        }

        // Add item back to inventory
        this.inventory.push(item);
        this.equipment[slot] = null;

        console.log(`📦 Unequipped ${item.name}`);
    }

    applyEquipmentStats(item) {
        if (item.stats) {
            this.atck += item.stats.atck || 0;
            this.def += item.stats.def || 0;
            this.maxHp += item.stats.hp || 0;
            this.maxMp += item.stats.mp || 0;
        }
    }

    removeEquipmentStats(item) {
        if (item.stats) {
            this.atck -= item.stats.atck || 0;
            this.def -= item.stats.def || 0;
            this.maxHp -= item.stats.hp || 0;
            this.maxMp -= item.stats.mp || 0;
        }
    }

    // Gold management methods
    addGold(amount) {
        this.gold += amount;
        console.log(`💰 Gained ${amount} gold! Total: ${this.gold}`);
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            console.log(`💸 Spent ${amount} gold! Remaining: ${this.gold}`);
            return true;
        }
        console.log(`❌ Not enough gold! Need ${amount}, have ${this.gold}`);
        return false;
    }

    hasGold(amount) {
        return this.gold >= amount;
    }

    // Save/Load methods
    toJSON() {
        return {
            X: this.X,
            Y: this.Y,
            level: this.level,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            atck: this.atck,
            def: this.def,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            spells: this.spells,
            inventory: this.inventory,
            equipment: this.equipment,
            gold: this.gold
        };
    }

    fromJSON(data) {
        Object.assign(this, data);
    }
} 
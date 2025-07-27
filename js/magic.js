import { MAGIC_SCHOOLS } from './constants.js';

export class Spell {
    constructor(config) {
        this.nome = config.nome;
        this.escola = config.escola;
        this.custo = config.custo;
        this.efeito = config.efeito;
        this.efct = config.efct || { dano: 0, efeito: null };
        this.valor = config.valor || 0;
        this.alvo = config.alvo || 'enemy';
        this.tipo = config.tipo || 'damage';
        this.duration = config.duration || 1;
        this.range = config.range || 1;
        this.accuracy = config.accuracy || 100;
    }

    cast(caster, target) {
        if (caster.mp < this.custo) {
            return { success: false, message: 'MP insuficiente' };
        }

        // Check accuracy
        if (Math.random() * 100 > this.accuracy) {
            return { success: false, message: 'Feitiço falhou!' };
        }

        caster.mp -= this.custo;

        switch (this.tipo) {
            case 'damage':
                return this.castDamage(caster, target);
            case 'heal':
                return this.castHeal(caster, target);
            case 'buff':
                return this.castBuff(caster, target);
            case 'debuff':
                return this.castDebuff(caster, target);
            case 'status':
                return this.castStatus(caster, target);
            default:
                return this.castDamage(caster, target);
        }
    }

    castDamage(caster, target) {
        const damage = this.efct.dano;
        if (target) {
            target.takeDamage(damage);
            return {
                success: true,
                message: `${caster.name || 'Você'} causou ${damage} de dano!`,
                damage: damage
            };
        }
        return { success: false, message: 'Alvo inválido' };
    }

    castHeal(caster, target) {
        const heal = this.efct.dano;
        if (target) {
            target.heal(heal);
            return {
                success: true,
                message: `${target.name || 'Você'} foi curado em ${heal} HP!`,
                heal: heal
            };
        }
        return { success: false, message: 'Alvo inválido' };
    }

    castBuff(caster, target) {
        const effect = {
            type: this.efct.efeito,
            duration: this.duration,
            value: this.efct.dano
        };

        if (target) {
            target.addStatusEffect(effect);
            return {
                success: true,
                message: `${target.name || 'Você'} recebeu um buff!`,
                effect: effect
            };
        }
        return { success: false, message: 'Alvo inválido' };
    }

    castDebuff(caster, target) {
        const effect = {
            type: this.efct.efeito,
            duration: this.duration,
            value: this.efct.dano
        };

        if (target) {
            target.addStatusEffect(effect);
            return {
                success: true,
                message: `${target.name || 'Inimigo'} foi afetado por um debuff!`,
                effect: effect
            };
        }
        return { success: false, message: 'Alvo inválido' };
    }

    castStatus(caster, target) {
        const effect = {
            type: this.efct.efeito,
            duration: this.duration,
            value: this.efct.dano
        };

        if (target) {
            target.addStatusEffect(effect);
            return {
                success: true,
                message: `${target.name || 'Inimigo'} foi afetado por ${this.efct.efeito}!`,
                effect: effect
            };
        }
        return { success: false, message: 'Alvo inválido' };
    }
}

export class MagicSystem {
    constructor() {
        this.spells = this.initializeSpells();
        this.kinesis = this.initializeKinesis();
    }

    initializeSpells() {
        return [
            new Spell({
                nome: "Fera interior",
                escola: MAGIC_SCHOOLS.ILLUSION,
                custo: 50,
                efeito: "Aumenta o dano do personagem em 50 ao custo de HP",
                efct: { dano: 50, efeito: "buff" },
                valor: 300,
                alvo: "player",
                tipo: "buff",
                duration: 3
            }),

            new Spell({
                nome: "Sopro de Lathare",
                escola: MAGIC_SCHOOLS.ELEMENTAL,
                custo: 100,
                efeito: "Lança um vento poderoso contra os inimigos que causa 150 de dano",
                efct: { dano: 150, efeito: null },
                valor: 600,
                alvo: "enemy",
                tipo: "damage"
            }),

            new Spell({
                nome: "Benção de zuldazar",
                escola: MAGIC_SCHOOLS.ELEMENTAL,
                custo: 100,
                efeito: "Lança uma enorme onda sobre os inimigos, que causa 150 de dano",
                efct: { dano: 150, efeito: null },
                valor: 600,
                alvo: "enemy",
                tipo: "damage"
            }),

            new Spell({
                nome: "Lança Eteril",
                escola: MAGIC_SCHOOLS.DESTRUCTION,
                custo: 20,
                efeito: "Dispara uma lança de caos, que ignora defesa, e causa 10 de dano",
                efct: { dano: 10, efeito: null },
                valor: 100,
                alvo: "enemy",
                tipo: "damage"
            }),

            new Spell({
                nome: "Lança Negra de Zulthun",
                escola: MAGIC_SCHOOLS.PROFANATION,
                custo: 30,
                efeito: "Invoca os poderes malignos de zulthun, para inflingir 50 de dano aos inimigos (Não afeta seres das trevas)",
                efct: { dano: 50, efeito: null },
                valor: 1000,
                alvo: "enemy",
                tipo: "damage"
            }),

            new Spell({
                nome: "Escuridão interior",
                escola: MAGIC_SCHOOLS.PROFANATION,
                custo: 50,
                efeito: "Encha seu corpo com energia maligna, aumentando seu dano por 50 (Não afeta seres das trevas)",
                efct: { dano: 50, efeito: "buff" },
                valor: 1500,
                alvo: "player",
                tipo: "buff",
                duration: 3
            }),

            new Spell({
                nome: "Lua Negra",
                escola: MAGIC_SCHOOLS.PROFANATION,
                custo: 150,
                efeito: "Invoca a lua negra de Zal'Taraut, causando sono profundo em seus inimigos (Não afeta seres das trevas)",
                valor: 1000,
                alvo: "enemy",
                tipo: "status",
                efct: { dano: 0, efeito: "sleep" },
                duration: 2
            }),

            new Spell({
                nome: "Durmstrang",
                escola: MAGIC_SCHOOLS.PROFANATION,
                custo: 200,
                efeito: "Cause dor e agonia aos seus inimigos, fazendo-os morrer lentamente, cause 500 de dano (Não afeta seres das trevas)",
                valor: 1000,
                alvo: "enemy",
                tipo: "damage",
                efct: { dano: 500, efeito: null }
            }),

            new Spell({
                nome: "Mors impia",
                escola: MAGIC_SCHOOLS.PROFANATION,
                custo: 50,
                efeito: "Cause dor e agonia aos seus inimigos (Não afeta seres das trevas)",
                valor: 1000,
                alvo: "enemy",
                tipo: "damage",
                efct: { dano: 500, efeito: null }
            }),

            new Spell({
                nome: "Luz de Anathor",
                escola: MAGIC_SCHOOLS.RESTORATION,
                custo: 50,
                efeito: "Cure suas feridas, lave sua alma, receba 100 pontos de vida",
                valor: 1000,
                alvo: "player",
                tipo: "heal",
                efct: { dano: 100, efeito: "buff" }
            })
        ];
    }

    initializeKinesis() {
        return [
            // Kinesis abilities - special powers unique to the player
            new Spell({
                nome: "Telecinese",
                escola: "Kinesis",
                custo: 25,
                efeito: "Move objetos com a mente, causando 30 de dano",
                efct: { dano: 30, efeito: null },
                valor: 500,
                alvo: "enemy",
                tipo: "damage"
            }),

            new Spell({
                nome: "Barreira Psíquica",
                escola: "Kinesis",
                custo: 40,
                efeito: "Cria uma barreira mental que reduz dano em 50% por 2 turnos",
                efct: { dano: 50, efeito: "barrier" },
                valor: 800,
                alvo: "player",
                tipo: "buff",
                duration: 2
            }),

            new Spell({
                nome: "Explosão Mental",
                escola: "Kinesis",
                custo: 80,
                efeito: "Libera energia psíquica que causa 200 de dano a todos os inimigos",
                efct: { dano: 200, efeito: null },
                valor: 1200,
                alvo: "all_enemies",
                tipo: "damage"
            })
        ];
    }

    getSpellByName(name) {
        return this.spells.find(spell => spell.nome === name) ||
            this.kinesis.find(kinesis => kinesis.nome === name);
    }

    getSpellsBySchool(school) {
        return this.spells.filter(spell => spell.escola === school);
    }

    getKinesisAbilities() {
        return this.kinesis;
    }

    getAllSpells() {
        return [...this.spells, ...this.kinesis];
    }

    canCastSpell(caster, spellName) {
        const spell = this.getSpellByName(spellName);
        return spell && caster.mp >= spell.custo;
    }

    castSpell(caster, spellName, target) {
        const spell = this.getSpellByName(spellName);
        if (spell) {
            return spell.cast(caster, target);
        }
        return { success: false, message: 'Feitiço não encontrado' };
    }

    // Spell learning system
    learnSpell(character, spellName) {
        const spell = this.getSpellByName(spellName);
        if (spell && !character.spells.find(s => s.nome === spellName)) {
            character.spells.push(spell);
            return true;
        }
        return false;
    }

    // Spell requirements checking
    checkSpellRequirements(character, spellName) {
        const spell = this.getSpellByName(spellName);
        if (!spell) return false;

        // Check level requirement
        if (character.level < spell.levelRequirement) {
            return false;
        }

        // Check school mastery
        if (spell.schoolRequirement && !character.masteredSchools.includes(spell.escola)) {
            return false;
        }

        return true;
    }
}

// Status effect system
export class StatusEffect {
    constructor(type, duration, value) {
        this.type = type;
        this.duration = duration;
        this.value = value;
        this.applied = false;
    }

    apply(target) {
        if (!this.applied) {
            switch (this.type) {
                case 'poison':
                    target.poisoned = true;
                    break;
                case 'paralysis':
                    target.paralyzed = true;
                    break;
                case 'sleep':
                    target.asleep = true;
                    break;
                case 'buff':
                    target.atck += this.value;
                    break;
                case 'debuff':
                    target.atck = Math.max(1, target.atck - this.value);
                    break;
            }
            this.applied = true;
        }
    }

    remove(target) {
        switch (this.type) {
            case 'poison':
                target.poisoned = false;
                break;
            case 'paralysis':
                target.paralyzed = false;
                break;
            case 'sleep':
                target.asleep = false;
                break;
            case 'buff':
                target.atck -= this.value;
                break;
            case 'debuff':
                target.atck += this.value;
                break;
        }
    }

    update(target) {
        this.duration--;

        // Apply periodic effects
        if (this.type === 'poison' && this.duration > 0) {
            target.takeDamage(Math.floor(this.value / 2));
        }

        return this.duration <= 0;
    }
} 
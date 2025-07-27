import { AUDIO_FILES } from './constants.js';

export class AudioManager {
    constructor() {
        this.music = {};
        this.soundEffects = {};
        this.currentMusic = null;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.masterVolume = 1.0;
        this.isMuted = false;
        this.loadAudio();
    }

    loadAudio() {
        // Load music tracks
        this.music.darkMagic = this.loadAudioFile(AUDIO_FILES.DARK_MAGIC, 'music');
        this.music.windsOfStories = this.loadAudioFile(AUDIO_FILES.WINDS_OF_STORIES, 'music');
        this.music.menuMusic = this.loadAudioFile(AUDIO_FILES.MENU_MUSIC, 'music');
        this.music.invasionOfChaos = this.loadAudioFile(AUDIO_FILES.INVASION_OF_CHAOS, 'music');
        this.music.battleMusic = this.loadAudioFile(AUDIO_FILES.BATTLE_MUSIC, 'music');

        // Load sound effects
        this.soundEffects.attack = this.loadAudioFile('./sounds/attack.wav', 'sfx');
        this.soundEffects.magic = this.loadAudioFile('./sounds/magic.wav', 'sfx');
        this.soundEffects.heal = this.loadAudioFile('./sounds/heal.wav', 'sfx');
        this.soundEffects.levelUp = this.loadAudioFile('./sounds/levelup.wav', 'sfx');
        this.soundEffects.menuSelect = this.loadAudioFile('./sounds/menu_select.wav', 'sfx');
        this.soundEffects.menuConfirm = this.loadAudioFile('./sounds/menu_confirm.wav', 'sfx');
        this.soundEffects.footstep = this.loadAudioFile('./sounds/footstep.wav', 'sfx');
        this.soundEffects.battleStart = this.loadAudioFile('./sounds/battle_start.wav', 'sfx');
        this.soundEffects.battleEnd = this.loadAudioFile('./sounds/battle_end.wav', 'sfx');
    }

    loadAudioFile(src, type) {
        const audio = new Audio();
        audio.src = src;
        audio.preload = 'auto';

        // Set default volume based on type
        if (type === 'music') {
            audio.volume = this.musicVolume * this.masterVolume;
            audio.loop = true;
        } else {
            audio.volume = this.sfxVolume * this.masterVolume;
        }

        return audio;
    }

    // Music control methods
    playMusic(trackName) {
        if (this.isMuted) return;

        const track = this.music[trackName];
        if (track) {
            this.stopCurrentMusic();
            this.currentMusic = track;
            track.currentTime = 0;
            track.play().catch(error => {
                console.warn('Failed to play music:', error);
            });
        }
    }

    stopCurrentMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && this.isMuted === false) {
            this.currentMusic.play().catch(error => {
                console.warn('Failed to resume music:', error);
            });
        }
    }

    fadeOutMusic(duration = 1000) {
        if (!this.currentMusic) return;

        const startVolume = this.currentMusic.volume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;

        const fadeInterval = setInterval(() => {
            if (this.currentMusic.volume > volumeStep) {
                this.currentMusic.volume -= volumeStep;
            } else {
                this.stopCurrentMusic();
                clearInterval(fadeInterval);
            }
        }, stepDuration);
    }

    fadeInMusic(trackName, duration = 1000) {
        const track = this.music[trackName];
        if (!track) return;

        this.stopCurrentMusic();
        this.currentMusic = track;
        track.volume = 0;
        track.currentTime = 0;
        track.play().catch(error => {
            console.warn('Failed to play music:', error);
        });

        const targetVolume = this.musicVolume * this.masterVolume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;

        const fadeInterval = setInterval(() => {
            if (track.volume < targetVolume - volumeStep) {
                track.volume += volumeStep;
            } else {
                track.volume = targetVolume;
                clearInterval(fadeInterval);
            }
        }, stepDuration);
    }

    // Sound effect methods
    playSound(soundName) {
        if (this.isMuted) return;

        const sound = this.soundEffects[soundName];
        if (sound) {
            // Clone the audio to allow multiple simultaneous plays
            const soundClone = sound.cloneNode();
            soundClone.volume = this.sfxVolume * this.masterVolume;
            soundClone.play().catch(error => {
                console.warn('Failed to play sound effect:', error);
            });
        }
    }

    playSoundOnce(soundName) {
        if (this.isMuted) return;

        const sound = this.soundEffects[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn('Failed to play sound effect:', error);
            });
        }
    }

    // Volume control methods
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolumes();
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateSFXVolumes();
    }

    updateAllVolumes() {
        this.updateMusicVolumes();
        this.updateSFXVolumes();
    }

    updateMusicVolumes() {
        Object.values(this.music).forEach(track => {
            track.volume = this.musicVolume * this.masterVolume;
        });
    }

    updateSFXVolumes() {
        Object.values(this.soundEffects).forEach(sound => {
            sound.volume = this.sfxVolume * this.masterVolume;
        });
    }

    // Mute/Unmute methods
    mute() {
        this.isMuted = true;
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    unmute() {
        this.isMuted = false;
        if (this.currentMusic) {
            this.currentMusic.play().catch(error => {
                console.warn('Failed to resume music after unmute:', error);
            });
        }
    }

    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    // Game-specific audio methods
    playBattleMusic() {
        this.fadeOutMusic(500);
        setTimeout(() => {
            this.fadeInMusic('battleMusic', 500);
        }, 500);
    }

    playMenuMusic() {
        this.fadeOutMusic(500);
        setTimeout(() => {
            this.fadeInMusic('menuMusic', 500);
        }, 500);
    }

    playExplorationMusic() {
        this.fadeOutMusic(500);
        setTimeout(() => {
            this.fadeInMusic('windsOfStories', 500);
        }, 500);
    }

    playDarkMusic() {
        this.playMusic('darkMagic');
    }

    playWindsOfStories() {
        this.playMusic('windsOfStories');
    }

    playInvasionOfChaos() {
        this.playMusic('invasionOfChaos');
    }

    pauseWindsOfStories() {
        if (this.music.windsOfStories) {
            this.music.windsOfStories.pause();
        }
    }

    pauseDarkMusic() {
        if (this.music.darkMagic) {
            this.music.darkMagic.pause();
        }
    }

    playChaosMusic() {
        this.playMusic('invasionOfChaos');
    }

    // Combat sound effects
    playAttackSound() {
        this.playSound('attack');
    }

    playMagicSound() {
        this.playSound('magic');
    }

    playHealSound() {
        this.playSound('heal');
    }

    playLevelUpSound() {
        this.playSound('levelUp');
    }

    playBattleStartSound() {
        this.playSound('battleStart');
    }

    playBattleEndSound() {
        this.playSound('battleEnd');
    }

    // UI sound effects
    playMenuSelectSound() {
        this.playSound('menuSelect');
    }

    playMenuConfirmSound() {
        this.playSound('menuConfirm');
    }

    playFootstepSound() {
        this.playSound('footstep');
    }

    // Audio state management
    getAudioState() {
        return {
            currentMusic: this.currentMusic ? this.currentMusic.src : null,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            masterVolume: this.masterVolume,
            isMuted: this.isMuted
        };
    }

    setAudioState(state) {
        this.musicVolume = state.musicVolume || 0.7;
        this.sfxVolume = state.sfxVolume || 0.8;
        this.masterVolume = state.masterVolume || 1.0;
        this.isMuted = state.isMuted || false;
        this.updateAllVolumes();
    }

    // Cleanup method
    dispose() {
        this.stopCurrentMusic();
        Object.values(this.music).forEach(track => {
            track.pause();
            track.src = '';
        });
        Object.values(this.soundEffects).forEach(sound => {
            sound.pause();
            sound.src = '';
        });
    }
}

// Audio presets for different game states
export const AUDIO_PRESETS = {
    MENU: {
        music: 'menuMusic',
        volume: 0.6
    },
    EXPLORATION: {
        music: 'windsOfStories',
        volume: 0.5
    },
    BATTLE: {
        music: 'battleMusic',
        volume: 0.7
    },
    DARK_AREA: {
        music: 'darkMagic',
        volume: 0.4
    },
    CHAOS: {
        music: 'invasionOfChaos',
        volume: 0.8
    }
}; 
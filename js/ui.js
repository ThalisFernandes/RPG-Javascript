
export class UI {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fonts = {
            title: 'bold 48px Arial',
            subtitle: 'bold 24px Arial',
            body: '16px Arial',
            menu: '20px Arial',
            combat: '18px Arial'
        };
        this.colors = {
            primary: '#4a90e2',
            secondary: '#f39c12',
            success: '#27ae60',
            danger: '#e74c3c',
            warning: '#f1c40f',
            text: '#ffffff',
            textDark: '#2c3e50',
            background: 'rgba(0, 0, 0, 0.8)',
            backgroundLight: 'rgba(255, 255, 255, 0.9)'
        };
    }

    // Main menu rendering
    drawMainMenu() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.font = this.fonts.title;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('O Despertar das Kineses', this.canvas.width / 2, 150);

        // Subtitle
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.subtitle;
        this.ctx.fillText('Uma Jornada Épica', this.canvas.width / 2, 200);

        // Menu options
        this.ctx.font = this.fonts.menu;
        const menuOptions = [
            { text: 'Novo Jogo (ENTER)', y: 300 },
            { text: 'Carregar Jogo (L)', y: 350 },
            { text: 'Salvar Jogo (S)', y: 400 }
        ];

        menuOptions.forEach((option, index) => {
            this.ctx.fillStyle = this.colors.text;
            this.ctx.fillText(option.text, this.canvas.width / 2, option.y);
        });

        // Instructions
        this.ctx.font = this.fonts.body;
        this.ctx.fillStyle = this.colors.secondary;
        this.ctx.fillText('Use as teclas indicadas para navegar', this.canvas.width / 2, 500);
    }

    // Save menu rendering
    drawSaveMenu(saveManager) {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.font = this.fonts.title;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SALVAR JOGO', this.canvas.width / 2, 100);

        // Get save metadata
        const metadata = saveManager.getSaveMetadata();

        // Draw save slots
        for (let slot = 1; slot <= 3; slot++) {
            this.drawSaveSlot(slot, metadata[slot], saveManager, 150 + (slot - 1) * 120);
        }

        // Instructions
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.body;
        this.ctx.fillText('Pressione 1-3 para salvar no slot | ESC para voltar', this.canvas.width / 2, 550);
    }

    // Load menu rendering
    drawLoadMenu(saveManager) {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.font = this.fonts.title;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CARREGAR JOGO', this.canvas.width / 2, 100);

        // Get save metadata
        const metadata = saveManager.getSaveMetadata();

        // Draw save slots
        for (let slot = 1; slot <= 3; slot++) {
            this.drawLoadSlot(slot, metadata[slot], saveManager, 150 + (slot - 1) * 120);
        }

        // Instructions
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.body;
        this.ctx.fillText('Pressione 1-3 para carregar do slot | ESC para voltar', this.canvas.width / 2, 550);
    }

    // Draw individual save slot
    drawSaveSlot(slot, slotData, saveManager, y) {
        const x = this.canvas.width / 2 - 300;
        const width = 600;
        const height = 80;

        // Slot background
        this.ctx.fillStyle = slotData ? this.colors.backgroundLight : 'rgba(100, 100, 100, 0.3)';
        this.ctx.fillRect(x, y, width, height);

        // Slot border
        this.ctx.strokeStyle = this.colors.primary;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Slot number
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${slot}`, x + 20, y + 35);

        if (slotData) {
            // Save exists - show details
            this.ctx.fillStyle = this.colors.textDark;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(`Nível ${slotData.playerLevel}`, x + 80, y + 25);

            this.ctx.font = '14px Arial';
            this.ctx.fillText(`${saveManager.formatTimestamp(slotData.timestamp)}`, x + 80, y + 45);
            this.ctx.fillText(`Tempo: ${saveManager.formatPlayTime(slotData.playTime)}`, x + 80, y + 65);

            // Location info
            this.ctx.fillText(`Posição: ${Math.floor(slotData.location.x)}, ${Math.floor(slotData.location.y)}`, x + 350, y + 35);
        } else {
            // Empty slot
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '18px Arial';
            this.ctx.fillText('Slot Vazio', x + 80, y + 45);
        }
    }

    // Draw individual load slot
    drawLoadSlot(slot, slotData, saveManager, y) {
        const x = this.canvas.width / 2 - 300;
        const width = 600;
        const height = 80;

        // Determine if slot is available
        const isAvailable = slotData && saveManager.saveExists(slot);

        // Slot background
        this.ctx.fillStyle = isAvailable ? this.colors.backgroundLight : 'rgba(50, 50, 50, 0.5)';
        this.ctx.fillRect(x, y, width, height);

        // Slot border
        this.ctx.strokeStyle = isAvailable ? this.colors.success : this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Slot number
        this.ctx.fillStyle = isAvailable ? this.colors.success : this.colors.text;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${slot}`, x + 20, y + 35);

        if (isAvailable) {
            // Save exists - show details
            this.ctx.fillStyle = this.colors.textDark;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(`Nível ${slotData.playerLevel}`, x + 80, y + 25);

            this.ctx.font = '14px Arial';
            this.ctx.fillText(`${saveManager.formatTimestamp(slotData.timestamp)}`, x + 80, y + 45);
            this.ctx.fillText(`Tempo: ${saveManager.formatPlayTime(slotData.playTime)}`, x + 80, y + 65);

            // Location info
            this.ctx.fillText(`Posição: ${Math.floor(slotData.location.x)}, ${Math.floor(slotData.location.y)}`, x + 350, y + 35);
        } else {
            // Empty or unavailable slot
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '18px Arial';
            this.ctx.fillText('Slot Vazio', x + 80, y + 45);
        }
    }

    // Draw save message
    drawSaveMessage(message) {
        if (!message) return;

        const messageWidth = 400;
        const messageHeight = 60;
        const x = (this.canvas.width - messageWidth) / 2;
        const y = 50;

        // Message background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(x, y, messageWidth, messageHeight);

        // Message border
        this.ctx.strokeStyle = this.colors.secondary;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, messageWidth, messageHeight);

        // Message text
        this.ctx.fillStyle = this.colors.secondary;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvas.width / 2, y + 35);
    }

    // HUD rendering
    drawHUD(player) {
        this.drawHealthBar(player);
        this.drawManaBar(player);
        this.drawPlayerStats(player);
        this.drawMiniMap();
    }

    drawHealthBar(player) {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 10;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Health bar
        const healthPercentage = player.getHpPercentage() / 100;
        this.ctx.fillStyle = this.getHealthColor(healthPercentage);
        this.ctx.fillRect(x + 2, y + 2, (barWidth - 4) * healthPercentage, barHeight - 4);

        // Border
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, barWidth, barHeight);

        // Text
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.body;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, x + barWidth / 2, y + 15);
    }

    drawManaBar(player) {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 40;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Mana bar
        const manaPercentage = player.getMpPercentage() / 100;
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.fillRect(x + 2, y + 2, (barWidth - 4) * manaPercentage, barHeight - 4);

        // Border
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, barWidth, barHeight);

        // Text
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.body;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`MP: ${player.mp}/${player.maxMp}`, x + barWidth / 2, y + 15);
    }

    drawPlayerStats(player) {
        const x = this.canvas.width - 150;
        const y = 10;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x, y, 140, 140);

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.body;
        this.ctx.textAlign = 'left';

        const stats = [
            `Nível: ${player.level}`,
            `XP: ${player.xp}/${player.xpToNextLevel}`,
            `Ataque: ${player.atck}`,
            `Defesa: ${player.def}`,
            `💰 Ouro: ${player.gold}`,
            `Posição: ${Math.floor(player.X)}, ${Math.floor(player.Y)}`
        ];

        stats.forEach((stat, index) => {
            this.ctx.fillText(stat, x + 10, y + 25 + (index * 20));
        });
    }

    drawMiniMap() {
        const mapSize = 100;
        const x = this.canvas.width - mapSize - 10;
        const y = this.canvas.height - mapSize - 10;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x, y, mapSize, mapSize);

        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, mapSize, mapSize);

        // Mini map content would go here
        this.ctx.fillStyle = this.colors.primary;
        this.ctx.fillText('Mapa', x + mapSize / 2, y + mapSize / 2);
    }

    // Combat UI
    drawCombatUI(player, enemy) {
        // Don't draw background here - let the game handle it
        this.drawCombatBars(player, enemy);
        this.drawCombatMenu();
        this.drawCombatLog();
    }

    drawCombatBackground() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCombatBars(player, enemy) {
        // Player stats (left side)
        this.drawCharacterStats(player, 20, 20, 'Jogador');

        // Enemy stats (right side) with difficulty indicator
        if (enemy) {
            this.drawCharacterStats(enemy, this.canvas.width - 220, 20, enemy.name || 'Inimigo');

            // Add difficulty indicator for enemy
            if (enemy.level && player.level) {
                this.drawEnemyDifficulty(enemy.level, player.level, this.canvas.width - 220, 70);
            }
        }
    }

    drawCharacterStats(character, x, y, name) {
        const barWidth = 180;
        const barHeight = 15;

        // Character name with level
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.combat;
        this.ctx.textAlign = 'left';

        // Display name with level if available
        const displayName = character.level ? `${name} (Nv.${character.level})` : name;
        this.ctx.fillText(displayName, x, y);

        // Health bar
        const healthPercentage = (typeof character.getHpPercentage === 'function')
            ? character.getHpPercentage() / 100
            : (character.hp / character.maxHp);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y + 10, barWidth, barHeight);

        this.ctx.fillStyle = this.getHealthColor(healthPercentage);
        this.ctx.fillRect(x + 2, y + 12, (barWidth - 4) * healthPercentage, barHeight - 4);

        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y + 10, barWidth, barHeight);

        // Health text
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${character.hp}/${character.maxHp}`, x + barWidth / 2, y + 22);

        // Mana bar (if applicable and character has MP)
        if (character.mp !== undefined && character.maxMp !== undefined && character.maxMp > 0) {
            const manaPercentage = (typeof character.getMpPercentage === 'function')
                ? character.getMpPercentage() / 100
                : (character.mp / character.maxMp);

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(x, y + 35, barWidth, barHeight);

            this.ctx.fillStyle = this.colors.primary;
            this.ctx.fillRect(x + 2, y + 37, (barWidth - 4) * manaPercentage, barHeight - 4);

            this.ctx.strokeStyle = this.colors.text;
            this.ctx.strokeRect(x, y + 35, barWidth, barHeight);

            this.ctx.fillStyle = this.colors.text;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${character.mp}/${character.maxMp}`, x + barWidth / 2, y + 47);
        }
    }

    // Draw enemy difficulty indicator
    drawEnemyDifficulty(enemyLevel, playerLevel, x, y) {
        // Import EnemyFactory to get difficulty rating
        // Note: This would need to be imported at the top of the file
        const levelDiff = enemyLevel - playerLevel;
        let difficulty;

        if (levelDiff <= -2) difficulty = { text: "Muito Fácil", color: "#90EE90" };
        else if (levelDiff === -1) difficulty = { text: "Fácil", color: "#32CD32" };
        else if (levelDiff === 0) difficulty = { text: "Equilibrado", color: "#FFD700" };
        else if (levelDiff === 1) difficulty = { text: "Desafiador", color: "#FFA500" };
        else if (levelDiff === 2) difficulty = { text: "Difícil", color: "#FF6347" };
        else if (levelDiff >= 3) difficulty = { text: "Muito Difícil", color: "#DC143C" };
        else difficulty = { text: "Desconhecido", color: "#FFFFFF" };

        // Draw difficulty background
        const diffWidth = 120;
        const diffHeight = 20;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x, y, diffWidth, diffHeight);

        this.ctx.strokeStyle = difficulty.color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, diffWidth, diffHeight);

        // Draw difficulty text
        this.ctx.fillStyle = difficulty.color;
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(difficulty.text, x + diffWidth / 2, y + 14);
    }

    drawCombatMenu() {
        const menuHeight = 100;
        const menuY = this.canvas.height - menuHeight;

        // Draw menu background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, menuY, this.canvas.width, menuHeight);

        // Draw menu border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, menuY, this.canvas.width, menuHeight);

        // Menu title
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Escolha sua ação:', this.canvas.width / 2, menuY + 20);

        // Combat options
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';

        const options = [
            { key: '1', text: 'Atacar ⚔️', x: 50, y: menuY + 45 },
            { key: '2', text: 'Magia 🪄', x: 200, y: menuY + 45 },
            { key: '3', text: 'Itens ⚗️', x: 350, y: menuY + 45 },
            { key: '4', text: 'Kinesis ✨', x: 500, y: menuY + 45 },
            { key: '5', text: 'Fugir 🏃', x: 650, y: menuY + 45 }
        ];

        options.forEach(option => {
            // Highlight key
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillText(option.key, option.x, option.y);

            // Action text
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(' - ' + option.text, option.x + 15, option.y);
        });

        // Instructions
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Pressione as teclas 1-5 para escolher', this.canvas.width / 2, menuY + 75);
    }

    drawCombatLog() {
        const logX = 20;
        const logY = 100;
        const logWidth = 350;
        const logHeight = 150; // Reduced height to avoid menu overlap

        // Draw log background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(logX, logY, logWidth, logHeight);

        // Draw log border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(logX, logY, logWidth, logHeight);

        // Log title
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('LOG DE COMBATE', logX + 10, logY + 25);

        // Combat messages
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('• Batalha iniciada!', logX + 10, logY + 50);
        this.ctx.fillText('• Inimigo equilibrado ao seu nível', logX + 10, logY + 70);
        this.ctx.fillText('• Escolha sua ação usando 1-5', logX + 10, logY + 90);

        // Add some battle tips
        this.ctx.fillStyle = '#ffff88';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Dica: Inimigos mais fortes dão mais XP!', logX + 10, logY + 120);
    }

    // Inventory UI
    drawInventory(player) {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.subtitle;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Inventário', this.canvas.width / 2, 50);

        // Items grid
        const itemsPerRow = 8;
        const itemSize = 60;
        const startX = (this.canvas.width - (itemsPerRow * itemSize)) / 2;
        const startY = 100;

        player.inventory.forEach((item, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const x = startX + (col * itemSize);
            const y = startY + (row * itemSize);

            this.drawInventorySlot(x, y, itemSize, item);
        });

        // Equipment
        this.drawEquipmentPanel(player);
    }

    drawInventorySlot(x, y, size, item) {
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, size, size);

        if (item) {
            this.ctx.fillStyle = this.colors.primary;
            this.ctx.fillRect(x + 5, y + 5, size - 10, size - 10);

            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.name || 'Item', x + size / 2, y + size / 2);
        }
    }

    drawEquipmentPanel(player) {
        const panelX = this.canvas.width - 200;
        const panelY = 100;

        this.ctx.fillStyle = this.colors.backgroundLight;
        this.ctx.fillRect(panelX, panelY, 180, 300);

        this.ctx.fillStyle = this.colors.textDark;
        this.ctx.font = this.fonts.body;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Equipamento', panelX + 10, panelY + 20);

        const slots = [
            { name: 'Arma', item: player.equipment.weapon, y: panelY + 50 },
            { name: 'Armadura', item: player.equipment.armor, y: panelY + 90 },
            { name: 'Acessório', item: player.equipment.accessory, y: panelY + 130 }
        ];

        slots.forEach(slot => {
            this.ctx.fillText(slot.name, panelX + 10, slot.y);
            if (slot.item) {
                this.ctx.fillStyle = this.colors.success;
                this.ctx.fillText(slot.item.name, panelX + 10, slot.y + 20);
            } else {
                this.ctx.fillStyle = this.colors.textDark;
                this.ctx.fillText('Vazio', panelX + 10, slot.y + 20);
            }
        });
    }

    // Settings UI
    drawSettings() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.subtitle;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Configurações', this.canvas.width / 2, 100);

        // Settings options would go here
        this.ctx.font = this.fonts.body;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Volume da Música: [=====]', 200, 200);
        this.ctx.fillText('Volume dos Efeitos: [=====]', 200, 250);
        this.ctx.fillText('Tela Cheia: [ ]', 200, 300);
        this.ctx.fillText('Voltar', 200, 400);
    }

    // Utility methods
    getHealthColor(percentage) {
        if (percentage > 0.6) return this.colors.success;
        if (percentage > 0.3) return this.colors.warning;
        return this.colors.danger;
    }

    drawText(text, x, y, options = {}) {
        const {
            font = this.fonts.body,
            color = this.colors.text,
            align = 'left',
            maxWidth = null
        } = options;

        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;

        if (maxWidth) {
            this.ctx.fillText(text, x, y, maxWidth);
        } else {
            this.ctx.fillText(text, x, y);
        }
    }

    drawButton(text, x, y, width, height, isHovered = false) {
        const color = isHovered ? this.colors.secondary : this.colors.primary;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        this.drawText(text, x + width / 2, y + height / 2 + 5, {
            align: 'center',
            font: this.fonts.menu
        });
    }

    // Loading screen
    drawLoadingScreen(progress = 0) {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.subtitle;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Carregando...', this.canvas.width / 2, this.canvas.height / 2 - 50);

        // Progress bar
        const barWidth = 400;
        const barHeight = 20;
        const barX = (this.canvas.width - barWidth) / 2;
        const barY = this.canvas.height / 2;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        this.ctx.fillStyle = this.colors.primary;
        this.ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * progress, barHeight - 4);

        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.body;
        this.ctx.fillText(`${Math.round(progress * 100)}%`, this.canvas.width / 2, barY + 40);
    }

    // Pause menu
    drawPauseMenu() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = this.fonts.subtitle;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('JOGO PAUSADO', this.canvas.width / 2, this.canvas.height / 2 - 100);

        const options = [
            'Continuar',
            'Inventário',
            'Configurações',
            'Salvar',
            'Sair para Menu'
        ];

        options.forEach((option, index) => {
            this.drawButton(option,
                this.canvas.width / 2 - 100,
                this.canvas.height / 2 - 50 + (index * 50),
                200, 40);
        });
    }
} 
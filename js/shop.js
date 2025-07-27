// Shop System for RPG Game
export class Shop {
    constructor() {
        this.shopItems = [
            {
                id: 'leather_armor',
                name: 'Armadura de Couro',
                description: '+5 Defesa',
                price: 100,
                type: 'armor',
                defenseBonus: 5,
                icon: '🛡️'
            },
            {
                id: 'iron_armor',
                name: 'Armadura de Ferro',
                description: '+10 Defesa',
                price: 250,
                type: 'armor',
                defenseBonus: 10,
                icon: '⚔️'
            },
            {
                id: 'gold_armor',
                name: 'Armadura de Ouro',
                description: '+20 Defesa',
                price: 500,
                type: 'armor',
                defenseBonus: 20,
                icon: '👑'
            },
            {
                id: 'hp_potion',
                name: 'Poção de HP',
                description: 'Regenera 50 HP',
                price: 20,
                type: 'consumable',
                effect: 'heal',
                value: 50,
                icon: '🧪'
            },
            {
                id: 'long_sword',
                name: 'Espada Longa',
                description: '+3 Ataque',
                price: 50,
                type: 'weapon',
                attackBonus: 3,
                icon: '⚔️'
            }
        ];
    }

    // Get all shop items
    getShopItems() {
        return this.shopItems;
    }

    // Get item by ID
    getItem(itemId) {
        return this.shopItems.find(item => item.id === itemId);
    }

    // Purchase item
    purchaseItem(player, itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            return { success: false, message: 'Item não encontrado!' };
        }

        if (!player.hasGold(item.price)) {
            return { success: false, message: 'Ouro insuficiente!' };
        }

        // Check if player already has better equipment
        if (item.type === 'armor' && player.equipment.armor) {
            if (player.equipment.armor.defenseBonus >= item.defenseBonus) {
                return { success: false, message: 'Você já tem uma armadura melhor!' };
            }
        }

        if (item.type === 'weapon' && player.equipment.weapon) {
            if (player.equipment.weapon.attackBonus >= item.attackBonus) {
                return { success: false, message: 'Você já tem uma arma melhor!' };
            }
        }

        // Process purchase
        if (player.spendGold(item.price)) {
            // Create a copy of the item for the player
            const purchasedItem = { ...item };

            if (item.type === 'consumable') {
                player.addItem(purchasedItem);
                return { success: true, message: `${item.name} adicionado ao inventário!` };
            } else {
                // For equipment, add to inventory first, then player can equip
                player.addItem(purchasedItem);
                return {
                    success: true,
                    message: `${item.name} comprado! Vá ao inventário para equipar.`,
                    autoEquip: true,
                    item: purchasedItem
                };
            }
        }

        return { success: false, message: 'Erro na compra!' };
    }

    // Get shop welcome message
    getWelcomeMessage() {
        return "Bem-vindo à loja! O que deseja comprar hoje?";
    }

    // Calculate gold earned from enemy
    static calculateGoldReward(enemyLevel) {
        return (enemyLevel || 1) + 10;
    }
}

// Shop UI Manager
export class ShopUI {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.selectedItemIndex = 0;
        this.scrollOffset = 0;
        this.itemsPerPage = 4;

        this.colors = {
            background: 'rgba(0, 0, 0, 0.9)',
            itemBackground: 'rgba(50, 50, 50, 0.8)',
            selectedBackground: 'rgba(100, 150, 200, 0.8)',
            text: '#ffffff',
            gold: '#FFD700',
            price: '#90EE90',
            cantAfford: '#FF6B6B',
            border: '#444444'
        };
    }

    // Draw shop interface
    drawShop(shop, player) {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw shop title
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏪 LOJA DO AVENTUREIRO', this.canvas.width / 2, 60);

        // Draw player gold
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`💰 Ouro: ${player.gold}`, this.canvas.width / 2, 100);

        // Draw shop items
        this.drawShopItems(shop, player);

        // Draw instructions
        this.drawInstructions();
    }

    drawShopItems(shop, player) {
        const items = shop.getShopItems();
        const startY = 140;
        const itemHeight = 80;
        const itemWidth = this.canvas.width - 100;
        const startX = 50;

        // Display items with pagination
        const visibleItems = items.slice(this.scrollOffset, this.scrollOffset + this.itemsPerPage);

        visibleItems.forEach((item, index) => {
            const actualIndex = this.scrollOffset + index;
            const y = startY + (index * itemHeight);
            const isSelected = actualIndex === this.selectedItemIndex;
            const canAfford = player.hasGold(item.price);

            // Draw item background
            this.ctx.fillStyle = isSelected ? this.colors.selectedBackground : this.colors.itemBackground;
            this.ctx.fillRect(startX, y, itemWidth, itemHeight - 10);

            // Draw item border
            this.ctx.strokeStyle = isSelected ? this.colors.text : this.colors.border;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(startX, y, itemWidth, itemHeight - 10);

            // Draw item icon
            this.ctx.font = '32px Arial';
            this.ctx.fillStyle = this.colors.text;
            this.ctx.textAlign = 'left';
            this.ctx.fillText(item.icon, startX + 15, y + 40);

            // Draw item name
            this.ctx.font = 'bold 18px Arial';
            this.ctx.fillStyle = this.colors.text;
            this.ctx.fillText(item.name, startX + 70, y + 25);

            // Draw item description
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#cccccc';
            this.ctx.fillText(item.description, startX + 70, y + 45);

            // Draw item price
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = canAfford ? this.colors.price : this.colors.cantAfford;
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`${item.price} 💰`, startX + itemWidth - 20, y + 35);

            // Draw affordability indicator
            if (!canAfford) {
                this.ctx.fillStyle = this.colors.cantAfford;
                this.ctx.font = '12px Arial';
                this.ctx.fillText('Ouro insuficiente', startX + itemWidth - 20, y + 55);
            }
        });

        // Draw scroll indicators if needed
        if (items.length > this.itemsPerPage) {
            this.drawScrollIndicators(items.length);
        }
    }

    drawScrollIndicators(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const currentPage = Math.floor(this.scrollOffset / this.itemsPerPage) + 1;

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Página ${currentPage} de ${totalPages}`, this.canvas.width / 2, this.canvas.height - 100);

        if (this.scrollOffset > 0) {
            this.ctx.fillText('↑ Mais itens acima', this.canvas.width / 2, 130);
        }
        if (this.scrollOffset + this.itemsPerPage < totalItems) {
            this.ctx.fillText('↓ Mais itens abaixo', this.canvas.width / 2, this.canvas.height - 80);
        }
    }

    drawInstructions() {
        const instructions = [
            '↑↓ - Navegar pelos itens',
            'ENTER - Comprar item selecionado',
            'ESC - Voltar ao mundo'
        ];

        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';

        instructions.forEach((instruction, index) => {
            this.ctx.fillText(instruction, this.canvas.width / 2, this.canvas.height - 40 + (index * 15));
        });
    }

    // Navigation methods
    selectNextItem(totalItems) {
        this.selectedItemIndex = Math.min(this.selectedItemIndex + 1, totalItems - 1);
        this.updateScroll(totalItems);
    }

    selectPreviousItem() {
        this.selectedItemIndex = Math.max(this.selectedItemIndex - 1, 0);
        this.updateScroll();
    }

    updateScroll(totalItems = 0) {
        // Adjust scroll to keep selected item visible
        if (this.selectedItemIndex < this.scrollOffset) {
            this.scrollOffset = this.selectedItemIndex;
        } else if (this.selectedItemIndex >= this.scrollOffset + this.itemsPerPage) {
            this.scrollOffset = this.selectedItemIndex - this.itemsPerPage + 1;
        }
    }

    getSelectedItemIndex() {
        return this.selectedItemIndex;
    }

    reset() {
        this.selectedItemIndex = 0;
        this.scrollOffset = 0;
    }
} 
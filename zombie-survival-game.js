// 🧟‍♂️ ZOMBIE STREET SHOOTOUT - WEAPONS EDITION 🧟‍♂️
// Survive the apocalypse with strategic weapon usage!

console.log("🧟‍♂️ WELCOME TO ZOMBIE STREET SHOOTOUT! 🧟‍♂️");
console.log("=".repeat(50));

// 🎮 PLAYER CONFIGURATION
const player = {
    name: "Ali",
    health: 100,
    currentWeapon: "pistol", // Change this to test: "knife", "pistol", "shotgun", "rifle", "axe", "flamethrower"
    inventory: {
        // 🔫 RANGED WEAPONS
        pistol: {
            name: "🔫 Glock 19",
            damage: 25,
            ammo: 15,
            maxAmmo: 15,
            type: "ranged",
            description: "Reliable sidearm with moderate damage"
        },
        shotgun: {
            name: "💥 Remington 870",
            damage: 50,
            ammo: 8,
            maxAmmo: 8,
            type: "ranged",
            description: "Devastating close-range weapon"
        },
        rifle: {
            name: "🎯 AK-47",
            damage: 40,
            ammo: 30,
            maxAmmo: 30,
            type: "ranged",
            description: "High-capacity assault rifle"
        },
        flamethrower: {
            name: "🔥 Flamethrower",
            damage: 60,
            ammo: 5,
            maxAmmo: 5,
            type: "ranged",
            description: "Burns zombies to crisp"
        },
        // 🗡️ MELEE WEAPONS (INFINITE AMMO)
        knife: {
            name: "🔪 Combat Knife",
            damage: 15,
            ammo: Infinity,
            maxAmmo: Infinity,
            type: "melee",
            description: "Silent and deadly, never runs out"
        },
        axe: {
            name: "🪓 Fire Axe",
            damage: 35,
            ammo: Infinity,
            maxAmmo: Infinity,
            type: "melee",
            description: "Heavy melee weapon for crushing skulls"
        }
    }
};

// 🧟‍♂️ ZOMBIE TYPES
const zombieTypes = [
    {
        name: "🧟‍♂️ Walker",
        type: "Slow Walker",
        health: 50,
        maxHealth: 50,
        damage: 10,
        description: "Slow but persistent undead"
    },
    {
        name: "🧟‍♀️ Runner",
        type: "Fast Runner",
        health: 75,
        maxHealth: 75,
        damage: 20,
        description: "Quick and aggressive zombie"
    },
    {
        name: "🧟‍♂️ Brute",
        type: "Armored Brute",
        health: 120,
        maxHealth: 120,
        damage: 30,
        description: "Heavily armored tank zombie"
    }
];

// 🎯 SELECT ZOMBIE TO FIGHT
let currentZombieIndex = 0; // Change this to test: 0, 1, or 2
let currentZombie = JSON.parse(JSON.stringify(zombieTypes[currentZombieIndex])); // Deep copy

// 🎮 GAME FUNCTIONS

function displayGameStatus() {
    console.log("\n🎮 CURRENT GAME STATUS");
    console.log("─".repeat(40));
    console.log(`👤 Player: ${player.name}`);
    console.log(`❤️  Health: ${player.health}/100`);
    console.log(`🔫 Current Weapon: ${player.inventory[player.currentWeapon].name}`);
    console.log(`📦 Ammo: ${player.inventory[player.currentWeapon].ammo === Infinity ? '∞' : player.inventory[player.currentWeapon].ammo}`);
    console.log("");
    console.log(`🧟‍♂️ Enemy: ${currentZombie.name}`);
    console.log(`💀 Health: ${currentZombie.health}/${currentZombie.maxHealth}`);
    console.log(`📝 Type: ${currentZombie.type}`);
    console.log("─".repeat(40));
}

function displayWeaponInventory() {
    console.log("\n🔫 WEAPON INVENTORY");
    console.log("─".repeat(30));
    Object.keys(player.inventory).forEach(weaponKey => {
        const weapon = player.inventory[weaponKey];
        const ammoDisplay = weapon.ammo === Infinity ? '∞' : `${weapon.ammo}/${weapon.maxAmmo}`;
        const current = weaponKey === player.currentWeapon ? " ⭐ EQUIPPED" : "";
        console.log(`${weapon.name} - DMG: ${weapon.damage} | AMMO: ${ammoDisplay}${current}`);
        console.log(`   └─ ${weapon.description}`);
    });
    console.log("─".repeat(30));
}

function attackZombie() {
    const weapon = player.inventory[player.currentWeapon];
    
    console.log(`\n⚔️  ATTACKING with ${weapon.name}!`);
    
    if (weapon.ammo > 0) {
        // Attack with current weapon
        currentZombie.health -= weapon.damage;
        console.log(`💥 Hit! Dealt ${weapon.damage} damage to ${currentZombie.name}`);
        
        // Reduce ammo (unless it's infinite for melee weapons)
        if (weapon.ammo !== Infinity) {
            weapon.ammo--;
            console.log(`📦 Ammo remaining: ${weapon.ammo}`);
        }
        
        // Check if zombie is defeated
        if (currentZombie.health <= 0) {
            currentZombie.health = 0;
            console.log(`💀 ${currentZombie.name} has been eliminated!`);
            return true; // Zombie defeated
        }
        
    } else {
        // No ammo - fall back to melee weapon (knife)
        console.log(`❌ No ammo left in ${weapon.name}!`);
        console.log(`🔄 Switching to backup weapon: ${player.inventory.knife.name}`);
        
        currentZombie.health -= player.inventory.knife.damage;
        console.log(`💥 Melee attack! Dealt ${player.inventory.knife.damage} damage to ${currentZombie.name}`);
        
        if (currentZombie.health <= 0) {
            currentZombie.health = 0;
            console.log(`💀 ${currentZombie.name} has been eliminated!`);
            return true; // Zombie defeated
        }
    }
    
    return false; // Zombie still alive
}

function zombieAttack() {
    console.log(`\n🧟‍♂️ ${currentZombie.name} attacks back!`);
    player.health -= currentZombie.damage;
    console.log(`💔 You took ${currentZombie.damage} damage!`);
    
    if (player.health <= 0) {
        player.health = 0;
        console.log(`💀 ${player.name} has been overwhelmed by the undead!`);
        return true; // Player defeated
    }
    
    return false; // Player still alive
}

function simulateCombat() {
    console.log("\n🚨 COMBAT INITIATED! 🚨");
    console.log(`${player.name} encounters ${currentZombie.name}!`);
    
    let round = 1;
    
    while (player.health > 0 && currentZombie.health > 0) {
        console.log(`\n⚡ ROUND ${round} ⚡`);
        displayGameStatus();
        
        // Player attacks
        const zombieDefeated = attackZombie();
        if (zombieDefeated) break;
        
        // Zombie counter-attacks
        const playerDefeated = zombieAttack();
        if (playerDefeated) break;
        
        round++;
        
        // Prevent infinite loop (safety measure)
        if (round > 20) {
            console.log("\n⏰ Combat timeout - both fighters are exhausted!");
            break;
        }
    }
}

function displayFinalStatus() {
    console.log("\n" + "=".repeat(50));
    console.log("🏁 FINAL BATTLE RESULTS 🏁");
    console.log("=".repeat(50));
    
    // Player final status
    console.log(`\n👤 PLAYER: ${player.name}`);
    console.log(`❤️  Final Health: ${player.health}/100`);
    if (player.health > 0) {
        console.log(`✅ STATUS: SURVIVED! 🎉`);
        console.log(`💪 You lived to fight another day!`);
    } else {
        console.log(`💀 STATUS: FALLEN IN BATTLE`);
        console.log(`⚰️  The apocalypse claimed another victim...`);
    }
    
    // Zombie final status
    console.log(`\n🧟‍♂️ ENEMY: ${currentZombie.name} (${currentZombie.type})`);
    console.log(`💀 Final Health: ${currentZombie.health}/${currentZombie.maxHealth}`);
    if (currentZombie.health > 0) {
        console.log(`😈 STATUS: STILL HUNTING`);
        console.log(`🩸 The undead hunger grows stronger...`);
    } else {
        console.log(`✅ STATUS: ELIMINATED`);
        console.log(`🔥 Another threat neutralized!`);
    }
    
    // Weapon status
    console.log(`\n🔫 WEAPON USED: ${player.inventory[player.currentWeapon].name}`);
    const finalAmmo = player.inventory[player.currentWeapon].ammo;
    console.log(`📦 Remaining Ammo: ${finalAmmo === Infinity ? '∞' : finalAmmo}`);
    
    console.log("\n" + "=".repeat(50));
}

function displayTestingInstructions() {
    console.log("\n🧪 TESTING INSTRUCTIONS:");
    console.log("─".repeat(40));
    console.log("• Change player.currentWeapon to test different weapons:");
    console.log('  "knife", "pistol", "shotgun", "rifle", "axe", "flamethrower"');
    console.log("• Change currentZombieIndex (0, 1, or 2) for different zombies");
    console.log("• Set weapon ammo to 0 to test 'no ammo' scenarios");
    console.log("• Add custom weapons to player.inventory");
    console.log("─".repeat(40));
}

// 🎮 MAIN GAME EXECUTION
function startGame() {
    console.log(`\n🌟 Initializing Zombie Street Shootout...`);
    console.log(`📅 Day ${Math.floor(Math.random() * 100) + 1} of the apocalypse`);
    console.log(`🌡️  Danger Level: ${['LOW', 'MEDIUM', 'HIGH', 'EXTREME'][Math.floor(Math.random() * 4)]}`);
    
    displayTestingInstructions();
    displayWeaponInventory();
    displayGameStatus();
    
    // Start combat simulation
    simulateCombat();
    
    // Show final results
    displayFinalStatus();
    
    console.log("\n🎮 Thanks for playing Zombie Street Shootout!");
    console.log("💀 Stay vigilant, survivor... they're always watching. 💀");
}


startGame();

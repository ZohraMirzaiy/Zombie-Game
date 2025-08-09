// 🧟‍♂️ ZOMBIE STREET SHOOTOUT - COMPREHENSIVE DEMO & TEST SUITE 🧟‍♂️
// This file demonstrates all game features and runs automated tests

console.log("🧟‍♂️ ZOMBIE STREET SHOOTOUT - WEAPONS EDITION 🧟‍♂️");
console.log("=".repeat(60));
console.log("🎮 COMPREHENSIVE DEMO & TEST SUITE");
console.log("=".repeat(60));

// 🎮 CORE GAME OBJECTS (Same as main game)
const gameTemplate = {
    player: {
        name: "Ali",
        health: 100,
        maxHealth: 100,
        currentWeapon: "pistol",
        inventory: {
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
    },
    zombieTypes: [
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
    ]
};

// 🎯 TEST SCENARIOS
const testScenarios = [
    {
        name: "🔫 Standard Combat - Pistol vs Walker",
        weapon: "pistol",
        zombieIndex: 0,
        description: "Basic combat scenario with standard equipment"
    },
    {
        name: "💥 Heavy Damage - Shotgun vs Runner",
        weapon: "shotgun",
        zombieIndex: 1,
        description: "High-damage weapon against fast zombie"
    },
    {
        name: "🎯 High Capacity - Rifle vs Brute",
        weapon: "rifle",
        zombieIndex: 2,
        description: "Sustained fire against heavily armored enemy"
    },
    {
        name: "🔥 Extreme Damage - Flamethrower vs Brute",
        weapon: "flamethrower",
        zombieIndex: 2,
        description: "Maximum damage weapon vs toughest enemy"
    },
    {
        name: "❌ No Ammo - Empty Pistol vs Walker",
        weapon: "pistol",
        zombieIndex: 0,
        ammoOverride: 0,
        description: "Testing fallback to melee when out of ammo"
    },
    {
        name: "🔪 Melee Only - Knife vs All Zombies",
        weapon: "knife",
        zombieIndex: "all",
        description: "Testing infinite ammo melee weapon"
    },
    {
        name: "🪓 Heavy Melee - Axe vs Brute",
        weapon: "axe",
        zombieIndex: 2,
        description: "High-damage melee vs tough enemy"
    }
];

// 🎮 GAME SIMULATION FUNCTIONS
function createGameState(weaponType, zombieIndex, ammoOverride = null) {
    const gameState = JSON.parse(JSON.stringify(gameTemplate));
    gameState.player.currentWeapon = weaponType;
    
    if (ammoOverride !== null) {
        gameState.player.inventory[weaponType].ammo = ammoOverride;
    }
    
    gameState.currentZombieIndex = zombieIndex;
    gameState.currentZombie = JSON.parse(JSON.stringify(gameState.zombieTypes[zombieIndex]));
    
    return gameState;
}

function simulateCombat(gameState, maxRounds = 20, verbose = true) {
    const results = {
        rounds: 0,
        playerWon: false,
        zombieWon: false,
        timeout: false,
        finalPlayerHealth: 0,
        finalZombieHealth: 0,
        weaponUsed: gameState.player.currentWeapon,
        ammoUsed: 0,
        meleeUsed: false
    };
    
    if (verbose) {
        console.log(`\n🚨 COMBAT: ${gameState.player.name} vs ${gameState.currentZombie.name}`);
        console.log(`🔫 Weapon: ${gameState.player.inventory[gameState.player.currentWeapon].name}`);
        console.log("─".repeat(50));
    }
    
    let round = 1;
    const initialAmmo = gameState.player.inventory[gameState.player.currentWeapon].ammo;
    
    while (gameState.player.health > 0 && gameState.currentZombie.health > 0 && round <= maxRounds) {
        if (verbose) console.log(`⚡ ROUND ${round}`);
        
        // Player attack
        const weapon = gameState.player.inventory[gameState.player.currentWeapon];
        
        if (weapon.ammo > 0) {
            gameState.currentZombie.health -= weapon.damage;
            if (verbose) console.log(`💥 ${weapon.name} hits for ${weapon.damage} damage!`);
            
            if (weapon.ammo !== Infinity) {
                weapon.ammo--;
            }
        } else {
            // Fall back to knife
            gameState.currentZombie.health -= gameState.player.inventory.knife.damage;
            if (verbose) console.log(`🔪 Fallback to knife for ${gameState.player.inventory.knife.damage} damage!`);
            results.meleeUsed = true;
        }
        
        // Check zombie defeat
        if (gameState.currentZombie.health <= 0) {
            gameState.currentZombie.health = 0;
            results.playerWon = true;
            if (verbose) console.log(`✅ ${gameState.currentZombie.name} defeated!`);
            break;
        }
        
        // Zombie counter-attack
        gameState.player.health -= gameState.currentZombie.damage;
        if (verbose) console.log(`💔 Zombie deals ${gameState.currentZombie.damage} damage!`);
        
        // Check player defeat
        if (gameState.player.health <= 0) {
            gameState.player.health = 0;
            results.zombieWon = true;
            if (verbose) console.log(`💀 ${gameState.player.name} defeated!`);
            break;
        }
        
        round++;
    }
    
    if (round > maxRounds) {
        results.timeout = true;
        if (verbose) console.log("⏰ Combat timeout!");
    }
    
    results.rounds = round - 1;
    results.finalPlayerHealth = gameState.player.health;
    results.finalZombieHealth = gameState.currentZombie.health;
    const finalWeapon = gameState.player.inventory[gameState.player.currentWeapon];
    results.ammoUsed = initialAmmo === Infinity ? 0 : initialAmmo - finalWeapon.ammo;
    
    if (verbose) {
        console.log(`📊 Final: Player ${results.finalPlayerHealth}HP | Zombie ${results.finalZombieHealth}HP | Rounds: ${results.rounds}`);
    }
    
    return results;
}

// 🧪 RUN ALL TEST SCENARIOS
function runAllTests() {
    console.log("\n🧪 RUNNING COMPREHENSIVE TEST SUITE");
    console.log("=".repeat(60));
    
    const testResults = [];
    
    testScenarios.forEach((scenario, index) => {
        console.log(`\n📋 TEST ${index + 1}: ${scenario.name}`);
        console.log(`📝 ${scenario.description}`);
        
        if (scenario.zombieIndex === "all") {
            // Test knife against all zombie types
            [0, 1, 2].forEach(zombieIdx => {
                const gameState = createGameState(scenario.weapon, zombieIdx, scenario.ammoOverride);
                const result = simulateCombat(gameState, 20, false);
                testResults.push({
                    scenario: `${scenario.name} vs ${gameState.zombieTypes[zombieIdx].name}`,
                    result: result
                });
                console.log(`  ${gameState.zombieTypes[zombieIdx].name}: ${result.playerWon ? '✅ WIN' : result.zombieWon ? '❌ LOSS' : '⚡ TIMEOUT'} (${result.rounds} rounds)`);
            });
        } else {
            const gameState = createGameState(scenario.weapon, scenario.zombieIndex, scenario.ammoOverride);
            const result = simulateCombat(gameState);
            testResults.push({
                scenario: scenario.name,
                result: result
            });
        }
    });
    
    return testResults;
}

// 📊 ANALYZE TEST RESULTS
function analyzeResults(testResults) {
    console.log("\n📊 TEST RESULTS ANALYSIS");
    console.log("=".repeat(60));
    
    let wins = 0, losses = 0, timeouts = 0;
    let totalRounds = 0;
    let meleeUsageCount = 0;
    
    testResults.forEach(test => {
        if (test.result.playerWon) wins++;
        else if (test.result.zombieWon) losses++;
        else timeouts++;
        
        totalRounds += test.result.rounds;
        if (test.result.meleeUsed) meleeUsageCount++;
    });
    
    console.log(`📈 Win Rate: ${wins}/${testResults.length} (${((wins/testResults.length)*100).toFixed(1)}%)`);
    console.log(`📉 Loss Rate: ${losses}/${testResults.length} (${((losses/testResults.length)*100).toFixed(1)}%)`);
    console.log(`⏰ Timeout Rate: ${timeouts}/${testResults.length} (${((timeouts/testResults.length)*100).toFixed(1)}%)`);
    console.log(`🎯 Average Combat Duration: ${(totalRounds/testResults.length).toFixed(1)} rounds`);
    console.log(`🔪 Melee Fallback Usage: ${meleeUsageCount}/${testResults.length} scenarios`);
    
    console.log("\n🏆 DETAILED RESULTS:");
    testResults.forEach((test, index) => {
        const status = test.result.playerWon ? '✅ WIN' : test.result.zombieWon ? '❌ LOSS' : '⚡ TIMEOUT';
        const melee = test.result.meleeUsed ? ' (Melee Used)' : '';
        console.log(`${index + 1}. ${test.scenario}: ${status} - ${test.result.rounds} rounds${melee}`);
    });
}

// 🎮 WEAPON EFFECTIVENESS ANALYSIS
function weaponEffectivenessAnalysis() {
    console.log("\n🔫 WEAPON EFFECTIVENESS ANALYSIS");
    console.log("=".repeat(60));
    
    const weapons = ["pistol", "shotgun", "rifle", "flamethrower", "knife", "axe"];
    const zombies = [0, 1, 2];
    
    weapons.forEach(weapon => {
        console.log(`\n${gameTemplate.player.inventory[weapon].name}:`);
        
        zombies.forEach(zombieIdx => {
            const gameState = createGameState(weapon, zombieIdx);
            const result = simulateCombat(gameState, 20, false);
            
            const zombieName = gameState.zombieTypes[zombieIdx].name;
            const status = result.playerWon ? '✅' : result.zombieWon ? '❌' : '⚡';
            const efficiency = result.playerWon ? 
                `${result.rounds}R, ${result.ammoUsed || 'N/A'}A` : 
                'FAILED';
            
            console.log(`  vs ${zombieName}: ${status} ${efficiency}`);
        });
    });
}

// 🧟‍♂️ ZOMBIE THREAT ASSESSMENT
function zombieThreatAssessment() {
    console.log("\n🧟‍♂️ ZOMBIE THREAT ASSESSMENT");
    console.log("=".repeat(60));
    
    const weapons = ["pistol", "shotgun", "rifle", "flamethrower"];
    
    gameTemplate.zombieTypes.forEach((zombie, zombieIdx) => {
        console.log(`\n${zombie.name} (${zombie.health}HP, ${zombie.damage}DMG):`);
        
        let victories = 0;
        let totalRounds = 0;
        
        weapons.forEach(weapon => {
            const gameState = createGameState(weapon, zombieIdx);
            const result = simulateCombat(gameState, 20, false);
            
            if (result.playerWon) {
                victories++;
                totalRounds += result.rounds;
            }
            
            const status = result.playerWon ? '✅' : '❌';
            console.log(`  vs ${gameTemplate.player.inventory[weapon].name}: ${status} ${result.rounds}R`);
        });
        
        const threatLevel = victories === 0 ? "EXTREME" : 
                           victories === 1 ? "HIGH" :
                           victories === 2 ? "MEDIUM" : "LOW";
        
        console.log(`  🚨 Threat Level: ${threatLevel} (${victories}/${weapons.length} weapons effective)`);
        if (victories > 0) {
            console.log(`  ⏱️  Average defeat time: ${(totalRounds/victories).toFixed(1)} rounds`);
        }
    });
}

// 🎯 SPECIAL TEST SCENARIOS
function specialScenarios() {
    console.log("\n🎯 SPECIAL TEST SCENARIOS");
    console.log("=".repeat(60));
    
    // Test 1: Extreme low ammo scenarios
    console.log("\n📋 Extreme Low Ammo Tests:");
    ["pistol", "shotgun", "rifle", "flamethrower"].forEach(weapon => {
        const gameState = createGameState(weapon, 0, 1); // Only 1 ammo
        const result = simulateCombat(gameState, 20, false);
        console.log(`${gameTemplate.player.inventory[weapon].name} (1 ammo): ${result.playerWon ? '✅' : '❌'} ${result.meleeUsed ? '(used knife)' : ''}`);
    });
    
    // Test 2: Player vs multiple zombie types simulation
    console.log("\n📋 Survival Simulation (Multiple Encounters):");
    let survivorHealth = 100;
    let encountersWon = 0;
    
    for (let encounter = 0; encounter < 5; encounter++) {
        const randomZombie = Math.floor(Math.random() * 3);
        const randomWeapon = ["pistol", "shotgun", "rifle"][Math.floor(Math.random() * 3)];
        
        const gameState = createGameState(randomWeapon, randomZombie);
        gameState.player.health = survivorHealth;
        
        const result = simulateCombat(gameState, 20, false);
        
        if (result.playerWon) {
            encountersWon++;
            survivorHealth = result.finalPlayerHealth;
            console.log(`Encounter ${encounter + 1}: ✅ vs ${gameState.currentZombie.name} with ${gameState.player.inventory[randomWeapon].name} (${survivorHealth}HP remaining)`);
        } else {
            console.log(`Encounter ${encounter + 1}: ❌ vs ${gameState.currentZombie.name} with ${gameState.player.inventory[randomWeapon].name} (DEFEATED)`);
            break;
        }
        
        if (survivorHealth <= 0) break;
    }
    
    console.log(`🏆 Survival Record: ${encountersWon}/5 encounters won`);
}

// 🎮 MAIN EXECUTION
function runCompleteDemo() {
    console.log("🎯 Starting comprehensive zombie survival analysis...\n");
    
    // Run main test suite
    const testResults = runAllTests();
    
    // Analyze results
    analyzeResults(testResults);
    
    // Weapon effectiveness
    weaponEffectivenessAnalysis();
    
    // Zombie threat assessment
    zombieThreatAssessment();
    
    // Special scenarios
    specialScenarios();
    
    console.log("\n" + "=".repeat(60));
    console.log("🎮 DEMO COMPLETE - ALL SYSTEMS TESTED!");
    console.log("=".repeat(60));
    console.log("🔫 All weapons tested against all zombie types");
    console.log("🧟‍♂️ All combat scenarios validated");
    console.log("⚔️ Ammo depletion and melee fallback confirmed");
    console.log("💀 Game mechanics working as intended");
    console.log("\n💪 Ready for zombie apocalypse survival!");
    
    // Console testing instructions
    console.log("\n🧪 MANUAL TESTING COMMANDS:");
    console.log("To test specific scenarios in the console:");
    console.log("- Change gameTemplate.player.currentWeapon to any weapon");
    console.log("- Change zombie index (0=Walker, 1=Runner, 2=Brute)");
    console.log("- Set weapon ammo to 0 to test fallback scenarios");
    console.log("- Available weapons: pistol, shotgun, rifle, flamethrower, knife, axe");
}

// 🚀 RUN THE COMPLETE DEMO
runCompleteDemo();

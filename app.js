// Hypixel Forge Flipper - Frontend Logic

const API_BASE = '/api';
let allFlips = [];
let lastUpdateTime = null;

// Mapping nomi item → ID SkyBlock per i prezzi
const NAME_TO_ID = {
    "Refined Diamond": "REFINED_DIAMOND",
    "Refined Mithril": "REFINED_MITHRIL",
    "Refined Titanium": "REFINED_TITANIUM",
    "Refined Tungsten": "REFINED_TUNGSTEN",
    "Refined Umber": "REFINED_UMBER",
    "Enchanted Diamond Block": "ENCHANTED_DIAMOND_BLOCK",
    "Enchanted Mithril": "ENCHANTED_MITHRIL",
    "Enchanted Titanium": "ENCHANTED_TITANIUM",
    "Enchanted Tungsten": "ENCHANTED_TUNGSTEN",
    "Enchanted Umber": "ENCHANTED_UMBER",
    "Enchanted Block of Coal": "ENCHANTED_COAL_BLOCK",
    "Enchanted Iron Block": "ENCHANTED_IRON_BLOCK",
    "Enchanted Redstone Block": "ENCHANTED_REDSTONE_BLOCK",
    "Enchanted Gold Block": "ENCHANTED_GOLD_BLOCK",
    "Enchanted Glacite": "ENCHANTED_GLACITE",
    "Enchanted Cobblestone": "ENCHANTED_COBBLESTONE",
    "Enchanted Hard Stone": "ENCHANTED_HARD_STONE",
    "Enchanted Lapis Lazuli": "ENCHANTED_LAPIS_BLOCK",
    "Enchanted Ender Pearl": "ENCHANTED_ENDER_PEARL",
    "Fine Jade Gemstone": "JADE_GEM",
    "Fine Amber Gemstone": "AMBER_GEM",
    "Fine Amethyst Gemstone": "AMETHYST_GEM",
    "Fine Sapphire Gemstone": "SAPPHIRE_GEM",
    "Fine Onyx Gemstone": "ONYX_GEM",
    "Fine Aquamarine Gemstone": "AQUAMARINE_GEM",
    "Fine Citrine Gemstone": "CITRINE_GEM",
    "Fine Peridot Gemstone": "PERIDOT_GEM",
    "Fine Ruby Gemstone": "RUBY_GEM",
    "Fine Topaz Gemstone": "TOPAZ_GEM",
    "Fine Opal Gemstone": "OPAL_GEM",
    "Fine Jasper Gemstone": "JASPER_GEM",
    "Flawless Jade Gemstone": "FLAWLESS_JADE_GEM",
    "Flawless Amber Gemstone": "FLAWLESS_AMBER_GEM",
    "Flawless Amethyst Gemstone": "FLAWLESS_AMETHYST_GEM",
    "Flawless Sapphire Gemstone": "FLAWLESS_SAPPHIRE_GEM",
    "Flawless Onyx Gemstone": "FLAWLESS_ONYX_GEM",
    "Flawless Aquamarine Gemstone": "FLAWLESS_AQUAMARINE_GEM",
    "Flawless Citrine Gemstone": "FLAWLESS_CITRINE_GEM",
    "Flawless Peridot Gemstone": "FLAWLESS_PERIDOT_GEM",
    "Flawless Ruby Gemstone": "FLAWLESS_RUBY_GEM",
    "Flawless Topaz Gemstone": "FLAWLESS_TOPAZ_GEM",
    "Flawless Opal Gemstone": "FLAWLESS_OPAL_GEM",
    "Flawless Jasper Gemstone": "FLAWLESS_JASPER_GEM",
    "Jade Crystal": "JADE_CRYSTAL",
    "Amber Crystal": "AMBER_CRYSTAL",
    "Amethyst Crystal": "AMETHYST_CRYSTAL",
    "Sapphire Crystal": "SAPPHIRE_CRYSTAL",
    "Onyx Crystal": "ONYX_CRYSTAL",
    "Aquamarine Crystal": "AQUAMARINE_CRYSTAL",
    "Citrine Crystal": "CITRINE_CRYSTAL",
    "Peridot Crystal": "PERIDOT_CRYSTAL",
    "Ruby Crystal": "RUBY_CRYSTAL",
    "Topaz Crystal": "TOPAZ_CRYSTAL",
    "Opal Crystal": "OPAL_CRYSTAL",
    "Jasper Crystal": "JASPER_CRYSTAL",
    "Golden Plate": "GOLDEN_PLATE",
    "Mithril Plate": "MITHRIL_PLATE",
    "Tungsten Plate": "TUNGSTEN_PLATE",
    "Umber Plate": "UMBER_PLATE",
    "Perfect Plate": "PERFECT_PLATE",
    "Glacite Jewel": "GLACITE_JEWEL",
    "Glacite Amalgamation": "GLACITE_AMALGAMATION",
    "Sludge Juice": "SLUDGE_JUICE",
    "Treasurite": "TREASURITE",
    "Starfall": "STARFALL",
    "Plasma": "PLASMA",
    "Glossy Gemstone": "GLOSSY_GEMSTONE",
    "Refined Mineral": "REFINED_MINERAL",
    "Divan Fragment": "DIVAN_FRAGMENT",
    "Corleonite": "CORLEONITE",
    "Magma Core": "MAGMA_CORE",
    "Worm Membrane": "WORM_MEMBRANE",
    "Control Switch": "CONTROL_SWITCH",
    "Superlite Motor": "SUPERLITE_MOTOR",
    "Electron Transmitter": "ELECTRON_TRANSMITTER",
    "FTX 3070": "FTX_3070",
    "Robotron Reflector": "ROBOTRON_REFLECTOR",
    "Synthetic Heart": "SYNTHETIC_HEART",
    "Divan's Alloy": "DIVAN_ALLOY",
    "Shattered Locket": "SHATTERED_LOCKET",
    "Artifact of Power": "POWER_ARTIFACT",
    "Helix Fossil": "HELIX_FOSSIL",
    "Claw Fossil": "CLAW_FOSSIL",
    "Footprint Fossil": "FOOTPRINT_FOSSIL",
    "Spine Fossil": "SPINE_FOSSIL",
    "Ugly Fossil": "UGLY_FOSSIL",
    "Clubbed Fossil": "CLUBBED_FOSSIL",
    "Webbed Fossil": "WEBBED_FOSSIL",
    "Tusk Fossil": "TUSK_FOSSIL",
    "Goblin Egg": "GOBLIN_EGG",
    "Green Goblin Egg": "GREEN_GOBLIN_EGG",
    "Yellow Goblin Egg": "YELLOW_GOBLIN_EGG",
    "Red Goblin Egg": "RED_GOBLIN_EGG",
    "Blue Goblin Egg": "BLUE_GOBLIN_EGG",
    "Drill Engine": "DRILL_ENGINE",
    "Fuel Tank": "FUEL_TANK",
    "Bejeweled Handle": "BEJEWELED_HANDLE",
    "Chisel": "CHISEL",
    "Match-Sticks": "MATCH_STICK",
    "Tungsten": "TUNGSTEN",
    "Mithril": "MITHRIL",
    "Titanium": "TITANIUM",
    "Beacon I": "BEACON_I",
};

// Ricette forge (dataset grezzo)
const FORGE_RECIPES = [
    {"name":"Refined Diamond","forgeTimeHours":8,"ingredients":[{"name":"Enchanted Diamond Block","quantity":2}]},
    {"name":"Refined Mithril","forgeTimeHours":6,"ingredients":[{"name":"Enchanted Mithril","quantity":160}]},
    {"name":"Refined Titanium","forgeTimeHours":12,"ingredients":[{"name":"Enchanted Titanium","quantity":16}]},
    {"name":"Refined Tungsten","forgeTimeHours":1,"ingredients":[{"name":"Enchanted Tungsten","quantity":160}]},
    {"name":"Refined Umber","forgeTimeHours":1,"ingredients":[{"name":"Enchanted Umber","quantity":160}]},
    {"name":"Fuel Canister","forgeTimeHours":10,"ingredients":[{"name":"Enchanted Block of Coal","quantity":2}]},
    {"name":"Bejeweled Handle","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Glacite Jewel","quantity":3}]},
    {"name":"Drill Motor","forgeTimeHours":30,"ingredients":[{"name":"Enchanted Iron Block","quantity":1},{"name":"Enchanted Redstone Block","quantity":3},{"name":"Golden Plate","quantity":1},{"name":"Treasurite","quantity":10}]},
    {"name":"Golden Plate","forgeTimeHours":6,"ingredients":[{"name":"Enchanted Gold Block","quantity":2},{"name":"Glacite Jewel","quantity":5},{"name":"Refined Diamond","quantity":1}]},
    {"name":"Mithril Plate","forgeTimeHours":18,"ingredients":[{"name":"Refined Mithril","quantity":5},{"name":"Golden Plate","quantity":1},{"name":"Enchanted Iron Block","quantity":1},{"name":"Refined Titanium","quantity":1}]},
    {"name":"Tungsten Plate","forgeTimeHours":3,"ingredients":[{"name":"Refined Tungsten","quantity":4},{"name":"Glacite Amalgamation","quantity":1}]},
    {"name":"Umber Plate","forgeTimeHours":3,"ingredients":[{"name":"Refined Umber","quantity":4},{"name":"Glacite Amalgamation","quantity":1}]},
    {"name":"Gemstone Mixture","forgeTimeHours":4,"ingredients":[{"name":"Fine Jade Gemstone","quantity":4},{"name":"Fine Amber Gemstone","quantity":4},{"name":"Fine Amethyst Gemstone","quantity":4},{"name":"Fine Sapphire Gemstone","quantity":4},{"name":"Sludge Juice","quantity":320}]},
    {"name":"Glacite Amalgamation","forgeTimeHours":4,"ingredients":[{"name":"Fine Onyx Gemstone","quantity":4},{"name":"Fine Aquamarine Gemstone","quantity":4},{"name":"Fine Citrine Gemstone","quantity":4},{"name":"Fine Peridot Gemstone","quantity":4},{"name":"Enchanted Glacite","quantity":256}]},
    {"name":"Perfect Jasper Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Jasper Gemstone","quantity":5},{"name":"Jasper Crystal","quantity":1}]},
    {"name":"Perfect Ruby Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Ruby Gemstone","quantity":5},{"name":"Ruby Crystal","quantity":1}]},
    {"name":"Perfect Jade Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Jade Gemstone","quantity":5},{"name":"Jade Crystal","quantity":1}]},
    {"name":"Perfect Sapphire Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Sapphire Gemstone","quantity":5},{"name":"Sapphire Crystal","quantity":1}]},
    {"name":"Perfect Amber Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Amber Gemstone","quantity":5},{"name":"Amber Crystal","quantity":1}]},
    {"name":"Perfect Topaz Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Topaz Gemstone","quantity":5},{"name":"Topaz Crystal","quantity":1}]},
    {"name":"Perfect Amethyst Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Amethyst Gemstone","quantity":5},{"name":"Amethyst Crystal","quantity":1}]},
    {"name":"Perfect Opal Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Opal Gemstone","quantity":5},{"name":"Opal Crystal","quantity":1}]},
    {"name":"Perfect Onyx Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Onyx Gemstone","quantity":5},{"name":"Onyx Crystal","quantity":1}]},
    {"name":"Perfect Citrine Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Citrine Gemstone","quantity":5},{"name":"Citrine Crystal","quantity":1}]},
    {"name":"Perfect Aquamarine Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Aquamarine Gemstone","quantity":5},{"name":"Aquamarine Crystal","quantity":1}]},
    {"name":"Perfect Peridot Gemstone","forgeTimeHours":20,"ingredients":[{"name":"Flawless Peridot Gemstone","quantity":5},{"name":"Peridot Crystal","quantity":1}]},
    {"name":"Perfect Plate","forgeTimeHours":6,"ingredients":[{"name":"Umber Plate","quantity":1},{"name":"Tungsten Plate","quantity":1},{"name":"Mithril Plate","quantity":1}]},
    {"name":"Beacon II","forgeTimeHours":20,"ingredients":[{"name":"Beacon I","quantity":1},{"name":"Refined Mithril","quantity":5}]},
    {"name":"Titanium Talisman","forgeTimeHours":14,"ingredients":[{"name":"Refined Titanium","quantity":2}]},
    {"name":"Diamonite","forgeTimeHours":6,"ingredients":[{"name":"Refined Diamond","quantity":3}]},
    {"name":"Pocket Iceberg","forgeTimeHours":6,"ingredients":[{"name":"Glacite Jewel","quantity":5}]},
    {"name":"Power Crystal","forgeTimeHours":2,"ingredients":[{"name":"Starfall","quantity":256}]},
    {"name":"Travel Scroll to the Dwarven Forge","forgeTimeHours":5,"ingredients":[{"name":"Mithril","quantity":48},{"name":"Titanium","quantity":80},{"name":"Enchanted Ender Pearl","quantity":16},{"name":"coins","quantity":25000}]},
    {"name":"Bejeweled Collar","forgeTimeHours":2,"ingredients":[{"name":"Bejeweled Handle","quantity":1},{"name":"Refined Mithril","quantity":4}]},
    {"name":"Mithril Gauntlet","forgeTimeHours":1,"ingredients":[{"name":"Enchanted Mithril","quantity":3}]},
    {"name":"Mithril Belt","forgeTimeHours":1,"ingredients":[{"name":"Enchanted Mithril","quantity":3}]},
    {"name":"Mithril Cloak","forgeTimeHours":1,"ingredients":[{"name":"Enchanted Mithril","quantity":3}]},
    {"name":"Mithril Necklace","forgeTimeHours":1,"ingredients":[{"name":"Enchanted Mithril","quantity":3}]},
    {"name":"Chisel","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Bejeweled Handle","quantity":1},{"name":"Tungsten","quantity":64}]},
    {"name":"Tungsten Key","forgeTimeHours":0.5,"ingredients":[{"name":"Enchanted Tungsten","quantity":192},{"name":"Bejeweled Handle","quantity":1}]},
    {"name":"Umber Key","forgeTimeHours":0.5,"ingredients":[{"name":"Enchanted Umber","quantity":192},{"name":"Bejeweled Handle","quantity":1}]},
    {"name":"Frigid Husk","forgeTimeHours":6,"ingredients":[{"name":"Glacite Amalgamation","quantity":4},{"name":"Flawless Onyx Gemstone","quantity":1}]},
    {"name":"Travel Scroll to the Dwarven Base Camp","forgeTimeHours":10,"ingredients":[{"name":"Flawless Onyx Gemstone","quantity":1},{"name":"Enchanted Ender Pearl","quantity":16},{"name":"coins","quantity":500000}]},
    {"name":"Mithril Drill SX-R226","forgeTimeHours":4,"ingredients":[{"name":"Drill Engine","quantity":1},{"name":"Refined Mithril","quantity":3},{"name":"Fuel Tank","quantity":1}]},
    {"name":"Mithril-Infused Fuel Tank","forgeTimeHours":10,"ingredients":[{"name":"Refined Diamond","quantity":5},{"name":"Refined Mithril","quantity":10},{"name":"Fuel Tank","quantity":5}]},
    {"name":"Mithril-Plated Drill Engine","forgeTimeHours":15,"ingredients":[{"name":"Drill Engine","quantity":2},{"name":"Mithril Plate","quantity":3}]},
    {"name":"Beacon III","forgeTimeHours":30,"ingredients":[{"name":"Beacon II","quantity":1},{"name":"Refined Mithril","quantity":10}]},
    {"name":"Titanium Ring","forgeTimeHours":20,"ingredients":[{"name":"Refined Titanium","quantity":6},{"name":"Titanium Talisman","quantity":1}]},
    {"name":"Pure Mithril","forgeTimeHours":6,"ingredients":[{"name":"Refined Mithril","quantity":2}]},
    {"name":"Titanium Tesseract","forgeTimeHours":6,"ingredients":[{"name":"Refined Titanium","quantity":1},{"name":"Enchanted Lapis Lazuli","quantity":16}]},
    {"name":"Dwarven Geode","forgeTimeHours":6,"ingredients":[{"name":"Enchanted Cobblestone","quantity":128},{"name":"Treasurite","quantity":64}]},
    {"name":"Petrified Starfall","forgeTimeHours":6,"ingredients":[{"name":"Starfall","quantity":512}]},
    {"name":"Pesto Goblin Omelette","forgeTimeHours":20,"ingredients":[{"name":"Green Goblin Egg","quantity":99},{"name":"Fine Jade Gemstone","quantity":1}]},
    {"name":"Ammonite","forgeTimeHours":72,"ingredients":[{"name":"Helix Fossil","quantity":1},{"name":"coins","quantity":300000}]},
    {"name":"Ruby Drill TX-15","forgeTimeHours":1,"ingredients":[{"name":"Drill Engine","quantity":1},{"name":"Fuel Tank","quantity":1},{"name":"Fine Ruby Gemstone","quantity":6}]},
    {"name":"Titanium Gauntlet","forgeTimeHours":4.5,"ingredients":[{"name":"Refined Mineral","quantity":16},{"name":"Refined Titanium","quantity":1},{"name":"Mithril Gauntlet","quantity":1}]},
    {"name":"Titanium Belt","forgeTimeHours":4.5,"ingredients":[{"name":"Refined Mineral","quantity":16},{"name":"Refined Titanium","quantity":1},{"name":"Mithril Belt","quantity":1}]},
    {"name":"Titanium Cloak","forgeTimeHours":4.5,"ingredients":[{"name":"Refined Mineral","quantity":16},{"name":"Refined Titanium","quantity":1},{"name":"Mithril Cloak","quantity":1}]},
    {"name":"Titanium Necklace","forgeTimeHours":4.5,"ingredients":[{"name":"Refined Mineral","quantity":16},{"name":"Refined Titanium","quantity":1},{"name":"Mithril Necklace","quantity":1}]},
    {"name":"Mole","forgeTimeHours":72,"ingredients":[{"name":"Claw Fossil","quantity":1},{"name":"coins","quantity":300000}]},
    {"name":"Mithril Drill SX-R326","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Mithril Drill SX-R226","quantity":1},{"name":"Golden Plate","quantity":5},{"name":"Mithril Plate","quantity":1}]},
    {"name":"Titanium-Plated Drill Engine","forgeTimeHours":30,"ingredients":[{"name":"Drill Engine","quantity":10},{"name":"Plasma","quantity":5},{"name":"Mithril Plate","quantity":4},{"name":"Refined Titanium","quantity":5}]},
    {"name":"Goblin Omelette","forgeTimeHours":18,"ingredients":[{"name":"Goblin Egg","quantity":99}]},
    {"name":"Beacon IV","forgeTimeHours":40,"ingredients":[{"name":"Beacon III","quantity":1},{"name":"Refined Mithril","quantity":20},{"name":"Plasma","quantity":1}]},
    {"name":"Titanium Artifact","forgeTimeHours":36,"ingredients":[{"name":"Refined Titanium","quantity":12},{"name":"Titanium Ring","quantity":1}]},
    {"name":"Scorched Topaz","forgeTimeHours":6,"ingredients":[{"name":"Enchanted Hard Stone","quantity":128},{"name":"Flawless Topaz Gemstone","quantity":1}]},
    {"name":"Sunny Side Goblin Omelette","forgeTimeHours":20,"ingredients":[{"name":"Yellow Goblin Egg","quantity":99},{"name":"Fine Topaz Gemstone","quantity":1}]},
    {"name":"Gemstone Drill LT-522","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Ruby Drill TX-15","quantity":1},{"name":"Gemstone Mixture","quantity":3}]},
    {"name":"Gleaming Crystal","forgeTimeHours":6,"ingredients":[{"name":"Glossy Gemstone","quantity":32},{"name":"Refined Mithril","quantity":1},{"name":"Refined Diamond","quantity":2}]},
    {"name":"Titanium Drill DR-X355","forgeTimeHours":64,"ingredients":[{"name":"Drill Engine","quantity":1},{"name":"Fuel Tank","quantity":1},{"name":"Golden Plate","quantity":6},{"name":"Refined Titanium","quantity":10},{"name":"Refined Mithril","quantity":10}]},
    {"name":"Titanium Drill DR-X455","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Titanium Drill DR-X355","quantity":1},{"name":"Refined Diamond","quantity":10},{"name":"Refined Titanium","quantity":16},{"name":"Mithril Plate","quantity":6}]},
    {"name":"Titanium Drill DR-X555","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Titanium Drill DR-X455","quantity":1},{"name":"Refined Diamond","quantity":20},{"name":"Refined Titanium","quantity":32},{"name":"Enchanted Iron Block","quantity":2},{"name":"Mithril Plate","quantity":15},{"name":"Plasma","quantity":20}]},
    {"name":"Titanium-Infused Fuel Tank","forgeTimeHours":25,"ingredients":[{"name":"Mithril-Infused Fuel Tank","quantity":1},{"name":"Refined Titanium","quantity":10},{"name":"Refined Diamond","quantity":5},{"name":"Fuel Tank","quantity":5}]},
    {"name":"Beacon V","forgeTimeHours":50,"ingredients":[{"name":"Beacon IV","quantity":1},{"name":"Refined Mithril","quantity":40},{"name":"Plasma","quantity":5}]},
    {"name":"Titanium Relic","forgeTimeHours":72,"ingredients":[{"name":"Refined Titanium","quantity":20},{"name":"Titanium Artifact","quantity":1}]},
    {"name":"Spicy Goblin Omelette","forgeTimeHours":20,"ingredients":[{"name":"Red Goblin Egg","quantity":99},{"name":"Flawless Ruby Gemstone","quantity":1}]},
    {"name":"Gemstone Chamber","forgeTimeHours":4,"ingredients":[{"name":"Worm Membrane","quantity":100},{"name":"Gemstone Mixture","quantity":1},{"name":"coins","quantity":25000}]},
    {"name":"Topaz Drill KGR-12","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Gemstone Drill LT-522","quantity":1},{"name":"Flawless Topaz Gemstone","quantity":1},{"name":"Gemstone Mixture","quantity":3},{"name":"Magma Core","quantity":5}]},
    {"name":"Ruby-Polished Drill Engine","forgeTimeHours":20,"ingredients":[{"name":"Mithril-Plated Drill Engine","quantity":1},{"name":"Superlite Motor","quantity":10},{"name":"Fine Ruby Gemstone","quantity":10}]},
    {"name":"Gemstone Fuel Tank","forgeTimeHours":30,"ingredients":[{"name":"Titanium-Infused Fuel Tank","quantity":1},{"name":"Control Switch","quantity":30},{"name":"Gemstone Mixture","quantity":10}]},
    {"name":"Amethyst Gauntlet","forgeTimeHours":24,"ingredients":[{"name":"Glossy Gemstone","quantity":32},{"name":"Flawless Amethyst Gemstone","quantity":2}]},
    {"name":"Jade Belt","forgeTimeHours":24,"ingredients":[{"name":"Glossy Gemstone","quantity":32},{"name":"Flawless Jade Gemstone","quantity":2}]},
    {"name":"Sapphire Cloak","forgeTimeHours":24,"ingredients":[{"name":"Glossy Gemstone","quantity":32},{"name":"Flawless Sapphire Gemstone","quantity":2}]},
    {"name":"Amber Necklace","forgeTimeHours":24,"ingredients":[{"name":"Glossy Gemstone","quantity":32},{"name":"Flawless Amber Gemstone","quantity":2}]},
    {"name":"Blue Cheese Goblin Omelette","forgeTimeHours":20,"ingredients":[{"name":"Perfect Sapphire Gemstone","quantity":1},{"name":"Blue Goblin Egg","quantity":99}]},
    {"name":"Titanium Drill DR-X655","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Titanium Drill DR-X555","quantity":1},{"name":"Corleonite","quantity":30},{"name":"Flawless Ruby Gemstone","quantity":1},{"name":"Refined Diamond","quantity":5},{"name":"Gemstone Mixture","quantity":16},{"name":"Refined Titanium","quantity":12},{"name":"Mithril Plate","quantity":5}]},
    {"name":"Jasper Drill X","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Topaz Drill KGR-12","quantity":1},{"name":"Flawless Jasper Gemstone","quantity":1},{"name":"Treasurite","quantity":100}]},
    {"name":"Sapphire-Polished Drill Engine","forgeTimeHours":20,"ingredients":[{"name":"Titanium-Plated Drill Engine","quantity":1},{"name":"Electron Transmitter","quantity":25},{"name":"FTX 3070","quantity":25},{"name":"Fine Sapphire Gemstone","quantity":20}]},
    {"name":"Amber Material","forgeTimeHours":6,"ingredients":[{"name":"Fine Amber Gemstone","quantity":12},{"name":"Golden Plate","quantity":1}]},
    {"name":"Helmet Of Divan","forgeTimeHours":23,"ingredients":[{"name":"Divan Fragment","quantity":5},{"name":"Gemstone Mixture","quantity":10},{"name":"Flawless Ruby Gemstone","quantity":1}]},
    {"name":"Chestplate Of Divan","forgeTimeHours":23,"ingredients":[{"name":"Divan Fragment","quantity":8},{"name":"Gemstone Mixture","quantity":10},{"name":"Flawless Ruby Gemstone","quantity":1}]},
    {"name":"Leggings Of Divan","forgeTimeHours":23,"ingredients":[{"name":"Divan Fragment","quantity":7},{"name":"Gemstone Mixture","quantity":10},{"name":"Flawless Ruby Gemstone","quantity":1}]},
    {"name":"Boots Of Divan","forgeTimeHours":23,"ingredients":[{"name":"Divan Fragment","quantity":4},{"name":"Gemstone Mixture","quantity":10},{"name":"Flawless Ruby Gemstone","quantity":1}]},
    {"name":"Amber-Polished Drill Engine","forgeTimeHours":50,"ingredients":[{"name":"Ruby-Polished Drill Engine","quantity":1},{"name":"Sapphire-Polished Drill Engine","quantity":1},{"name":"Flawless Amber Gemstone","quantity":1},{"name":"Robotron Reflector","quantity":50}]},
    {"name":"Perfectly-Cut Fuel Tank","forgeTimeHours":50,"ingredients":[{"name":"Gemstone Fuel Tank","quantity":1},{"name":"Gemstone Mixture","quantity":25},{"name":"Synthetic Heart","quantity":70}]},
    {"name":"Divan's Drill","forgeTimeHours":60,"ingredients":[{"name":"Divan's Alloy","quantity":1},{"name":"Titanium Drill DR-X655","quantity":1},{"name":"coins","quantity":50000000}]},
    {"name":"Divan's Powder Coating","forgeTimeHours":36,"ingredients":[{"name":"Glossy Gemstone","quantity":32},{"name":"Refined Mineral","quantity":32},{"name":"Divan Fragment","quantity":5},{"name":"Enchanted Gold Block","quantity":16}]},
    {"name":"Secret Railroad Pass","forgeTimeHours":0.008333333333333333,"ingredients":[{"name":"Flawless Ruby Gemstone","quantity":1},{"name":"Refined Mithril","quantity":2},{"name":"Corleonite","quantity":8}]},
    {"name":"T-Rex","forgeTimeHours":168,"ingredients":[{"name":"Footprint Fossil","quantity":1},{"name":"Flawless Onyx Gemstone","quantity":1}]},
    {"name":"Spinosaurus","forgeTimeHours":168,"ingredients":[{"name":"Spine Fossil","quantity":1},{"name":"Flawless Aquamarine Gemstone","quantity":1}]},
    {"name":"Goblin","forgeTimeHours":168,"ingredients":[{"name":"Ugly Fossil","quantity":1},{"name":"Flawless Amber Gemstone","quantity":1}]},
    {"name":"Ankylosaurus","forgeTimeHours":168,"ingredients":[{"name":"Clubbed Fossil","quantity":1},{"name":"Flawless Opal Gemstone","quantity":1}]},
    {"name":"Penguin","forgeTimeHours":168,"ingredients":[{"name":"Webbed Fossil","quantity":1},{"name":"Flawless Aquamarine Gemstone","quantity":1}]},
    {"name":"Mammoth","forgeTimeHours":168,"ingredients":[{"name":"Tusk Fossil","quantity":1},{"name":"Flawless Onyx Gemstone","quantity":1}]},
    {"name":"Dwarven Handwarmers","forgeTimeHours":4,"ingredients":[{"name":"Umber Plate","quantity":1},{"name":"Tungsten Plate","quantity":1},{"name":"Flawless Jade Gemstone","quantity":1},{"name":"Flawless Amber Gemstone","quantity":1}]},
    {"name":"Reinforced Chisel","forgeTimeHours":12,"ingredients":[{"name":"Chisel","quantity":1},{"name":"Refined Tungsten","quantity":2},{"name":"Refined Umber","quantity":2},{"name":"Bejeweled Handle","quantity":1}]},
    {"name":"Dwarven Metal Talisman","forgeTimeHours":24,"ingredients":[{"name":"Refined Umber","quantity":4},{"name":"Refined Tungsten","quantity":4},{"name":"Glacite Amalgamation","quantity":4}]},
    {"name":"Portable Campfire","forgeTimeHours":0.5,"ingredients":[{"name":"Refined Umber","quantity":1},{"name":"Match-Sticks","quantity":16}]},
    {"name":"Tungsten Regulator","forgeTimeHours":6,"ingredients":[{"name":"Perfect Opal Gemstone","quantity":1},{"name":"Fuel Tank","quantity":5},{"name":"Tungsten Plate","quantity":5}]},
    {"name":"Glacite-Plated Chisel","forgeTimeHours":18,"ingredients":[{"name":"Reinforced Chisel","quantity":1},{"name":"Mithril Plate","quantity":1},{"name":"Glacite Amalgamation","quantity":8},{"name":"Bejeweled Handle","quantity":1}]},
    {"name":"Perfect Chisel","forgeTimeHours":24,"ingredients":[{"name":"Glacite-Plated Chisel","quantity":1},{"name":"Perfect Plate","quantity":1},{"name":"Bejeweled Handle","quantity":1}]},
    {"name":"Pendant of Divan","forgeTimeHours":168,"ingredients":[{"name":"Shattered Locket","quantity":1},{"name":"Perfect Plate","quantity":1},{"name":"Divan Fragment","quantity":10}]},
    {"name":"Relic of Power","forgeTimeHours":8,"ingredients":[{"name":"Artifact of Power","quantity":1},{"name":"Perfect Plate","quantity":4}]},
    {"name":"Skeleton Key","forgeTimeHours":0.5,"ingredients":[{"name":"Bejeweled Handle","quantity":1},{"name":"Perfect Plate","quantity":1}]}
];

// Formatta numeri come moneta
function formatCoins(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(0);
}

// Formatta tempo forge
function formatForgeTime(hours) {
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.round(hours % 24);
        return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
    if (hours >= 1) return `${Math.round(hours)}h`;
    const minutes = Math.round(hours * 60);
    if (minutes >= 1) return `${minutes}m`;
    return '< 1m';
}

// Fetch prezzi dal Bazaar
async function fetchBazaarPrices() {
    const response = await fetch(`${API_BASE}/bazaar-prices`);
    if (!response.ok) throw new Error('Failed to fetch prices');
    return response.json();
}

// Calcola profitto per una ricetta
function calculateProfit(recipe, bazaarPrices, strategy) {
    let useInstantBuyMaterials = true;
    let useInstantSellProduct = true;
    
    if (strategy === 'optimal') {
        useInstantBuyMaterials = true;
        useInstantSellProduct = false; // sell su AH (buy price)
    } else if (strategy === 'maxProfit') {
        useInstantBuyMaterials = false; // buy su AH (sell price)
        useInstantSellProduct = false; // sell su AH (buy price)
    }
    
    const ingredients = recipe.ingredients.map(ing => {
        if (ing.name === 'coins') {
            return { ...ing, cost: ing.quantity, pricePerUnit: 1 };
        }
        
        const itemId = NAME_TO_ID[ing.name];
        if (!itemId || !bazaarPrices[itemId]) {
            return { ...ing, cost: 0, pricePerUnit: 0, unavailable: true };
        }
        
        const priceData = bazaarPrices[itemId];
        const pricePerUnit = useInstantBuyMaterials ? priceData.buyPrice : priceData.sellPrice;
        return { ...ing, cost: pricePerUnit * ing.quantity, pricePerUnit };
    });
    
    const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    
    // Prezzo vendita prodotto
    const productId = NAME_TO_ID[recipe.name];
    let productSellPrice = 0;
    if (productId && bazaarPrices[productId]) {
        const priceData = bazaarPrices[productId];
        productSellPrice = useInstantSellProduct ? priceData.sellPrice : priceData.buyPrice;
    }
    
    const profit = productSellPrice - totalCost;
    const profitPerHour = profit / recipe.forgeTimeHours;
    
    // Calcola max flip basati sul capitale e ordini bazaar
    let maxFlip = 0;
    if (totalCost > 0 && productId && bazaarPrices[productId]) {
        const instantBuyVolume = bazaarPrices[productId].instantBuyVolume || 100;
        maxFlip = Math.floor(Math.min(100, instantBuyVolume)); // Limite pratico
    }
    
    return {
        ...recipe,
        ingredients,
        totalCost,
        productSellPrice,
        profit,
        profitPerHour,
        maxFlip,
        strategy
    };
}

// Filtra e ordina i flip
function filterAndSortFlips(flips, capital, forgeSlots, minProfitHour, strategy) {
    let filtered = flips.filter(flip => {
        if (flip.profitPerHour < minProfitHour) return false;
        if (flip.totalCost > capital && capital > 0) return false;
        const hasUnavailable = flip.ingredients.some(ing => ing.unavailable);
        if (hasUnavailable) return false;
        return true;
    });
    
    // Ordina per profitto/ora
    filtered.sort((a, b) => b.profitPerHour - a.profitPerHour);
    
    return filtered;
}

// Renderizza la tabella
function renderTable(flips, forgeSlots) {
    const tbody = document.getElementById('flipsTableBody');
    tbody.innerHTML = '';
    
    flips.forEach(flip => {
        const tr = document.createElement('tr');
        
        const profitClass = flip.profit >= 0 ? 'profit' : 'negative';
        const profitHourClass = flip.profitPerHour >= 0 ? 'profit-per-hour' : 'negative';
        
        tr.innerHTML = `
            <td class="item-name">${flip.name}</td>
            <td class="forge-time">${formatForgeTime(flip.forgeTimeHours)}</td>
            <td class="cost">${formatCoins(flip.totalCost)}</td>
            <td class="sell-price">${formatCoins(flip.productSellPrice)}</td>
            <td class="${profitClass}">${formatCoins(flip.profit)}</td>
            <td class="${profitHourClass}">${formatCoins(flip.profitPerHour)}</td>
            <td class="max-flip">${flip.maxFlip > 0 ? flip.maxFlip : 'N/A'}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Aggiorna le statistiche
function updateStats(flips) {
    if (flips.length === 0) {
        document.getElementById('bestProfitHour').textContent = '-';
        document.getElementById('bestProfitForge').textContent = '-';
        document.getElementById('totalFlips').textContent = '0';
        return;
    }
    
    const bestProfitHour = Math.max(...flips.map(f => f.profitPerHour));
    const bestProfitForge = Math.max(...flips.map(f => f.profit));
    
    document.getElementById('bestProfitHour').textContent = formatCoins(bestProfitHour);
    document.getElementById('bestProfitForge').textContent = formatCoins(bestProfitForge);
    document.getElementById('totalFlips').textContent = flips.length;
    
    if (lastUpdateTime) {
        document.getElementById('lastUpdate').textContent = lastUpdateTime.toLocaleTimeString();
    }
}

// Carica e processa i dati
async function loadData() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');
    
    loading.style.display = 'block';
    error.style.display = 'none';
    results.style.display = 'none';
    
    try {
        const bazaarPrices = await fetchBazaarPrices();
        const strategy = document.getElementById('strategy').value;
        
        // Calcola tutti i flip
        allFlips = FORGE_RECIPES.map(recipe => calculateProfit(recipe, bazaarPrices, strategy));
        
        // Applica filtri
        const capital = parseFloat(document.getElementById('capital').value) || 0;
        const forgeSlots = parseInt(document.getElementById('forgeSlots').value) || 1;
        const minProfitHour = parseFloat(document.getElementById('minProfitHour').value) || 0;
        
        const filteredFlips = filterAndSortFlips(allFlips, capital, forgeSlots, minProfitHour, strategy);
        
        // Renderizza
        renderTable(filteredFlips, forgeSlots);
        updateStats(filteredFlips);
        
        lastUpdateTime = new Date();
        
        loading.style.display = 'none';
        results.style.display = 'block';
        
    } catch (err) {
        console.error('Error loading data:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('refreshBtn').addEventListener('click', loadData);
    document.getElementById('strategy').addEventListener('change', loadData);
    
    // Carica dati iniziali
    loadData();
});

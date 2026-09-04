#!/usr/bin/env python3
"""
Forge Flip Calculator - Hypixel SkyBlock

This script:
1. Loads forgeRecipesRaw.json
2. Fetches current Bazaar/AH prices from Hypixel API
3. Calculates total cost, profit per forge, and profit per hour
4. Saves enriched data to forgeRecipesEnriched.json
"""

import json
import requests
from typing import Dict, List, Any, Optional

# Mapping da nome leggibile a ID SkyBlock (Bazaar/AH)
NAME_TO_ID = {
    # Refined
    "Refined Diamond": "REFINED_DIAMOND",
    "Refined Mithril": "REFINED_MITHRIL",
    "Refined Titanium": "REFINED_TITANIUM",
    "Refined Tungsten": "REFINED_TUNGSTEN",
    "Refined Umber": "REFINED_UMBER",
    
    # Enchanted materials
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
    
    # Gemstones (fine)
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
    
    # Gemstones (flawless)
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
    
    # Crystals
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
    
    # Plates
    "Golden Plate": "GOLDEN_PLATE",
    "Mithril Plate": "MITHRIL_PLATE",
    "Tungsten Plate": "TUNGSTEN_PLATE",
    "Umber Plate": "UMBER_PLATE",
    "Perfect Plate": "PERFECT_PLATE",
    
    # Other materials
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
    
    # Fossils
    "Helix Fossil": "HELIX_FOSSIL",
    "Claw Fossil": "CLAW_FOSSIL",
    "Footprint Fossil": "FOOTPRINT_FOSSIL",
    "Spine Fossil": "SPINE_FOSSIL",
    "Ugly Fossil": "UGLY_FOSSIL",
    "Clubbed Fossil": "CLUBBED_FOSSIL",
    "Webbed Fossil": "WEBBED_FOSSIL",
    "Tusk Fossil": "TUSK_FOSSIL",
    
    # Goblin Eggs
    "Goblin Egg": "GOBLIN_EGG",
    "Green Goblin Egg": "GREEN_GOBLIN_EGG",
    "Yellow Goblin Egg": "YELLOW_GOBLIN_EGG",
    "Red Goblin Egg": "RED_GOBLIN_EGG",
    "Blue Goblin Egg": "BLUE_GOBLIN_EGG",
    
    # Components
    "Drill Engine": "DRILL_ENGINE",
    "Fuel Tank": "FUEL_TANK",
    "Bejeweled Handle": "BEJEWELED_HANDLE",
    "Chisel": "CHISEL",
    "Match-Sticks": "MATCH_STICK",
    "Tungsten": "TUNGSTEN",
    "Mithril": "MITHRIL",
    "Titanium": "TITANIUM",
    
    # Beacons
    "Beacon I": "BEACON_I",
    
    # Pets (per ora non hanno prezzo Bazaar, servono da AH)
    "Ammonite": "AMMONITE_PET",
    "Mole": "MOLE_PET",
    "T-Rex": "T_REX_PET",
    "Spinosaurus": "SPINOSAURUS_PET",
    "Goblin": "GOBLIN_PET",
    "Ankylosaurus": "ANKYLOSAURUS_PET",
    "Penguin": "PENGUIN_PET",
    "Mammoth": "MAMMOTH_PET",
}

# Ingredienti speciali che non sono nel Bazaar (prezzo fisso o da AH)
SPECIAL_INGREDIENTS = {
    "coins": {"type": "coins", "price": 1.0},  # 1 coin = 1
}

def fetch_bazaar_prices() -> Dict[str, Dict[str, float]]:
    """Fetch current Bazaar prices from Hypixel API."""
    url = "https://api.hypixel.net/skyblock/bazaar"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    data = response.json()
    
    prices = {}
    for product_id, product_data in data["products"].items():
        quick_status = product_data.get("quick_status", {})
        prices[product_id] = {
            "buy_price": quick_status.get("buyPrice", 0),  # Instant buy price
            "sell_price": quick_status.get("sellPrice", 0),  # Instant sell price
        }
    return prices

def get_ingredient_price(ingredient_name: str, quantity: int, bazaar_prices: Dict[str, Dict[str, float]], use_instant_buy: bool = True) -> float:
    """Get the cost of an ingredient based on Bazaar prices."""
    
    # Special case: coins
    if ingredient_name == "coins":
        return quantity  # 1 coin = 1
    
    # Get SkyBlock ID
    item_id = NAME_TO_ID.get(ingredient_name)
    if not item_id:
        # Item not in mapping, return 0 (will need manual price)
        return 0.0
    
    # Get price from Bazaar
    if item_id not in bazaar_prices:
        return 0.0  # Not in Bazaar, need AH price
    
    price_data = bazaar_prices[item_id]
    if use_instant_buy:
        price = price_data["buy_price"]  # Buying from Bazaar (instant buy)
    else:
        price = price_data["sell_price"]  # Selling to Bazaar (instant sell)
    
    return price * quantity

def calculate_recipe_profit(recipe: Dict[str, Any], bazaar_prices: Dict[str, Dict[str, float]], 
                           use_instant_buy_materials: bool = True, 
                           use_instant_sell_product: bool = False) -> Dict[str, Any]:
    """Calculate profit for a single recipe."""
    
    product_name = recipe["name"]
    forge_time_hours = recipe["forgeTimeHours"]
    ingredients = recipe["ingredients"]
    
    # Calculate total material cost
    total_cost = 0.0
    ingredient_costs = []
    
    for ing in ingredients:
        ing_name = ing["name"]
        ing_qty = ing["quantity"]
        cost = get_ingredient_price(ing_name, ing_qty, bazaar_prices, use_instant_buy_materials)
        total_cost += cost
        ingredient_costs.append({
            "name": ing_name,
            "quantity": ing_qty,
            "cost": cost
        })
    
    # Get product sell price
    product_id = NAME_TO_ID.get(product_name)
    product_sell_price = 0.0
    
    if product_id and product_id in bazaar_prices:
        price_data = bazaar_prices[product_id]
        if use_instant_sell_product:
            product_sell_price = price_data["sell_price"]  # Instant sell to Bazaar
        else:
            product_sell_price = price_data["buy_price"]  # Instant buy from Bazaar (higher price)
    
    # Calculate profit
    profit = product_sell_price - total_cost
    profit_per_hour = profit / forge_time_hours if forge_time_hours > 0 else 0.0
    
    return {
        "name": product_name,
        "forgeTimeHours": forge_time_hours,
        "ingredients": ingredient_costs,
        "totalMaterialCost": total_cost,
        "productSellPrice": product_sell_price,
        "profit": profit,
        "profitPerHour": profit_per_hour,
        "strategy": {
            "buyMaterials": "instant_buy" if use_instant_buy_materials else "instant_sell",
            "sellProduct": "instant_sell" if use_instant_sell_product else "instant_buy"
        }
    }

def main():
    # Load raw recipes
    with open("forgeRecipesRaw.json", "r") as f:
        recipes = json.load(f)
    
    print("Fetching Bazaar prices...")
    bazaar_prices = fetch_bazaar_prices()
    print(f"Loaded {len(bazaar_prices)} Bazaar products")
    
    # Calculate profits with default strategy: buy materials instant, sell product instant
    enriched_recipes = []
    
    for recipe in recipes:
        enriched = calculate_recipe_profit(
            recipe, 
            bazaar_prices,
            use_instant_buy_materials=True,   # Buy materials at instant buy price
            use_instant_sell_product=True     # Sell product at instant sell price
        )
        enriched_recipes.append(enriched)
    
    # Sort by profit per hour (descending)
    enriched_recipes.sort(key=lambda x: x["profitPerHour"], reverse=True)
    
    # Save enriched data
    with open("forgeRecipesEnriched.json", "w") as f:
        json.dump(enriched_recipes, f, indent=2)
    
    print(f"Saved {len(enriched_recipes)} enriched recipes to forgeRecipesEnriched.json")
    
    # Print top 10 by profit/hour
    print("\nTop 10 recipes by profit/hour:")
    for i, recipe in enumerate(enriched_recipes[:10], 1):
        print(f"{i}. {recipe['name']}: {recipe['profitPerHour']:,.0f} coins/hour (profit: {recipe['profit']:,.0f})")

if __name__ == "__main__":
    main()

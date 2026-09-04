# Hypixel Forge Flipper

Forge flipping calculator for Hypixel SkyBlock. Questo progetto calcola profitti, costi e profitto/ora per tutte le ricette della Forge.

## Struttura del repository

- `forgeRecipesRaw.json` - Dataset grezzo con tutte le ricette (nome, tempo forge, ingredienti)
- `calculateProfits.py` - Script Python che calcola profitti usando le API del Bazaar
- `forgeRecipesEnriched.json` - (generato) Dataset arricchito con costi, profitti e profitto/ora

## Come usare

### 1. Installa le dipendenze

```bash
pip install requests
```

### 2. Scarica i file necessari

Assicurati di avere `forgeRecipesRaw.json` e `calculateProfits.py` nella stessa cartella.

### 3. Esegui lo script

```bash
python calculateProfits.py
```

Lo script:
1. Scarica i prezzi attuali dal Bazaar di Hypixel
2. Calcola il costo totale dei materiali per ogni ricetta
3. Calcola il profitto (prezzo vendita - costo materiali)
4. Calcola il profitto per ora
5. Salva il risultato in `forgeRecipesEnriched.json`
6. Stampa le top 10 ricette per profitto/ora

### 4. Controlla i risultati

Apri `forgeRecipesEnriched.json` per vedere tutte le ricette ordinate per profitto/ora.

Ogni ricetta ha:

```json
{
  "name": "Refined Diamond",
  "forgeTimeHours": 8,
  "ingredients": [
    {"name": "Enchanted Diamond Block", "quantity": 2, "cost": 12345.0}
  ],
  "totalMaterialCost": 12345.0,
  "productSellPrice": 15000.0,
  "profit": 2655.0,
  "profitPerHour": 331.875,
  "strategy": {
    "buyMaterials": "instant_buy",
    "sellProduct": "instant_sell"
  }
}
```

## Strategie di trading

Lo script usa di default:
- **buyMaterials**: `instant_buy` - compri i materiali al prezzo instant buy del Bazaar
- **sellProduct**: `instant_sell` - vendi il prodotto al prezzo instant sell del Bazaar

Puoi modificare queste impostazioni nello script per simulare diverse strategie:
- `instant_buy` + `instant_buy` = compri e vendi entrambi a prezzo buy (massimo guadagno, ma devi mettere in AH)
- `instant_sell` + `instant_sell` = compri e vendi entrambi a prezzo sell (minimo guadagno, tutto instant)

## Dove controllare le ricette

Nel file `forgeRecipesRaw.json`, ogni oggetto ha:

- `name`: nome dell'oggetto craftato
- `forgeTimeHours`: durata in ore (es. `0.008333...` = 30 secondi, `30` = 1 giorno e 6 ore)
- `ingredients`: array di `{name, quantity}`

Puoi confrontare con la lista ufficiale dalla wiki di Hypixel SkyBlock: https://hypixel-skyblock.fandom.com/wiki/The_Forge

## Prossimi passi

- [ ] Aggiungere supporto per i prezzi dell'Auction House (per item non-Bazaar come pet e fossili)
- [ ] Creare interfaccia web per visualizzare i flip in tempo reale
- [ ] Aggiungere filtri per capitale minimo, tempo forge, categoria item
- [ ] Calcolare volumi massimi flipabili basati sui ordini del Bazaar

## License

MIT

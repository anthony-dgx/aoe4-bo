// Hardcoded matchup tips used when no Claude API key is configured.
// Key format: "myCiv_vs_opponentCiv" (lowercase civilization names)

const tips: Record<string, string[]> = {
  // --- ABBASID ---
  'abbasid_vs_english': [
    'Rush their Farms early — English economy peaks late.',
    'Use Camel Archers to kite English Longbowmen.',
    'Deny their Council Hall upgrades by pressuring at Feudal.',
    'House of Wisdom Golden Age bonus speeds your own Castle Age push.'
  ],
  'abbasid_vs_french': [
    'Camel Riders hard-counter French Knights — tech into them fast.',
    'Prevent a 2nd TC placement to slow their economic engine.',
    'Use Trade Route income to outscale them in Castle Age.',
    'Research Camel Support early for the damage bonus vs cavalry.'
  ],
  'abbasid_vs_mongols': [
    'Scout constantly — Mongol Ovoo production is invisible early.',
    'Fortify your Lumber Camps; Mongols love to raid wood.',
    'Camel Archers beat Mangudai in prolonged fights — micro carefully.',
    'Deny Sacred Sites in Castle Age to cut their spiritual income.'
  ],

  // --- CHINESE ---
  'chinese_vs_english': [
    'Rush Great Wall Gatehouse to hold English Longbow aggression.',
    'Use Supervise on a Blacksmith to hit upgrades before them.',
    'Imperial Academy landmarks give you eco bonuses Longbow plays can\'t match.',
    'Nest of Bees answers Longbow ball compositions effectively.'
  ],
  'chinese_vs_french': [
    'Matches up well — your Imperial Official tax income scales fast.',
    'Clocktower Trebuchet counters French Castle play.',
    'Keep your Supervise uptime high on production buildings.',
    'Spring Lantern bonus pushes your Feudal timing ahead of French.'
  ],
  'chinese_vs_hre': [
    'Deny Regnitz Cathedral; contest the landmark with early aggression.',
    'Spirit Way reduces heal cost — trade fights favoring attrition.',
    'Clocktower units answer HRE Man-at-Arms mass well.',
    'Use Granary tax collection to outpace HRE early eco.'
  ],

  // --- DELHI ---
  'delhi_vs_english': [
    'Free Feudal-Age upgrades let you match English early; use that window.',
    'Scholar-boosted Sacred Sites cut their income stream.',
    'Tower of Victory timing advantage — hit before their Keeps are up.',
    'Avoid prolonged archer fights; use spearmen to absorb Longbow hits.'
  ],
  'delhi_vs_french': [
    'Elephant Archers kite French Knights in Castle Age.',
    'Research Patchwork Repairs to protect your key buildings.',
    'Free upgrades mean you\'re ahead economically — tech up faster.',
    'Use war elephants as frontline with archers behind to melt cavalry.'
  ],

  // --- ENGLISH ---
  'english_vs_french': [
    'Farm Bonus locks in early eco; don\'t delay it past Feudal.',
    'Longbow + keeps combo hard-counters French early knight rush.',
    'Pull Longbows back behind keeps if knights engage.',
    'Castle Age Council Hall upgrades are your power spike — time it.'
  ],
  'english_vs_mongols': [
    'Place Keeps at resource clusters to deny Mongol raids.',
    'Longbow First Strike ability punishes Mangudai kiting.',
    'Network of Castles alerts you to raids — keep Keeps spread out.',
    'Force fights at your keeps where Longbow First Strike gives range.'
  ],
  'english_vs_hre': [
    'Network of Castles counters HRE Man-at-Arms push with garrison firepower.',
    'Longbow range advantage beats MAA in the open — never let them close.',
    'Deny their Regnitz Cathedral placement with early harassment.',
    'Castle Age: White Tower upgrade gives Longbow extra range.'
  ],

  // --- FRENCH ---
  'french_vs_english': [
    'Hit before Council Hall Longbow upgrades land — time your knight push.',
    'Royal Institute gives free blacksmith upgrades — use the tempo.',
    'Fleur-de-Lis triggers on Sacred Site income — contest them early.',
    'Castle Age: transition to crossbows to answer Longbow keeps.'
  ],
  'french_vs_hre': [
    'Early knight rush hits before HRE can mass Man-at-Arms.',
    'Royal Knight charge ability breaks HRE defensive formations.',
    'Contest Regnitz Cathedral — their Castle Age eco hinges on it.',
    'Keep knights moving; static fights favor HRE armor stacking.'
  ],
  'french_vs_malians': [
    'Malian Javelin Throwers beat your knights hard — don\'t mass knights blind.',
    'Royal Institute tech tempo advantage; hit them before they get Donso Militia.',
    'Contest gold deposits — Malians rely heavily on gold income.',
    'Castle Age: Arbalétrier + melee combo answers Malian infantry well.'
  ],
  'french_vs_mongols': [
    'Hunker behind stone walls early — Mongol mobility kites your knights.',
    'Get crossbows up to answer Mangudai; they kite melee cavalry.',
    'Deny Sacred Sites aggressively to stop their spiritual economy.',
    'Castle Age: Ribauldequin counters Mongol mass unit production.'
  ],

  // --- HRE ---
  'hre_vs_french': [
    'Prelate inspire on your MAA — close the gap on French knights fast.',
    'Meinwerk early timing advantage; hit before French get Royal Knights.',
    'Regnitz Cathedral in Castle Age massively boosts your relics eco.',
    'MAA + Spear mix counters French cavalry at low cost.'
  ],
  'hre_vs_mongols': [
    'Spiked Barricades on expansion TCs delay Mongol raids significantly.',
    'Prelate inspire + MAA can match Mangudai in a straight fight.',
    'Burgrave Palace timing push forces Mongols to fight on your terms.',
    'Deny Sacred Sites — Mongols love quick-capping spiritual income.'
  ],
  'hre_vs_english': [
    'Rush Feudal Age before their Farm Bonus locks in their eco.',
    'Inspired Spearmen cost-effectively answer English Longbow blobs.',
    'Contest keeps construction with early men-at-arms harassment.',
    'Prelate healing sustains extended fights that Longbow can\'t afford.'
  ],

  // --- MALIANS ---
  'malians_vs_french': [
    'Javelin Throwers hard-counter French Knights — prioritize them.',
    'Donso Militia Feudal rush punishes slow French expansions.',
    'Farimba stable gives cavalry stat advantages in Castle Age.',
    'Deny 2nd TC placement with aggressive early pressure.'
  ],
  'malians_vs_english': [
    'Sofa archers outrange Longbows — keep them spread to avoid AoE.',
    'Cattle income lets you ignore gold early; starve their upgrades.',
    'Musofadi Warriors bypass English keep fire with stealth approach.',
    'Grand Fulani Corral discounts reduce your cavalry production cost.'
  ],
  'malians_vs_hre': [
    'Javelin Throwers kite HRE MAA — never let them close.',
    'Use cattle economy to outpace HRE Prelate-inspired production.',
    'Pit Mine access speeds your Stone for early wall defense.',
    'Farimba Garrison buff applies to all units — stack upgrades quickly.'
  ],
  'malians_vs_mongols': [
    'Musofadi Warrior stealth counters Mangudai micro kiting.',
    'Sofa archers beat Mangudai in a straight-up ranged fight.',
    'Strong economy from cattle — don\'t over-invest in military early.',
    'Deny Sacred Sites quickly; Mongols rely on spiritual income.'
  ],

  // --- MONGOLS ---
  'mongols_vs_english': [
    'Raid Lumber Camps relentlessly — English Farm eco requires wood.',
    'Mangudai kite over Longbow keep range with careful micro.',
    'Use Ovoo Stone production to fund multiple TCs rapidly.',
    'Avoid fighting directly at English Keeps — drag them out.'
  ],
  'mongols_vs_french': [
    'Early Mangudai + Horsemen raid forces French to play defensively.',
    'Outpost Network covers sacred site capping before French respond.',
    'Tugh Jugni landmark converts enemy unit kills to resources.',
    'Stone economy from Ovoo fuels faster Castle Age than French expect.'
  ],
  'mongols_vs_hre': [
    'Raid outlying eco before HRE defensive fortifications are up.',
    'Mangudai speed denies HRE relic collection in Dark Age.',
    'Don\'t engage Inspired MAA head-on — raid flanks instead.',
    'Pax Mongolica trade network boosts your Castle Age resources.'
  ],
  'mongols_vs_malians': [
    'Mangudai outpaces Malian Javelin Throwers early — raid hard.',
    'Avoid prolonged Castle Age fights — Malian Farimba buffs stack fast.',
    'Khan signal arrows debuff enemy army — use them before engagements.',
    'Contest Sacred Sites early; both civs rely on spiritual income.'
  ],

  // --- OTTOMANS ---
  'ottomans_vs_french': [
    'Military School free unit production relieves gold pressure vs French tech.',
    'Mehter aura buffs let your janissaries trade up vs Royal Knights.',
    'Hit before they get Royal Institute online — tempo window is tight.',
    'Grand Galley castle drop cuts French water transport if map applies.'
  ],
  'ottomans_vs_english': [
    'Free Military School units let you mass faster than English counter.',
    'Sipahi cavalry harasses English farms to disrupt their eco bonus.',
    'Mehter drums give your mass a fight bonus vs Longbow formations.',
    'Anatolian Hills bonus boosts your defense on hill terrain.'
  ],

  // --- RUS ---
  'rus_vs_english': [
    'Hunting Cabin income means your eco scales independently of farm fights.',
    'Early Streltsy timing hits before English Council Hall upgrades land.',
    'Prince of Moscow landmark gives you cheap Kremlin defense.',
    'High Armory upgrades make your units punch above weight vs Longbow.'
  ],
  'rus_vs_mongols': [
    'Fortify outlying resources with Outposts early — Mongol raid is their game.',
    'Streltsy long-range attack counters Mangudai kiting.',
    'Kremlin + High Armory combo makes your base defensible fast.',
    'Use hunting income to avoid Mongol trade route disruption.'
  ],

  // Fallback for any unrecognized matchup
  '_default': [
    'Control Sacred Sites for passive gold income — contest them from Feudal Age.',
    'Always have villagers building a TC at a new resource location by Castle Age.',
    'Scout your opponent\'s build at 3:00 — identify Fast Castle vs aggression.',
    'Never let your villager count fall behind; idle vils lose the game.'
  ]
}

export function getHardcodedTips(myCiv: string, opponentCiv: string): string[] {
  const key = `${myCiv.toLowerCase()}_vs_${opponentCiv.toLowerCase()}`
  const reverseKey = `${opponentCiv.toLowerCase()}_vs_${myCiv.toLowerCase()}`

  // Exact match
  if (tips[key]) return tips[key]

  // Try reverse (same matchup, different perspective)
  if (tips[reverseKey]) {
    return tips[reverseKey].map((t) =>
      t.replace(new RegExp(opponentCiv, 'gi'), '__OPP__')
        .replace(new RegExp(myCiv, 'gi'), opponentCiv)
        .replace(/__OPP__/g, myCiv)
    )
  }

  return tips['_default']
}

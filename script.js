
/*
  CoC Builder Tracker v3
  Scriptable for iPhone

  MONOCHROME

  Features:
  - Active timers across Home Village, Builder Base,
    Laboratory, and Pets
  - All active upgrades in one medium widget
  - Monochrome ETA-based finish proximity bars
  - One compact, two-column upgrade list
  - Native countdown text
  - Multiple accounts and editable labels
  - Clipboard JSON import
  - Local completion notifications and storage

  Widget parameter:
    #P9GJ2J9YC

  IMPORTANT:
  Builder Potion timer interpretation is not
  fully validated. When boosted, estimated
  completion dates may differ from the game.
*/

// =====================================
// CONFIG
// =====================================

const fm = FileManager.local()

const STORAGE = fm.joinPath(
  fm.documentsDirectory(),
  "coc-villages.json"
)

const COLOR = {
  bg: new Color("#080808"),
  card: new Color("#171717"),
  white: new Color("#FFFFFF"),
  gray: new Color("#AAAAAA"),
  dim: new Color("#737373"),
  border: new Color("#303030"),
  progress: new Color("#FFFFFF"),
  track: new Color("#383838")
}

const NAMESPACE = "coc-tracker-v3"

// =====================================
// ID MAPPINGS
// =====================================

const BUILDINGS = {
  "1000000": "Army Camp",
  "1000001": "Town Hall",
  "1000002": "Elixir Collector",
  "1000003": "Elixir Storage",
  "1000004": "Gold Mine",
  "1000005": "Gold Storage",
  "1000006": "Barracks",
  "1000007": "Laboratory",
  "1000008": "Cannon",
  "1000009": "Archer Tower",
  "1000010": "Wall",
  "1000011": "Wizard Tower",
  "1000012": "Air Defense",
  "1000013": "Mortar",
  "1000014": "Clan Castle",
  "1000015": "Builder's Hut",
  "1000019": "Hidden Tesla",
  "1000020": "Spell Factory",
  "1000021": "X-Bow",
  "1000023": "Dark Elixir Drill",
  "1000024": "Dark Elixir Storage",
  "1000026": "Dark Barracks",
  "1000027": "Inferno Tower",
  "1000028": "Air Sweeper",
  "1000029": "Dark Spell Factory",
  "1000031": "Eagle Artillery",
  "1000032": "Bomb Tower",
  "1000059": "Workshop",
  "1000064": "B.O.B's Hut",
  "1000067": "Scattershot",
  "1000068": "Pet House",
  "1000070": "Blacksmith",
  "1000071": "Hero Hall",
  "1000072": "Spell Tower",
  "1000077": "Monolith",
  "1000079": "Multi-Gear Tower",
  "1000084": "Multi-Archer Tower",
  "1000085": "Ricochet Cannon",
  "1000086": "Revenge Tower",
  "1000089": "Firespitter",
  "1000093": "Helper Hut",
  "1000097": "Crafting Station",
  "1000102": "Super Wizard Tower"
}

const TRAPS = {
  "12000000": "Bomb",
  "12000001": "Spring Trap",
  "12000002": "Giant Bomb",
  "12000005": "Air Bomb",
  "12000006": "Seeking Air Mine",
  "12000008": "Skeleton Trap",
  "12000016": "Tornado Trap",
  "12000020": "Giga Bomb"
}

const HEROES = {
  "28000000": "Barbarian King",
  "28000001": "Archer Queen",
  "28000002": "Grand Warden",
  "28000003": "Battle Machine",
  "28000004": "Royal Champion",
  "28000005": "Battle Copter",
  "28000006": "Minion Prince",
  "28000007": "Dragon Duke"
}

const LAB_TROOPS = {
  "4000000": "Barbarian",
  "4000001": "Archer",
  "4000002": "Goblin",
  "4000003": "Giant",
  "4000004": "Wall Breaker",
  "4000005": "Balloon",
  "4000006": "Wizard",
  "4000007": "Healer",
  "4000008": "Dragon",
  "4000009": "P.E.K.K.A",
  "4000010": "Minion",
  "4000011": "Hog Rider",
  "4000012": "Valkyrie",
  "4000013": "Golem",
  "4000015": "Witch",
  "4000017": "Lava Hound",
  "4000022": "Bowler",
  "4000023": "Baby Dragon",
  "4000024": "Miner",
  "4000053": "Yeti",
  "4000058": "Ice Golem",
  "4000059": "Electro Dragon",
  "4000065": "Dragon Rider",
  "4000082": "Headhunter",
  "4000095": "Electro Titan",
  "4000097": "Apprentice Warden",
  "4000109": "Ruin Witch",
  "4000110": "Root Rider",
  "4000123": "Druid",
  "4000132": "Thrower",
  "4000150": "Furnace",
  "4000177": "Meteor Golem"
}

const SIEGE_MACHINES = {
  "4000051": "Wall Wrecker",
  "4000052": "Battle Blimp",
  "4000062": "Stone Slammer",
  "4000075": "Siege Barracks",
  "4000087": "Log Launcher",
  "4000091": "Flame Flinger",
  "4000092": "Battle Drill",
  "4000135": "Troop Launcher",
  "4000188": "Sky Wagon"
}

const BUILDER_BASE_TROOPS = {
  "4000031": "Raged Barbarian",
  "4000032": "Sneaky Archer",
  "4000033": "Beta Minion",
  "4000034": "Boxer Giant",
  "4000035": "Bomber",
  "4000036": "Power P.E.K.K.A",
  "4000037": "Cannon Cart",
  "4000038": "Drop Ship",
  "4000041": "Baby Dragon",
  "4000042": "Night Witch",
  "4000070": "Hog Glider",
  "4000106": "Electrofire Wizard"
}

const BUILDER_BASE_BUILDINGS = {
  "1000033": "Wall",
  "1000034": "Builder Hall",
  "1000035": "Elixir Collector",
  "1000036": "Elixir Storage",
  "1000037": "Gold Mine",
  "1000038": "Gold Storage",
  "1000039": "Clock Tower",
  "1000040": "Builder Barracks",
  "1000041": "Double Cannon",
  "1000042": "Army Camp",
  "1000043": "Hidden Tesla",
  "1000044": "Cannon",
  "1000045": "Multi Mortar",
  "1000046": "Star Laboratory",
  "1000047": "B.O.T.O's Shack",
  "1000048": "Archer Tower",
  "1000049": "Reinforcement Camp",
  "1000050": "Firecrackers",
  "1000051": "Guard Post",
  "1000052": "Mega Tesla",
  "1000053": "Battle Machine Altar",
  "1000054": "Air Bombs",
  "1000055": "Crusher",
  "1000056": "Roaster",
  "1000057": "Giant Cannon",
  "1000058": "Gem Mine",
  "1000063": "Lava Launcher",
  "1000065": "B.O.B Control",
  "1000078": "O.T.T.O's Outpost",
  "1000080": "Battle Copter Altar",
  "1000081": "X-Bow",
  "1000082": "Healing Hut"
}

const BUILDER_BASE_TRAPS = {
  "12000010": "Spring Trap",
  "12000011": "Push Trap",
  "12000013": "Mine",
  "12000014": "Mega Mine"
}

const LAB_SPELLS = {
  "26000000": "Lightning Spell",
  "26000001": "Healing Spell",
  "26000002": "Rage Spell",
  "26000003": "Jump Spell",
  "26000005": "Freeze Spell",
  "26000009": "Poison Spell",
  "26000010": "Earthquake Spell",
  "26000011": "Haste Spell",
  "26000016": "Clone Spell",
  "26000017": "Skeleton Spell",
  "26000028": "Bat Spell",
  "26000035": "Invisibility Spell",
  "26000053": "Recall Spell",
  "26000070": "Overgrowth Spell",
  "26000098": "Revive Spell",
  "26000109": "Ice Block Spell",
  "26000120": "Totem Spell",
  "26000123": "Angry Spell"
}

const PETS = {
  "73000000": "L.A.S.S.I",
  "73000001": "Mighty Yak",
  "73000002": "Electro Owl",
  "73000003": "Unicorn",
  "73000004": "Phoenix",
  "73000007": "Poison Lizard",
  "73000008": "Diggy",
  "73000009": "Frosty",
  "73000010": "Spirit Fox",
  "73000011": "Angry Jelly",
  "73000016": "Sneezy",
  "73000017": "Greedy Raven"
}

const ITEM_NAMES = {
  Building: BUILDINGS,
  Trap: TRAPS,
  Hero: HEROES,
  "Builder Base Hero": HEROES,
  "Lab Troop": LAB_TROOPS,
  "Siege Machine": SIEGE_MACHINES,
  "Builder Base Troop": BUILDER_BASE_TROOPS,
  "Lab Spell": LAB_SPELLS,
  Pet: PETS,
  "Builder Base Building": BUILDER_BASE_BUILDINGS,
  "Builder Base Trap": BUILDER_BASE_TRAPS
}

const LEGACY_CATEGORIES = {
  Laboratory: "Lab Troop",
  "Builder Base": "Builder Base Building",
  "Builder Base Laboratory": "Builder Base Troop"
}

function mappedItemName(category, id) {
  const names = ITEM_NAMES[category]
  if (!names) return null

  const key = String(id)
  if (names[key]) return names[key]
  if (!/^\d+$/.test(key)) return null

  // Some saved tracker versions may contain an ID with an extra zero.
  for (let index = 1; index < key.length - 1; index++) {
    if (key[index] !== "0") continue

    const candidate = key.slice(0, index) + key.slice(index + 1)
    if (names[candidate]) return names[candidate]
  }

  return null
}

// =====================================
// STORAGE
// =====================================

function loadStore() {
  if (!fm.fileExists(STORAGE)) return {}

  try {
    const data = JSON.parse(fm.readString(STORAGE))

    if (data && typeof data === "object") {
      let changed = false

      for (const village of Object.values(data)) {
        if (!Array.isArray(village?.items)) continue

        for (const item of village.items) {
          if (!item || typeof item !== "object") continue

          const category =
            LEGACY_CATEGORIES[item.category] || item.category
          const id = String(item.id ?? "")
          const mappedName = mappedItemName(category, id)

          if (category !== item.category) {
            item.category = category
            changed = true
          }

          if (mappedName && mappedName !== item.name) {
            item.name = mappedName
            changed = true
          }
        }
      }

      if (changed) saveStore(data)
      return data
    }
  } catch (error) {
    console.error(String(error))
  }

  return {}
}

function saveStore(store) {
  fm.writeString(
    STORAGE,
    JSON.stringify(store)
  )
}

// =====================================
// IMPORT
// =====================================

function countInstances(collection, dataId) {
  if (!Array.isArray(collection)) return 0

  return collection.reduce((total, object) => {
    if (Number(object.data) !== dataId) return total

    const count = Number(object.cnt)
    const instances = Number.isFinite(count) && count > 0
      ? count
      : 1

    return total + instances
  }, 0)
}

function parseVillage(raw, previous = null) {
  const json = JSON.parse(raw)

  if (
    typeof json.tag !== "string" ||
    !Number.isFinite(json.timestamp) ||
    !Array.isArray(json.buildings)
  ) {
    throw new Error("Invalid Clash of Clans export.")
  }

  const sections = [
    ["buildings", "Building"],
    ["traps", "Trap"],
    ["heroes", "Hero"],
    ["units", "Lab Troop"],
    ["spells", "Lab Spell"],
    ["siege_machines", "Siege Machine"],
    ["pets", "Pet"],
    ["buildings2", "Builder Base Building"],
    ["traps2", "Builder Base Trap"],
    ["heroes2", "Builder Base Hero"],
    ["units2", "Builder Base Troop"]
  ]

  const duplicateCounts = {}
  const items = []

  for (const [key, category] of sections) {
    const collection = json[key] || []

    for (const object of collection) {
      if (
        !Number.isFinite(object.timer) ||
        object.timer <= 0
      ) {
        continue
      }

      const id = String(object.data)
      const level = Number(object.lvl) || 0
      const hasPosition =
        Number.isFinite(object.x) &&
        Number.isFinite(object.y)
      const position = hasPosition
        ? `${object.x},${object.y}`
        : ""
      const duplicateBase = [
        key,
        id,
        level,
        position
      ].join("|")
      const duplicateIndex = duplicateCounts[duplicateBase] || 0
      duplicateCounts[duplicateBase] = duplicateIndex + 1
      const itemKey = hasPosition
        ? duplicateBase
        : `${duplicateBase}|${duplicateIndex}`

      const name = mappedItemName(category, id) || `#${id}`

      items.push({
        key: itemKey,
        id,
        name,
        category,
        level,
        workSeconds: object.timer,
        helperSeconds: Math.max(
          0,
          Number(object.helper_timer) || 0
        )
      })
    }
  }

  const tag = json.tag.toUpperCase()
  const boostData = json.boosts || {}
  const homeBuildings = json.buildings || []
  const builderBaseBuildings = json.buildings2 || []
  const builderHuts = countInstances(homeBuildings, 1000015)
  const bobHuts = countInstances(homeBuildings, 1000064)
  const homeBuilderCount = builderHuts + (bobHuts > 0 ? 1 : 0)
  const builderHall = builderBaseBuildings.find(
    building => Number(building.data) === 1000034
  )
  const builderHallLevel = Number(builderHall?.lvl) || 0
  const builderBaseBuilderCount =
    (builderHallLevel >= 6 ? 2 : builderHallLevel > 0 ? 1 : 0) +
    (countInstances(builderBaseBuildings, 1000047) > 0 ? 1 : 0)
  const homeLabAvailable =
    countInstances(homeBuildings, 1000007) > 0
  const petHouseAvailable =
    countInstances(homeBuildings, 1000068) > 0
  const builderBaseLabAvailable =
    countInstances(builderBaseBuildings, 1000046) > 0

  return {
    tag,
    name: previous?.name || tag,
    timestamp: json.timestamp,
    builderBoost: Math.max(
      0,
      Number(boostData.builder_boost) || 0
    ),
    boosts: {
      builder: Math.max(0, Number(boostData.builder_boost) || 0),
      research: Math.max(0, Number(boostData.lab_boost) || 0),
      clockTower: Math.max(0, Number(boostData.clocktower_boost) || 0),
      pet: Math.max(0, Number(boostData.pet_boost) || 0),
      builderBite: Math.max(0, Number(boostData.builder_consumable) || 0),
      studySoup: Math.max(0, Number(boostData.lab_consumable) || 0)
    },
    homeBuilderCount,
    builderBaseBuilderCount,
    homeLabAvailable,
    petHouseAvailable,
    builderBaseLabAvailable,
    items
  }
}

// =====================================
// TIMER ENGINE
// =====================================

function usesBuilderPotion(item) {
  return ["Building", "Trap", "Hero"].includes(item.category)
}

function calculateFinish(village, item) {
  let seconds = item.workSeconds

  /*
    Boost calculation is provisional.

    Assumes exported timer is remaining
    normal-speed work seconds.

    A 10x potion performs 10 seconds of
    upgrade work per real-world second.

    If this assumption is incorrect,
    the finish time must be recalculated
    after a fresh export.
  */

  if (
    usesBuilderPotion(item) &&
    village.builderBoost > 0
  ) {
    const boostDuration = village.builderBoost
    const boostedWork = boostDuration * 10

    if (seconds <= boostedWork) {
      seconds = seconds / 10
    } else {
      seconds =
        boostDuration +
        (seconds - boostedWork)
    }
  }

  return new Date(
    (village.timestamp + seconds) * 1000
  )
}

function boostSecondsRemaining(village, secondsAtImport) {
  const duration = Math.max(0, Number(secondsAtImport) || 0)
  const importedAt = Number(village.timestamp)
  const elapsed = Number.isFinite(importedAt)
    ? Math.max(0, Date.now() / 1000 - importedAt)
    : 0

  return Math.max(0, duration - elapsed)
}

function activeBoostLabels(village) {
  const boosts = village.boosts || {}
  const labels = []

  if (boostSecondsRemaining(
    village,
    boosts.builder || village.builderBoost || 0
  ) > 0) {
    labels.push("BUILDER POTION")
  }
  if (boostSecondsRemaining(village, boosts.research) > 0) {
    labels.push("RESEARCH POTION")
  }
  if (boostSecondsRemaining(village, boosts.clockTower) > 0) {
    labels.push("CLOCK TOWER")
  }
  if (boostSecondsRemaining(village, boosts.pet) > 0) {
    labels.push("PET POTION")
  }
  if (boostSecondsRemaining(village, boosts.builderBite) > 0) {
    labels.push("BUILDER BITE")
  }
  if (boostSecondsRemaining(village, boosts.studySoup) > 0) {
    labels.push("STUDY SOUP")
  }

  return labels
}

function freeBuilderLabel(village) {
  const builderCategories = ["Building", "Trap", "Hero"]
  const busy = (village.items || []).filter(item =>
    builderCategories.includes(item.category) &&
    calculateFinish(village, item).getTime() > Date.now()
  ).length
  const importedTotal = Number(village.homeBuilderCount)

  // Six active Home Village jobs prove that all six builders are occupied,
  // even when this account was saved before builder-count tracking existed.
  let total = Number.isFinite(importedTotal) && importedTotal > 0
    ? Math.min(6, importedTotal)
    : 0

  if (busy >= 6) total = 6

  if (total <= 0 || busy > total) return ""

  const free = Math.max(0, total - busy)

  return `HOME BUILDERS · ${free}/${total}`
}

function freeBuilderBaseBuilderLabel(village) {
  const builderCategories = [
    "Builder Base Building",
    "Builder Base Trap",
    "Builder Base Hero"
  ]
  const busy = (village.items || []).filter(item =>
    builderCategories.includes(item.category) &&
    calculateFinish(village, item).getTime() > Date.now()
  ).length
  const importedTotal = Number(village.builderBaseBuilderCount)

  let total = Number.isFinite(importedTotal) && importedTotal > 0
    ? Math.min(3, importedTotal)
    : 0

  // Three simultaneous Builder Base jobs prove all three builders are occupied.
  if (busy >= 3) total = 3

  if (total <= 0 || busy > total) return ""

  const free = Math.max(0, total - busy)

  return `BB BUILDERS · ${free}/${total}`
}

function categoryIsActive(village, categories) {
  return (village.items || []).some(item =>
    categories.includes(item.category) &&
    calculateFinish(village, item).getTime() > Date.now()
  )
}

function slotStatus(village, field, categories, label) {
  const knownFromImport = village[field]
  const knownFromSavedTimers = (village.items || []).some(item =>
    categories.includes(item.category)
  )

  if (knownFromImport !== true && knownFromImport !== false &&
      !knownFromSavedTimers) {
    return ""
  }

  if (knownFromImport === false) return ""

  return label + " " + (
    categoryIsActive(village, categories)
      ? "BUSY"
      : "AVAILABLE"
  )
}

function addWidgetFooter(widget, village) {
  const firstRow = [
    freeBuilderLabel(village),
    freeBuilderBaseBuilderLabel(village),
    slotStatus(
      village,
      "homeLabAvailable",
      ["Lab Troop", "Lab Spell", "Siege Machine"],
      "LAB"
    )
  ].filter(Boolean).join(" · ")

  const secondRow = [
    slotStatus(
      village,
      "petHouseAvailable",
      ["Pet"],
      "PET HOUSE"
    ),
    slotStatus(
      village,
      "builderBaseLabAvailable",
      ["Builder Base Troop"],
      "STAR LAB"
    )
  ].filter(Boolean).join(" · ")

  if (firstRow) {
    widget.addSpacer()
    const row = widget.addStack()
    row.centerAlignContent()
    addText(
      row,
      firstRow,
      7,
      COLOR.gray,
      true
    )
  }

  if (secondRow) {
    const row = widget.addStack()
    row.centerAlignContent()
    addText(
      row,
      secondRow,
      7,
      COLOR.gray,
      true
    )
  }

  const activeBoosts = activeBoostLabels(village)

  if (activeBoosts.length) {
    widget.addSpacer(1)
    const boostRow = widget.addStack()
    boostRow.centerAlignContent()
    addText(
      boostRow,
      "ACTIVE BOOSTS · " + activeBoosts.join(", "),
      7,
      COLOR.gray,
      true
    )
  }
}

function getAllUpgrades(village) {
  return village.items
    .map(item => ({
      ...item,
      finish: calculateFinish(village, item)
    }))
    .sort((a, b) => a.finish - b.finish)
}

function getUpgrades(village) {
  return getAllUpgrades(village)
    .filter(item => item.finish.getTime() > Date.now())
}

// =====================================
// TEXT HELPERS
// =====================================

function addText(
  parent,
  value,
  size = 11,
  textColor = COLOR.white,
  bold = false
) {
  const t = parent.addText(String(value))

  t.font = bold
    ? Font.boldSystemFont(size)
    : Font.systemFont(size)

  t.textColor = textColor
  t.lineLimit = 1
  t.minimumScaleFactor = 0.65

  return t
}

function ageLabel(timestamp) {
  const seconds = Math.max(
    0,
    Math.floor(Date.now() / 1000 - timestamp)
  )

  if (seconds < 60) return "imported just now"
  if (seconds < 3600) {
    return `imported ${Math.floor(seconds / 60)}m ago`
  }
  if (seconds < 86400) {
    return `imported ${Math.floor(seconds / 3600)}h ago`
  }

  return `imported ${Math.floor(seconds / 86400)}d ago`
}

function compactRemaining(date) {
  let minutes = Math.ceil(
    Math.max(0, date.getTime() - Date.now()) / 60000
  )

  const days = Math.floor(minutes / 1440)
  minutes %= 1440
  const hours = Math.floor(minutes / 60)
  minutes %= 60

  if (days) return `${days}d ${hours}h`
  if (hours) return `${hours}h ${minutes}m`
  if (minutes) return `${minutes}m`
  return "<1m"
}

function compactName(name) {
  return name
}

function upgradeTitle(item) {
  return compactName(item.name)
}

function upgradeGroup(item) {
  if (item.category.startsWith("Builder Base")) {
    return "Builder Base"
  }
  if (item.category.startsWith("Lab ") || item.category === "Siege Machine") {
    return "Laboratory"
  }
  if (item.category === "Pet") return "Pets"
  return "Home Village"
}

// =====================================
// WIDGET BASE
// =====================================

function makeWidget() {
  const w = new ListWidget()

  w.backgroundColor = COLOR.bg
  w.setPadding(9, 13, 9, 13)

  return w
}

function makeHeader(parent, village, compact = false, subtitle = null) {
  const top = parent.addStack()
  top.centerAlignContent()

  const left = top.addStack()
  left.layoutVertically()

  addText(
    left,
    "CoC BUILDER",
    compact ? 12 : 15,
    COLOR.white,
    true
  )

  left.addSpacer(3)

  addText(
    left,
    subtitle || village.name || village.tag,
    compact ? 9 : 10,
    COLOR.gray
  )

  top.addSpacer(8)

  return top
}

// =====================================
// FINISH PROXIMITY ESTIMATE
// =====================================

function finishProximity(item) {
  /*
    The export provides a remaining timer but not
    the upgrade's original duration or actual start.

    This is a visual ETA cue, not a completion
    percentage. It is calibrated so an upgrade
    with about two hours remaining appears ~90%
    full, then approaches full as its ETA nears 0.
  */

  const remainingSeconds = Math.max(
    0,
    (item.finish.getTime() - Date.now()) / 1000
  )
  const proximityScaleSeconds = 18 * 60 * 60

  return Math.max(
    0,
    Math.min(
      1,
      proximityScaleSeconds /
        (proximityScaleSeconds + remainingSeconds)
    )
  )
}

function addProgressBar(
  parent,
  progress,
  width = 240,
  barHeight = 7
) {
  /*
    Scriptable widgets do not provide a native
    progress view, so we render a monochrome bar
    using DrawContext.
  */

  const inset = barHeight > 5 ? 1 : 0
  const fillHeight = Math.max(2, barHeight - inset * 2)
  const ctx = new DrawContext()
  ctx.size = new Size(width, barHeight)
  ctx.opaque = false
  ctx.respectScreenScale = true

  ctx.setFillColor(COLOR.track)
  ctx.fillRect(
    new Rect(0, inset, width, fillHeight)
  )

  ctx.setFillColor(COLOR.progress)
  ctx.fillRect(
    new Rect(
      0,
      inset,
      Math.max(0, width * progress),
      fillHeight
    )
  )

  const img = parent.addImage(ctx.getImage())
  img.imageSize = new Size(width, barHeight)
}

// =====================================
// MEDIUM WIDGET
// =====================================

function mediumWidget(village) {
  const w = makeWidget()
  const upgrades = getUpgrades(village)

  makeHeader(
    w,
    village,
    true,
    `${village.name || village.tag} · ${upgrades.length} active · ${ageLabel(village.timestamp)}`
  )

  w.addSpacer(4)

  if (!upgrades.length) {
    w.addSpacer()
    addText(
      w,
      "ALL TRACKED UPGRADES COMPLETE",
      11,
      COLOR.white,
      true
    )
    addWidgetFooter(w, village)
    return w
  }

  const grid = w.addStack()
  grid.layoutHorizontally()

  const left = grid.addStack()
  left.layoutVertically()

  grid.addSpacer(8)

  const right = grid.addStack()
  right.layoutVertically()

  const midpoint = Math.ceil(upgrades.length / 2)
  const leftItems = upgrades.slice(0, midpoint)
  const rightItems = upgrades.slice(midpoint)

  function drawColumn(stack, entries) {
    entries.forEach((item, index) => {
      const row = stack.addStack()
      row.centerAlignContent()
      addText(
        row,
        `${upgradeTitle(item)} · L${item.level + 1}`,
        8,
        COLOR.white,
        true
      )
      row.addSpacer()
      addText(row, compactRemaining(item.finish), 7, COLOR.gray)
      const progress = finishProximity(item)
      stack.addSpacer(1)
      addProgressBar(stack, progress, 150, 4)

      if (index < entries.length - 1) {
        stack.addSpacer(1)
      }
    })
  }

  drawColumn(left, leftItems)
  drawColumn(right, rightItems)

  addWidgetFooter(w, village)

  return w
}

// =====================================
// EMPTY STATE
// =====================================

function emptyWidget() {
  const w = makeWidget()

  addText(
    w,
    "CoC BUILDER",
    15,
    COLOR.white,
    true
  )

  w.addSpacer()

  addText(
    w,
    "NO VILLAGE DATA",
    13,
    COLOR.white,
    true
  )

  w.addSpacer(6)

  const t = addText(
    w,
    "Open Scriptable to import a village export.",
    11,
    COLOR.gray
  )

  t.lineLimit = 3

  w.addSpacer()
  return w
}

function renderWidget(village, family) {
  if (!village) return emptyWidget()

  if (family !== "medium") {
    const w = makeWidget()
    addText(
      w,
      "PLEASE USE A MEDIUM WIDGET",
      11,
      COLOR.white,
      true
    )
    return w
  }

  return mediumWidget(village)
}

// =====================================
// NOTIFICATIONS
// =====================================

function notificationId(tag, item, index) {
  return [
    NAMESPACE,
    tag.replace("#", ""),
    item.category.replace(/\s+/g, "-"),
    item.id,
    index
  ].join("-")
}

async function scheduleNotifications(village) {
  /*
    Removes notifications previously created
    by this tracker for this account.

    Does not remove notifications belonging
    to other apps or other CoC accounts.
  */

  const scheduled = await Notification.allPending()

  const prefix = (
    NAMESPACE +
    "-" +
    village.tag.replace("#", "") +
    "-"
  )

  const oldIds = scheduled
    .filter(n => n.identifier.startsWith(prefix))
    .map(n => n.identifier)

  if (oldIds.length) {
    await Notification.removePending(oldIds)
  }

  const upgrades = getAllUpgrades(village)

  let count = 0

  for (let i = 0; i < upgrades.length; i++) {
    const item = upgrades[i]

    if (item.finish.getTime() <= Date.now()) {
      continue
    }

    const n = new Notification()

    n.identifier = notificationId(
      village.tag,
      item,
      i
    )

    n.title = "CoC Upgrade Complete"

    n.body =
      (village.name || village.tag) +
      " · " +
      upgradeGroup(item) +
      ": " +
      item.name +
      " is finished upgrading."

    n.sound = "default"

    n.setTriggerDate(item.finish)

    await n.schedule()
    count++
  }

  return count
}

// =====================================
// ALERTS AND MENUS
// =====================================

async function message(title, body) {
  const a = new Alert()
  a.title = title
  a.message = body
  a.addAction("OK")
  await a.presentAlert()
}


async function importClipboard(store) {
  try {
    const raw = Pasteboard.pasteString()

    if (!raw || !raw.trim()) {
      throw new Error(
        "Clipboard is empty. Copy your village export first."
      )
    }

    const json = JSON.parse(raw)
    const tag = String(json.tag || "").toUpperCase()
    const previous = store[tag] || null

    const village = parseVillage(raw, previous)

    if (
      previous &&
      village.timestamp < previous.timestamp
    ) {
      throw new Error(
        "The copied export is older than your saved data."
      )
    }

    if (!previous) {
      const prompt = new Alert()
      prompt.title = "Village Name"
      prompt.message =
        "Enter a name to display on your widget."

      prompt.addTextField(
        "Account name",
        village.tag
      )

      prompt.addAction("Save")
      prompt.addCancelAction("Cancel")

      const result = await prompt.presentAlert()

      if (result < 0) return null

      const name = prompt.textFieldValue(0).trim()
      village.name = name || village.tag
    }

    store[village.tag] = village
    saveStore(store)

    let count = 0
    let notificationError = ""

    try {
      count = await scheduleNotifications(village)
    } catch (e) {
      notificationError = String(e)
    }

    await message(
      "Import Successful",
      "Village: " + village.name +
      "\nActive timers: " + village.items.length +
      "\nBuilder Potion: " +
      (village.builderBoost > 0
        ? "Detected"
        : "Not active") +
      "\nNotifications: " + count +
      (notificationError
        ? "\nNotification error: " + notificationError
        : "")
    )

    return village

  } catch (error) {
    await message(
      "Import Failed",
      String(error.message || error)
    )

    return null
  }
}

async function chooseVillage(store) {
  const tags = Object.keys(store)

  if (!tags.length) {
    await message(
      "No Accounts",
      "Import a village JSON first."
    )
    return null
  }

  const a = new Alert()
  a.title = "Choose Village"

  tags.forEach(tag => {
    const village = store[tag]

    a.addAction(
      (village.name || tag) + " (" + tag + ")"
    )
  })

  a.addCancelAction("Cancel")

  const selected = await a.presentSheet()

  if (selected < 0) return null

  return store[tags[selected]]
}

async function previewWidget(village) {
  const widget = renderWidget(village, "medium")
  await widget.presentMedium()
}

async function renameVillage(store) {
  const village = await chooseVillage(store)

  if (!village) return

  const a = new Alert()
  a.title = "Rename Village"

  a.addTextField(
    "Village name",
    village.name || village.tag
  )

  a.addAction("Save")
  a.addCancelAction("Cancel")

  const result = await a.presentAlert()

  if (result < 0) return

  const newName = a.textFieldValue(0).trim()

  village.name = newName || village.tag

  store[village.tag] = village
  saveStore(store)

  await message(
    "Name Updated",
    village.name
  )
}

// =====================================
// MAIN
// =====================================

async function main() {
  const store = loadStore()
  const tags = Object.keys(store)

  if (config.runsInWidget) {
    const parameter = String(
      args.widgetParameter || ""
    ).trim()

    const rawTag = parameter.split("|")[0]
    const tag = rawTag.toUpperCase()

    const selectedTag = store[tag]
      ? tag
      : tags[tags.length - 1]

    const village = store[selectedTag] || null

    const widget = renderWidget(
      village,
      config.widgetFamily
    )

    widget.refreshAfterDate = new Date(
      Date.now() + 15 * 60 * 1000
    )

    Script.setWidget(widget)
    return
  }

  const menu = new Alert()

  menu.title = "CoC Builder Tracker"

  menu.addAction("Import Village JSON")
  menu.addAction("Preview Widget")
  menu.addAction("Rename Village")
  menu.addAction("View Saved Accounts")
  menu.addCancelAction("Close")

  const result = await menu.presentSheet()

  if (result === 0) {
    const village = await importClipboard(store)

    if (village) {
      await previewWidget(village)
    }
  }

  if (result === 1) {
    const village = await chooseVillage(store)

    if (village) {
      await previewWidget(village)
    }
  }

  if (result === 2) {
    await renameVillage(store)
  }

  if (result === 3) {
    await message(
      "Saved Accounts",
      tags.length
        ? tags.map(tag => {
            const village = store[tag]
            return (village.name || tag) +
              "\n" + tag
          }).join("\n\n")
        : "No accounts saved."
    )
  }
}

await main()
Script.complete()

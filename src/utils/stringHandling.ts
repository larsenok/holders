const adjectives = [
  'Crimson', 'Golden', 'Obsidian', 'Frost', 'Verdant', 'Shattered',
  'Silent', 'Sacred', 'Ivory', 'Duskwatch', 'Stormbound', 'Cinder', 'Ashen',
  'Twilight', 'Ebon', 'Azure', 'Wyrmblood', 'Mythic', 'Ember'
];

const nouns = [
  'Blades', 'Order', 'Vanguard', 'Council', 'Flame', 'Oath',
  'Legion', 'Covenant', 'Circle', 'Pact', 'Horns', 'Watch', 'Keep',
  'Thorns', 'Cloak', 'Spire', 'Fangs', 'Shroud', 'Sanctum'
];

// Used to track names already given in-session
const usedNames = new Set<string>();

export function generateGuildName(): string {
  let name = '';
  let tries = 0;
  do {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    name = `${adjective} ${noun}`;
    tries++;
  } while (usedNames.has(name) && tries < 50);
  usedNames.add(name);
  return name;
}

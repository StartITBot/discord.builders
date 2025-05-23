const adjectives = ['Furry', 'Ferocious', 'Dangerous', 'Poisonous', 'Tame', 'Agile', 'Clever', 'Aggressive',
    'Tiny', 'Domestic', 'Wild', 'Herbivorous', 'Carnivorous', 'Adorable', 'Aggressive', 'Agile', 'Beautiful', 'Bossy',
    'Candid', 'Carnivorous', 'Clever', 'Cold', 'Cold-Blooded', 'Colorful', 'Cuddly', 'Curious', 'Cute', 'Dangerous',
    'Deadly', 'Domestic', 'Dominant', 'Energetic', 'Fast', 'Feisty', 'Ferocious', 'Fierce', 'Fluffy', 'Friendly',
    'Furry', 'Fuzzy', 'Grumpy', 'Hairy', 'Heavy', 'Herbivorous', 'Jealous', 'Large', 'Lazy', 'Loud', 'Lovable',
    'Loving', 'Malicious', 'Maternal', 'Mean', 'Messy', 'Nocturnal', 'Noisy', 'Nosy', 'Picky', 'Playful', 'Poisonous',
    'Quick', 'Rough', 'Sassy', 'Scaly', 'Short', 'Shy', 'Slimy', 'Slow', 'Small', 'Smart', 'Smelly', 'Soft', 'Spikey',
    'Stinky', 'Strong', 'Stubborn', 'Submissive', 'Tall', 'Tame', 'Tenacious', 'Territorial', 'Tiny', 'Vicious',
    'Warm', 'Wild']


const animals = ['Aardvark', 'Albatross', 'Alligator', 'Alpaca', 'Ant', 'Anteater', 'Antelope', 'Ape',
    'Armadillo', 'Donkey', 'Baboon', 'Badger', 'Barracuda', 'Bat', 'Bear', 'Beaver', 'Bee', 'Bison', 'Boar',
    'Buffalo', 'Butterfly', 'Camel', 'Capybara', 'Caribou', 'Cassowary', 'Cat', 'Caterpillar', 'Cattle', 'Chamois',
    'Cheetah', 'Chicken', 'Chimpanzee', 'Chinchilla', 'Chough', 'Clam', 'Cobra', 'Cockroach', 'Cod', 'Cormorant',
    'Coyote', 'Crab', 'Crane', 'Crocodile', 'Crow', 'Curlew', 'Deer', 'Dinosaur', 'Dog', 'Dogfish', 'Dolphin',
    'Dotterel', 'Dove', 'Dragonfly', 'Duck', 'Dugong', 'Dunlin', 'Eagle', 'Echidna', 'Eel', 'Eland', 'Elephant',
    'Elk', 'Emu', 'Falcon', 'Ferret', 'Finch', 'Fish', 'Flamingo', 'Fly', 'Fox', 'Frog', 'Gaur', 'Gazelle', 'Gerbil',
    'Giraffe', 'Gnat', 'Gnu', 'Goat', 'Goldfinch', 'Goldfish', 'Goose', 'Gorilla', 'Goshawk', 'Grasshopper', 'Grouse',
    'Guanaco', 'Gull', 'Hamster', 'Hare', 'Hawk', 'Hedgehog', 'Heron', 'Herring', 'Hippopotamus', 'Hornet', 'Horse',
    'Human', 'Hummingbird', 'Hyena', 'Ibex', 'Ibis', 'Jackal', 'Jaguar', 'Jay', 'Jellyfish', 'Kangaroo', 'Kingfisher',
    'Koala', 'Kookabura', 'Kouprey', 'Kudu', 'Lapwing', 'Lark', 'Lemur', 'Leopard', 'Lion', 'Llama', 'Lobster',
    'Locust', 'Loris', 'Louse', 'Lyrebird', 'Magpie', 'Mallard', 'Manatee', 'Mandrill', 'Mantis', 'Marten', 'Meerkat',
    'Mink', 'Mole', 'Mongoose', 'Monkey', 'Moose', 'Mosquito', 'Mouse', 'Mule', 'Narwhal', 'Newt', 'Nightingale',
    'Octopus', 'Okapi', 'Opossum', 'Oryx', 'Ostrich', 'Otter', 'Owl', 'Oyster', 'Panther', 'Parrot', 'Partridge',
    'Peafowl', 'Pelican', 'Penguin', 'Pheasant', 'Pig', 'Pigeon', 'Pony', 'Porcupine', 'Porpoise', 'Quail', 'Quelea',
    'Quetzal', 'Rabbit', 'Raccoon', 'Rail', 'Ram', 'Rat', 'Raven', 'Red Deer', 'Red Panda', 'Reindeer', 'Rhinoceros',
    'Rook', 'Salamander', 'Salmon', 'Sand Dollar', 'Sandpiper', 'Sardine', 'Scorpion', 'Seahorse', 'Seal', 'Shark',
    'Sheep', 'Shrew', 'Skunk', 'Snail', 'Snake', 'Sparrow', 'Spider', 'Spoonbill', 'Squid', 'Squirrel', 'Starling',
    'Stingray', 'Stinkbug', 'Stork', 'Swallow', 'Swan', 'Tapir', 'Tarsier', 'Termite', 'Tiger', 'Toad', 'Trout',
    'Turkey', 'Turtle', 'Viper', 'Vulture', 'Wallaby', 'Walrus', 'Wasp', 'Weasel', 'Whale', 'Wildcat', 'Wolf',
    'Wolverine', 'Wombat', 'Woodcock', 'Woodpecker', 'Worm', 'Wren', 'Yak', 'Zebra']
;


export function generateRandomAnimal() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective} ${randomAnimal}`;
}

export function uuidv4() {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c==='x' ? r : (r&0x7|0x8)).toString(16);
    });
}

const DICTIONARY: {[a: string]: string[]} = {
  FEELINGS: ["confused", "thrilled", "awkward", "jealous", "lazy", "excited"],
  ACTIONS: ["lick a cactus", "hug a stranger", "scream into the void", "dance with socks on your hands", "talk to a plant"],
  SUBJECTS: ["cat", "lizard", "grandma", "robot", "alien", "time traveler"],
  OBJECTS: ["toaster", "banana", "invisible unicorn", "giant spaghetti", "emotional potato"],
  VERBS: ["explode", "teleport", "vanish", "become famous", "write a novel", "sing opera"],
  PLACES: ["the moon", "a haunted IKEA", "your dreams", "Area 51", "a parallel universe"],
  QUOTES: [
    "If life gives you ${OBJECTS}, make ${OBJECTS} soup.",
    "Never trust a ${SUBJECTS} with a ${OBJECTS}.",
    "Always ${ACTIONS} before you ${VERBS}.",
    "They said I couldn't ${VERBS}, so I went to ${PLACES} and became a ${SUBJECTS}.",
    "True wisdom comes from ${ACTIONS} during ${FEELINGS} times.",
    "Behind every ${SUBJECTS}, there's a ${FEELINGS} ${OBJECTS}."
  ]
};

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomSentence() {
  let sentence = getRandom(DICTIONARY.QUOTES);
  const matches = sentence.match(/\${\w+}/g);

  matches?.forEach((match) => {
    const key = match.replace("${", "").replace("}", "");
    const replacement = getRandom(DICTIONARY[key] || ["something"]);
    sentence = sentence.replace(match, replacement);
  });

  return sentence
}

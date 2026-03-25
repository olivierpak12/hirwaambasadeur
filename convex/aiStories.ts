import { query, mutation } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

// Module-level constant for story pairs to ensure accessibility
const STORY_PAIRS = [
  {
    english: "Once upon a time, a chicken decided to start a band. But every time they tried to play, the drummer kept saying 'I'm too chicken to drum!' The band never took off, but the chicken became a famous comedian instead.",
    kinyarwanda: "Hari igihe, inkoko yahisemo gutangiza umurika. Ariko buri gihe bagiye gukina, umushyitsi w'imbyino yavugaga 'ndatinya gukina!' Umurika ntiwagize amahirwe, ariko inkoko yabaye umukinnyi wamamaye.",
    french: "Il était une fois, un poulet qui décida de former un groupe. Mais chaque fois qu'ils essayaient de jouer, le batteur disait 'J'ai trop peur de battre!' Le groupe n'a jamais décollé, mais le poulet est devenu un célèbre comédien.",
  },
  {
    english: "A tomato and a potato were best friends. One day, the tomato said, 'I want to become a superhero!' The potato replied, 'That's great! Just don't get squashed!' The tomato became 'Super Squash' and saved the garden from hungry rabbits.",
    kinyarwanda: "Inyanya n'ibirayi byari incuti magara. Umunsi umwe, inyanya yavuze 'ndashaka kuba umusirikare!' Ibirayi byasubije 'ni byiza! Gusa ntuzasatwe!' Inyanya yabaye 'Super Squash' ikiza ubutaka ku nsina zifite inzura.",
    french: "Une tomate et une pomme de terre étaient les meilleures amies. Un jour, la tomate dit 'Je veux devenir un super-héros!' La pomme de terre répondit 'C'est génial! Ne te fais pas écraser!' La tomate devint 'Super Écrasé' et sauva le jardin des lapins affamés.",
  },
  {
    english: "Why did the scarecrow win an award? Because he was outstanding in his field! He also told the best jokes, making all the crows laugh so hard they forgot to steal corn.",
    kinyarwanda: "Kuki umupfumu w'imbuto yatsindiye igihembo? Kubera ko yari uwa mbere mu murima we! Yanavugaga amajambo meza, ashyira inyoni zose mu isezerano kugeza zibagirwa gukurira.",
    french: "Pourquoi l'épouvantail a-t-il gagné un prix? Parce qu'il était exceptionnel dans son domaine! Il racontait aussi les meilleures blagues, faisant rire les corbeaux si fort qu'ils oubliaient de voler le maïs.",
  },
  {
    english: "A penguin tried to fly south for winter, but kept falling into the water. 'I guess I'm just not cut out for this flying business,' he said. His friends told him, 'Don't worry, you're ice at swimming!'",
    kinyarwanda: "Pengwini yagerageje kuruka amajyepfo mu gihe cy'ubukonje, ariko yicaga mu mazi. 'Ndabona ntako nakoze muri ubu buryo bwo kuruka,' yavuze. Incuti ze zimubwira 'Ntuzahangayike, uri ice mu koga!'",
    french: "Un pingouin essaya de voler vers le sud pour l'hiver, mais tombait constamment dans l'eau. 'Je suppose que je ne suis pas fait pour ce métier de voler,' dit-il. Ses amis lui dirent 'Ne t'inquiète pas, tu es glace à la nage!'",
  },
  {
    english: "Two cookies were baking in an oven. One said, 'Boy, it's hot in here!' The other replied, 'Holy smokes! A talking cookie!'",
    kinyarwanda: "Cookies ebyiri zari zivuga mu ruhu. Imwe yavuze 'Mukuru, birashyu hano!' Iya kabiri isubiza 'Holy smokes! Cookie ivuga!'",
    french: "Deux biscuits cuisaient dans un four. L'un dit 'Mon Dieu, il fait chaud ici!' L'autre répondit 'Sainte fumée! Un biscuit qui parle!'",
  },
];

// Get the latest active AI story
export const getLatestStory = query({
  args: {},
  handler: async (ctx) => {
    const story = await ctx.db
      .query('aiStories')
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('desc')
      .first();
    return story;
  },
});

// Generate a new AI story (admin function)
export const generateNewStory = mutation({
  args: {},
  handler: async (ctx) => {
    // First, deactivate the current active story
    const currentActive = await ctx.db
      .query('aiStories')
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    if (currentActive) {
      await ctx.db.patch(currentActive._id, { isActive: false });
    }

    // Pick random story pair
    const randomStory = STORY_PAIRS[Math.floor(Math.random() * STORY_PAIRS.length)];

    console.log('=== GENERATING NEW STORY ===');
    console.log('English:', randomStory.english.substring(0, 50));
    console.log('Kinyarwanda:', randomStory.kinyarwanda.substring(0, 50));
    console.log('French:', randomStory.french.substring(0, 50));

    const newStoryId = await ctx.db.insert('aiStories', {
      englishText: randomStory.english,
      kinyarwandaText: randomStory.kinyarwanda,
      frenchText: randomStory.french,
      generatedAt: new Date().toISOString(),
      isActive: true,
    });

    console.log('Story inserted with ID:', newStoryId);

    // Schedule the next generation in 24 hours
    await ctx.scheduler.runAfter(24 * 60 * 60 * 1000, api.aiStories.generateNewStory, {});

    return newStoryId;
  },
});

// Helper function to generate funny story (integrate with AI API)
async function generateFunnyStory(language: string): Promise<string> {
  // TODO: Replace with actual AI API integration
  // Example with OpenAI:
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-3.5-turbo',
  //     messages: [{
  //       role: 'user',
  //       content: `Generate a short, funny story in ${language} about animals or everyday situations. Keep it under 100 words.`
  //     }],
  //     max_tokens: 150,
  //   }),
  // });
  // const data = await response.json();
  // return data.choices[0].message.content.trim();

  // For now, using sample stories
  const sampleStories = {
    english: [
      "Once upon a time, a chicken decided to start a band. But every time they tried to play, the drummer kept saying 'I'm too chicken to drum!' The band never took off, but the chicken became a famous comedian instead.",
      "A tomato and a potato were best friends. One day, the tomato said, 'I want to become a superhero!' The potato replied, 'That's great! Just don't get squashed!' The tomato became 'Super Squash' and saved the garden from hungry rabbits.",
      "Why did the scarecrow win an award? Because he was outstanding in his field! He also told the best jokes, making all the crows laugh so hard they forgot to steal corn.",
      "A penguin tried to fly south for winter, but kept falling into the water. 'I guess I'm just not cut out for this flying business,' he said. His friends told him, 'Don't worry, you're ice at swimming!'",
      "Two cookies were baking in an oven. One said, 'Boy, it's hot in here!' The other replied, 'Holy smokes! A talking cookie!'",
    ],
    kinyarwanda: [
      "Hari igihe, inkoko yahisemo gutangiza umurika. Ariko buri gihe bagiye gukina, umushyitsi w'imbyino yavugaga 'ndatinya gukina!' Umurika ntiwagize amahirwe, ariko inkoko yabaye umukinnyi wamamaye.",
      "Inyanya n'ibirayi byari incuti magara. Umunsi umwe, inyanya yavuze 'ndashaka kuba umusirikare!' Ibirayi byasubije 'ni byiza! Gusa ntuzasatwe!' Inyanya yabaye 'Super Squash' ikiza ubutaka ku nsina zifite inzara.",
      "Kuki umupfumu w'imbuto yatsindiye igihembo? Kubera ko yari uwa mbere mu murima we! Yanavugaga amajambo meza, ashyira inyoni zose mu isezerano kugeza zibagirwa gukurira.",
      "Pengwini yagerageje kuruka amajyepfo mu gihe cy'ubukonje, ariko yicaga mu mazi. 'Ndabona ntako nakoze muri ubu buryo bwo kuruka,' yavuze. Incuti ze zimubwira 'Ntuzahangayike, uri ice mu koga!'",
      "Cookies ebyiri zari zivuga mu ruhu. Imwe yavuze 'Mukuru, birashyu hano!' Iya kabiri isubiza 'Holy smokes! Cookie ivuga!'",
    ],
    french: [
      "Il était une fois, un poulet qui décida de former un groupe. Mais chaque fois qu'ils essayaient de jouer, le batteur disait 'J'ai trop peur de battre!' Le groupe n'a jamais décollé, mais le poulet est devenu un célèbre comédien.",
      "Une tomate et une pomme de terre étaient les meilleures amies. Un jour, la tomate dit 'Je veux devenir un super-héros!' La pomme de terre répondit 'C'est génial! Ne te fais pas écraser!' La tomate devint 'Super Écrasé' et sauva le jardin des lapins affamés.",
      "Pourquoi l'épouvantail a-t-il gagné un prix? Parce qu'il était exceptionnel dans son domaine! Il racontait aussi les meilleures blagues, faisant rire les corbeaux si fort qu'ils oubliaient de voler le maïs.",
      "Un pingouin essaya de voler vers le sud pour l'hiver, mais tombait constamment dans l'eau. 'Je suppose que je ne suis pas fait pour ce métier de voler,' dit-il. Ses amis lui dirent 'Ne t'inquiète pas, tu es glace à la nage!'",
      "Deux biscuits cuisaient dans un four. L'un dit 'Mon Dieu, il fait chaud ici!' L'autre répondit 'Sainte fumée! Un biscuit qui parle!'",
    ],
  };

  const languageStories = sampleStories[language as keyof typeof sampleStories] || sampleStories.english;
  return languageStories[Math.floor(Math.random() * languageStories.length)];
}

// Get all story pairs (English, Kinyarwanda, French) together
function getAllStoryPairs(): { english: string; kinyarwanda: string; french: string }[] {
  return [
    {
      english: "Once upon a time, a chicken decided to start a band. But every time they tried to play, the drummer kept saying 'I'm too chicken to drum!' The band never took off, but the chicken became a famous comedian instead.",
      kinyarwanda: "Hari igihe, inkoko yahisemo gutangiza umurika. Ariko buri gihe bagiye gukina, umushyitsi w'imbyino yavugaga 'ndatinya gukina!' Umurika ntiwagize amahirwe, ariko inkoko yabaye umukinnyi wamamaye.",
      french: "Il était une fois, un poulet qui décida de former un groupe. Mais chaque fois qu'ils essayaient de jouer, le batteur disait 'J'ai trop peur de battre!' Le groupe n'a jamais décollé, mais le poulet est devenu un célèbre comédien.",
    },
    {
      english: "A tomato and a potato were best friends. One day, the tomato said, 'I want to become a superhero!' The potato replied, 'That's great! Just don't get squashed!' The tomato became 'Super Squash' and saved the garden from hungry rabbits.",
      kinyarwanda: "Inyanya n'ibirayi byari incuti magara. Umunsi umwe, inyanya yavuze 'ndashaka kuba umusirikare!' Ibirayi byasubije 'ni byiza! Gusa ntuzasatwe!' Inyanya yabaye 'Super Squash' ikiza ubutaka ku nsina zifite inzura.",
      french: "Une tomate et une pomme de terre étaient les meilleures amies. Un jour, la tomate dit 'Je veux devenir un super-héros!' La pomme de terre répondit 'C'est génial! Ne te fais pas écraser!' La tomate devint 'Super Écrasé' et sauva le jardin des lapins affamés.",
    },
    {
      english: "Why did the scarecrow win an award? Because he was outstanding in his field! He also told the best jokes, making all the crows laugh so hard they forgot to steal corn.",
      kinyarwanda: "Kuki umupfumu w'imbuto yatsindiye igihembo? Kubera ko yari uwa mbere mu murima we! Yanavugaga amajambo meza, ashyira inyoni zose mu isezerano kugeza zibagirwa gukurira.",
      french: "Pourquoi l'épouvantail a-t-il gagné un prix? Parce qu'il était exceptionnel dans son domaine! Il racontait aussi les meilleures blagues, faisant rire les corbeaux si fort qu'ils oubliaient de voler le maïs.",
    },
    {
      english: "A penguin tried to fly south for winter, but kept falling into the water. 'I guess I'm just not cut out for this flying business,' he said. His friends told him, 'Don't worry, you're ice at swimming!'",
      kinyarwanda: "Pengwini yagerageje kuruka amajyepfo mu gihe cy'ubukonje, ariko yicaga mu mazi. 'Ndabona ntako nakoze muri ubu buryo bwo kuruka,' yavuze. Incuti ze zimubwira 'Ntuzahangayike, uri ice mu koga!'",
      french: "Un pingouin essaya de voler vers le sud pour l'hiver, mais tombait constamment dans l'eau. 'Je suppose que je ne suis pas fait pour ce métier de voler,' dit-il. Ses amis lui dirent 'Ne t'inquiète pas, tu es glace à la nage!'",
    },
    {
      english: "Two cookies were baking in an oven. One said, 'Boy, it's hot in here!' The other replied, 'Holy smokes! A talking cookie!'",
      kinyarwanda: "Cookies ebyiri zari zivuga mu ruhu. Imwe yavuze 'Mukuru, birashyu hano!' Iya kabiri isubiza 'Holy smokes! Cookie ivuga!'",
      french: "Deux biscuits cuisaient dans un four. L'un dit 'Mon Dieu, il fait chaud ici!' L'autre répondit 'Sainte fumée! Un biscuit qui parle!'",
    },
  ];
}

// Helper function to translate story (placeholder - replace with translation API)
async function translateStory(story: string, targetLanguage: string): Promise<string> {
  // Note: This function is deprecated - stories are now generated in all languages directly
  // Kept for backwards compatibility
  return story;
}

// Get all AI stories (admin function)
export const getAllStories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('aiStories').order('desc').collect();
  },
});

// Get scheduling status
export const getSchedulingStatus = query({
  args: {},
  handler: async (ctx) => {
    // Check if there are any scheduled jobs
    // Note: Convex doesn't provide direct access to scheduled jobs,
    // but we can infer from the last story generation time
    const latestStory = await ctx.db
      .query('aiStories')
      .filter((q) => q.eq(q.field('isActive'), true))
      .first();

    if (!latestStory) {
      return { isScheduled: false, nextGeneration: null };
    }

    const lastGeneration = new Date(latestStory.generatedAt);
    const nextGeneration = new Date(lastGeneration.getTime() + 24 * 60 * 60 * 1000);

    return {
      isScheduled: true,
      lastGeneration: lastGeneration.toISOString(),
      nextGeneration: nextGeneration.toISOString(),
    };
  },
});

// Seed initial AI story (for development)
export const seedInitialStory = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if any stories exist
    const existingStory = await ctx.db.query('aiStories').first();
    if (existingStory) {
      return existingStory._id; // Already seeded
    }

    // Create initial story with matched translations
    const initialStory = STORY_PAIRS[0]; // Use first story

    const storyId = await ctx.db.insert('aiStories', {
      englishText: initialStory.english,
      kinyarwandaText: initialStory.kinyarwanda,
      frenchText: initialStory.french,
      generatedAt: new Date().toISOString(),
      isActive: true,
    });

    // Schedule the next generation in 24 hours
    await ctx.scheduler.runAfter(24 * 60 * 60 * 1000, api.aiStories.generateNewStory, {});

    return storyId;
  },
});

// Clear all stories and generate fresh multilingual story
export const clearAndRegenerateMutilingual = mutation({
  args: {},
  handler: async (ctx) => {
    console.log('Starting clear and regenerate...');
    
    // Delete all old stories
    const allStories = await ctx.db.query('aiStories').collect();
    console.log('Found', allStories.length, 'stories to delete');
    
    for (const story of allStories) {
      await ctx.db.delete(story._id);
    }
    
    console.log('All stories deleted');
    
    // Pick random story pair from constant
    const randomStory = STORY_PAIRS[Math.floor(Math.random() * STORY_PAIRS.length)];
    
    console.log('Selected story pair:', randomStory.english.substring(0, 40));
    
    // Create new story with all three language fields
    const newStoryId = await ctx.db.insert('aiStories', {
      englishText: randomStory.english,
      kinyarwandaText: randomStory.kinyarwanda,
      frenchText: randomStory.french,
      generatedAt: new Date().toISOString(),
      isActive: true,
    });
    
    console.log('New story created:', newStoryId);
    return newStoryId;
  },
});
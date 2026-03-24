import { query, mutation } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

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

    // Generate new story content
    // Note: In a real implementation, you would call an AI API here
    // For now, using placeholder content
    const englishStory = await generateFunnyStory('english');
    const kinyarwandaStory = await translateStory(englishStory, 'kinyarwanda');
    const frenchStory = await translateStory(englishStory, 'french');

    const newStoryId = await ctx.db.insert('aiStories', {
      englishText: englishStory,
      kinyarwandaText: kinyarwandaStory,
      frenchText: frenchStory,
      generatedAt: new Date().toISOString(),
      isActive: true,
    });

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

// Helper function to translate story (placeholder - replace with translation API)
async function translateStory(story: string, targetLanguage: string): Promise<string> {
  // TODO: Replace with actual translation API integration
  // Example with Google Translate API:
  // const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     q: story,
  //     target: targetLanguage === 'kinyarwanda' ? 'rw' : targetLanguage === 'french' ? 'fr' : 'en',
  //     source: 'en',
  //   }),
  // });
  // const data = await response.json();
  // return data.data.translations[0].translatedText;

  // For now, return the original story (in a real implementation, this would translate)
  // In the sample stories above, we already have translations, so this is just a placeholder
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

    // Create initial story
    const englishStory = "Once upon a time, a chicken decided to start a band. But every time they tried to play, the drummer kept saying 'I'm too chicken to drum!' The band never took off, but the chicken became a famous comedian instead.";
    const kinyarwandaStory = "Hari igihe, inkoko yahisemo gutangiza umurika. Ariko buri gihe bagiye gukina, umushyitsi w'imbyino yavugaga 'ndatinya gukina!' Umurika ntiwagize amahirwe, ariko inkoko yabaye umukinnyi wamamaye.";
    const frenchStory = "Il était une fois, un poulet qui décida de former un groupe. Mais chaque fois qu'ils essayaient de jouer, le batteur disait 'J'ai trop peur de battre!' Le groupe n'a jamais décollé, mais le poulet est devenu un célèbre comédien.";

    const storyId = await ctx.db.insert('aiStories', {
      englishText: englishStory,
      kinyarwandaText: kinyarwandaStory,
      frenchText: frenchStory,
      generatedAt: new Date().toISOString(),
      isActive: true,
    });

    // Schedule the next generation in 24 hours
    await ctx.scheduler.runAfter(24 * 60 * 60 * 1000, api.aiStories.generateNewStory, {});

    return storyId;
  },
});
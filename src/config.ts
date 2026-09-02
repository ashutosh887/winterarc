import type { Challenge, Quote, ResourceGroup, Template } from './lib/types'

export const site = {
  name: 'WinterArc',
  domain: 'https://trywinterarc.vercel.app',
  tagline: 'Lock in while they coast.',
  hero: 'Disappear for 90 days. Come back unrecognizable.',
  author: { name: 'Ashutosh Jha', url: 'https://ashutosh887.in', github: 'https://github.com/ashutosh887/winterarc', handle: 'ashutosh887_' },
  support: { github: 'https://github.com/ashutosh887/winterarc' },
}

export const resources: Record<string, ResourceGroup> = {
  workout: {
    title: 'Workout',
    items: [
      { name: 'workout.lol', url: 'https://workout.lol/', desc: 'Build a routine from the muscles you pick' },
      { name: 'DAREBEE', url: 'https://darebee.com/', desc: 'No equipment workouts, no ads' },
      { name: 'Hevy', url: 'https://hevy.com/', desc: 'Log lifts and track volume' },
      { name: 'NerdFitness', url: 'https://www.nerdfitness.com/blog/beginner-body-weight-workout-burn-fat-build-muscle/', desc: '20 minute beginner bodyweight routine' },
    ],
  },
  nutrition: {
    title: 'Nutrition',
    items: [
      { name: 'Cronometer', url: 'https://cronometer.com/', desc: 'Calories and micronutrients' },
      { name: 'MyFitnessPal', url: 'https://www.myfitnesspal.com/', desc: 'Protein and calorie logging' },
      { name: 'EatingWell meal plans', url: 'https://www.eatingwell.com/category/4288/meal-plans/', desc: 'Weekly meal plans, no account' },
    ],
  },
  focus: {
    title: 'Focus and work',
    items: [
      { name: 'Pomofocus', url: 'https://pomofocus.io/', desc: 'Pomodoro timer in the browser' },
      { name: 'Flow', url: 'https://flow.app/', desc: 'Minimal focus timer for Mac and iOS' },
      { name: 'Notion', url: 'https://www.notion.so/', desc: 'Somewhere to keep the plan' },
    ],
  },
  mind: {
    title: 'Mind',
    items: [
      { name: 'Insight Timer', url: 'https://insighttimer.com/', desc: 'Large library of guided meditations' },
      { name: 'UCLA Mindful', url: 'https://www.uclahealth.org/uclamindful/free-guided-meditations', desc: 'Guided meditations from UCLA Health' },
      { name: 'Greater Good gratitude', url: 'https://ggia.berkeley.edu/practice/gratitude_journal', desc: 'Berkeley gratitude journal practice' },
    ],
  },
  sleep: {
    title: 'Sleep',
    items: [
      { name: 'Sleep Foundation', url: 'https://www.sleepfoundation.org/how-sleep-works', desc: 'How sleep actually works' },
      { name: 'Huberman sleep toolkit', url: 'https://www.hubermanlab.com/newsletter/toolkit-for-sleep', desc: 'Protocol for falling and staying asleep' },
    ],
  },
}

export const templates: Template[] = [
  { id: 'body', name: 'Body arc', icon: 'dumbbell', habitIds: ['gym', 'steps', 'sleep', 'nutrition', 'water'], desc: 'Train. Move. Sleep. Eat clean.' },
  { id: 'mind', name: 'Mind arc', icon: 'wind', habitIds: ['meditation', 'journaling', 'reading', 'sleep', 'phone-pm'], desc: 'Calm mornings. Reading. Journaling. Phone curfew.' },
  { id: 'grind', name: 'Grind arc', icon: 'target', habitIds: ['work', 'sleep', 'gym', 'reading', 'phone-am'], desc: 'Deep work 90 min. Train. Read. No phone in the morning.' },
  { id: 'no-sugar', name: 'No sugar arc', icon: 'salad', habitIds: ['nutrition', 'protein', 'water', 'sleep', 'gym'], desc: 'No sugar or junk. Hit protein. Drink water. Sleep.' },
  { id: 'minimal', name: 'Minimal', icon: 'snowflake', habitIds: ['gym', 'sleep', 'work'], desc: 'Just three. Good place to start. Add more later.' },
]

export const challenges: Challenge[] = [
  { id: 'first', label: 'First check', icon: 'check', desc: 'Log one habit', metric: 'checks', target: 1 },
  { id: 'perfect1', label: 'Perfect day', icon: 'star', desc: 'Every habit in one day', metric: 'perfect', target: 1 },
  { id: 'streak3', label: '3 day streak', icon: 'flame', desc: 'Three perfect days in a row', metric: 'streak', target: 3 },
  { id: 'streak7', label: '7 day streak', icon: 'mountainSnow', desc: 'Seven perfect days in a row', metric: 'streak', target: 7 },
  { id: 'perfect10', label: '10 perfect', icon: 'gem', desc: 'Ten perfect days total', metric: 'perfect', target: 10 },
  { id: 'streak14', label: '14 day lock', icon: 'snowflake', desc: 'Fourteen perfect days in a row', metric: 'streak', target: 14 },
  { id: 'half', label: 'Halfway', icon: 'hourglass', desc: 'Half of all checks done', metric: 'pct', target: 50 },
  { id: 'streak30', label: '30 day forge', icon: 'gem', desc: 'Thirty perfect days in a row', metric: 'streak', target: 30 },
  { id: 'perfect30', label: '30 perfect', icon: 'crown', desc: 'Thirty perfect days total', metric: 'perfect', target: 30 },
  { id: 'complete75', label: 'Three quarters', icon: 'rocket', desc: 'Three quarters of all checks', metric: 'pct', target: 75 },
  { id: 'graduate', label: 'Graduation', icon: 'graduationcap', desc: 'Every single day perfect', metric: 'perfect', target: 0 },
]

export const quotes: Quote[] = [
  { text: "Never suffer an exception to occur till the new habit is securely rooted in your life.", author: "William James", source: "The Principles of Psychology, 1890" },
  { text: "Nothing we ever do is, in strict scientific literalness, wiped out.", author: "William James", source: "The Principles of Psychology, 1890" },
  { text: "We are spinning our own fates, good or evil, and never to be undone.", author: "William James", source: "The Principles of Psychology, 1890" },
  { text: "Every smallest stroke of virtue or of vice leaves its never so little scar.", author: "William James", source: "The Principles of Psychology, 1890" },
  { text: "A small daily task, if it be really daily, will beat the labours of a spasmodic Hercules.", author: "Anthony Trollope", source: "An Autobiography, 1883" },
  { text: "Men become builders by building and lyre-players by playing the lyre.", author: "Aristotle", source: "Nicomachean Ethics II, trans. Ross" },
  { text: "No longer talk at all about the kind of man that a good man ought to be, but be such.", author: "Marcus Aurelius", source: "Meditations X.16, trans. Long" },
  { text: "No great thing is created suddenly, any more than a bunch of grapes or a fig.", author: "Epictetus", source: "Discourses I.15" },

  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant", source: "The Story of Philosophy, 1926" },
  { text: "How we spend our days is, of course, how we spend our lives.", author: "Annie Dillard", source: "The Writing Life, 1989" },
  { text: "Inspiration is for amateurs. The rest of us just show up and get to work.", author: "Chuck Close", source: "Esquire, 2001" },
  { text: "Habit will sustain you whether you're inspired or not.", author: "Octavia E. Butler", source: "Furor Scribendi, 1995" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", source: "Atomic Habits, 2018" },
  { text: "The repetition itself becomes the important thing; it's a form of mesmerism.", author: "Haruki Murakami", source: "What I Talk About When I Talk About Running, 2007" },
  { text: "Don't quit. Suffer now and live the rest of your life as a champion.", author: "Muhammad Ali" },
]
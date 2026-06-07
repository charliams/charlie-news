// Sample feed data for Charlie News.
// Topics grouped; sources mix NZ (RNZ, NZ Herald, Newsroom) + global (Guardian, BBC).
window.SOURCES = {
  rnz:      { name: 'RNZ',        domain: 'rnz.co.nz',          tone: '#0a7d8c' },
  herald:   { name: 'NZ Herald',  domain: 'nzherald.co.nz',     tone: '#1f4b99' },
  newsroom: { name: 'Newsroom',   domain: 'newsroom.co.nz',     tone: '#c2362f' },
  guardian: { name: 'The Guardian', domain: 'theguardian.com',  tone: '#0a3d62' },
  bbc:      { name: 'BBC',        domain: 'bbc.com',            tone: '#1a1a1a' },
};

// Sources grouped for the manager sheet.
window.SOURCE_GROUPS = [
  { label: 'New Zealand', ids: ['rnz', 'herald', 'newsroom'] },
  { label: 'Global',      ids: ['guardian', 'bbc'] },
];

window.TOPICS = [
  { id: 'tech',     label: 'Tech' },
  { id: 'nz',       label: 'New Zealand' },
  { id: 'world',    label: 'World' },
  { id: 'politics', label: 'Politics' },
  { id: 'climate',  label: 'Climate' },
  { id: 'business', label: 'Business' },
  { id: 'sport',    label: 'Sport' },
];

window.ARTICLES = [
  // ── TECH ──
  {
    id: 'a1', topic: 'tech', source: 'guardian', mins: 18, read: 4,
    headline: 'On-device AI assistants race to cut the cloud out of the loop',
    summary: 'A wave of startups is shipping assistants that run entirely on your phone, promising lower latency and no data leaving the handset. Backers argue privacy could become the category\u2019s real selling point. Sceptics counter that small models still lag the cloud on hard tasks.',
  },
  {
    id: 'a2', topic: 'tech', source: 'bbc', mins: 41, read: 5,
    headline: 'Europe\u2019s AI rulebook faces its first real enforcement test',
    summary: 'Regulators have opened an inquiry into how a major platform labels AI-generated content, the first significant probe under the bloc\u2019s new rules. The outcome could set the tone for how aggressively the law is applied. Companies are watching closely before committing to compliance budgets.',
  },
  {
    id: 'a3', topic: 'tech', source: 'newsroom', mins: 70, read: 6,
    headline: 'How NZ\u2019s software exports quietly became a billion-dollar story',
    summary: 'Weightless exports now rival some primary industries, built on a handful of firms selling globally from Auckland and Wellington. The sector has grown without the fanfare given to dairy or tourism. Founders say talent, not capital, is now the binding constraint.',
  },

  // ── NEW ZEALAND ──
  {
    id: 'a4', topic: 'nz', source: 'rnz', mins: 32, read: 3,
    headline: 'Government reshuffles public transport funding toward the regions',
    summary: 'Ministers unveiled a funding shift that directs more money to regional bus networks while trimming some urban rail subsidies. Councils outside the main centres welcomed the change. Public transport advocates warned it could slow city decarbonisation.',
  },
  {
    id: 'a5', topic: 'nz', source: 'herald', mins: 55, read: 3,
    headline: 'Auckland building consents tick up after a two-year slump',
    summary: 'New data shows consents for homes rose for a third straight month, an early sign the construction downturn may be bottoming out. Economists cautioned the recovery is fragile and rate-dependent. Builders reported cautious optimism heading into spring.',
  },
  {
    id: 'a6', topic: 'nz', source: 'newsroom', mins: 96, read: 7,
    headline: 'Inside the quiet overhaul reshaping the public health system',
    summary: 'A long-form look at how restructuring is changing the day-to-day for clinicians and patients far from the headlines. Staff describe both relief and uncertainty. The reforms\u2019 success may hinge on whether promised back-office savings ever materialise.',
  },

  // ── WORLD ──
  {
    id: 'a7', topic: 'world', source: 'bbc', mins: 12, read: 4,
    headline: 'Ceasefire talks resume amid cautious, fragile optimism',
    summary: 'Negotiators returned to the table after a week-long pause, with mediators describing the mood as constructive but brittle. Key sticking points around monitoring remain unresolved. Both sides face domestic pressure to show progress.',
  },
  {
    id: 'a8', topic: 'world', source: 'guardian', mins: 47, read: 5,
    headline: 'Record early-summer heat grips southern Europe',
    summary: 'Temperatures have surged well above seasonal norms across the Mediterranean, straining power grids and prompting health warnings. Authorities opened cooling centres in several cities. Forecasters expect the ridge of high pressure to persist into next week.',
  },

  // ── POLITICS ──
  {
    id: 'a9', topic: 'politics', source: 'rnz', mins: 28, read: 4,
    headline: 'Coalition tensions surface over the shape of the next budget',
    summary: 'Partners are publicly at odds over how to balance tax relief against spending on infrastructure. The disagreement spilled into the open during a press conference. Analysts say the rift is more about timing than fundamental direction.',
  },
  {
    id: 'a10', topic: 'politics', source: 'guardian', mins: 63, read: 5,
    headline: 'Why centrist parties keep losing the messaging war online',
    summary: 'An analysis of how moderate platforms struggle to compete with sharper, more emotive content from the fringes. Strategists point to structural incentives in how feeds reward outrage. Some parties are now rethinking how they show up on social platforms.',
  },

  // ── CLIMATE ──
  {
    id: 'a11', topic: 'climate', source: 'guardian', mins: 80, read: 6,
    headline: 'Antarctic sea ice slides to another worrying winter low',
    summary: 'Satellite data shows ice extent tracking far below the long-term average for this time of year. Scientists are still debating how much is natural variability versus a longer-term shift. The trend has implications for global ocean circulation.',
  },
  {
    id: 'a12', topic: 'climate', source: 'rnz', mins: 110, read: 5,
    headline: 'NZ farmers trial regenerative methods at meaningful scale',
    summary: 'A growing cohort of farms is testing practices aimed at soil health and lower emissions, with early results that look promising but unproven. Researchers urge patience before drawing conclusions. Banks are beginning to factor the practices into lending.',
  },

  // ── BUSINESS ──
  {
    id: 'a13', topic: 'business', source: 'herald', mins: 22, read: 3,
    headline: 'Reserve Bank holds the line as inflation slowly cools',
    summary: 'The central bank left the official cash rate unchanged, signalling it wants more evidence before easing. Markets had largely priced in the hold. Mortgage holders hoping for relief will likely wait until later in the year.',
  },
  {
    id: 'a14', topic: 'business', source: 'bbc', mins: 38, read: 4,
    headline: 'Global markets steady after a bruising, volatile week',
    summary: 'Equities clawed back losses as fresh data eased fears of a sharper slowdown. Investors remain jittery about the path of interest rates. Analysts warned that thin summer trading could amplify any surprises.',
  },

  // ── SPORT ──
  {
    id: 'a15', topic: 'sport', source: 'herald', mins: 15, read: 3,
    headline: 'Selectors name a youthful squad for the winter tour',
    summary: 'Several uncapped players earned call-ups as selectors signalled a shift toward the next generation. Veterans were rested rather than dropped, the coach stressed. The tour shapes as an audition ahead of a packed home season.',
  },
  {
    id: 'a16', topic: 'sport', source: 'bbc', mins: 52, read: 4,
    headline: 'The quiet science behind the season\u2019s breakout athletes',
    summary: 'A look at how marginal gains in recovery and data are reshaping who reaches the top. Sports scientists describe a shift from instinct to measurement. Not everyone in the locker room is convinced the numbers tell the whole story.',
  },
];

// Stories Charlie filtered out of your feed (headline-only).
// Rate one up to tell the model it got the filter wrong.
window.FILTERED = [
  { id: 'f1', source: 'herald',   topic: 'entertainment', kind: 'Entertainment', mins: 95,  headline: 'Reality TV star opens up about life after the cameras stopped' },
  { id: 'f2', source: 'bbc',      topic: 'lifestyle',     kind: 'Lifestyle',     mins: 130, headline: 'Five ways to make the most of winter root vegetables' },
  { id: 'f3', source: 'guardian', topic: 'opinion',       kind: 'Opinion',       mins: 60,  headline: 'Opinion: your morning routine is probably working against you' },
  { id: 'f4', source: 'rnz',      topic: 'crime',         kind: 'Local crime',   mins: 75,  headline: 'Police appeal for information after a spate of weekend break-ins' },
  { id: 'f5', source: 'newsroom', topic: 'tech',          kind: 'Gadget review', mins: 145, headline: 'Review: the mid-range phone that quietly punches above its price' },
  { id: 'f6', source: 'bbc',      topic: 'world',         kind: 'Royals',        mins: 200, headline: 'Royal tour wraps up with a rain-soaked walkabout' },
  { id: 'f7', source: 'herald',   topic: 'business',      kind: 'Lottery',       mins: 40,  headline: 'Lotto jackpot must be won this weekend after another rollover' },
];

// Combined lookup so ratings on filtered items also count toward tuning.
window.FILTERED.forEach((f) => { f.filtered = true; });
window.ALL_ARTICLES = window.ARTICLES.concat(window.FILTERED);

// Generic story templates instantiated when a user adds a new source,
// so a freshly-added source immediately contributes a couple of headlines.
window.SOURCE_TEMPLATES = [
  { topic: 'tech',     mins: 25, read: 4, headline: 'The week in technology: what actually mattered',
    summary: 'A rundown of the launches, deals and debates worth your attention, with the noise stripped out. The shortlist favours shifts that will still matter in a month. Everything else is left on the cutting-room floor.' },
  { topic: 'world',    mins: 50, read: 5, headline: 'Five stories shaping the world this morning',
    summary: 'A brisk tour of the developments moving markets, governments and borders today. Each is summarised to the essentials with a link to go deeper. Context is favoured over breaking-news adrenaline.' },
  { topic: 'business', mins: 33, read: 3, headline: 'Markets digest mixed signals as the week opens',
    summary: 'Investors weighed fresh data against lingering uncertainty, leaving the major indices little changed. Analysts remain split on the path ahead. Attention now turns to the week\u2019s scheduled releases.' },
  { topic: 'climate',  mins: 88, read: 6, headline: 'The climate numbers behind this week\u2019s headlines',
    summary: 'A look at the data points driving the latest round of coverage, and what they do and don\u2019t tell us. Researchers urge care in reading short-term swings. The longer trend, they note, is the story that matters.' },
  { topic: 'nz',       mins: 44, read: 3, headline: 'What\u2019s making news around the motu today',
    summary: 'A quick scan of the local stories people are talking about, from the regions to the main centres. The selection leans toward what affects everyday life. Lighter items round out the bottom of the list.' },
  { topic: 'politics', mins: 19, read: 4, headline: 'The political week ahead, in brief',
    summary: 'What to watch in the chamber and on the campaign trail over the coming days. Key votes and announcements are flagged in advance. Expect the usual gap between rhetoric and outcome.' },
];


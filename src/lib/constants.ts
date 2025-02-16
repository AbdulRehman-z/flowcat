import { Briefcase, CoinsIcon, CreditCard, Filter, Library } from 'lucide-react'


export const navItems = [
  { title: "Jobs", icon: Briefcase, url: "/jobs" },
  { title: "Filters", icon: Filter, url: "/filters" },
  {
    title: "Prompt library", icon: Library, url: "/prompts",
  },
  { title: "Credits", icon: CoinsIcon, url: "/credits" },
  { title: "Pricing", icon: CreditCard, url: "/pricing" },
]

// Available AI models
export const AI_MODELS = [
  { id: "gpt-4", name: "ChatGPT-4", provider: "OpenAI" },
  { id: "gpt-3.5", name: "ChatGPT-3.5", provider: "OpenAI" },
  { id: "claude-3", name: "Claude 3", provider: "Anthropic" },
  { id: "deepseek-v3", name: "Deepseek v3", provider: "Deepseek" },
  { id: "gemini-1.5-flash", name: "gemini-1.5-flash", provider: "Google" },
]

export const PROMPT_TASTES = ["Formal", "Creative", "Casual", "Professional", "Technical"]
const jobProposalPrompts = [
  {
    prompt: "Craft a compelling job proposal that emphasizes my expertise in [Specific Skill/Technology] and its relevance to the client's need to [Client's Specific Need/Problem].  Highlight how my approach differs from competitors and delivers superior results.",
    metadata: {
      communityLikes: 150,
      usageCount: 2500,
    },
  },
  {
    prompt: "Develop a concise job proposal for a [Job Title] position that showcases my ability to [Specific Achievable Goal] within the first [Timeframe] of employment. Quantify my successes with specific metrics wherever possible.",
    metadata: {
      communityLikes: 120,
      usageCount: 1800,
    },
  },
  {
    prompt: "Write a job proposal tailored to a client who values [Specific Client Value, e.g., innovation, efficiency, cost-effectiveness].  The proposal should clearly articulate how my skills and experience directly address their priorities.",
    metadata: {
      communityLikes: 180,
      usageCount: 2200,
    },
  },
  {
    prompt: "Generate a job proposal that uses a storytelling approach to illustrate my passion for [Industry/Field] and how my career trajectory has prepared me for this specific opportunity.  Include a personal anecdote that highlights a relevant skill.",
    metadata: {
      communityLikes: 100,
      usageCount: 1500,
    },
  },
  {
    prompt: "Develop a job proposal that emphasizes my proactive problem-solving skills.  Describe a challenging project I overcame and the innovative solutions I implemented.  Quantify the positive impact of these solutions.",
    metadata: {
      communityLikes: 160,
      usageCount: 2000,
    },
  },
  {
    prompt: "Write a job proposal that focuses on my collaborative work style.  Detail a team project where I played a key role, highlighting my contributions and how I fostered a positive team environment.",
    metadata: {
      communityLikes: 110,
      usageCount: 1600,
    },
  },
  {
    prompt: "Create a job proposal that highlights my adaptability and ability to learn quickly.  Describe a situation where I had to quickly master a new skill or technology to meet a deadline or solve a problem.",
    metadata: {
      communityLikes: 90,
      usageCount: 1200,
    },
  },
  {
    prompt: "Generate a job proposal that leverages data and analytics to demonstrate my effectiveness.  Use relevant statistics and metrics to showcase my past achievements and project future success.",
    metadata: {
      communityLikes: 170,
      usageCount: 2100,
    },
  },
  {
    prompt: "Compose a job proposal that emphasizes my leadership skills and experience managing teams or projects.  Describe a successful project you led, outlining your strategies and the positive outcomes.",
    metadata: {
      communityLikes: 140,
      usageCount: 1900,
    },
  },
  {
    prompt: "Write a job proposal that incorporates a unique value proposition that sets me apart from other candidates.  This could be a specialized skill, a unique approach, or a combination of factors that contribute to exceptional results.",
    metadata: {
      communityLikes: 190,
      usageCount: 2800,
    },
  },
];

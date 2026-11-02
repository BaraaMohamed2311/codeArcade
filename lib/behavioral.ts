// Behavioral interview prep: STAR template plus the 16 Amazon Leadership
// Principles, each with what it means in plain words and sample questions.
// Principle names come from Amazon's public leadership principles page; the
// descriptions and questions here are written for practice.

export interface Principle {
  id: string;
  name: string;
  meaning: string;
  questions: string[];
}

export const STAR_STEPS = [
  {
    letter: "S",
    name: "Situation",
    hint: "Set the scene in one or two sentences: where, when, and what was going on.",
    example: "Our team's nightly data job started failing twice a week, and nobody owned it.",
  },
  {
    letter: "T",
    name: "Task",
    hint: "What was YOUR responsibility or goal? Make clear what was yours, not the team's.",
    example: "It was not assigned to me, but I wanted the failures gone before the next release.",
  },
  {
    letter: "A",
    name: "Action",
    hint: "The longest part. What did YOU do, step by step? Use 'I', not 'we'.",
    example: "I read the logs, found the cause, wrote a fix, added an alert, and wrote it up for the team.",
  },
  {
    letter: "R",
    name: "Result",
    hint: "What happened, with a number if you can. Then one line on what you learned.",
    example: "Failures dropped from twice a week to zero over two months, and the alert caught a new issue early.",
  },
];

export const PRINCIPLES: Principle[] = [
  {
    id: "customer-obsession",
    name: "Customer Obsession",
    meaning: "Start from what the customer needs and work backwards. Keep earning their trust over time.",
    questions: [
      "Tell me about a time you went out of your way for a customer.",
      "Describe a time you had to choose between what the customer wanted and what was easy for you.",
    ],
  },
  {
    id: "ownership",
    name: "Ownership",
    meaning: "Act like it is your own business. Think long term, and do not say 'that is not my job'.",
    questions: [
      "Tell me about a time when you took responsibility for a problem even though it wasn't directly assigned to you. What was the outcome?",
      "Give an example of when you sacrificed short-term results for long-term value.",
    ],
  },
  {
    id: "invent-and-simplify",
    name: "Invent and Simplify",
    meaning: "Look for new and simpler ways to do things, and be comfortable that new ideas are not always understood at first.",
    questions: [
      "Tell me about a time you simplified a complicated process.",
      "Describe an innovative idea you came up with. How did you get others to accept it?",
    ],
  },
  {
    id: "are-right-a-lot",
    name: "Are Right, A Lot",
    meaning: "Use good judgment and data, look for views that disagree with yours, and change your mind when the evidence says so.",
    questions: [
      "Tell me about a time you made a decision with incomplete data.",
      "Describe a time you changed your mind after hearing a different view.",
    ],
  },
  {
    id: "learn-and-be-curious",
    name: "Learn and Be Curious",
    meaning: "Never stop learning. Look for new things to try and new skills to build.",
    questions: [
      "Tell me about something you taught yourself recently, and why.",
      "Describe a time you had to learn something quickly to finish a task.",
    ],
  },
  {
    id: "hire-and-develop-the-best",
    name: "Hire and Develop the Best",
    meaning: "Raise the bar with every hire, help people grow, and mentor others.",
    questions: [
      "Tell me about a time you helped a teammate grow.",
      "Describe how you gave difficult feedback to someone.",
    ],
  },
  {
    id: "insist-on-the-highest-standards",
    name: "Insist on the Highest Standards",
    meaning: "Keep your standards high even when others think they are too high, and fix problems for good rather than patching them.",
    questions: [
      "Tell me about a time you refused to ship something that was not good enough.",
      "Describe a time you raised the quality bar on your team.",
    ],
  },
  {
    id: "think-big",
    name: "Think Big",
    meaning: "Think beyond the current task and tell a bigger story that inspires results.",
    questions: [
      "Tell me about a time you proposed a much bigger solution than was asked for.",
      "Describe a goal you set that others thought was too ambitious.",
    ],
  },
  {
    id: "bias-for-action",
    name: "Bias for Action",
    meaning: "Speed matters. Many decisions can be reversed, so do not wait for perfect information.",
    questions: [
      "Tell me about a time you had to act quickly without all the information.",
      "Describe a time you took a calculated risk.",
    ],
  },
  {
    id: "frugality",
    name: "Frugality",
    meaning: "Do more with less. Limits push you to be resourceful and inventive.",
    questions: [
      "Tell me about a time you delivered with very limited resources.",
      "Describe how you cut cost or effort without hurting quality.",
    ],
  },
  {
    id: "earn-trust",
    name: "Earn Trust",
    meaning: "Listen carefully, speak frankly, admit mistakes, and judge yourself by a higher standard than others do.",
    questions: [
      "Tell me about a mistake you made at work and how you handled it.",
      "Describe a time you had to rebuild trust with a coworker.",
    ],
  },
  {
    id: "dive-deep",
    name: "Dive Deep",
    meaning: "Stay close to the details, check the data, and question numbers that do not look right.",
    questions: [
      "Tell me about a time you dug into the details to find a root cause.",
      "Describe a time the metrics did not match what you were seeing. What did you do?",
    ],
  },
  {
    id: "have-backbone-disagree-and-commit",
    name: "Have Backbone; Disagree and Commit",
    meaning: "Respectfully challenge decisions you disagree with, even when it is uncomfortable. Once a decision is made, fully commit to it.",
    questions: [
      "Tell me about a time you disagreed with your manager or team.",
      "Describe a time you committed to a decision you did not agree with.",
    ],
  },
  {
    id: "deliver-results",
    name: "Deliver Results",
    meaning: "Focus on the key inputs, deliver on time with good quality, and rise to the occasion when things go wrong.",
    questions: [
      "Tell me about your most important deadline and how you met it.",
      "Describe a time you hit a major obstacle and still delivered.",
    ],
  },
  {
    id: "strive-to-be-earths-best-employer",
    name: "Strive to be Earth's Best Employer",
    meaning: "Make the workplace safe, diverse, productive and supportive, and lead with empathy.",
    questions: [
      "Tell me about a time you made a teammate feel included or supported.",
      "Describe how you handled a conflict between two people on your team.",
    ],
  },
  {
    id: "success-and-scale-bring-broad-responsibility",
    name: "Success and Scale Bring Broad Responsibility",
    meaning: "Think about the wider effect of your work on people, communities and the world, and aim to leave things better.",
    questions: [
      "Tell me about a time you considered the wider effects of a decision you made.",
      "Describe a time you spotted a risk to users or the public and spoke up.",
    ],
  },
];

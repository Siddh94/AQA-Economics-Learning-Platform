import { AppDataSource } from './database';
import { Question } from '../models/Question';

const sampleQuestions = [
  // Market Failure - Difficulty 1
  {
    text: "Which of the following is an example of market failure?",
    options: ["Perfect competition", "Monopoly power", "Efficient resource allocation", "Consumer surplus maximization"],
    correctAnswer: 1,
    topic: "Market Failure",
    difficultyLevel: 1,
    explanation: "Monopoly power is a form of market failure because it leads to inefficient resource allocation and deadweight loss."
  },
  {
    text: "Public goods are characterized by:",
    options: ["Rivalry and excludability", "Non-rivalry and excludability", "Rivalry and non-excludability", "Non-rivalry and non-excludability"],
    correctAnswer: 3,
    topic: "Market Failure",
    difficultyLevel: 1,
    explanation: "Public goods are non-rivalrous (one person's consumption doesn't reduce availability for others) and non-excludable (difficult to prevent people from consuming them)."
  },
  
  // Market Failure - Difficulty 2
  {
    text: "Negative externalities occur when:",
    options: ["Private costs exceed social costs", "Social costs exceed private costs", "Private benefits exceed social benefits", "Social benefits equal private benefits"],
    correctAnswer: 1,
    topic: "Market Failure",
    difficultyLevel: 2,
    explanation: "Negative externalities arise when the social cost of production exceeds the private cost, leading to overproduction from society's perspective."
  },
  {
    text: "The free rider problem is most associated with:",
    options: ["Private goods", "Merit goods", "Public goods", "Demerit goods"],
    correctAnswer: 2,
    topic: "Market Failure",
    difficultyLevel: 2,
    explanation: "The free rider problem occurs with public goods because people can benefit without paying, due to their non-excludable nature."
  },

  // Market Failure - Difficulty 3
  {
    text: "Which policy tool would be most effective in correcting a negative consumption externality?",
    options: ["Production subsidy", "Consumption tax", "Price ceiling", "Quantity control"],
    correctAnswer: 1,
    topic: "Market Failure",
    difficultyLevel: 3,
    explanation: "A consumption tax (Pigouvian tax) internalizes the external cost, reducing consumption to the socially optimal level."
  },

  // Fiscal Policy - Difficulty 1
  {
    text: "Fiscal policy involves the use of:",
    options: ["Interest rates and money supply", "Government spending and taxation", "Exchange rates and tariffs", "Bank reserves and lending"],
    correctAnswer: 1,
    topic: "Fiscal Policy",
    difficultyLevel: 1,
    explanation: "Fiscal policy refers to government use of spending and taxation to influence the economy."
  },
  {
    text: "An increase in government spending will:",
    options: ["Decrease aggregate demand", "Increase aggregate demand", "Have no effect on aggregate demand", "Only affect aggregate supply"],
    correctAnswer: 1,
    topic: "Fiscal Policy",
    difficultyLevel: 1,
    explanation: "Government spending is a component of aggregate demand, so increasing it will shift AD to the right."
  },

  // Fiscal Policy - Difficulty 2
  {
    text: "The multiplier effect suggests that:",
    options: ["Initial spending increases have smaller final impacts", "Initial spending increases have larger final impacts", "Spending has no cumulative effect", "Only government spending has multiplier effects"],
    correctAnswer: 1,
    topic: "Fiscal Policy",
    difficultyLevel: 2,
    explanation: "The multiplier effect means that an initial injection of spending leads to larger overall increases in national income through successive rounds of spending."
  },
  {
    text: "Automatic stabilizers include:",
    options: ["Discretionary spending increases", "Unemployment benefits and progressive taxation", "Monetary policy changes", "Exchange rate adjustments"],
    correctAnswer: 1,
    topic: "Fiscal Policy",
    difficultyLevel: 2,
    explanation: "Automatic stabilizers are fiscal mechanisms that automatically adjust to economic conditions without new government action."
  },

  // Fiscal Policy - Difficulty 3
  {
    text: "The crowding out effect occurs when:",
    options: ["Private investment decreases due to higher interest rates from government borrowing", "Government spending directly replaces private spending", "Higher taxes reduce consumption", "Inflation reduces real income"],
    correctAnswer: 0,
    topic: "Fiscal Policy",
    difficultyLevel: 3,
    explanation: "Crowding out happens when government borrowing drives up interest rates, making private investment more expensive and reducing it."
  },

  // Monetary Policy - Difficulty 1
  {
    text: "Monetary policy is primarily concerned with:",
    options: ["Government spending", "Tax rates", "Interest rates and money supply", "Trade policy"],
    correctAnswer: 2,
    topic: "Monetary Policy",
    difficultyLevel: 1,
    explanation: "Monetary policy involves managing interest rates and money supply to achieve economic objectives."
  },
  {
    text: "When the central bank lowers interest rates, it aims to:",
    options: ["Reduce inflation", "Stimulate economic growth", "Increase unemployment", "Reduce government debt"],
    correctAnswer: 1,
    topic: "Monetary Policy",
    difficultyLevel: 1,
    explanation: "Lower interest rates make borrowing cheaper, encouraging investment and consumption, stimulating economic growth."
  },

  // Monetary Policy - Difficulty 2
  {
    text: "Quantitative easing involves:",
    options: ["Raising interest rates", "Buying government bonds to increase money supply", "Reducing government spending", "Increasing reserve requirements"],
    correctAnswer: 1,
    topic: "Monetary Policy",
    difficultyLevel: 2,
    explanation: "Quantitative easing is when central banks purchase government securities to inject money directly into the economy."
  },
  {
    text: "The transmission mechanism of monetary policy works through:",
    options: ["Direct government spending", "Interest rate effects on investment and consumption", "Automatic tax adjustments", "Trade balance changes"],
    correctAnswer: 1,
    topic: "Monetary Policy",
    difficultyLevel: 2,
    explanation: "Monetary policy affects the economy through interest rate changes that influence borrowing, investment, and consumption decisions."
  },

  // Monetary Policy - Difficulty 3
  {
    text: "The liquidity trap occurs when:",
    options: ["Interest rates are so low that monetary policy becomes ineffective", "Banks have too much liquidity", "Government borrowing is excessive", "Inflation expectations are anchored"],
    correctAnswer: 0,
    topic: "Monetary Policy",
    difficultyLevel: 3,
    explanation: "A liquidity trap occurs when interest rates are near zero and further monetary expansion has little effect on economic activity."
  },

  // Supply and Demand - Difficulty 1
  {
    text: "If demand increases while supply remains constant, what happens to price?",
    options: ["Price decreases", "Price increases", "Price remains the same", "Price becomes undefined"],
    correctAnswer: 1,
    topic: "Supply and Demand",
    difficultyLevel: 1,
    explanation: "When demand increases and supply stays constant, there's upward pressure on price due to excess demand."
  },
  {
    text: "The law of demand states that:",
    options: ["As price increases, quantity demanded increases", "As price increases, quantity demanded decreases", "Price and quantity are unrelated", "Demand is always elastic"],
    correctAnswer: 1,
    topic: "Supply and Demand",
    difficultyLevel: 1,
    explanation: "The law of demand describes the inverse relationship between price and quantity demanded, ceteris paribus."
  },

  // Supply and Demand - Difficulty 2
  {
    text: "Price elasticity of demand measures:",
    options: ["The slope of the demand curve", "The responsiveness of quantity demanded to price changes", "The total revenue effect", "The income effect only"],
    correctAnswer: 1,
    topic: "Supply and Demand",
    difficultyLevel: 2,
    explanation: "Price elasticity of demand measures how responsive quantity demanded is to changes in price."
  },
  {
    text: "If the price elasticity of demand is -0.5, demand is:",
    options: ["Elastic", "Inelastic", "Unit elastic", "Perfectly elastic"],
    correctAnswer: 1,
    topic: "Supply and Demand",
    difficultyLevel: 2,
    explanation: "When the absolute value of price elasticity is less than 1, demand is inelastic (relatively unresponsive to price changes)."
  },

  // Supply and Demand - Difficulty 3
  {
    text: "Cross-price elasticity of demand between complementary goods is:",
    options: ["Positive", "Negative", "Zero", "Infinite"],
    correctAnswer: 1,
    topic: "Supply and Demand",
    difficultyLevel: 3,
    explanation: "Complementary goods have negative cross-price elasticity because when the price of one increases, demand for both decreases."
  },

  // Economic Growth - Difficulty 1
  {
    text: "Economic growth is typically measured by:",
    options: ["Inflation rate", "Unemployment rate", "GDP growth rate", "Interest rate"],
    correctAnswer: 2,
    topic: "Economic Growth",
    difficultyLevel: 1,
    explanation: "Economic growth is commonly measured by the percentage increase in real GDP over time."
  },

  // Economic Growth - Difficulty 2
  {
    text: "The production possibility frontier shifts outward when:",
    options: ["Resources are fully employed", "Technology improves", "Unemployment increases", "Inflation occurs"],
    correctAnswer: 1,
    topic: "Economic Growth",
    difficultyLevel: 2,
    explanation: "Technological improvements increase productive capacity, shifting the PPF outward and enabling economic growth."
  },

  // Economic Growth - Difficulty 3
  {
    text: "Endogenous growth theory emphasizes:",
    options: ["External factors determining growth", "Internal factors like human capital and innovation", "Government spending as the main driver", "Natural resource availability"],
    correctAnswer: 1,
    topic: "Economic Growth",
    difficultyLevel: 3,
    explanation: "Endogenous growth theory focuses on internal factors within the economic system, particularly human capital, innovation, and knowledge spillovers."
  }
];

export const seedDatabase = async () => {
  try {
    const questionRepository = AppDataSource.getRepository(Question);
    
    // Check if questions already exist
    const existingQuestions = await questionRepository.count();
    if (existingQuestions > 0) {
      console.log('Database already contains questions. Skipping seed.');
      return;
    }

    // Create and save questions
    for (const questionData of sampleQuestions) {
      const question = questionRepository.create(questionData);
      await questionRepository.save(question);
    }

    console.log(`Successfully seeded database with ${sampleQuestions.length} questions`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export type RecommendationPayload = {
  context: string;
  suggestion: string;
  justification: string;
  expectedImpact: string;
};

export type WeeklySummaryPayload = {
  factualSummary: string[];
  suggestions: Array<{
    title: string;
    reason: string;
  }>;
};


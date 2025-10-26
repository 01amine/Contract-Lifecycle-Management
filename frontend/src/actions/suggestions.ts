import { api } from "./api";

export interface SuggestionTag {
  name: string;
}

export interface ClauseSuggestion {
  title: string;
  action: string;
  tags: SuggestionTag[];
  body: string;
  relevance_score: number;
}

export interface SuggestionsResponse {
  suggestions: ClauseSuggestion[];
}

export interface SuggestionsRequest {
  content: string;
  query?: string;
}

export const suggestionsActions = {
  /**
   * Generate AI-powered contract clause suggestions
   * @param content - The contract text to analyze
   * @param query - Optional user query to guide suggestions
   * @returns Promise with suggestions
   */
  async generateSuggestions(
    content: string,
    query?: string
  ): Promise<SuggestionsResponse> {
    return api.post<SuggestionsResponse>("/suggestions/generate", {
      content,
      query,
    });
  },
};

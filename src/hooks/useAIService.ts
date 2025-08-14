import { useState } from 'react';
import { aiService } from '@/services/aiService';
import type { AIContentSuggestion, ATSAnalysis, JobMatchAnalysis } from '@/services/aiService';

export const useAIService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const generateContentSuggestions = async (
    resumeData: any,
    targetIndustry: string,
    jobDescription?: string
  ): Promise<AIContentSuggestion[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateContentSuggestions(resumeData, targetIndustry, jobDescription);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content suggestions');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeATSCompatibility = async (resumeData: any): Promise<ATSAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeATSCompatibility(resumeData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze ATS compatibility');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeJobMatch = async (resumeData: any, jobDescription: string): Promise<JobMatchAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeJobMatch(resumeData, jobDescription);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze job match');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartSuggestions = async (
    section: string, 
    currentContent: string, 
    context: any
  ): Promise<string[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateSmartSuggestions(section, currentContent, context);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate smart suggestions');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    clearError,
    generateContentSuggestions,
    analyzeATSCompatibility,
    analyzeJobMatch,
    generateSmartSuggestions,
  };
};
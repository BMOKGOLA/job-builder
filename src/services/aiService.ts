// AI service for content generation and optimization
// Integrates with Gemini 1.5 Flash API via Supabase Edge Functions

export interface AIContentSuggestion {
  section: string;
  original: string;
  suggested: string;
  reason: string;
  keywords: string[];
  confidence: number;
}

export interface ATSAnalysis {
  score: number;
  issues: Array<{
    type: 'critical' | 'warning' | 'suggestion';
    section: string;
    issue: string;
    fix: string;
  }>;
  keywordMatches: Array<{
    keyword: string;
    found: boolean;
    frequency: number;
    importance: 'high' | 'medium' | 'low';
  }>;
  formatIssues: Array<{
    issue: string;
    impact: string;
    fix: string;
  }>;
}

export interface JobMatchAnalysis {
  matchScore: number;
  missingKeywords: string[];
  overusedKeywords: string[];
  suggestions: Array<{
    section: string;
    action: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

class AIService {
  private async callGeminiAPI(action: string, payload: any): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action, payload })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gemini API call failed:', error);
      // Fallback to simulated responses if API fails
      return this.getSimulatedResponse(action, payload);
    }
  }

  async generateContentSuggestions(
    resumeData: any,
    targetIndustry: string,
    jobDescription?: string
  ): Promise<AIContentSuggestion[]> {
    const payload = { resumeData, targetIndustry, jobDescription };
    const result = await this.callGeminiAPI('generateContentSuggestions', payload);
    
    // Ensure result is array format
    if (Array.isArray(result)) {
      return result;
    }
    
    // Fallback if API doesn't return expected format
    return this.getSimulatedContentSuggestions(resumeData, targetIndustry, jobDescription);
  }

  async analyzeATSCompatibility(resumeData: any): Promise<ATSAnalysis> {
    const payload = { resumeData };
    const result = await this.callGeminiAPI('analyzeATSCompatibility', payload);
    
    // Validate result format
    if (result.score !== undefined && result.issues && result.keywordMatches) {
      return result;
    }
    
    // Fallback if API doesn't return expected format
    return this.getSimulatedATSAnalysis(resumeData);
  }

  async analyzeJobMatch(resumeData: any, jobDescription: string): Promise<JobMatchAnalysis> {
    const payload = { resumeData, jobDescription };
    const result = await this.callGeminiAPI('analyzeJobMatch', payload);
    
    // Validate result format
    if (result.matchScore !== undefined && result.missingKeywords && result.suggestions) {
      return result;
    }
    
    // Fallback if API doesn't return expected format
    return this.getSimulatedJobMatch(resumeData, jobDescription);
  }

  async generateSmartSuggestions(section: string, currentContent: string, context: any): Promise<string[]> {
    const payload = { section, currentContent, context };
    const result = await this.callGeminiAPI('generateSmartSuggestions', payload);
    
    // Ensure result is array format
    if (Array.isArray(result)) {
      return result;
    }
    
    // Fallback suggestions
    return this.getSimulatedSmartSuggestions(section);
  }

  // Fallback methods with simulated responses
  private async getSimulatedResponse(action: string, payload: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (action) {
      case 'generateContentSuggestions':
        return this.getSimulatedContentSuggestions(payload.resumeData, payload.targetIndustry, payload.jobDescription);
      case 'analyzeATSCompatibility':
        return this.getSimulatedATSAnalysis(payload.resumeData);
      case 'analyzeJobMatch':
        return this.getSimulatedJobMatch(payload.resumeData, payload.jobDescription);
      case 'generateSmartSuggestions':
        return this.getSimulatedSmartSuggestions(payload.section);
      default:
        throw new Error('Unknown action');
    }
  }

  private getSimulatedContentSuggestions(resumeData: any, targetIndustry: string, jobDescription?: string): AIContentSuggestion[] {
    const suggestions: AIContentSuggestion[] = [];
    
    if (resumeData.personalInfo?.summary) {
      suggestions.push({
        section: 'summary',
        original: resumeData.personalInfo.summary,
        suggested: `${resumeData.personalInfo.summary} Experienced professional with proven track record in ${targetIndustry} industry, delivering results through strategic thinking and innovative problem-solving.`,
        reason: 'Added industry-specific keywords and achievement language',
        keywords: ['proven track record', 'strategic thinking', 'innovative'],
        confidence: 0.85
      });
    }

    return suggestions;
  }

  private getSimulatedATSAnalysis(resumeData: any): ATSAnalysis {
    const issues = [];
    let score = 100;

    if (!resumeData.personalInfo?.phone) {
      issues.push({
        type: 'critical' as const,
        section: 'contact',
        issue: 'Missing phone number',
        fix: 'Add a phone number to your contact information'
      });
      score -= 15;
    }

    if (!resumeData.personalInfo?.email) {
      issues.push({
        type: 'critical' as const,
        section: 'contact',
        issue: 'Missing email address',
        fix: 'Add a professional email address'
      });
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues,
      keywordMatches: [
        { keyword: 'results-driven', found: true, frequency: 1, importance: 'high' as const },
        { keyword: 'team player', found: false, frequency: 0, importance: 'medium' as const },
      ],
      formatIssues: []
    };
  }

  private getSimulatedJobMatch(resumeData: any, jobDescription: string): JobMatchAnalysis {
    return {
      matchScore: 75,
      missingKeywords: ['project management', 'stakeholder communication', 'agile methodology'],
      overusedKeywords: [],
      suggestions: [
        {
          section: 'summary',
          action: 'Add project management experience and agile methodology keywords',
          impact: 'high' as const
        }
      ]
    };
  }

  private getSimulatedSmartSuggestions(section: string): string[] {
    switch (section) {
      case 'summary':
        return [
          'Start with your years of experience and key expertise',
          'Include specific industry achievements with metrics',
          'End with your professional goal or value proposition'
        ];
      case 'experience':
        return [
          'Use action verbs to start each bullet point',
          'Include specific metrics and percentages',
          'Focus on achievements rather than job duties'
        ];
      default:
        return ['Use specific examples', 'Include measurable results', 'Keep content relevant'];
    }
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in real implementation would use more sophisticated NLP
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = new Set(['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said']);
    return [...new Set(words.filter(word => !stopWords.has(word)))];
  }

  private findMissingKeywords(text: string, keywords: string[]): string[] {
    const textLower = text.toLowerCase();
    return keywords.filter(keyword => !textLower.includes(keyword.toLowerCase()));
  }

  private enhanceText(originalText: string, keywords: string[]): string {
    let enhanced = originalText;
    
    // Simple enhancement - in real implementation would use more sophisticated text generation
    if (keywords.length > 0) {
      const keywordPhrase = keywords.slice(0, 2).join(' and ');
      enhanced = `${originalText} Experienced in ${keywordPhrase} with strong focus on delivering results.`;
    }
    
    return enhanced;
  }

  private extractAllText(resumeData: any): string {
    const texts = [];
    
    if (resumeData.personalInfo?.summary) {
      texts.push(resumeData.personalInfo.summary);
    }
    
    resumeData.experiences?.forEach((exp: any) => {
      texts.push(exp.description);
      texts.push(exp.position);
    });
    
    resumeData.education?.forEach((edu: any) => {
      texts.push(edu.field);
      texts.push(edu.degree);
    });
    
    if (resumeData.skills) {
      texts.push(...resumeData.skills);
    }
    
    return texts.join(' ');
  }

}

export const aiService = new AIService();
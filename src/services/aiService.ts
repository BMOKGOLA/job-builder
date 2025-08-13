// AI service for content generation and optimization
// Simulates Google Flash 1.5 API integration

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
  private readonly INDUSTRY_KEYWORDS: Record<string, string[]> = {
    technology: [
      'software development', 'agile', 'scrum', 'cloud computing', 'API', 'microservices',
      'DevOps', 'CI/CD', 'machine learning', 'artificial intelligence', 'data analysis',
      'full-stack', 'front-end', 'back-end', 'database', 'security', 'scalability'
    ],
    healthcare: [
      'patient care', 'clinical experience', 'healthcare compliance', 'medical records',
      'HIPAA', 'quality assurance', 'patient safety', 'interdisciplinary team',
      'evidence-based practice', 'continuous improvement', 'care coordination'
    ],
    finance: [
      'financial analysis', 'risk management', 'compliance', 'portfolio management',
      'investment strategy', 'financial modeling', 'regulatory reporting', 'audit',
      'budgeting', 'forecasting', 'capital markets', 'due diligence'
    ],
    marketing: [
      'digital marketing', 'content strategy', 'brand management', 'campaign optimization',
      'SEO', 'social media', 'analytics', 'conversion optimization', 'customer acquisition',
      'market research', 'lead generation', 'marketing automation'
    ],
    sales: [
      'business development', 'relationship building', 'sales pipeline', 'CRM',
      'revenue growth', 'client acquisition', 'negotiation', 'account management',
      'territory management', 'quota attainment', 'prospecting', 'closing deals'
    ]
  };

  private readonly ATS_KEYWORDS = [
    'results-driven', 'proven track record', 'strong communication', 'team player',
    'problem-solving', 'analytical skills', 'attention to detail', 'time management',
    'adaptable', 'innovative', 'leadership', 'collaborative', 'strategic thinking'
  ];

  async generateContentSuggestions(
    resumeData: any,
    targetIndustry: string,
    jobDescription?: string
  ): Promise<AIContentSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: AIContentSuggestion[] = [];
    const industryKeywords = this.INDUSTRY_KEYWORDS[targetIndustry.toLowerCase()] || [];
    const jobKeywords = jobDescription ? this.extractKeywords(jobDescription) : [];
    const allKeywords = [...industryKeywords, ...jobKeywords];

    // Analyze summary
    if (resumeData.personalInfo?.summary) {
      const summaryKeywords = this.findMissingKeywords(resumeData.personalInfo.summary, allKeywords);
      if (summaryKeywords.length > 0) {
        suggestions.push({
          section: 'summary',
          original: resumeData.personalInfo.summary,
          suggested: this.enhanceText(resumeData.personalInfo.summary, summaryKeywords.slice(0, 3)),
          reason: 'Added industry-specific keywords to improve ATS compatibility',
          keywords: summaryKeywords.slice(0, 3),
          confidence: 0.85
        });
      }
    }

    // Analyze experiences
    resumeData.experiences?.forEach((exp: any, index: number) => {
      const missingKeywords = this.findMissingKeywords(exp.description, allKeywords);
      if (missingKeywords.length > 0) {
        suggestions.push({
          section: `experience_${index}`,
          original: exp.description,
          suggested: this.enhanceText(exp.description, missingKeywords.slice(0, 2)),
          reason: 'Enhanced job description with relevant keywords',
          keywords: missingKeywords.slice(0, 2),
          confidence: 0.78
        });
      }
    });

    return suggestions;
  }

  async analyzeATSCompatibility(resumeData: any): Promise<ATSAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const issues = [];
    const formatIssues = [];
    let score = 100;

    // Check for common ATS issues
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

    if (!resumeData.experiences || resumeData.experiences.length === 0) {
      issues.push({
        type: 'critical' as const,
        section: 'experience',
        issue: 'No work experience listed',
        fix: 'Add at least one work experience entry'
      });
      score -= 20;
    }

    // Check keyword density
    const allText = this.extractAllText(resumeData);
    const keywordMatches = this.ATS_KEYWORDS.map(keyword => ({
      keyword,
      found: allText.toLowerCase().includes(keyword.toLowerCase()),
      frequency: (allText.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length,
      importance: 'medium' as const
    }));

    const foundKeywords = keywordMatches.filter(k => k.found).length;
    const keywordScore = (foundKeywords / this.ATS_KEYWORDS.length) * 30;
    score = Math.max(0, score - (30 - keywordScore));

    return {
      score: Math.round(score),
      issues,
      keywordMatches,
      formatIssues
    };
  }

  async analyzeJobMatch(resumeData: any, jobDescription: string): Promise<JobMatchAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1800));

    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeText = this.extractAllText(resumeData);
    const resumeKeywords = this.extractKeywords(resumeText);

    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(rk => rk.toLowerCase().includes(keyword.toLowerCase()))
    );

    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(rk => rk.toLowerCase().includes(keyword.toLowerCase()))
    );

    const matchScore = Math.round((matchedKeywords.length / jobKeywords.length) * 100);

    const suggestions = [];
    if (missingKeywords.length > 0) {
      suggestions.push({
        section: 'summary',
        action: `Add keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
        impact: 'high' as const
      });
    }

    if (matchScore < 60) {
      suggestions.push({
        section: 'experience',
        action: 'Rewrite job descriptions to better match job requirements',
        impact: 'high' as const
      });
    }

    return {
      matchScore,
      missingKeywords: missingKeywords.slice(0, 10),
      overusedKeywords: [],
      suggestions
    };
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

  async generateSmartSuggestions(section: string, currentContent: string, context: any): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const suggestions = [];

    switch (section) {
      case 'summary':
        suggestions.push(
          'Highlight specific years of experience',
          'Include quantifiable achievements',
          'Mention industry-specific certifications'
        );
        break;
      case 'experience':
        suggestions.push(
          'Use action verbs to start bullet points',
          'Include specific metrics and numbers',
          'Focus on achievements rather than responsibilities'
        );
        break;
      case 'skills':
        suggestions.push(
          'Group related skills together',
          'Include both technical and soft skills',
          'Add proficiency levels where relevant'
        );
        break;
    }

    return suggestions;
  }
}

export const aiService = new AIService();
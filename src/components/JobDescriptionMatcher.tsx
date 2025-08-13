import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService, JobMatchAnalysis } from "@/services/aiService";

interface JobDescriptionMatcherProps {
  resumeData: any;
  onSuggestionApply?: (suggestion: string) => void;
}

const JobDescriptionMatcher = ({ resumeData, onSuggestionApply }: JobDescriptionMatcherProps) => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to analyze match compatibility.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeJobMatch(resumeData, jobDescription);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: `Your resume matches ${result.matchScore}% with the job requirements.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze job match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getMatchScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Job Description Matcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Paste Job Description</label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Copy and paste the job description you're applying for..."
              rows={8}
              className="mt-2"
            />
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Job Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Match Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className={`text-4xl font-bold ${getMatchScoreColor(analysis.matchScore)}`}>
                  {analysis.matchScore}%
                </div>
                <Progress value={analysis.matchScore} className="h-3" />
                <Badge variant={getMatchScoreVariant(analysis.matchScore)} className="text-sm">
                  {analysis.matchScore >= 80 ? "Excellent Match" :
                   analysis.matchScore >= 60 ? "Good Match" :
                   "Needs Improvement"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Missing Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertCircle className="w-5 h-5 mr-2 text-warning" />
                Missing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.missingKeywords.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Consider adding these keywords to improve your match:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.slice(0, 10).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  {analysis.missingKeywords.length > 10 && (
                    <p className="text-xs text-muted-foreground">
                      +{analysis.missingKeywords.length - 10} more keywords
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-success text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  All important keywords are present!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Improvement Suggestions */}
      {analysis && analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Badge 
                        variant={suggestion.impact === 'high' ? 'default' : 'secondary'} 
                        className="text-xs mr-2"
                      >
                        {suggestion.impact} impact
                      </Badge>
                      <span className="font-medium text-sm capitalize">{suggestion.section}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.action}</p>
                  </div>
                  {onSuggestionApply && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onSuggestionApply(suggestion.action)}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">💡 Pro Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use keywords from the job description naturally in your experience bullets</li>
            <li>• Match the job title format and terminology used by the company</li>
            <li>• Include specific software, tools, and technologies mentioned</li>
            <li>• Quantify your achievements with numbers and percentages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDescriptionMatcher;
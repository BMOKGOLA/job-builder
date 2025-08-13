import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Loader2, 
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService, AIContentSuggestion } from "@/services/aiService";

interface AIContentSuggestionsProps {
  resumeData: any;
  targetIndustry: string;
  jobDescription?: string;
  onSuggestionApply: (section: string, newContent: string) => void;
  onFeedback?: (suggestion: AIContentSuggestion, isPositive: boolean) => void;
}

const AIContentSuggestions = ({ 
  resumeData, 
  targetIndustry, 
  jobDescription,
  onSuggestionApply,
  onFeedback
}: AIContentSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<AIContentSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    generateSuggestions();
  }, [resumeData, targetIndustry, jobDescription]);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const result = await aiService.generateContentSuggestions(
        resumeData, 
        targetIndustry, 
        jobDescription
      );
      setSuggestions(result);
    } catch (error) {
      toast({
        title: "AI Suggestions Failed",
        description: "Unable to generate content suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = (suggestion: AIContentSuggestion) => {
    onSuggestionApply(suggestion.section, suggestion.suggested);
    setAppliedSuggestions(prev => new Set(prev).add(suggestion.section));
    toast({
      title: "Suggestion Applied",
      description: "Your resume content has been updated with AI suggestions.",
    });
  };

  const handleFeedback = (suggestion: AIContentSuggestion, isPositive: boolean) => {
    onFeedback?.(suggestion, isPositive);
    toast({
      title: "Feedback Recorded",
      description: "Thank you for helping us improve our suggestions!",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-success";
    if (confidence >= 0.6) return "text-warning";
    return "text-muted-foreground";
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="font-medium">Generating AI Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Analyzing your content for optimization opportunities...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
          <h3 className="font-medium mb-2">Great Job!</h3>
          <p className="text-sm text-muted-foreground">
            Your resume content is already well-optimized. No suggestions at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI Content Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.section.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge 
                        variant={suggestion.confidence >= 0.8 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {getConfidenceBadge(suggestion.confidence)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1 text-warning" />
                          Current Content
                        </h4>
                        <div className="bg-muted p-3 rounded text-sm mt-1">
                          {suggestion.original.substring(0, 200)}
                          {suggestion.original.length > 200 && "..."}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm flex items-center">
                          <Lightbulb className="w-4 h-4 mr-1 text-success" />
                          AI Suggestion
                        </h4>
                        <div className="bg-gradient-card border-primary/20 p-3 rounded text-sm mt-1">
                          {suggestion.suggested.substring(0, 200)}
                          {suggestion.suggested.length > 200 && "..."}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <strong>Reason:</strong> {suggestion.reason}
                      </div>
                      
                      {suggestion.keywords.length > 0 && (
                        <div>
                          <span className="text-xs font-medium">Added Keywords: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {suggestion.keywords.map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    {onFeedback && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(suggestion, true)}
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(suggestion, false)}
                        >
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Not Helpful
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleApplySuggestion(suggestion)}
                    disabled={appliedSuggestions.has(suggestion.section)}
                  >
                    {appliedSuggestions.has(suggestion.section) ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Apply Suggestion
                      </>
                    )}
                  </Button>
                </div>
                
                {index < suggestions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-xs">
              <p className="font-medium mb-1">AI Enhancement Tips</p>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Review each suggestion carefully before applying</li>
                <li>• High-confidence suggestions are more likely to improve ATS scores</li>
                <li>• Keywords are automatically optimized for your target industry</li>
                <li>• Your feedback helps improve future suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIContentSuggestions;
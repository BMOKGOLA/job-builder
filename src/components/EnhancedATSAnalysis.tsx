import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  FileText,
  Key,
  Layout,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService, ATSAnalysis } from "@/services/aiService";

interface EnhancedATSAnalysisProps {
  resumeData: any;
  onIssueClick?: (issue: any) => void;
}

const EnhancedATSAnalysis = ({ resumeData, onIssueClick }: EnhancedATSAnalysisProps) => {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    performAnalysis();
  }, [resumeData]);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeATSCompatibility(resumeData);
      setAnalysis(result);
      setLastAnalyzed(new Date());
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze ATS compatibility. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { variant: "default" as const, text: "Excellent" };
    if (score >= 70) return { variant: "secondary" as const, text: "Good" };
    return { variant: "destructive" as const, text: "Needs Work" };
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const groupedIssues = analysis?.issues.reduce((acc, issue) => {
    if (!acc[issue.section]) acc[issue.section] = [];
    acc[issue.section].push(issue);
    return acc;
  }, {} as Record<string, typeof analysis.issues>) || {};

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="font-medium">Analyzing ATS Compatibility</h3>
              <p className="text-sm text-muted-foreground">
                Checking format, keywords, and structure...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">ATS Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check how well your resume passes Applicant Tracking Systems
          </p>
          <Button onClick={performAnalysis}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Run ATS Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              ATS Compatibility Score
            </div>
            <Button variant="outline" size="sm" onClick={performAnalysis}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}%
            </div>
            <Progress value={analysis.score} className="h-3" />
            <Badge {...getScoreBadge(analysis.score)} className="text-sm px-3 py-1">
              {getScoreBadge(analysis.score).text} ATS Compatibility
            </Badge>
            {lastAnalyzed && (
              <p className="text-xs text-muted-foreground">
                Last analyzed: {lastAnalyzed.toLocaleTimeString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Issues Breakdown */}
      {analysis.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Issues Found ({analysis.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupedIssues).map(([section, issues]) => (
                <div key={section}>
                  <h4 className="font-medium text-sm mb-2 capitalize flex items-center">
                    <Layout className="w-4 h-4 mr-1" />
                    {section.replace('_', ' ')} Section
                  </h4>
                  <div className="space-y-2 ml-5">
                    {issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          issue.type === 'critical' 
                            ? 'border-destructive/20 bg-destructive/5' 
                            : issue.type === 'warning'
                            ? 'border-warning/20 bg-warning/5'
                            : 'border-border bg-muted/50'
                        } ${onIssueClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                        onClick={() => onIssueClick?.(issue)}
                      >
                        {getIssueIcon(issue.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{issue.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {issue.fix}
                          </p>
                        </div>
                        <Badge 
                          variant={issue.type === 'critical' ? 'destructive' : 
                                  issue.type === 'warning' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {issue.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {section !== Object.keys(groupedIssues)[Object.keys(groupedIssues).length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyword Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Keyword Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {analysis.keywordMatches.filter(k => k.found).length}
                </div>
                <p className="text-sm text-muted-foreground">Keywords Found</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {analysis.keywordMatches.filter(k => !k.found).length}
                </div>
                <p className="text-sm text-muted-foreground">Keywords Missing</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {analysis.keywordMatches.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded">
                  <span className="text-sm">{keyword.keyword}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={keyword.importance === 'high' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {keyword.importance}
                    </Badge>
                    {keyword.found ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Issues */}
      {analysis.formatIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Format Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.formatIssues.map((issue, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.issue}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Impact: {issue.impact}
                      </p>
                      <p className="text-xs text-success mt-2">
                        Fix: {issue.fix}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {analysis.score >= 85 && analysis.issues.length === 0 && (
        <Card className="bg-gradient-success border-success/20">
          <CardContent className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Excellent ATS Compatibility!</h3>
            <p className="text-muted-foreground">
              Your resume is optimized and ready to pass through Applicant Tracking Systems.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedATSAnalysis;
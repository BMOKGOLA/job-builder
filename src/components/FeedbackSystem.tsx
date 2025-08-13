import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle2,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storageManager } from "@/utils/localStorage";

interface FeedbackSystemProps {
  onFeedbackSubmit?: (feedback: any) => void;
}

interface UserFeedback {
  feature: string;
  rating: number;
  feedback: string;
  timestamp: string;
}

const FeedbackSystem = ({ onFeedbackSubmit }: FeedbackSystemProps) => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const features = [
    { id: "ai_suggestions", name: "AI Content Suggestions", icon: Star },
    { id: "ats_optimization", name: "ATS Optimization", icon: TrendingUp },
    { id: "job_matching", name: "Job Description Matching", icon: Users },
    { id: "templates", name: "Resume Templates", icon: Award },
    { id: "overall", name: "Overall Experience", icon: CheckCircle2 },
  ];

  const handleRatingClick = (ratingValue: number) => {
    setRating(ratingValue);
  };

  const handleSubmit = async () => {
    if (!selectedFeature || rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a feature and provide a rating.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: UserFeedback = {
        feature: selectedFeature,
        rating,
        feedback,
        timestamp: new Date().toISOString(),
      };

      // Save to local storage
      const existingFeedback = storageManager.loadFeedback() || { improvements: [], userRatings: [] };
      existingFeedback.userRatings.push(feedbackData);
      storageManager.saveFeedback(existingFeedback);

      // Call parent callback
      onFeedbackSubmit?.(feedbackData);

      setSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us improve the AI Resume Builder!",
      });

      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setSelectedFeature("");
        setRating(0);
        setFeedback("");
      }, 3000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">
            Your feedback has been submitted and will help us improve the resume builder.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Feedback & Improvement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature Selection */}
        <div>
          <Label className="text-sm font-medium">Which feature would you like to review?</Label>
          <RadioGroup value={selectedFeature} onValueChange={setSelectedFeature} className="mt-2">
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Label
                    key={feature.id}
                    htmlFor={feature.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFeature === feature.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <RadioGroupItem value={feature.id} id={feature.id} />
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{feature.name}</span>
                  </Label>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium">How would you rate this feature?</Label>
          <div className="flex space-x-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className={`w-8 h-8 rounded transition-colors ${
                  star <= rating
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-muted-foreground hover:text-yellow-400"
                }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="mt-2">
              <Badge variant={rating >= 4 ? "default" : rating >= 3 ? "secondary" : "destructive"}>
                {rating >= 4 ? "Excellent" : rating >= 3 ? "Good" : rating >= 2 ? "Fair" : "Poor"}
              </Badge>
            </div>
          )}
        </div>

        {/* Feedback Text */}
        <div>
          <Label htmlFor="feedback" className="text-sm font-medium">
            Additional Comments (Optional)
          </Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you liked, what could be improved, or suggest new features..."
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedFeature || rating === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>

        {/* Privacy Note */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <strong>Privacy Note:</strong> Your feedback is stored locally on your device and helps 
          improve the AI suggestions and user experience. No personal resume data is transmitted.
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSystem;
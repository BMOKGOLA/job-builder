import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Zap, 
  CheckCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  targetIndustry: string;
}

interface ResumeBuilderProps {
  templateId: string;
  onPreview: (data: ResumeData) => void;
  onBack: () => void;
}

const steps = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Work Experience", icon: Briefcase },
  { id: 3, title: "Education", icon: GraduationCap },
  { id: 4, title: "Skills & Industry", icon: Award },
];

const ResumeBuilder = ({ templateId, onPreview, onBack }: ResumeBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [atsScore, setAtsScore] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
    targetIndustry: "",
  });

  const handleOptimizeContent = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization
    setTimeout(() => {
      setAtsScore(Math.floor(Math.random() * 20) + 75);
      setIsOptimizing(false);
      toast({
        title: "Content Optimized!",
        description: "Your resume has been enhanced with AI-powered suggestions.",
      });
    }, 2000);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                    }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value },
                    }))
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value },
                    }))
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value },
                    }))
                  }
                  placeholder="New York, NY"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="linkedIn">LinkedIn URL</Label>
                <Input
                  id="linkedIn"
                  value={resumeData.personalInfo.linkedIn}
                  onChange={(e) =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, linkedIn: e.target.value },
                    }))
                  }
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) =>
                  setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, summary: e.target.value },
                  }))
                }
                placeholder="Brief professional summary highlighting your key achievements and skills..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <Button onClick={addExperience} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            {resumeData.experiences.map((exp, index) => (
              <Card key={exp.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  <Button
                    onClick={() => removeExperience(exp.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label>Position *</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      placeholder="Job Title"
                    />
                  </div>
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Job Description *</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button onClick={addEducation} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {resumeData.education.map((edu, index) => (
              <Card key={edu.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Education #{index + 1}</h4>
                  <Button
                    onClick={() => removeEducation(edu.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  <div>
                    <Label>Field of Study *</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      placeholder="Computer Science, Business, etc."
                    />
                  </div>
                  <div>
                    <Label>Graduation Date *</Label>
                    <Input
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetIndustry">Target Industry *</Label>
              <Input
                id="targetIndustry"
                value={resumeData.targetIndustry}
                onChange={(e) =>
                  setResumeData(prev => ({
                    ...prev,
                    targetIndustry: e.target.value,
                  }))
                }
                placeholder="Technology, Healthcare, Finance, etc."
              />
            </div>
            
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {resumeData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill}
                    <Trash2 className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Type a skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            <Card className="p-4 bg-gradient-card border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">ATS Optimization Score</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis of your resume
                  </p>
                </div>
                <Button
                  onClick={handleOptimizeContent}
                  disabled={isOptimizing}
                  variant="outline"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isOptimizing ? "Optimizing..." : "Optimize"}
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">ATS Compatibility</span>
                  <span className="text-sm font-medium">{atsScore}%</span>
                </div>
                <Progress value={atsScore} className="h-2" />
                {atsScore >= 80 && (
                  <div className="flex items-center text-success text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Excellent ATS compatibility!
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return resumeData.personalInfo.fullName && 
               resumeData.personalInfo.email && 
               resumeData.personalInfo.phone && 
               resumeData.personalInfo.location;
      case 2:
        return resumeData.experiences.length > 0;
      case 3:
        return resumeData.education.length > 0;
      case 4:
        return resumeData.targetIndustry && resumeData.skills.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-success text-success-foreground"
                        : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      Step {step.id}
                    </p>
                    <p className="text-sm">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 bg-muted mx-4 hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 mr-2" })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={currentStep === 1 ? onBack : () => setCurrentStep(prev => prev - 1)}
            variant="outline"
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? "Back to Templates" : "Previous"}
          </Button>
          
          <Button
            onClick={
              currentStep === steps.length
                ? () => onPreview(resumeData)
                : () => setCurrentStep(prev => prev + 1)
            }
            disabled={!canProceed()}
            className="px-6"
          >
            {currentStep === steps.length ? "Preview Resume" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import TemplateSelector from "@/components/TemplateSelector";
import ResumeBuilder from "@/components/ResumeBuilder";
import ResumePreview from "@/components/ResumePreview";
import { useToast } from "@/hooks/use-toast";

type AppState = "hero" | "templates" | "builder" | "preview";

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

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("hero");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentState("templates");
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleTemplateContinue = () => {
    if (selectedTemplate) {
      setCurrentState("builder");
    }
  };

  const handleBuilderPreview = (data: ResumeData) => {
    setResumeData(data);
    setCurrentState("preview");
  };

  const handleBackToBuilder = () => {
    setCurrentState("builder");
  };

  const handleBackToTemplates = () => {
    setCurrentState("templates");
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'html') => {
    // Simulate export process
    toast({
      title: "Export Started",
      description: `Your resume is being exported as ${format.toUpperCase()}...`,
    });

    // In a real app, this would call an API to generate the document
    setTimeout(() => {
      toast({
        title: "Export Complete!",
        description: `Your resume has been exported as ${format.toUpperCase()}.`,
      });
    }, 2000);
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case "hero":
        return <HeroSection onGetStarted={handleGetStarted} />;
      
      case "templates":
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onContinue={handleTemplateContinue}
          />
        );
      
      case "builder":
        return (
          <ResumeBuilder
            templateId={selectedTemplate}
            onPreview={handleBuilderPreview}
            onBack={handleBackToTemplates}
          />
        );
      
      case "preview":
        return resumeData ? (
          <ResumePreview
            data={resumeData}
            templateId={selectedTemplate}
            onBack={handleBackToBuilder}
            onExport={handleExport}
          />
        ) : null;
      
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentState()}
    </div>
  );
};

export default Index;
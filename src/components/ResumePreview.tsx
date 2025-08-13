import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Globe, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Linkedin,
  Calendar
} from "lucide-react";

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

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
  onBack: () => void;
  onExport: (format: 'pdf' | 'docx' | 'html') => void;
}

const ResumePreview = ({ data, templateId, onBack, onExport }: ResumePreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderTemplate = () => {
    switch (templateId) {
      case "professional":
        return (
          <div className="bg-white text-gray-900 p-8 font-sans">
            {/* Header */}
            <div className="border-b-2 border-primary pb-6 mb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">
                {data.personalInfo.fullName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {data.personalInfo.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {data.personalInfo.email}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {data.personalInfo.location}
                </div>
                {data.personalInfo.linkedIn && (
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 mr-1" />
                    {data.personalInfo.linkedIn}
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {data.personalInfo.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-primary mb-2 uppercase tracking-wide">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-wide">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {data.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-wide">
                  Education
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-primary">{edu.institution}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(edu.graduationDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-wide">
                  Key Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "creative":
        return (
          <div className="bg-white text-gray-900 p-8">
            {/* Creative Header with Color Block */}
            <div className="bg-gradient-primary text-white p-6 -m-8 mb-8">
              <h1 className="text-4xl font-bold mb-2">
                {data.personalInfo.fullName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                <span>{data.personalInfo.phone}</span>
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.location}</span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Summary */}
                {data.personalInfo.summary && (
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-3 border-b-2 border-primary pb-1">
                      About
                    </h2>
                    <p className="text-sm leading-relaxed">
                      {data.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-3 border-b-2 border-primary pb-1">
                      Skills
                    </h2>
                    <div className="space-y-2">
                      {data.skills.map((skill) => (
                        <div key={skill} className="bg-primary text-white px-3 py-1 rounded-full text-sm inline-block mr-2">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Experience */}
                {data.experiences.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
                      Experience
                    </h2>
                    <div className="space-y-6">
                      {data.experiences.map((exp) => (
                        <div key={exp.id} className="border-l-4 border-primary pl-4">
                          <h3 className="text-lg font-bold">{exp.position}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                          </p>
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
                      Education
                    </h2>
                    <div className="space-y-3">
                      {data.education.map((edu) => (
                        <div key={edu.id} className="border-l-4 border-primary pl-4">
                          <h3 className="font-bold">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-primary">{edu.institution}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(edu.graduationDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "executive":
        return (
          <div className="bg-white text-gray-900 p-8">
            {/* Executive Header */}
            <div className="text-center border-b border-gray-300 pb-6 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {data.personalInfo.fullName}
              </h1>
              <p className="text-lg text-primary font-medium mb-3">
                {data.targetIndustry} Executive
              </p>
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <span>{data.personalInfo.phone}</span>
                <span>{data.personalInfo.email}</span>
                <span>{data.personalInfo.location}</span>
              </div>
            </div>

            {/* Executive Summary */}
            {data.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  EXECUTIVE SUMMARY
                </h2>
                <p className="text-center text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Core Competencies */}
            {data.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  CORE COMPETENCIES
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {data.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="border-2 border-primary text-primary px-4 py-2 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Experience */}
            {data.experiences.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  PROFESSIONAL EXPERIENCE
                </h2>
                <div className="space-y-8">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="border-b border-gray-200 pb-6">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-primary">{exp.position}</h3>
                        <p className="text-lg text-gray-700">{exp.company}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </p>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-center max-w-4xl mx-auto">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-center">
                      <h3 className="font-bold text-lg">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-primary">{edu.institution}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(edu.graduationDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return renderTemplate();
    }
  };

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resume Preview</h1>
            <p className="text-muted-foreground">Review your resume before exporting</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Edit Resume
            </Button>
            <Button onClick={() => onExport('pdf')} className="shadow-hover">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Export Options */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => onExport('pdf')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
                <Button 
                  onClick={() => onExport('docx')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as DOCX
                </Button>
                <Button 
                  onClick={() => onExport('html')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Export as HTML
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Resume Stats</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Template:</span>
                      <Badge variant="secondary" className="text-xs">
                        {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry:</span>
                      <span className="text-xs">{data.targetIndustry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skills:</span>
                      <span className="text-xs">{data.skills.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-3">
            <Card className="shadow-card overflow-hidden">
              <div className="bg-white min-h-[1100px] transform scale-90 origin-top">
                {renderTemplate()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Eye,
  Edit,
  Download
} from "lucide-react";

interface SectionPreviewProps {
  resumeData: any;
  templateId: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onEditSection?: (section: string) => void;
  onExportSection?: (section: string) => void;
}

const sections = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Award },
];

const SectionPreview = ({ 
  resumeData, 
  templateId, 
  activeSection, 
  onSectionChange,
  onEditSection,
  onExportSection 
}: SectionPreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderPersonalSection = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">
            {resumeData.personalInfo?.fullName || "Full Name"}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
            <span>{resumeData.personalInfo?.phone || "Phone"}</span>
            <span>{resumeData.personalInfo?.email || "Email"}</span>
            <span>{resumeData.personalInfo?.location || "Location"}</span>
          </div>
          {resumeData.personalInfo?.summary && (
            <p className="text-gray-700 max-w-2xl mx-auto">
              {resumeData.personalInfo.summary}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {resumeData.personalInfo?.fullName ? "Complete" : "Incomplete"}
        </Badge>
        <div className="flex space-x-2">
          {onEditSection && (
            <Button size="sm" variant="outline" onClick={() => onEditSection('personal')}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold text-primary mb-4">Professional Experience</h2>
        {resumeData.experiences && resumeData.experiences.length > 0 ? (
          <div className="space-y-6">
            {resumeData.experiences.map((exp: any, index: number) => (
              <div key={exp.id || index} className="border-l-4 border-primary pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{exp.position || "Position Title"}</h3>
                    <p className="text-primary font-medium">{exp.company || "Company Name"}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {exp.description || "Job description and achievements..."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No work experience added yet</p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {resumeData.experiences?.length || 0} Experience{(resumeData.experiences?.length || 0) !== 1 ? 's' : ''}
        </Badge>
        <div className="flex space-x-2">
          {onEditSection && (
            <Button size="sm" variant="outline" onClick={() => onEditSection('experience')}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold text-primary mb-4">Education</h2>
        {resumeData.education && resumeData.education.length > 0 ? (
          <div className="space-y-4">
            {resumeData.education.map((edu: any, index: number) => (
              <div key={edu.id || index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">
                    {edu.degree || "Degree"} in {edu.field || "Field of Study"}
                  </h3>
                  <p className="text-primary">{edu.institution || "Institution"}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(edu.graduationDate)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No education added yet</p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {resumeData.education?.length || 0} Education{(resumeData.education?.length || 0) !== 1 ? 's' : ''}
        </Badge>
        <div className="flex space-x-2">
          {onEditSection && (
            <Button size="sm" variant="outline" onClick={() => onEditSection('education')}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold text-primary mb-4">Skills & Expertise</h2>
        {resumeData.skills && resumeData.skills.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            {resumeData.targetIndustry && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Target Industry:</strong> {resumeData.targetIndustry}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No skills added yet</p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {resumeData.skills?.length || 0} Skill{(resumeData.skills?.length || 0) !== 1 ? 's' : ''}
        </Badge>
        <div className="flex space-x-2">
          {onEditSection && (
            <Button size="sm" variant="outline" onClick={() => onEditSection('skills')}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return renderPersonalSection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      default:
        return <div>Section not found</div>;
    }
  };

  const getSectionCompleteness = (sectionId: string): number => {
    switch (sectionId) {
      case 'personal':
        const personal = resumeData.personalInfo || {};
        const requiredPersonal = ['fullName', 'email', 'phone', 'location'];
        const completedPersonal = requiredPersonal.filter(field => personal[field]).length;
        return Math.round((completedPersonal / requiredPersonal.length) * 100);
      
      case 'experience':
        return resumeData.experiences && resumeData.experiences.length > 0 ? 100 : 0;
      
      case 'education':
        return resumeData.education && resumeData.education.length > 0 ? 100 : 0;
      
      case 'skills':
        const skillsCount = (resumeData.skills?.length || 0) + (resumeData.targetIndustry ? 1 : 0);
        return skillsCount > 0 ? Math.min(100, skillsCount * 25) : 0;
      
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Section Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSection} onValueChange={onSectionChange}>
          <TabsList className="grid w-full grid-cols-4">
            {sections.map((section) => {
              const IconComponent = section.icon;
              const completeness = getSectionCompleteness(section.id);
              return (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="relative"
                >
                  <div className="flex items-center space-x-1">
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.name}</span>
                  </div>
                  {completeness > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {completeness === 100 ? "✓" : Math.round(completeness / 25)}
                      </span>
                    </div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              {renderSectionContent(section.id)}
            </TabsContent>
          ))}
        </Tabs>

        {/* Export options */}
        {onExportSection && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Export this section independently
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onExportSection(activeSection)}
              >
                <Download className="w-3 h-3 mr-1" />
                Export Section
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionPreview;
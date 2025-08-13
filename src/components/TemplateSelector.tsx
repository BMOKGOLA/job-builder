import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
  recommended?: boolean;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onContinue: () => void;
}

const templates: Template[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean, modern design perfect for corporate roles",
    preview: "Modern layout with emphasis on experience and achievements",
    features: ["ATS Optimized", "Clean Layout", "Professional Typography"],
    recommended: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Eye-catching design for creative professionals",
    preview: "Bold typography with creative visual elements",
    features: ["Visual Appeal", "Creative Layout", "Portfolio Section"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior-level positions",
    preview: "Executive-level formatting with leadership focus",
    features: ["Executive Summary", "Leadership Focus", "Achievement Highlights"],
  },
];

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, onContinue }: TemplateSelectorProps) => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Choose Your Template
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a professionally designed template that best fits your industry and career level.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-hover transform hover:-translate-y-1 ${
                selectedTemplate === template.id
                  ? "ring-2 ring-primary shadow-hover"
                  : "shadow-card"
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              {template.recommended && (
                <Badge className="absolute -top-3 left-4 bg-success text-success-foreground">
                  Recommended
                </Badge>
              )}
              
              <CardContent className="p-6">
                {/* Template Preview */}
                <div className="bg-gradient-card rounded-lg h-48 mb-4 flex items-center justify-center border">
                  <div className="text-center p-4">
                    <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">{template.preview}</span>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">
                      {template.name}
                    </h3>
                    {selectedTemplate === template.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">
                    {template.description}
                  </p>

                  <div className="space-y-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={onContinue}
            disabled={!selectedTemplate}
            size="lg"
            className="px-8 py-6 text-lg font-semibold shadow-hover"
          >
            Continue with {templates.find(t => t.id === selectedTemplate)?.name || 'Selected'} Template
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TemplateSelector;
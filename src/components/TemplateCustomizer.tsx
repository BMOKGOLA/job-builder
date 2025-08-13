import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Type, 
  Layout, 
  Settings,
  Eye,
  RotateCcw
} from "lucide-react";

interface TemplateCustomizerProps {
  templateId: string;
  customizations: TemplateCustomizations;
  onCustomizationChange: (customizations: TemplateCustomizations) => void;
  onPreview?: () => void;
}

export interface TemplateCustomizations {
  colorScheme: 'blue' | 'green' | 'purple' | 'red' | 'dark' | 'minimal';
  fontSize: number;
  spacing: number;
  fontFamily: 'inter' | 'roboto' | 'opensans' | 'lato';
  showIcons: boolean;
  showBorders: boolean;
  headerStyle: 'centered' | 'left' | 'split';
  sectionSpacing: number;
}

const defaultCustomizations: TemplateCustomizations = {
  colorScheme: 'blue',
  fontSize: 12,
  spacing: 1,
  fontFamily: 'inter',
  showIcons: true,
  showBorders: true,
  headerStyle: 'left',
  sectionSpacing: 1,
};

const TemplateCustomizer = ({ 
  templateId, 
  customizations, 
  onCustomizationChange,
  onPreview 
}: TemplateCustomizerProps) => {
  const [localCustomizations, setLocalCustomizations] = useState<TemplateCustomizations>(
    customizations || defaultCustomizations
  );

  const colorSchemes = [
    { id: 'blue', name: 'Professional Blue', color: 'bg-blue-600' },
    { id: 'green', name: 'Fresh Green', color: 'bg-green-600' },
    { id: 'purple', name: 'Creative Purple', color: 'bg-purple-600' },
    { id: 'red', name: 'Bold Red', color: 'bg-red-600' },
    { id: 'dark', name: 'Sophisticated Dark', color: 'bg-gray-800' },
    { id: 'minimal', name: 'Minimal Gray', color: 'bg-gray-400' },
  ];

  const fontFamilies = [
    { id: 'inter', name: 'Inter', preview: 'Modern and clean' },
    { id: 'roboto', name: 'Roboto', preview: 'Professional standard' },
    { id: 'opensans', name: 'Open Sans', preview: 'Friendly and readable' },
    { id: 'lato', name: 'Lato', preview: 'Elegant and refined' },
  ];

  const headerStyles = [
    { id: 'left', name: 'Left Aligned', description: 'Traditional layout' },
    { id: 'centered', name: 'Centered', description: 'Balanced design' },
    { id: 'split', name: 'Split Layout', description: 'Modern approach' },
  ];

  const updateCustomization = <K extends keyof TemplateCustomizations>(
    key: K,
    value: TemplateCustomizations[K]
  ) => {
    const updated = { ...localCustomizations, [key]: value };
    setLocalCustomizations(updated);
    onCustomizationChange(updated);
  };

  const resetToDefaults = () => {
    setLocalCustomizations(defaultCustomizations);
    onCustomizationChange(defaultCustomizations);
  };

  const getTemplateRestrictions = () => {
    switch (templateId) {
      case 'creative':
        return {
          allowedColors: ['blue', 'green', 'purple', 'red'],
          allowedHeaders: ['left', 'centered'],
          minSpacing: 1.2,
        };
      case 'executive':
        return {
          allowedColors: ['dark', 'minimal', 'blue'],
          allowedHeaders: ['centered', 'split'],
          minSpacing: 1.5,
        };
      default:
        return {
          allowedColors: colorSchemes.map(c => c.id),
          allowedHeaders: headerStyles.map(h => h.id),
          minSpacing: 0.8,
        };
    }
  };

  const restrictions = getTemplateRestrictions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Template Customization
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              {onPreview && (
                <Button size="sm" onClick={onPreview}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Color Scheme */}
          <div>
            <div className="flex items-center mb-3">
              <Palette className="w-4 h-4 mr-2" />
              <Label className="font-medium">Color Scheme</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {colorSchemes
                .filter(scheme => restrictions.allowedColors.includes(scheme.id))
                .map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => updateCustomization('colorScheme', scheme.id as any)}
                  className={`flex items-center p-3 rounded-lg border transition-all ${
                    localCustomizations.colorScheme === scheme.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mr-3 ${scheme.color}`} />
                  <div className="text-left">
                    <div className="text-sm font-medium">{scheme.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Typography */}
          <div>
            <div className="flex items-center mb-4">
              <Type className="w-4 h-4 mr-2" />
              <Label className="font-medium">Typography</Label>
            </div>
            
            {/* Font Family */}
            <div className="space-y-3 mb-6">
              <Label className="text-sm">Font Family</Label>
              <div className="grid grid-cols-1 gap-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateCustomization('fontFamily', font.id as any)}
                    className={`flex items-center justify-between p-3 rounded border text-left transition-colors ${
                      localCustomizations.fontFamily === font.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{font.name}</div>
                      <div className="text-xs text-muted-foreground">{font.preview}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <Label className="text-sm">
                Font Size: {localCustomizations.fontSize}pt
              </Label>
              <Slider
                value={[localCustomizations.fontSize]}
                onValueChange={([value]) => updateCustomization('fontSize', value)}
                min={10}
                max={16}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small (10pt)</span>
                <span>Standard (12pt)</span>
                <span>Large (16pt)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Layout */}
          <div>
            <div className="flex items-center mb-4">
              <Layout className="w-4 h-4 mr-2" />
              <Label className="font-medium">Layout</Label>
            </div>

            {/* Header Style */}
            <div className="space-y-3 mb-6">
              <Label className="text-sm">Header Style</Label>
              <div className="grid grid-cols-1 gap-2">
                {headerStyles
                  .filter(style => restrictions.allowedHeaders.includes(style.id))
                  .map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateCustomization('headerStyle', style.id as any)}
                    className={`flex items-center justify-between p-3 rounded border text-left transition-colors ${
                      localCustomizations.headerStyle === style.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-3">
              <Label className="text-sm">
                Section Spacing: {localCustomizations.sectionSpacing}x
              </Label>
              <Slider
                value={[localCustomizations.sectionSpacing]}
                onValueChange={([value]) => updateCustomization('sectionSpacing', value)}
                min={restrictions.minSpacing}
                max={2.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Compact</span>
                <span>Standard</span>
                <span>Spacious</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Visual Options */}
          <div>
            <div className="flex items-center mb-4">
              <Settings className="w-4 h-4 mr-2" />
              <Label className="font-medium">Visual Options</Label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Show Icons</Label>
                  <p className="text-xs text-muted-foreground">
                    Display icons next to section headers
                  </p>
                </div>
                <Switch
                  checked={localCustomizations.showIcons}
                  onCheckedChange={(checked) => updateCustomization('showIcons', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Show Borders</Label>
                  <p className="text-xs text-muted-foreground">
                    Add subtle borders between sections
                  </p>
                </div>
                <Switch
                  checked={localCustomizations.showBorders}
                  onCheckedChange={(checked) => updateCustomization('showBorders', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template-specific recommendations */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">
            💡 {templateId.charAt(0).toUpperCase() + templateId.slice(1)} Template Tips
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {templateId === 'professional' && (
              <>
                <li>• Use blue or minimal color schemes for corporate roles</li>
                <li>• Keep font size between 11-13pt for optimal readability</li>
                <li>• Left-aligned headers work best for ATS systems</li>
              </>
            )}
            {templateId === 'creative' && (
              <>
                <li>• Bold colors like purple or green showcase creativity</li>
                <li>• Slightly larger fonts (13-14pt) improve visual impact</li>
                <li>• Centered headers create balanced, modern layouts</li>
              </>
            )}
            {templateId === 'executive' && (
              <>
                <li>• Dark or minimal schemes convey executive presence</li>
                <li>• Increase section spacing for sophisticated look</li>
                <li>• Split headers emphasize leadership positioning</li>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateCustomizer;
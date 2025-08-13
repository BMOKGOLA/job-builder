import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Zap, CheckCircle, Download } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered ATS Optimization
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Build Your Perfect
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent block">
              ATS-Friendly Resume
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Create professional resumes that pass Applicant Tracking Systems with AI-powered 
            content generation, industry-specific keywords, and expert formatting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-hover transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Start Building Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              View Templates
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ATS Optimized</h3>
              <p className="text-white/70 leading-relaxed">
                Our AI ensures your resume passes through Applicant Tracking Systems with 95%+ success rate.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Content Generation</h3>
              <p className="text-white/70 leading-relaxed">
                Generate compelling content with industry-specific keywords powered by Google Flash 1.5 API.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multiple Formats</h3>
              <p className="text-white/70 leading-relaxed">
                Export your resume in PDF, DOCX, or HTML formats for maximum compatibility.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
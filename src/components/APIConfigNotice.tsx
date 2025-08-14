import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, ExternalLink } from 'lucide-react';

const APIConfigNotice = () => {
  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center text-warning">
          <Key className="w-5 h-5 mr-2" />
          Gemini API Configuration Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          To enable AI-powered resume optimization, you need to configure your Gemini API key.
        </p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Setup Instructions:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 ml-4">
            <li>1. Go to your Supabase project dashboard</li>
            <li>2. Navigate to Settings → Secrets</li>
            <li>3. Add a new secret with name: <code className="bg-muted px-1 rounded">GEMINI_API_KEY</code></li>
            <li>4. Set the value to: <code className="bg-muted px-1 rounded">AIzaSyAI5qePEY4cVNt8jUDDUrtUv-SVjDKlQ9E</code></li>
            <li>5. Save and redeploy your edge functions</li>
          </ol>
        </div>

        <Button 
          onClick={openSupabaseDashboard} 
          variant="outline" 
          size="sm"
          className="w-full"
        >
          Open Supabase Dashboard
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <strong>Note:</strong> Until configured, the app will use simulated AI responses for demonstration purposes.
        </div>
      </CardContent>
    </Card>
  );
};

export default APIConfigNotice;
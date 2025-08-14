import React from 'react';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

interface SecretFormProps {
  secretName: string;
  description: string;
  onConfigured?: () => void;
}

export const SecretForm: React.FC<SecretFormProps> = ({ secretName, description, onConfigured }) => {
  const handleConfigureSecret = () => {
    // This would normally open a Supabase secrets configuration modal
    // For now, we'll just notify that it should be configured in Supabase
    alert(`Please configure the ${secretName} secret in your Supabase project dashboard under Settings > Secrets.`);
    onConfigured?.();
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg border border-warning/20">
      <Key className="w-4 h-4 text-warning" />
      <div className="flex-1">
        <p className="text-sm font-medium">API Configuration Required</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button size="sm" onClick={handleConfigureSecret}>
        Configure
      </Button>
    </div>
  );
};
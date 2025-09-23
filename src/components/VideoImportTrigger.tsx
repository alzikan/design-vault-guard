import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VideoImportTrigger = () => {
  const [importing, setImporting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const runImport = async () => {
    setImporting(true);
    try {
      console.log('Starting video import...');
      
      const { data, error } = await supabase.functions.invoke('video-import');
      
      if (error) {
        console.error('Import error:', error);
        toast.error('Import failed: ' + error.message);
        return;
      }
      
      console.log('Import completed:', data);
      toast.success(`Video import completed: ${data.results.successful} successful, ${data.results.failed} failed`);
      
      if (data.results.errors && data.results.errors.length > 0) {
        console.log('Import errors:', data.results.errors);
      }
      
      setCompleted(true);
    } catch (error) {
      console.error('Failed to run import:', error);
      toast.error('Failed to run import');
    } finally {
      setImporting(false);
    }
  };

  if (completed) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-600 font-semibold">✅ Video import completed successfully!</p>
        <p className="text-sm text-muted-foreground mt-2">You can now delete this component.</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <Button 
        onClick={runImport}
        disabled={importing}
        size="lg"
      >
        {importing ? 'Importing Videos...' : 'Run Video Import (Click Once)'}
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        This will import 4 videos from your CSV file
      </p>
    </div>
  );
};

export default VideoImportTrigger;
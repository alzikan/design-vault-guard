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
      console.log('Starting video import with updated URLs...');
      
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
      
      // Refresh the page to show new videos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to run import:', error);
      toast.error('Failed to run import');
    } finally {
      setImporting(false);
    }
  };

  if (completed) {
    return (
      <div className="p-4 text-center bg-green-50 border border-green-200 rounded-lg mb-4">
        <p className="text-green-600 font-semibold">✅ Video import completed successfully!</p>
        <p className="text-sm text-muted-foreground mt-2">Page will refresh automatically...</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-center bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <Button 
        onClick={runImport}
        disabled={importing}
        size="lg"
        className="mb-2"
      >
        {importing ? 'Importing 5 Videos...' : 'Import Videos with New URLs'}
      </Button>
      <p className="text-sm text-muted-foreground">
        Will import 5 videos with working alzakan.net URLs
      </p>
    </div>
  );
};

export default VideoImportTrigger;
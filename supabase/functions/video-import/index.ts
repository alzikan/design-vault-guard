import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoData {
  title: string;
  video_url: string;
}

async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 10000 });
    return response.ok;
  } catch (error) {
    console.log(`URL validation failed for ${url}:`, error);
    return false;
  }
}

function parseCSVLine(line: string): VideoData | null {
  const parts = line.split(',');
  if (parts.length < 2) return null;
  
  return {
    title: parts[0].trim(),
    video_url: parts[1].trim()
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

const csvData = `Video Name,Video URL
درس 1: رسم كرة زجاجية,https://alzakan.net/videos/lesson1.mp4
درس 2: رسم برتقالة,https://alzakan.net/videos/lesson2.mp4
درس 3: رسم الشاطئ,https://alzakan.net/videos/lesson3.mp4
درس 5: رسم كرة و الظل,https://alzakan.net/videos/lesson5.mp4`;

    console.log('Starting video import');

    // Parse CSV data
    const lines = csvData.split('\n').filter(line => line.trim() && !line.startsWith('Video Name'));
    
    console.log(`Found ${lines.length} video entries in CSV`);

    const results = {
      total: lines.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`Processing entry ${i + 1}/${lines.length}`);
      
      try {
        const video = parseCSVLine(line);
        if (!video) {
          results.errors.push(`Line ${i + 1}: Failed to parse CSV line`);
          results.failed++;
          continue;
        }

        console.log(`Validating URL for: ${video.title}`);
        
        // Validate video URL
        const urlValid = await validateUrl(video.video_url);

        if (!urlValid) {
          results.errors.push(`${video.title}: Video URL is invalid`);
          results.failed++;
          continue;
        }
        
        // Insert into database
        const { error } = await supabase
          .from('videos')
          .insert({
            title: video.title,
            video_url: video.video_url,
            category: 'دروس الرسم', // Arabic for "Drawing Lessons"
            is_published: true,
            is_featured: false
          });

        if (error) {
          console.error(`Database error for ${video.title}:`, error);
          results.errors.push(`${video.title}: Database insertion failed - ${error.message}`);
          results.failed++;
        } else {
          console.log(`Successfully imported: ${video.title}`);
          results.successful++;
        }

      } catch (error) {
        console.error(`Error processing entry ${i + 1}:`, error);
        results.errors.push(`Entry ${i + 1}: ${error.message}`);
        results.failed++;
      }
    }

    console.log('Video import completed:', results);

    return new Response(
      JSON.stringify({
        message: 'Video import completed',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Video import function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Video import failed', 
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
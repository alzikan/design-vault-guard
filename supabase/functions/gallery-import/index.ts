import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ArtworkData {
  thumb_url: string;
  title: string;
  year: string;
  full_image_url: string;
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

function parseCSVLine(line: string): ArtworkData | null {
  // Handle multiline titles by splitting on comma but preserving quoted content
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  
  if (parts.length < 4) return null;
  
  return {
    thumb_url: parts[0].replace(/"/g, ''),
    title: parts[1].replace(/"/g, '').replace(/\s+/g, ' ').trim(),
    year: parts[2].replace(/"/g, '').replace(/\s+/g, ''),
    full_image_url: parts[3].replace(/"/g, '')
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

    const { testMode = true } = await req.json();
    
    console.log(`Starting gallery import - Test mode: ${testMode}`);

    // Read CSV file
    const csvContent = await Deno.readTextFile('./final_images.csv');
    const lines = csvContent.split('\n').filter(line => line.trim() && !line.startsWith('thumb_url'));
    
    console.log(`Found ${lines.length} artwork entries in CSV`);

    // In test mode, only process first 2 entries
    const linesToProcess = testMode ? lines.slice(0, 2) : lines;
    
    const results = {
      total: linesToProcess.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < linesToProcess.length; i++) {
      const line = linesToProcess[i];
      console.log(`Processing entry ${i + 1}/${linesToProcess.length}`);
      
      try {
        const artwork = parseCSVLine(line);
        if (!artwork) {
          results.errors.push(`Line ${i + 1}: Failed to parse CSV line`);
          results.failed++;
          continue;
        }

        console.log(`Validating URLs for: ${artwork.title}`);
        
        // Validate both URLs
        const [thumbValid, fullValid] = await Promise.all([
          validateUrl(artwork.thumb_url),
          validateUrl(artwork.full_image_url)
        ]);

        if (!thumbValid && !fullValid) {
          results.errors.push(`${artwork.title}: Both thumbnail and full image URLs are invalid`);
          results.failed++;
          continue;
        }

        // Use valid URL for image_url, prefer full image
        const imageUrl = fullValid ? artwork.full_image_url : artwork.thumb_url;
        
        // Clean and parse year
        const yearNumber = parseInt(artwork.year) || null;
        
        // Insert into database
        const { error } = await supabase
          .from('artworks')
          .insert({
            title: artwork.title,
            image_url: imageUrl,
            created_year: yearNumber,
            artist_name: 'Ibrahim al Zikan',
            is_available: true,
            is_featured: false
          });

        if (error) {
          console.error(`Database error for ${artwork.title}:`, error);
          results.errors.push(`${artwork.title}: Database insertion failed - ${error.message}`);
          results.failed++;
        } else {
          console.log(`Successfully imported: ${artwork.title}`);
          results.successful++;
        }

      } catch (error) {
        console.error(`Error processing entry ${i + 1}:`, error);
        results.errors.push(`Entry ${i + 1}: ${error.message}`);
        results.failed++;
      }
    }

    console.log('Import completed:', results);

    return new Response(
      JSON.stringify({
        message: testMode ? 'Test import completed' : 'Full import completed',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Import function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Import failed', 
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
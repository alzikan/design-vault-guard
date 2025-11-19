import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, contentId } = await req.json();

    console.log('Incrementing view count:', { contentType, contentId });

    // Validate inputs
    if (!contentType || !contentId) {
      throw new Error('Missing contentType or contentId');
    }

    if (contentType !== 'video' && contentType !== 'artwork') {
      throw new Error('Invalid contentType. Must be "video" or "artwork"');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine RPC function name based on content type
    const rpcFunction = contentType === 'video' 
      ? 'increment_video_view_count' 
      : 'increment_artwork_view_count';

    // Call the database function to increment view count atomically
    const { data, error } = await supabase
      .rpc(rpcFunction, { 
        [contentType === 'video' ? 'video_id' : 'artwork_id']: contentId 
      });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('View count updated successfully. New count:', data);

    return new Response(
      JSON.stringify({ success: true, viewCount: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in increment-view-count function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

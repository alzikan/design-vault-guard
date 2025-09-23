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

    let testMode = true;
    try {
      const body = await req.json();
      testMode = body.testMode !== undefined ? body.testMode : true;
    } catch (error) {
      // No JSON body provided, use default testMode = true
      console.log('No JSON body provided, using default testMode = true');
    }
    
const csvData = `thumb_url,title,year,full_image_url
https://alzakan.net/images/Holy%20mohsque/iairb01.jpg,إلى ا لمسجد الحرام,1412,https://alzakan.net/images/to%20the%20holy%20mosque/001To%20Holy%20mohsqueX.jpg
https://alzakan.net/images/Incense/iairb02IncenseS.jpg,ا لبخور,1412,https://alzakan.net/images/Incense/002IntenseX.jpg
https://alzakan.net/images/Usury/iairb03UsuryS.jpg,ا لربا,1413,https://alzakan.net/images/Usury/003UsuryX.jpg
https://alzakan.net/images/holy%20book/iairb04The%20holy%20book.jpg,ا لقرآن,1412,https://alzakan.net/images/holy%20book/004The%20holy%20bookholy%20bookX.jpg
https://alzakan.net/images/Aflower/iairb05AflowerS.jpg,ز هور,1412,https://alzakan.net/images/Aflower/005AflowerX.jpg
https://alzakan.net/images/The%20bout%20&%20the%20night/ioilpaint028.jpg,"ا لقارب 
		واليل",1407,https://alzakan.net/images/The%20bout%20&%20the%20night/028The%20bout%20&%20the%20night.jpg
https://alzakan.net/images/Water%20falls1/ioilpaint021S.jpg,ا لشلال,1407,https://alzakan.net/images/Water%20falls2/020Water%20falls2.jpg
https://alzakan.net/images/An%20nakhal%20tools/ioilpaint030.jpg,ا لنّخّال,1407,https://alzakan.net/images/An%20nakhal%20tools/030An%20nakhal%20toolsxX.jpg
https://alzakan.net/images/Al-Majlis%20An%20old1/ioilpaint026Sٍ.jpg,"ا لمجلس 
		: حارة قديمة",1407,https://alzakan.net/images/Al-Majlis%20An%20old1/026Al-Majlis%20An%20oldX.jpg
https://alzakan.net/images/Lebanon %20A%20torn%20nation/ioilpaint018S.jpg,"أ مة 
		تتمزق",1407,https://alzakan.net/images/Lebanon%C2%A0%20A%20torn%20nation/018Lebanon%C2%A0%20A%20torn%20nation.jpg
https://alzakan.net/images/Pride/ioilpaint035.jpg,ش موخ,140 7,https://alzakan.net/images/Pride/035Pride.jpg
https://alzakan.net/images/The%20subway/ioilpaint034.jpg,ا لنفق,1407,https://alzakan.net/images/The%20subway/034The%20subwayX.jpg
https://alzakan.net/images/OldTOYOTA/toyotas.jpg,تويوتا قديم,1407,https://alzakan.net/images/OldTOYOTA/TOYOTYX.jpg
https://alzakan.net/images/War%20of%20stones /ioilpaint031.jpg,"ح رب 
		الحجارة",140 8,https://alzakan.net/images/Pride/035Pride.jpg
https://alzakan.net/images/An%20old%20neighborhood2/014An%20old%20neighborhoodS.JPG,"س وق 
		قديم",1408,https://alzakan.net/images/An%20old%20neighborhood2/014An%20old%20neighborhood2.jpg
https://alzakan.net/images/The%20near%20Past/ioilpaint017S.JPG,"ا لأمس 
		القريب",1408,https://alzakan.net/images/The%20near%20Past/017The%20near%20Past.jpg
https://alzakan.net/images/The%20bout%20&%20the%20moon/ioilpaint029.jpg,"ا لقارب 
		والقمر",1411,https://alzakan.net/images/The%20bout%20&%20the%20moon/The%20bout%20&%20the%20moon.jpg
https://alzakan.net/images/A%20torn%20down%20house/ioilpaint033.jpg,"ب يت 
		متهدم",1411,https://alzakan.net/images/A%20torn%20down%20house/033A%20torn%20down%20house.jpg
https://alzakan.net/images/The%20shell/ioilpaint027S.jpg,"ا لغزو 
		الفكري",1411,https://alzakan.net/images/The%20shell/027The%20shellX.jpg
https://alzakan.net/images/The%20beach1/ioilpaint022.jpg,ا لشاطئ,1412,https://alzakan.net/images/The%20beach1/022The%20beach1.jpg
https://alzakan.net/images/Water%20falls2/ioilpaint020S.jpg,ا لشلال,1412,https://alzakan.net/images/Water%20falls1/021Water%20falls1.jpg
https://alzakan.net/images/The%20farm1/ioilpaint025S.jpg,ا لمزرعة,1414,https://alzakan.net/images/The%20farm1/025The%20farm1X.jpg
https://alzakan.net/images/the%20lighting/ioilpaint016S.jpg,ا لبارق,1415,https://alzakan.net/images/the%20lighting/016The%20lightingX.jpg
https://alzakan.net/images/Mountains/ioilpaint032.jpg,ج بال,1415,https://alzakan.net/images/Mountains/032Mountains.jpg
https://alzakan.net/images/Spring/ioilpaint023SpringS.jpg,ا لربيع,1415,https://alzakan.net/images/Spring/023SpringX.jpg
https://alzakan.net/images/The%20south/ioilpaint015S.jpg,ا لجنوب,141 7,https://alzakan.net/images/The%20south/015The%20southX.jpg
https://alzakan.net/images/South%20&sunset/ioilpaint024S.jpg,"ا لجنوب 
		والغروب",1418,https://alzakan.net/images/South%20&sunset/024MountainsX.jpg
https://alzakan.net/images/Valley3/ioilpaint036a.jpg,الشعيب,1428,https://alzakan.net/images/Valley1/036aValley1.jpg
https://alzakan.net/images/Hail/Hail.jpg,من حائل,1435,https://alzakan.net/images/Hail/Hail.jpg
https://alzakan.net/images/After%20rain/After%20the%20rain%20S.jpg,بعد المطر,1435,https://alzakan.net/images/After%20rain/After%20the%20rain.jpg
https://alzakan.net/images/sunset-in-the-south/sunset-in-the-south-s.jpg,الغروب في الجنوب,1436,https://alzakan.net/images/sunset-in-the-south/sunset-in-the-south-X.jpg
https://alzakan.net/images/Al7aet/Al7aetIcon.jpg,المزرعة 2,1436,https://alzakan.net/images/Al7aet/Al7aet.jpg
https://alzakan.net/images/The%20Arabian%20Peninsula%20in%20the%20future/The-Arabian-Peninsula-in-the-future-Iqun.jpg,ا لجزيرة العربية مستقبلا,1436,https://alzakan.net/images/The%20Arabian%20Peninsula%20in%20the%20future/The%20Arabian%20Peninsula%20in%20the%20future..jpg
https://alzakan.net/images/ButGod/ButGods.jpg,والله متم نوره,1436,https://alzakan.net/images/ButGod/ButGodX.jpg
https://alzakan.net/images/BeachPepple/BeachPeppleS.jpg,شاطئ حصوي,1436,https://alzakan.net/images/BeachPepple/BeachPepple.jpg
https://alzakan.net/images/Rock%20Beach2/Rock-beach-Icon.jpg,شاطئ صخري,1436,https://alzakan.net/images/Rock%20Beach2/RockBeach.jpg
https://alzakan.net/images/LastRain/Last-rains.jpg,آخر المطر,1436,https://alzakan.net/images/LastRain/Last-rains.jpg
https://alzakan.net/images/The%20camp2/The%20camps.jpg,المخيم,1436,https://alzakan.net/images/The%20camp2/The%20campX.jpg
https://alzakan.net/images/Sea&mountains/Sea&mountainsS.jpg,البحر والجبال,1436,https://alzakan.net/images/Sea&mountains/Sea&mountainsX.jpg
https://alzakan.net/images/WFall3/WFallss.jpg,الشلال,1437,https://alzakan.net/images/WFall3/WFallsX.jpg
https://alzakan.net/images/A%20torn%20down%20house%202/A%20torn%20down%20house%202%20icon.jpg,بيت طيني متهدم,1437,https://alzakan.net/images/A%20torn%20down%20house%202/A%20torn%20down%20house%202%20X.jpg
https://alzakan.net/images/pollution/pollutionicon.jpg,التلوث,1438,https://alzakan.net/images/pollution/pollutionX.jpg
https://alzakan.net/images/A%20good%20tree/A%20good%20treeS.jpg,الشجرة الطيبة,1438,https://alzakan.net/images/A%20good%20tree/A%20good%20treeX.jpg
https://alzakan.net/links/PIC%20gallery/South%20travel/South%20travel%20s.jpg,رحلة إلى الجنوب,1439,https://alzakan.net/images/South%20travel/South%20travelX.jpg
https://alzakan.net/images/Valley2/Valley2s.jpg,الوادي,1439,https://alzakan.net/images/Valley2/Valley2X.jpg
https://alzakan.net/images/theVallage/the%20villages.jpg,القرية,1439,https://alzakan.net/images/the%20village/the%20villageX.jpg
https://alzakan.net/images/City%20lights/City%20lights.jpg,أضواء المدينة,1440,https://alzakan.net/images/City%20lights/City%20lightsX.jpg
https://alzakan.net/images/hood%20folk/Hood%20folks.jpg,قوم هود,1441,https://alzakan.net/images/hood%20folk/Hood%20folksX.jpg
https://alzakan.net/images/hailstoness/hailstoness1%20.jpg,البرد,1441,https://alzakan.net/images/hailstoness/hailstonesX2.jpg
https://alzakan.net/images/Nouh%201442/nouh%20iconS.jpg,وفار التنور,1442,https://alzakan.net/images/Nouh%201442/nouh%20X.jpg
https://alzakan.net/images/fishermen/Ficon.jpg,الصيادون,1443,https://alzakan.net/images/fishermen/01.jpg
https://alzakan.net/images/Ahl%20alfajr/iconc%20Alfar.jpg,أهل الفجر,1444,https://alzakan.net/images/Ahl%20alfajr/Ail%20alfajr.jpg
https://alzakan.net/images/Al7uj/Al7uj/Al7uj%20icons.jpg,الحج,1445,https://alzakan.net/images/Al7uj/Al7uj/Al7uj%20XA.jpg`;

    console.log(`Starting gallery import - Test mode: ${testMode}`);

    // Parse CSV data
    const lines = csvData.split('\n').filter(line => line.trim() && !line.startsWith('thumb_url'));
    
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
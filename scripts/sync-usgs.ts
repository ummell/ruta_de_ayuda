/**
 * Script to sync earthquake data from USGS
 * Run: npx tsx scripts/sync-usgs.ts
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const USGS_FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';

interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    sig: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

async function syncEarthquakes() {
  console.log('Fetching USGS data...');

  const response = await fetch(USGS_FEED_URL, {
    headers: { 'User-Agent': 'RutaDeAyuda/1.0' },
  });

  if (!response.ok) {
    throw new Error(`USGS API error: ${response.status}`);
  }

  const data = await response.json();
  const features: EarthquakeFeature[] = data.features || [];

  // Filter for Colombia
  const colombiaQuakes = features.filter((f) => {
    const [lon, lat] = f.geometry.coordinates;
    return lat >= -5 && lat <= 15 && lon >= -85 && lon <= -65;
  });

  console.log(`Found ${colombiaQuakes.length} earthquakes in Colombia region`);

  // In a real implementation, you might want to store these in a table
  // For now, we just log them
  for (const quake of colombiaQuakes) {
    console.log(`  ${quake.properties.mag} - ${quake.properties.place}`);
  }

  console.log('Sync complete!');
}

syncEarthquakes().catch(console.error);

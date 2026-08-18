import { NextRequest, NextResponse } from 'next/server';

const USGS_FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    url: string;
    tsunami: number;
    sig: number | null;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

interface UsgsGeoJson {
  features?: UsgsFeature[];
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(USGS_FEED_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RutaDeAyuda/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = (await response.json()) as UsgsGeoJson;

    const earthquakes = (data.features || []).map((feature) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: new Date(feature.properties.time).toISOString(),
      coordinates: {
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        depth: feature.geometry.coordinates[2],
      },
      url: feature.properties.url,
      tsunami: feature.properties.tsunami === 1,
      significance: feature.properties.sig,
    }));

    const colombiaQuakes = earthquakes.filter(
      (q) =>
        q.coordinates.latitude >= -5 &&
        q.coordinates.latitude <= 15 &&
        q.coordinates.longitude >= -85 &&
        q.coordinates.longitude <= -65
    );

    return NextResponse.json({
      earthquakes: colombiaQuakes,
      total: colombiaQuakes.length,
      lastUpdate: new Date().toISOString(),
      source: 'USGS',
    });
  } catch (error) {
    console.error('USGS fetch error:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener datos sísmicos',
        detail: error instanceof Error ? error.message : 'Error desconocido',
        earthquakes: [],
      },
      { status: 500 }
    );
  }
}

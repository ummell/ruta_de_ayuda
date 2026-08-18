export interface EarthquakeFeature {
  type: 'Feature';
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz: number;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number;
    dmin: number;
    rms: number;
    gap: number;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [lon, lat, depth]
  };
  id: string;
}

export interface EarthquakeGeoJSON {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: Date;
  coordinates: {
    longitude: number;
    latitude: number;
    depth: number;
  };
  url: string;
  tsunami: boolean;
  significance: number;
}

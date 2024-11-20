import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const MILES_TO_METERS = 1609.34;

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is missing');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Google Maps API key is not configured',
        details: 'Environment variable GOOGLE_MAPS_API_KEY is not set'
      }),
    };
  }

  try {
    const { lat, lng, radius } = JSON.parse(event.body || '{}');

    if (!lat || !lng || !radius) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          received: { lat, lng, radius }
        }),
      };
    }

    const radiusMeters = radius * MILES_TO_METERS;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=establishment&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Fetching from Google Places API...');
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places API response not OK:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (data.error_message) {
      console.error('Google Places API error:', data.error_message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Google Places API error',
          details: data.error_message
        }),
      };
    }

    // Calculate population estimate based on the number and types of places
    const places = data.results || [];
    console.log(`Found ${places.length} places in the area`);
    
    const basePopulation = places.length * 1000; // Basic multiplier
    const populationEstimate = Math.round(basePopulation / 100) * 100; // Round to nearest hundred

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        population: populationEstimate,
        placeCount: places.length
      }),
    };
  } catch (error) {
    console.error('Population estimation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to estimate population',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
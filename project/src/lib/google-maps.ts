export async function getPopulationEstimate(
  center: [number, number],
  radiusMiles: number
): Promise<number> {
  try {
    const response = await fetch('/.netlify/functions/getPopulation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lng: center[0],
        lat: center[1],
        radius: radiusMiles,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch population data');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.population;
  } catch (error) {
    console.error('Population estimation error:', error);
    return 0;
  }
}
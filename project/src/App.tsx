import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { LocationDisplay } from '@/components/LocationDisplay';
import { SearchHistory } from '@/components/SearchHistory';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { StorageManager } from '@/lib/storage';
import { LocationData } from '@/lib/types';
import { analyzeLocation } from '@/lib/gpt';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required. Please set VITE_MAPBOX_TOKEN in your environment variables.');
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [favorites, setFavorites] = useState<LocationData[]>([]);
  const { toast } = useToast();
  const storage = StorageManager.getInstance();

  useEffect(() => {
    setRecentSearches(storage.getRecentSearches());
    setFavorites(storage.getFavorites());
  }, []);

  const handleSearch = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_TOKEN}&country=us&types=address&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Address not found in the United States');
      }

      // Verify the location is within US bounds
      const [longitude, latitude] = data.features[0].center;
      if (
        longitude < -167.276413 || longitude > -52.233040 ||
        latitude < 15.436089 || latitude > 72.553992
      ) {
        throw new Error('Location must be within the United States');
      }

      const formattedAddress = data.features[0].place_name;

      const locationData: LocationData = {
        address: formattedAddress,
        coordinates: [longitude, latitude],
        timestamp: Date.now(),
      };

      setLocation(locationData);
      setIsAnalyzing(true);
      
      const analysis = await analyzeLocation(formattedAddress, [longitude, latitude]);
      
      const updatedLocation = {
        ...locationData,
        analysis,
      };

      setLocation(updatedLocation);
      storage.addSearch(updatedLocation);
      setRecentSearches(storage.getRecentSearches());

      if (analysis.error) {
        toast({
          title: 'Analysis Warning',
          description: analysis.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch location data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleSelectLocation = (location: LocationData) => {
    setLocation(location);
  };

  const handleToggleFavorite = (address: string) => {
    const isFavorite = storage.toggleFavorite(address);
    setRecentSearches(storage.getRecentSearches());
    setFavorites(storage.getFavorites());

    toast({
      title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      description: address,
    });
  };

  const handleClearHistory = () => {
    storage.clearHistory();
    setRecentSearches([]);
    toast({
      title: 'History cleared',
      description: 'Your search history has been cleared.',
    });
  };

  const handleClearFavorites = () => {
    storage.clearFavorites();
    setFavorites([]);
    setRecentSearches(storage.getRecentSearches());
    toast({
      title: 'Favorites cleared',
      description: 'Your favorite locations have been cleared.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Location Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a US address to analyze its location and get detailed insights
            about the area.
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {location && (
          <div className="mt-8">
            <LocationDisplay
              location={location}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        <div className="mt-8">
          <SearchHistory
            recentSearches={recentSearches}
            favorites={favorites}
            onSelectLocation={handleSelectLocation}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
            onClearFavorites={handleClearFavorites}
          />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
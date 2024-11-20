import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map } from './Map';
import { LocationAnalysis } from './LocationAnalysis';
import { LocationData } from '@/lib/types';

interface LocationDisplayProps {
  location: LocationData;
  isAnalyzing?: boolean;
}

export function LocationDisplay({ location, isAnalyzing = false }: LocationDisplayProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{location.address}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Map address={location.address} coordinates={location.coordinates} />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/${encodeURIComponent(
                    location.address
                  )}`,
                  '_blank'
                );
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
          </div>
        </CardContent>
      </Card>

      {(location.analysis || isAnalyzing) && (
        <LocationAnalysis
          analysis={location.analysis || {
            rankings: { national: 0, state: 0, local: 0 },
            demographicProfile: '',
            lifestyleTrends: '',
            relevantIndustries: '',
            physicalCharacteristics: '',
            typeOfCenter: '',
            nearbyBusinesses: '',
          }}
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
}
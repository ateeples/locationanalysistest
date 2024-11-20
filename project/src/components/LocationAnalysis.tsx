import {
  Users,
  TrendingUp,
  Building2,
  MapPin,
  Store,
  Building,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { LocationAnalysis as LocationAnalysisType } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RankingBadge } from './RankingBadge';
import { Separator } from '@/components/ui/separator';

interface LocationAnalysisProps {
  analysis: LocationAnalysisType;
  isLoading?: boolean;
}

export function LocationAnalysis({
  analysis,
  isLoading = false,
}: LocationAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-2/3 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (analysis.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{analysis.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Location Analysis</span>
          <div className="flex gap-4">
            <RankingBadge
              type="area"
              label="Area Type"
              value={analysis.rankings.areaType.value}
            />
            <RankingBadge
              type="population"
              label="Est. Population"
              value={analysis.rankings.population.value}
            />
          </div>
        </CardTitle>
        <CardDescription>
          Analysis for {analysis.location.name || analysis.location.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <Users className="h-4 w-4" />
                Demographic Profile
              </h4>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis.demographic_profile}
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <TrendingUp className="h-4 w-4" />
                Lifestyle & Cultural Trends
              </h4>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis.lifestyle_trends}
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <Building2 className="h-4 w-4" />
                Relevant Industries
              </h4>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis.relevant_industries}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="h-4 w-4" />
                Physical Characteristics
              </h4>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis.physical_characteristics}
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <Store className="h-4 w-4" />
                Type of Center
              </h4>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis.type_of_center}
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <Building className="h-4 w-4" />
                Nearby Businesses
              </h4>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis.nearby_businesses}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground italic w-full text-center mt-4">
          Created by Generative AI - some details may be inaccurate
        </p>
      </CardFooter>
    </Card>
  );
}
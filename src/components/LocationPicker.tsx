
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  initialLocation?: string;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = '',
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchInput, setSearchInput] = useState(initialLocation);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { toast } = useToast();
  const { apiKey, loading: apiKeyLoading } = useGoogleMaps();

  useEffect(() => {
    if (!apiKey || apiKeyLoading) return;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (!mapRef.current) return;

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        setMap(mapInstance);
        setIsMapLoaded(true);

        // Add click listener to map
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            placeMarker(event.latLng, mapInstance);
          }
        });

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              mapInstance.setCenter(pos);
            },
            () => {
              console.log('Error: The Geolocation service failed.');
            }
          );
        }

        // If there's an initial location, search for it
        if (initialLocation) {
          setTimeout(() => searchLocation(), 1000);
        }

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast({
          variant: "destructive",
          title: "Maps Error",
          description: "Failed to load Google Maps. Please check your API key.",
        });
      }
    };

    initMap();
  }, [apiKey, apiKeyLoading, initialLocation, toast]);

  const placeMarker = (location: google.maps.LatLng, mapInstance: google.maps.Map) => {
    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      draggable: true
    });

    setMarker(newMarker);

    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        setSearchInput(address);
        onLocationSelect({
          address,
          lat: location.lat(),
          lng: location.lng()
        });
      }
    });

    // Add drag listener
    newMarker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        geocoder.geocode({ location: event.latLng }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            setSearchInput(address);
            onLocationSelect({
              address,
              lat: event.latLng!.lat(),
              lng: event.latLng!.lng()
            });
          }
        });
      }
    });
  };

  const searchLocation = () => {
    if (!map || !searchInput.trim()) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);
        placeMarker(location, map);
      } else {
        toast({
          variant: "destructive",
          title: "Location not found",
          description: "Please try a different search term.",
        });
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchLocation();
    }
  };

  if (apiKeyLoading) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map configuration...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Google Maps not configured</p>
          <p className="text-sm text-gray-400">Please add your Google Maps API key</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for a location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button 
          type="button" 
          onClick={searchLocation}
          variant="outline"
          disabled={!isMapLoaded}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border-2 border-gray-200 dark:border-gray-700"
        style={{ minHeight: '256px' }}
      />
      
      {!isMapLoaded && apiKey && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading map...
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Click on the map or search to select a location
      </p>
    </div>
  );
};

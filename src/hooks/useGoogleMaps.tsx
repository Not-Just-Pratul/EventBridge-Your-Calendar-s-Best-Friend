
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGoogleMaps = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('maps-config');
        
        if (error) throw error;
        
        if (data?.apiKey) {
          setApiKey(data.apiKey);
          // Set it globally for the Google Maps loader
          (window as any).GOOGLE_MAPS_API_KEY = data.apiKey;
        }
      } catch (error: any) {
        console.error('Error fetching Google Maps API key:', error);
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Failed to load Google Maps configuration. Please ensure the API key is set in Supabase secrets.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, [toast]);

  return { apiKey, loading };
};

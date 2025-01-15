import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Intervention } from '../types/database';

export const useInterventions = (childId?: string) => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        let query = supabase.from('interventions').select('*');
        
        if (childId) {
          query = query.eq('childId', childId);
        }

        const { data, error } = await query.order('startDate', { ascending: true });

        if (error) throw error;
        setInterventions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, [childId]);

  const addIntervention = async (intervention: Omit<Intervention, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .insert([intervention])
        .select()
        .single();

      if (error) throw error;
      setInterventions(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return { interventions, loading, error, addIntervention };
};

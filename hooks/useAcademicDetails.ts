// hooks/useAcademicDetails.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { studentService } from '@/services/student.service';
import { AcademicResponse } from '@/types/auth';
import { useAuthContext } from '@/contexts/AuthContext';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAcademicDetails = () => {
  const [academicData, setAcademicData] = useState<AcademicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken, isLoading: authLoading } = useAuthContext();

  const getCacheKey = useCallback(() => {
    return `academicData-${user?.id}`;
  }, [user?.id]);

  const getCachedData = useCallback(() => {
    const cacheKey = getCacheKey();
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const isStale = Date.now() - timestamp > CACHE_TTL;
    
    return isStale ? null : data;
  }, [getCacheKey]);

  const saveToCache = useCallback((data: AcademicResponse) => {
    const cacheKey = getCacheKey();
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }, [getCacheKey]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!accessToken || !user?.id) {
        throw new Error('Please log in to view academic information');
      }

      // Check cache first unless forcing refresh
      const cachedData = forceRefresh ? null : getCachedData();
      if (cachedData) {
        setAcademicData(cachedData);
        return;
      }

      // Fetch fresh data
      const freshData = await studentService.getAcademicDetails(user.userId, accessToken);
      setAcademicData(freshData);
      saveToCache(freshData);

    } catch (err) {
      const cachedData = getCachedData();
      if (cachedData) {
        setAcademicData(cachedData);
        setError('Using cached data. ' + (err instanceof Error ? err.message : 'Failed to refresh'));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch academic details');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, user?.id, getCachedData, saveToCache]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (user?.id && accessToken && !authLoading) {
      fetchData();
    }
  }, [user?.id, accessToken, authLoading, fetchData]);

  return {
    academicData: academicData?.data[0] || null,
    loading: loading || authLoading,
    error,
    refresh
  };
};
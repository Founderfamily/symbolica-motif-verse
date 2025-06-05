
import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { InterestGroup } from '@/types/interest-groups';
import { supabase } from '@/integrations/supabase/client';

const GROUPS_PER_PAGE = 8;

interface PaginatedGroupsResult {
  groups: InterestGroup[];
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export const usePaginatedGroups = (searchQuery?: string): PaginatedGroupsResult => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['groups', 'paginated', searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('interest_groups')
        .select('*')
        .order('name')
        .range(pageParam * GROUPS_PER_PAGE, (pageParam + 1) * GROUPS_PER_PAGE - 1);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: groups, error } = await query;

      if (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }

      return {
        groups: groups || [],
        nextPage: groups && groups.length === GROUPS_PER_PAGE ? pageParam + 1 : null
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const groups = data?.pages.flatMap(page => page.groups) || [];

  return {
    groups,
    hasNextPage: !!hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  };
};

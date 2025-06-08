import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Share2, Plus, Eye, Folder, FileText, MessageCircle, Send, Reply, ExternalLink } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupDiscovery, DiscoveryComment } from '@/types/interest-groups';
import { getGroupDiscoveries } from '@/services/communityService';
import { likeDiscovery, getDiscoveryComments, createDiscoveryComment, likeDiscoveryComment } from '@/services/discoveryService';
import { toast } from 'sonner';
import ShareDiscoveryDialog from './ShareDiscoveryDialog';
import EntityPreviewCard from './EntityPreviewCard';
import GroupSearch, { SearchFilters } from './GroupSearch';

interface EnhancedGroupDiscoveriesProps {
  groupId: string;
  isMember: boolean;
}

const EnhancedGroupDiscoveries: React.FC<EnhancedGroupDiscoveriesProps> = ({ groupId, isMember }) => {
  const [discoveries, setDiscoveries] = useState<GroupDiscovery[]>([]);
  const [filteredDiscoveries, setFilteredDiscoveries] = useState<GroupDiscovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDiscovery, setExpandedDiscovery] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, DiscoveryComment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const auth = useAuth();

  useEffect(() => {
    loadDiscoveries();
  }, [groupId, auth?.user]);

  useEffect(() => {
    filterDiscoveries();
  }, [discoveries, searchQuery, searchFilters]);

  const loadDiscoveries = async () => {
    try {
      const discoveriesData = await getGroupDiscoveries(groupId, auth?.user?.id);
      setDiscoveries(discoveriesData);
    } catch (error) {
      console.error('Error loading discoveries:', error);
      toast.error('Failed to load discoveries');
    } finally {
      setLoading(false);
    }
  };

  const filterDiscoveries = () => {
    let filtered = [...discoveries];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(discovery => 
        discovery.title.toLowerCase().includes(query) ||
        discovery.description?.toLowerCase().includes(query) ||
        discovery.sharer_profile?.username?.toLowerCase().includes(query) ||
        discovery.sharer_profile?.full_name?.toLowerCase().includes(query)
      );
    }

    // Apply entity type filter
    if (searchFilters.entityType && searchFilters.entityType !== 'all') {
      filtered = filtered.filter(discovery => discovery.entity_type === searchFilters.entityType);
    }

    // Apply time range filter
    if (searchFilters.timeRange && searchFilters.timeRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (searchFilters.timeRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(discovery => new Date(discovery.created_at) >= filterDate);
    }

    setFilteredDiscoveries(filtered);
  };

  const loadComments = async (discoveryId: string) => {
    if (comments[discoveryId] || loadingComments[discoveryId]) return;

    setLoadingComments(prev => ({ ...prev, [discoveryId]: true }));
    try {
      const commentsData = await getDiscoveryComments(discoveryId, auth?.user?.id);
      setComments(prev => ({ ...prev, [discoveryId]: commentsData }));
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(prev => ({ ...prev, [discoveryId]: false }));
    }
  };

  const handleLikeDiscovery = async (discoveryId: string) => {
    if (!auth?.user) {
      toast.error('Please log in to like discoveries');
      return;
    }

    try {
      await likeDiscovery(discoveryId, auth.user.id);
      setDiscoveries(prev => prev.map(discovery => {
        if (discovery.id === discoveryId) {
          return {
            ...discovery,
            likes_count: discovery.is_liked 
              ? discovery.likes_count - 1 
              : discovery.likes_count + 1,
            is_liked: !discovery.is_liked
          };
        }
        return discovery;
      }));
    } catch (error) {
      console.error('Error liking discovery:', error);
      toast.error('Failed to like discovery');
    }
  };

  const handleCreateComment = async (discoveryId: string) => {
    if (!auth?.user || !newComment[discoveryId]?.trim()) return;

    try {
      await createDiscoveryComment(discoveryId, auth.user.id, newComment[discoveryId]);
      setNewComment(prev => ({ ...prev, [discoveryId]: '' }));
      
      // Reload comments
      setComments(prev => ({ ...prev, [discoveryId]: [] }));
      await loadComments(discoveryId);
      
      // Update discovery comments count
      setDiscoveries(prev => prev.map(discovery => 
        discovery.id === discoveryId 
          ? { ...discovery, comments_count: discovery.comments_count + 1 }
          : discovery
      ));
      
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleCreateReply = async (discoveryId: string, parentCommentId: string) => {
    if (!auth?.user || !replyContent.trim()) return;

    try {
      await createDiscoveryComment(discoveryId, auth.user.id, replyContent, parentCommentId);
      setReplyContent('');
      setReplyingTo(null);
      
      // Reload comments
      setComments(prev => ({ ...prev, [discoveryId]: [] }));
      await loadComments(discoveryId);
      
      toast.success('Reply posted successfully');
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error('Failed to post reply');
    }
  };

  const handleLikeComment = async (commentId: string, discoveryId: string) => {
    if (!auth?.user) return;

    try {
      await likeDiscoveryComment(commentId, auth.user.id);
      
      // Update comment like status and count
      setComments(prev => ({
        ...prev,
        [discoveryId]: prev[discoveryId]?.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes_count: comment.is_liked 
                ? comment.likes_count - 1 
                : comment.likes_count + 1,
              is_liked: !comment.is_liked
            };
          }
          // Also check replies
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? {
                      ...reply,
                      likes_count: reply.is_liked 
                        ? reply.likes_count - 1 
                        : reply.likes_count + 1,
                      is_liked: !reply.is_liked
                    }
                  : reply
              )
            };
          }
          return comment;
        }) || []
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
    }
  };

  const toggleDiscoveryExpansion = (discoveryId: string) => {
    if (expandedDiscovery === discoveryId) {
      setExpandedDiscovery(null);
    } else {
      setExpandedDiscovery(discoveryId);
      if (!comments[discoveryId]) {
        loadComments(discoveryId);
      }
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'symbol':
        return <Eye className="h-4 w-4" />;
      case 'collection':
        return <Folder className="h-4 w-4" />;
      case 'contribution':
        return <FileText className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getEntityTypeLabel = (entityType: string) => {
    switch (entityType) {
      case 'symbol':
        return 'Symbol';
      case 'collection':
        return 'Collection';
      case 'contribution':
        return 'Contribution';
      default:
        return 'Item';
    }
  };

  const handleEntityNavigate = (entityType: string, entityId: string) => {
    const url = `/${entityType}s/${entityId}`;
    window.open(url, '_blank');
  };

  const CommentItem: React.FC<{ comment: DiscoveryComment; discoveryId: string; isReply?: boolean }> = ({ comment, discoveryId, isReply = false }) => (
    <div className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-slate-200 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={`https://avatar.vercel.sh/${comment.user_profile?.username || 'user'}.png`} 
            alt={comment.user_profile?.username || 'User'} 
          />
          <AvatarFallback>
            {comment.user_profile?.username?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-medium text-sm">
              {comment.user_profile?.full_name || comment.user_profile?.username || 'Unknown User'}
            </p>
            <span className="text-slate-500 text-xs">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-slate-900 text-sm mb-2">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleLikeComment(comment.id, discoveryId)}
              className={`text-slate-600 hover:text-red-600 h-6 px-2 ${comment.is_liked ? 'text-red-600' : ''}`}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.is_liked ? 'fill-current' : ''}`} />
              {comment.likes_count}
            </Button>
            {!isReply && auth?.user && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-slate-600 h-6 px-2"
              >
                <Reply className="h-3 w-3 mr-1" />
                <I18nText translationKey="community.reply">Reply</I18nText>
              </Button>
            )}
          </div>

          {replyingTo === comment.id && auth?.user && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => handleCreateReply(discoveryId, comment.id)}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-3 w-3 mr-1" />
                  <I18nText translationKey="community.reply">Reply</I18nText>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  <I18nText translationKey="common.cancel">Cancel</I18nText>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} discoveryId={discoveryId} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Share Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            <I18nText translationKey="community.sharedDiscoveries">Shared Discoveries</I18nText>
          </h3>
          <p className="text-sm text-slate-600">
            <I18nText translationKey="community.discoveriesDescription">
              Symbols, collections, and contributions shared by group members
            </I18nText>
          </p>
        </div>
        
        {isMember && auth?.user && (
          <ShareDiscoveryDialog groupId={groupId} onDiscoveryShared={loadDiscoveries}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <I18nText translationKey="community.shareDiscovery">Share Discovery</I18nText>
            </Button>
          </ShareDiscoveryDialog>
        )}
      </div>

      {/* Search and Filters */}
      <GroupSearch
        onSearchChange={setSearchQuery}
        onFilterChange={setSearchFilters}
      />

      {/* Discoveries List */}
      <div className="space-y-4">
        {filteredDiscoveries.map((discovery) => (
          <Card key={discovery.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://avatar.vercel.sh/${discovery.sharer_profile?.username || 'user'}.png`} 
                    alt={discovery.sharer_profile?.username || 'User'} 
                  />
                  <AvatarFallback>
                    {discovery.sharer_profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-medium">
                      {discovery.sharer_profile?.full_name || discovery.sharer_profile?.username || 'Unknown User'}
                    </p>
                    <Badge variant="secondary" className="text-xs gap-1">
                      {getEntityIcon(discovery.entity_type)}
                      {getEntityTypeLabel(discovery.entity_type)}
                    </Badge>
                    <span className="text-slate-500 text-sm">
                      {new Date(discovery.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-slate-900 mb-2">
                    {discovery.title}
                  </h4>
                  
                  {discovery.description && (
                    <p className="text-slate-700 mb-3">
                      {discovery.description}
                    </p>
                  )}

                  {/* Entity Preview */}
                  {discovery.entity_preview && (
                    <div className="mb-4">
                      <EntityPreviewCard
                        entity={discovery.entity_preview}
                        onNavigate={handleEntityNavigate}
                      />
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-6 text-slate-500">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleLikeDiscovery(discovery.id)}
                      className={`hover:text-red-600 ${discovery.is_liked ? 'text-red-600' : ''}`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${discovery.is_liked ? 'fill-current' : ''}`} />
                      {discovery.likes_count}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleDiscoveryExpansion(discovery.id)}
                      className="hover:text-blue-600"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {discovery.comments_count}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {expandedDiscovery === discovery.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      {/* New Comment Form */}
                      {auth?.user && (
                        <div className="mb-4">
                          <Textarea
                            placeholder="Write a comment..."
                            value={newComment[discovery.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ 
                              ...prev, 
                              [discovery.id]: e.target.value 
                            }))}
                            rows={2}
                            className="mb-2"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleCreateComment(discovery.id)}
                            disabled={!newComment[discovery.id]?.trim()}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            <I18nText translationKey="community.postComment">Post Comment</I18nText>
                          </Button>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-4">
                        {loadingComments[discovery.id] ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          </div>
                        ) : (
                          comments[discovery.id]?.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} discoveryId={discovery.id} />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscoveries.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Share2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="font-medium text-slate-900 mb-2">
              {searchQuery || Object.values(searchFilters).some(v => v !== 'all') ? (
                <I18nText translationKey="community.noDiscoveriesFound">No discoveries found</I18nText>
              ) : (
                <I18nText translationKey="community.noDiscoveries">No discoveries yet</I18nText>
              )}
            </h4>
            <p className="text-slate-600 mb-4">
              {searchQuery || Object.values(searchFilters).some(v => v !== 'all') ? (
                <I18nText translationKey="community.tryDifferentSearch">Try adjusting your search or filters</I18nText>
              ) : (
                <I18nText translationKey="community.noDiscoveriesDescription">
                  Share the first discovery to start building the group's knowledge base
                </I18nText>
              )}
            </p>
            {isMember && auth?.user && !searchQuery && (
              <ShareDiscoveryDialog groupId={groupId} onDiscoveryShared={loadDiscoveries}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <I18nText translationKey="community.shareFirstDiscovery">Share First Discovery</I18nText>
                </Button>
              </ShareDiscoveryDialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedGroupDiscoveries;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Reply, Send } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { PostComment } from '@/types/interest-groups';
import { getPostComments, createComment, likeComment } from '@/services/communityService';
import { toast } from 'sonner';

interface PostCommentsProps {
  postId: string;
  onCommentsChange?: (count: number) => void;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId, onCommentsChange }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId]);

  useEffect(() => {
    if (onCommentsChange) {
      const totalComments = comments.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
      }, 0);
      onCommentsChange(totalComments);
    }
  }, [comments, onCommentsChange]);

  const loadComments = async () => {
    try {
      const commentsData = await getPostComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!auth?.user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await createComment(postId, auth.user.id, newComment);
      setNewComment('');
      await loadComments();
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (parentCommentId: string) => {
    if (!auth?.user || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      await createComment(postId, auth.user.id, replyContent, parentCommentId);
      setReplyContent('');
      setReplyingTo(null);
      await loadComments();
      toast.success('Reply posted successfully');
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!auth?.user) return;

    try {
      await likeComment(commentId, auth.user.id);
      await loadComments();
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
    }
  };

  const CommentItem: React.FC<{ comment: PostComment; isReply?: boolean }> = ({ comment, isReply = false }) => (
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
          
          {/* Comment Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleLikeComment(comment.id)}
              className="text-slate-600 hover:text-red-600 h-6 px-2"
            >
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes_count}
            </Button>
            {!isReply && (
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

          {/* Reply Form */}
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
                  onClick={() => handleCreateReply(comment.id)}
                  disabled={!replyContent.trim() || submitting}
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

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* New Comment Form */}
        {auth?.user && (
          <div className="space-y-3">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={`https://avatar.vercel.sh/${auth.user.email}.png`} 
                  alt="You" 
                />
                <AvatarFallback>
                  {auth.user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleCreateComment}
                disabled={!newComment.trim() || submitting}
              >
                <Send className="h-4 w-4 mr-2" />
                <I18nText translationKey="community.post">Post</I18nText>
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-6 text-slate-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>
              <I18nText translationKey="community.noComments">No comments yet</I18nText>
            </p>
            <p className="text-sm">
              <I18nText translationKey="community.beFirstToComment">
                Be the first to comment on this post
              </I18nText>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostComments;

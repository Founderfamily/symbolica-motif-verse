
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';

interface GroupPostWithProfile {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  user_profile?: {
    username: string;
    full_name: string;
  };
}

interface GroupDiscussionProps {
  groupId: string;
  posts: GroupPostWithProfile[];
  onCreatePost: (content: string) => void;
  onLikePost: (postId: string) => void;
}

const GroupDiscussion: React.FC<GroupDiscussionProps> = ({
  groupId,
  posts,
  onCreatePost,
  onLikePost
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const auth = useAuth();

  const handleSubmitPost = () => {
    if (newPostContent.trim()) {
      onCreatePost(newPostContent);
      setNewPostContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Post */}
      {auth?.user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <I18nText translationKey="community.shareThoughts">Share your thoughts</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind about cultural symbols?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitPost} disabled={!newPostContent.trim()}>
                <Send className="h-4 w-4 mr-2" />
                <I18nText translationKey="community.post">Post</I18nText>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://avatar.vercel.sh/${post.user_profile?.username || 'user'}.png`} 
                    alt={post.user_profile?.username || 'User'} 
                  />
                  <AvatarFallback>
                    {post.user_profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-medium">
                      {post.user_profile?.full_name || post.user_profile?.username || 'Unknown User'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <I18nText translationKey="community.member">Member</I18nText>
                    </Badge>
                    <span className="text-slate-500 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-900 mb-3">{post.content}</p>
                  
                  {/* Post Actions */}
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onLikePost(post.id)}
                      className="text-slate-600 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600">
                      <Share2 className="h-4 w-4 mr-1" />
                      <I18nText translationKey="community.share">Share</I18nText>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              <I18nText translationKey="community.noDiscussions">No discussions yet</I18nText>
            </h3>
            <p className="text-slate-600">
              <I18nText translationKey="community.startConversation">
                Be the first to start a conversation in this group
              </I18nText>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupDiscussion;

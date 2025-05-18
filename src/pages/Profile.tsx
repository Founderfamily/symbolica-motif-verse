import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Bookmark, UploadCloud, Award, UserCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

// Type definitions needed to fix the build errors
interface EnhancedUser {
  avatar_url?: string;
  full_name?: string;
  username?: string;
  is_admin?: boolean;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('contributions');
  
  // Cast the user to EnhancedUser to access the properties
  const enhancedUser = user as EnhancedUser | null;
  
  // Contributions mock data
  const contributions = [
    { 
      id: '1', 
      name: 'Fleur de Lys', 
      culture: 'French', 
      date: '2023-04-15', 
      status: 'approved' 
    },
    { 
      id: '2', 
      name: 'Celtic Knot', 
      culture: 'Celtic', 
      date: '2023-04-10', 
      status: 'pending' 
    },
    { 
      id: '3', 
      name: 'Greek Meander', 
      culture: 'Greek', 
      date: '2023-03-28', 
      status: 'approved' 
    }
  ];
  
  // Bookmarks mock data
  const bookmarks = [
    { 
      id: '101', 
      name: 'Aztec Calendar', 
      culture: 'Aztec', 
      date: '2023-04-05' 
    },
    { 
      id: '102', 
      name: 'Chinese Dragon', 
      culture: 'Chinese', 
      date: '2023-03-20' 
    }
  ];
  
  // Badges mock data
  const badges = [
    { 
      id: '201', 
      name: 'First Contribution', 
      description: 'Successfully contributed your first symbol', 
      date: '2023-03-15' 
    },
    { 
      id: '202', 
      name: 'Explorer', 
      description: 'Viewed 50+ symbols in the database', 
      date: '2023-03-28' 
    },
    { 
      id: '203', 
      name: 'Scholar', 
      description: 'Contributed symbols from 3 different cultures', 
      date: '2023-04-10' 
    }
  ];
  
  // Ensure the page returns to the top when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            <I18nText translationKey="profile.notSignedIn">Not Signed In</I18nText>
          </h1>
          <p className="mb-6 text-slate-600">
            <I18nText translationKey="profile.signInToView">Please sign in to view your profile</I18nText>
          </p>
          <Button asChild>
            <a href="/auth">
              <I18nText translationKey="auth.signIn">Sign In</I18nText>
            </a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    {enhancedUser?.avatar_url ? (
                      <AvatarImage src={enhancedUser.avatar_url} alt={enhancedUser.full_name || enhancedUser.username || 'User'} />
                    ) : (
                      <AvatarFallback className="text-3xl bg-amber-100 text-amber-800">
                        {(enhancedUser?.full_name || enhancedUser?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="text-xl font-bold">{enhancedUser?.username}</h2>
                  <p className="text-slate-500">{enhancedUser?.username}</p>
                  
                  {enhancedUser?.is_admin && (
                    <Badge className="mt-2 bg-amber-600">
                      <I18nText translationKey="profile.admin">Admin</I18nText>
                    </Badge>
                  )}
                  
                  <Button variant="outline" size="sm" className="mt-4">
                    <Edit className="h-4 w-4 mr-2" />
                    <I18nText translationKey="profile.editProfile">Edit Profile</I18nText>
                  </Button>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'contributions' ? 'bg-amber-50 text-amber-900' : ''}`}
                    onClick={() => setActiveTab('contributions')}
                  >
                    <UploadCloud className="h-5 w-5 mr-2" />
                    <I18nText translationKey="profile.contributions">Contributions</I18nText>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'bookmarks' ? 'bg-amber-50 text-amber-900' : ''}`}
                    onClick={() => setActiveTab('bookmarks')}
                  >
                    <Bookmark className="h-5 w-5 mr-2" />
                    <I18nText translationKey="profile.bookmarks">Bookmarks</I18nText>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'badges' ? 'bg-amber-50 text-amber-900' : ''}`}
                    onClick={() => setActiveTab('badges')}
                  >
                    <Award className="h-5 w-5 mr-2" />
                    <I18nText translationKey="profile.badges">Badges</I18nText>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'account' ? 'bg-amber-50 text-amber-900' : ''}`}
                    onClick={() => setActiveTab('account')}
                  >
                    <UserCircle className="h-5 w-5 mr-2" />
                    <I18nText translationKey="profile.account">Account</I18nText>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'settings' ? 'bg-amber-50 text-amber-900' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <I18nText translationKey="profile.settings">Settings</I18nText>
                  </Button>
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => signOut()}>
                    <LogOut className="h-5 w-5 mr-2" />
                    <I18nText translationKey="auth.signOut">Sign Out</I18nText>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'contributions' && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">
                    <I18nText translationKey="profile.myContributions">My Contributions</I18nText>
                  </h3>
                </CardHeader>
                <CardContent>
                  {contributions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">
                        <I18nText translationKey="profile.noContributions">
                          You haven't contributed any symbols yet
                        </I18nText>
                      </p>
                      <Button asChild>
                        <a href="/contribute">
                          <UploadCloud className="h-5 w-5 mr-2" />
                          <I18nText translationKey="profile.contributeNow">
                            Contribute Now
                          </I18nText>
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {contributions.map(contribution => (
                        <div key={contribution.id} className="py-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{contribution.name}</h4>
                            <p className="text-sm text-slate-500">{contribution.culture}</p>
                            <p className="text-xs text-slate-400">{contribution.date}</p>
                          </div>
                          <div>
                            <Badge 
                              variant={contribution.status === 'approved' ? 'default' : 'outline'}
                              className={contribution.status === 'approved' ? 'bg-green-500' : ''}
                            >
                              <I18nText translationKey={`status.${contribution.status}`}>
                                {contribution.status}
                              </I18nText>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'bookmarks' && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">
                    <I18nText translationKey="profile.myBookmarks">My Bookmarks</I18nText>
                  </h3>
                </CardHeader>
                <CardContent>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">
                        <I18nText translationKey="profile.noBookmarks">
                          You haven't bookmarked any symbols yet
                        </I18nText>
                      </p>
                      <Button asChild>
                        <a href="/explore">
                          <I18nText translationKey="profile.exploreSymbols">Explore Symbols</I18nText>
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {bookmarks.map(bookmark => (
                        <div key={bookmark.id} className="py-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{bookmark.name}</h4>
                            <p className="text-sm text-slate-500">{bookmark.culture}</p>
                            <p className="text-xs text-slate-400">{bookmark.date}</p>
                          </div>
                          <div>
                            <Button variant="ghost" size="sm">
                              <I18nText translationKey="profile.viewSymbol">View</I18nText>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'badges' && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">
                    <I18nText translationKey="profile.myBadges">My Badges</I18nText>
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map(badge => (
                      <div key={badge.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-800 rounded-full mx-auto mb-3">
                          <Award />
                        </div>
                        <h4 className="font-medium text-center">{badge.name}</h4>
                        <p className="text-xs text-slate-500 text-center mt-1">{badge.description}</p>
                        <p className="text-xs text-slate-400 text-center mt-2">{badge.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">
                    <I18nText translationKey="profile.accountDetails">Account Details</I18nText>
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-500 block mb-1">
                        <I18nText translationKey="profile.email">Email</I18nText>
                      </label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-500 block mb-1">
                        <I18nText translationKey="profile.memberSince">Member Since</I18nText>
                      </label>
                      <p className="font-medium">April 2023</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="mr-4">
                        <I18nText translationKey="profile.changePassword">Change Password</I18nText>
                      </Button>
                      <Button variant="destructive">
                        <I18nText translationKey="profile.deleteAccount">Delete Account</I18nText>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">
                    <I18nText translationKey="profile.settings">Settings</I18nText>
                  </h3>
                </CardHeader>
                <CardContent>
                  {/* Settings content */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">
                        <I18nText translationKey="profile.preferences">Preferences</I18nText>
                      </h4>
                      <div className="space-y-2">
                        {/* Preferences settings */}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">
                        <I18nText translationKey="profile.notifications">Notifications</I18nText>
                      </h4>
                      <div className="space-y-2">
                        {/* Notification settings */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

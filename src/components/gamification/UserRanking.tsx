
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface RankingUser {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
}

interface UserRankingProps {
  users: RankingUser[];
  title: string;
  translationKey?: string;
  loading?: boolean;
  compact?: boolean;
}

const UserRanking: React.FC<UserRankingProps> = ({
  users,
  title,
  translationKey,
  loading = false,
  compact = false
}) => {
  const { t } = useTranslation();
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-medium text-slate-500">{rank}</span>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-lg font-medium">
          {translationKey ? <I18nText translationKey={translationKey} /> : title}
        </h3>
      </div>
      
      <div className="p-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : users.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between py-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  {!compact && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <span className={`font-medium ${user.rank <= 3 ? "text-slate-800" : "text-slate-600"}`}>
                    {user.username}
                  </span>
                </div>
                
                <div className="text-amber-600 font-semibold">
                  {user.points} {t('gamification.points')}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center text-slate-500">
            <p>{t('gamification.noRankingsYet')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRanking;

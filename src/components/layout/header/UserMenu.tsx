
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';

export const UserMenu: React.FC = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  if (!auth?.user || !auth?.profile) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth.profile.avatar_url || `https://avatar.vercel.sh/${auth.profile.username}.png`} alt={auth.profile.username || 'Avatar'} />
            <AvatarFallback>{auth.profile.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          {t('myAccount', { ns: 'header' })}
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            {t('profile', { ns: 'header' })}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/contribute">
            <HelpCircle className="mr-2 h-4 w-4" />
            {t('contribute', { ns: 'header' })}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {auth.profile.is_admin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" />
                {t('adminDashboard', { ns: 'header' })}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => auth.signOut()}>
          {t('logout', { ns: 'header' })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: string | null;
  isAdmin: boolean;
  loading: boolean;
  subscriptionStatus: string;
  hasActiveSubscription: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshSubscriptionStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState(true);

  const isAdmin = userRole === 'admin';
  const hasActiveSubscription = subscriptionStatus === 'active';

  const refreshSubscriptionStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_subscription_status', { user_uuid: user.id });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus('inactive');
      } else {
        setSubscriptionStatus(data || 'inactive');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubscriptionStatus('inactive');
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session?.user);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls to avoid callback issues
          setTimeout(async () => {
            try {
              // Fetch user profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
              } else {
                setProfile(profileData);
              }

              // Fetch user role
              const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .single();

              if (roleError && roleError.code !== 'PGRST116') {
                console.error('Error fetching role:', roleError);
                setUserRole('user'); // Default to user role
              } else {
                setUserRole(roleData?.role || 'user');
              }

              // Fetch subscription status (only for non-admin users)
              const adminEmails = ['josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaidav347@gmail.com'];
              if (!adminEmails.includes(session.user.email || '')) {
                await refreshSubscriptionStatus();
              } else {
                setSubscriptionStatus('active'); // Admins always have active status
              }
            } catch (error) {
              console.error('Error in profile/role fetch:', error);
            }
          }, 0);
        } else {
          // Clear all user data when signed out
          setProfile(null);
          setUserRole(null);
          setSubscriptionStatus('inactive');
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Clear all state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole(null);
      setSubscriptionStatus('inactive');
      
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      userRole,
      isAdmin,
      loading,
      subscriptionStatus,
      hasActiveSubscription,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshSubscriptionStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const ADMIN_EMAIL = 'admin@rkglobalengineering.com';
const ADMIN_PASSWORD = 'admin123';

const isAdminUser = (u) =>
  u?.email?.toLowerCase().includes('admin') || u?.user_metadata?.isAdmin === true;

const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  loading: true
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  // On mount: check Supabase session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const adminFlag = isAdminUser(u);
          setIsLoggedIn(true);
          setIsAdmin(adminFlag);
          setUser({ email: u.email, fullName: u.user_metadata?.full_name || 'Admin', isAdmin: adminFlag, id: u.id });
        } else if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('rk_user_session');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setIsAdmin(userData.isAdmin || false);
            setUser(userData);
          }
        }
      } catch (e) {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('rk_user_session');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setIsAdmin(userData.isAdmin || false);
            setUser(userData);
          }
        }
      }
      setLoading(false);
    };

    checkSession();

    // Listen to Supabase auth state changes (safe guard)
    let unsubscribe = () => {};
    try {
      if (supabase?.auth?.onAuthStateChange) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const u = session.user;
            const adminFlag = isAdminUser(u);
            setIsLoggedIn(true);
            setIsAdmin(adminFlag);
            setUser({ email: u.email, fullName: u.user_metadata?.full_name || 'Admin', isAdmin: adminFlag, id: u.id });
          } else if (_event === 'SIGNED_OUT') {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUser(null);
          }
        });
        unsubscribe = () => subscription?.unsubscribe?.();
      }
    } catch (e) {}

    return () => unsubscribe();
  }, []);

  // Route protection — ONLY protect /admin route
  useEffect(() => {
    if (loading) return;
    // If non-admin tries to visit /admin → redirect to home
    if (pathname.startsWith('/admin') && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, pathname, loading, router]);

  // ── LOGIN ──────────────────────────────────────────────
  const finalizeLogin = (u) => {
    const adminFlag = isAdminUser(u);
    const userData = {
      email: u?.email || ADMIN_EMAIL,
      fullName: u?.user_metadata?.full_name || (adminFlag ? 'Admin' : 'User'),
      isAdmin: adminFlag,
      id: u?.id || 'admin-id'
    };
    setIsLoggedIn(true);
    setIsAdmin(adminFlag);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rk_user_session', JSON.stringify(userData));
    }
    router.push(adminFlag ? '/admin' : '/');
  };

  const login = async (email, password) => {
    setAuthError('');
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Direct Admin Bypass check for seamless admin login
    const isAdminCredentials = 
      (normalizedEmail === ADMIN_EMAIL || normalizedEmail.includes('admin')) && 
      (password === ADMIN_PASSWORD || password === 'admin123' || password === 'admin');

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      // First-time admin bootstrap: create Supabase auth user if missing
      if (
        error &&
        normalizedEmail === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          options: {
            data: { full_name: 'Admin', isAdmin: true }
          }
        });

        const alreadyExists = signUpError?.message?.toLowerCase().includes('already');
        if (!signUpError || alreadyExists) {
          const retry = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
          });
          data = retry.data;
          error = retry.error;
        }
      }

      if (error) {
        // If admin credentials match, log in as Admin even if Supabase Auth requires email confirmation
        if (isAdminCredentials || (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD)) {
          const adminUser = {
            email: ADMIN_EMAIL,
            user_metadata: { full_name: 'Admin', isAdmin: true },
            id: 'admin-session-id'
          };
          finalizeLogin(adminUser);
          return;
        }

        if (typeof window !== 'undefined') {
          const usersList = JSON.parse(localStorage.getItem('rk_registered_users') || '[]');
          const found = usersList.find(u => u.email === normalizedEmail && u.password === password);
          if (found) {
            const userData = { email: normalizedEmail, fullName: found.fullName, isAdmin: false };
            setIsLoggedIn(true);
            setIsAdmin(false);
            setUser(userData);
            localStorage.setItem('rk_user_session', JSON.stringify(userData));
            router.push('/');
            return;
          }
        }

        setAuthError('Invalid email or password. Please try again.');
        return;
      }

      if (data?.user) {
        finalizeLogin(data.user);
      }
    } catch (e) {
      if (isAdminCredentials) {
        const adminUser = {
          email: ADMIN_EMAIL,
          user_metadata: { full_name: 'Admin', isAdmin: true },
          id: 'admin-session-id'
        };
        finalizeLogin(adminUser);
        return;
      }
      setAuthError('Connection error. Please try again.');
    }
  };

  // ── REGISTER ───────────────────────────────────────────
  const register = async (fullName, email, password) => {
    setAuthError('');

    // Try Supabase Auth signup
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        // Supabase error (e.g. user already exists) — fallback to localStorage
        if (typeof window !== 'undefined') {
          const usersList = JSON.parse(localStorage.getItem('rk_registered_users') || '[]');
          const exists = usersList.find(u => u.email === email);
          if (exists) {
            setAuthError('Email already registered. Please login.');
            return;
          }
          usersList.push({ fullName, email, password });
          localStorage.setItem('rk_registered_users', JSON.stringify(usersList));
        }
      }

      // Either way, log them in
      const userData = { fullName, email, isAdmin: false, id: data?.user?.id };
      setIsLoggedIn(true);
      setIsAdmin(false);
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rk_user_session', JSON.stringify(userData));
        // Also store in local list for fallback
        const usersList = JSON.parse(localStorage.getItem('rk_registered_users') || '[]');
        if (!usersList.find(u => u.email === email)) {
          usersList.push({ fullName, email, password });
          localStorage.setItem('rk_registered_users', JSON.stringify(usersList));
        }
      }
      router.push('/');
    } catch (e) {
      // Supabase not available — use localStorage only
      if (typeof window !== 'undefined') {
        const usersList = JSON.parse(localStorage.getItem('rk_registered_users') || '[]');
        const exists = usersList.find(u => u.email === email);
        if (exists) {
          setAuthError('Email already registered. Please login.');
          return;
        }
        usersList.push({ fullName, email, password });
        localStorage.setItem('rk_registered_users', JSON.stringify(usersList));
        const userData = { fullName, email, isAdmin: false };
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('rk_user_session', JSON.stringify(userData));
        router.push('/');
      }
    }
  };

  // ── LOGOUT ─────────────────────────────────────────────
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rk_user_session');
    }
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, register, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

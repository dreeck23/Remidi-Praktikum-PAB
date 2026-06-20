import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Article, UserProfile } from './types';
import { DBService } from './services/db';

// Primary views
import SplashView from './components/SplashView';
import WelcomeView from './components/WelcomeView';
import RegisterView from './components/RegisterView';
import LoginView from './components/LoginView';
import ForgotPasswordView from './components/ForgotPasswordView';
import MainLayout from './components/MainLayout';
import DetailView from './components/DetailView';

type AppScreen = 'splash' | 'register' | 'login' | 'forgot_password' | 'welcome' | 'main' | 'detail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [favoritesTrigger, setFavoritesTrigger] = useState<number>(0);

  // Check state session once splash has finished running
  const handleSplashFinished = () => {
    const activeSession = DBService.getCurrentUser();
    
    if (activeSession) {
      setCurrentUser(activeSession);
      const welcomeSeen = DBService.checkWelcomeSeen();
      if (!welcomeSeen) {
        setCurrentScreen('welcome');
      } else {
        setCurrentScreen('main');
      }
    } else {
      setCurrentScreen('login');
    }
  };

  const handleRegisterSuccess = () => {
    const activeUser = DBService.getCurrentUser();
    setCurrentUser(activeUser);
    setCurrentScreen('welcome');
  };

  const handleLoginSuccess = () => {
    const activeUser = DBService.getCurrentUser();
    setCurrentUser(activeUser);
    
    const welcomeSeen = DBService.checkWelcomeSeen();
    if (!welcomeSeen) {
      setCurrentScreen('welcome');
    } else {
      setCurrentScreen('main');
    }
  };

  const handleWelcomeFinished = () => {
    DBService.setWelcomeSeen(true);
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    DBService.logout();
    setCurrentUser(null);
    setSelectedArticle(null);
    setCurrentScreen('login');
  };

  const handleSelectArticleInFeed = (article: Article) => {
    setSelectedArticle(article);
    setCurrentScreen('detail');
  };

  const handleProfileUpdated = () => {
    // Force active user reload
    const active = DBService.getCurrentUser();
    setCurrentUser(active);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans flex md:py-8 justify-center items-center overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Smartphone Device Frame Container Mockup for Premium Applet Preview on Desktops */}
      <div className="relative w-full max-w-md h-full md:h-[840px] md:max-h-[90vh] md:rounded-[36px] md:border-8 md:border-slate-850 bg-slate-950 shadow-2xl flex flex-col overflow-y-auto md:shadow-indigo-950/20 scrollbar-none antialiased">
        
        {/* Camera block notch mockup for smartphone display */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-850 rounded-full z-40" />

        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {/* SCREEN 1: Splash Display */}
            {currentScreen === 'splash' && (
              <motion.div
                key="splash"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <SplashView onComplete={handleSplashFinished} />
              </motion.div>
            )}

            {/* SCREEN 2: Register/Daftar */}
            {currentScreen === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <RegisterView
                  onNavigateToLogin={() => setCurrentScreen('login')}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              </motion.div>
            )}

            {/* SCREEN 3: Login */}
            {currentScreen === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <LoginView
                  onNavigateToRegister={() => setCurrentScreen('register')}
                  onNavigateToForgotPassword={() => setCurrentScreen('forgot_password')}
                  onLoginSuccess={handleLoginSuccess}
                />
              </motion.div>
            )}

            {/* SCREEN 4: Forgot Password */}
            {currentScreen === 'forgot_password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <ForgotPasswordView onNavigateToLogin={() => setCurrentScreen('login')} />
              </motion.div>
            )}

            {/* SCREEN 5: Onboarding Welcome Page */}
            {currentScreen === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <WelcomeView onContinue={handleWelcomeFinished} />
              </motion.div>
            )}

            {/* SCREEN 6: Dashboard Core layout (including feeds, favorites, notifications, profiles) */}
            {currentScreen === 'main' && currentUser && (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <MainLayout
                  user={currentUser}
                  onLogout={handleLogout}
                  onSelectArticle={handleSelectArticleInFeed}
                  onUpdateUser={handleProfileUpdated}
                  favoritesChangedTrigger={favoritesTrigger}
                />
              </motion.div>
            )}

            {/* SCREEN 7: News Article Reader Detail */}
            {currentScreen === 'detail' && currentUser && selectedArticle && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="w-full h-full flex-1 flex flex-col"
              >
                <DetailView
                  article={selectedArticle}
                  user={currentUser}
                  onBack={() => setCurrentScreen('main')}
                  onFavoritesChanged={() => setFavoritesTrigger(prev => prev + 1)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

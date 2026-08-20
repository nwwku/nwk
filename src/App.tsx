import { Route, Switch } from 'wouter';
import { AppShell } from './components/AppShell';
import { CreatePage } from './pages/CreatePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProfilePage } from './pages/ProfilePage';
import { ShopPage } from './pages/ShopPage';
import { WardrobePage } from './pages/WardrobePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LanguageProvider } from './lib/language';
import { StylistPage } from './pages/StylistPage';
import { SavedLooksPage } from './pages/SavedLooksPage';
import { ThemeProvider } from './lib/theme';
import { ProfileGenderProvider } from './lib/profileGender';
import { AuthPage } from './pages/AuthPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { AvatarProvider } from './lib/avatar';
import { GenderGate } from './components/GenderGate';
import { PlannerPage } from './pages/PlannerPage';
import { CapsulePage } from './pages/CapsulePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LookShopPage } from './pages/LookShopPage';

export default function App() {
  return (
    <ThemeProvider><LanguageProvider><AvatarProvider><ProfileGenderProvider><Switch>
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/">
        <AppShell><HomePage /></AppShell>
      </Route>
      <Route path="/wardrobe">
        <AppShell><WardrobePage /></AppShell>
      </Route>
      <Route path="/create">
        <AppShell><CreatePage /></AppShell>
      </Route>
      <Route path="/discover">
        <AppShell><DiscoverPage /></AppShell>
      </Route>
      <Route path="/shop">
        <AppShell><ShopPage /></AppShell>
      </Route>
      <Route path="/look-shop">
        <AppShell><LookShopPage /></AppShell>
      </Route>
      <Route path="/profile">
        <AppShell><ProfilePage /></AppShell>
      </Route>
      <Route path="/auth">
        <AppShell><AuthPage /></AppShell>
      </Route>
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/stylist">
        <AppShell><StylistPage /></AppShell>
      </Route>
      <Route path="/saved">
        <AppShell><SavedLooksPage /></AppShell>
      </Route>
      <Route path="/planner">
        <AppShell><PlannerPage /></AppShell>
      </Route>
      <Route path="/capsule">
        <AppShell><CapsulePage /></AppShell>
      </Route>
      <Route path="/achievements">
        <AppShell><AchievementsPage /></AppShell>
      </Route>
      <Route component={NotFoundPage} />
    </Switch><GenderGate /></ProfileGenderProvider></AvatarProvider></LanguageProvider></ThemeProvider>
  );
}

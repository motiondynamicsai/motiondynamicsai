import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RouteScroll } from './components/SiteChrome';
import SquashLanding from './components/SquashLanding';

// Team and 404 pages load on demand so the landing (the QR-code entry) ships none of their code or photos.
const TeamPage = lazy(() => import('./pages/TeamRoutes').then((m) => ({ default: m.TeamPage })));
const TeamMemberPage = lazy(() => import('./pages/TeamRoutes').then((m) => ({ default: m.TeamMemberPage })));
const NotFound = lazy(() => import('./pages/TeamRoutes').then((m) => ({ default: m.NotFound })));

// index.html paints the page dark for "/" before anything mounts; this keeps that in step when navigating.
function RouteBackground() {
  const { pathname } = useLocation();
  useEffect(() => { // one owner for the page colours behind the app: a bounce past either end must not flash the wrong one
    document.documentElement.classList.add('dark-first');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#05070d');
  }, [pathname]);
  return null;
}

const pageFallback = <div className="page-fallback" style={{ minHeight: '100vh' }} />;

export default function App() {
  return <BrowserRouter><RouteScroll /><RouteBackground /><Suspense fallback={pageFallback}><Routes><Route path="/" element={<SquashLanding />} /><Route path="/squash" element={<Navigate to="/" replace />} /><Route path="/team" element={<TeamPage />} /><Route path="/team/:id" element={<TeamMemberPage />} /><Route path="*" element={<NotFound />} /></Routes></Suspense></BrowserRouter>;
}

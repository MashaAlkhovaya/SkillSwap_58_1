import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { MainLayout } from '../Layouts/MainLayout'
import { Skeleton } from '@/shared/ui'
import { PrivateRoute } from '@/features/auth/ui/PrivateRoute'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Skeleton width="100%" height="100vh" />}>
        <Routes>
          {/* 1. Главный маршрут — это наш лейаут */}
          <Route element={<MainLayout />}>
            {/* 2. Вложенные маршруты (они отрендерятся на месте <Outlet />) */}
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />
            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route
              path={ROUTES.REGISTER}
              element={<RegisterPage currentStep={1} totalSteps={3} />}
            />
            {/* защищённые маршруты */}
            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />
            </Route>

            {/* 3. Обработка 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/global.css'
import { SessionGate } from '@/features/auth/ui/SessionGate'
import { NotificationStack } from '@/widgets/NotificationStack'

export function App() {
  return (
    <StoreProvider>
      <SessionGate>
        <AppRouter />
        <NotificationStack />
      </SessionGate>
    </StoreProvider>
  )
}

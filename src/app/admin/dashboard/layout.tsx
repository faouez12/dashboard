import DashboardContainer from './components/DashboardContainer'
import { ToastProvider } from './components/ToastProvider'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <DashboardContainer userName="Shahine Operator">
        {children}
      </DashboardContainer>
    </ToastProvider>
  )
}

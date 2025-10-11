import { getAllExpenses, getUserSettings } from '@/lib/services/data-service'
import { DayList } from '@/app/_components/pages/calendar/DayList'

export default async function CalendarDaysPage() {
  const data = await getAllExpenses()
  const settings = await getUserSettings()

  return (
    <div style={{ position: 'relative' }}>
      <DayList initialData={data} settings={settings} />
    </div>
  )
}

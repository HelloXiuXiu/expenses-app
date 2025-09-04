import { getAllExpenses, getUserSettings } from '@/lib/services/data-service'
import { DayList } from '@/app/_components/DayList'

export default async function CalendarDaysPage() {
  const data = await getAllExpenses()
  const settings = await getUserSettings()

  return (
    <div style={{ position: 'relative' }}>
      <DayList data={data} settings={settings} />
    </div>
  )
}

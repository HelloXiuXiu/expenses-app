import { cookies } from 'next/headers'
import { getUserSettings } from '@/lib/services/data-service'
import UpdateSettingsForm from '@/app/_components/pages/account/UpdateSettingsForm'
import s from './styles.module.css'

export default async function SettingsPage() {
  const settings = await getUserSettings()
  
  const cookieStore = await cookies()
  const cookiesCategories = cookieStore.get('selectedCategories')?.value?.replaceAll('_', ' ')

  return (
    <div className={s.page}>
      <h1>
        Settings
      </h1>
      <p>Username: {settings?.username}</p>
      <p>Currency: {settings?.currency}</p>
      <br /><br />
      <p>Categories:</p>
      <ul>
        {Object.entries(settings?.categories || {}).map(([title, color]) => (
          <li key={title}>{title} <span style={{ color }}>{color}</span></li>
        ))}
      </ul>
      <UpdateSettingsForm initialSettings={settings} cookiesCategories={cookiesCategories} />
    </div>
  )
}

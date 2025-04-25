import { getUserSettings } from '@/lib/services/data-service'
import UpdateSettingsForm from '@/app/_components/UpdateSettingsForm'

export default async function SettingsPage() {
  const settings = await getUserSettings()

  return (
    <>
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
      <UpdateSettingsForm initialSettings={settings} />
    </>
  )
}

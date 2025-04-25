import { getUserSettings } from '@/lib/services/data-service'
import AddNewExpense from '@/app/_components/AddNewExpense'

export default async function CreateNewExpensePage() {
  const settings = await getUserSettings()

  return (
    <>
      <h1>
        Add new expense
      </h1>
      <AddNewExpense settings={settings} />
    </>
  )
}

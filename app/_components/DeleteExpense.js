'use client'

import { useTransition } from 'react'
import { deleteExpenseAction } from '@/lib/actions/actions'
import { removeExpenseFromDayCache } from '@/lib/cache/dayCache'
import { Button } from '@/app/_components/ui/Button'

export const DeleteExpense = ({ id, day }) => {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteExpenseAction(id)
      removeExpenseFromDayCache(id, day)
    })
  }

  return (
    <Button.Small onClick={handleDelete} disabled={isPending}>
      delete
    </Button.Small>
  )
}

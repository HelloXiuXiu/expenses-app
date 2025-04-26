'use client'

import { useTransition } from 'react'
import { deleteExpenseAction } from '@/lib/actions/actions'

export const DeleteExpense = ({ id, date }) => {
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    startTransition(async () => {
      const res = await deleteExpenseAction(id, date)
    })
  }

  return (
    <button onClick={handleRemove} disabled={isPending}>
      Remove
    </button>
  )
}
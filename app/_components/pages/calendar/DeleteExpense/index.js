'use client'

import { useTransition } from 'react'
import { deleteExpenseAction } from '@/lib/actions/actions'
import { Button } from '@/app/_components/common/ui/Button'

export const DeleteExpense = ({ id, onDelete = () => {} }) => {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    onDelete(id)
    startTransition(async () => {
      const res = await deleteExpenseAction(id)
    })
  }

  return (
    <Button.Small onClick={handleDelete} disabled={isPending}>
      delete
    </Button.Small>
  )
}

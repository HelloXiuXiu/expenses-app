'use client'

import { useState, useTransition } from 'react'
import { addExpenseAction } from '@/lib/actions/actions'
import s from '@/app/_styles/_components/AddExpenseForm.module.css'

export function AddExpenseForm({ settings }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(null)

  const categories = settings.categories

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target

    const amount = parseFloat(form.elements.amount.value)
    const description = form.elements.description.value
    const category = form.elements.category.value
    const date = form.elements.date.value
    const currency = settings.currency

    startTransition(async () => {
      const res = await addExpenseAction({
        amount,
        description,
        category,
        date,
        currency
      })

      setStatus(res?.error ? 'error' : 'success')

      if (!res?.error) form.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <span>[  create new expense  ]</span>
      <div className={s.field}>
        <label className={s.label}>Amount ({settings.currency})</label>
        <input
          type='number'
          name='amount'
          step='0.01'
          min='0'
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Date 'yyyy-mm-dd'</label>
        <input
          type='text'
          name='date'
          defaultValue={new Date().toLocaleDateString('en-CA')}
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Description</label>
        <input
          name='description'
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Category</label>
        <select
          name='category'
          className={s.input}
        >
          {Object.entries(categories).map(([title]) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <button type='submit' disabled={isPending} className={s.button}>
        {isPending ? 'Adding...' : 'Add Expense'}
      </button>

      {status === 'success' && <p className={s.success}>Expense added!</p>}
      {status === 'error' && <p className={s.error}>Something went wrong.</p>}
    </form>
  )
}


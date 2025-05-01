'use client'

import { useState, useTransition } from 'react'
import { addExpenseAction } from '@/lib/actions/actions'
import s from '@/app/_styles/_components/AddNewExpense.module.css'

export default function AddExpenseForm({ settings }) {
  const categories = settings.categories
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: Object.keys(categories)[0] || '',
  })

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await addExpenseAction({
        amount: parseFloat(form.amount),
        description: form.description,
        category: form.category,
        currency: settings.currency,
        date: new Date().toLocaleDateString('en-CA')
      })

      setStatus(res?.error ? 'error' : 'success')

      if (!res?.error) {
        setForm({
          amount: '',
          description: '',
          category: Object.keys(categories)[0] || '',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <div className={s.field}>
        <label className={s.label}>Amount ({settings.currency})</label>
        <input
          type='number'
          name='amount'
          value={form.amount}
          onChange={handleChange}
          step='0.01'
          min='0'
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Description</label>
        <input
          name='description'
          value={form.description}
          onChange={handleChange}
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Category</label>
        <select
          name='category'
          value={form.category}
          onChange={handleChange}
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


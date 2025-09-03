'use client'

import { useState, useTransition } from 'react'
import { addExpenseAction } from '@/lib/actions/actions'
import s from '@/app/_styles/_components/AddExpenseForm.module.css'

// TO-DO handle no categories case
export function AddExpenseForm({ settings }) {
  const categories = settings.categories

  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [categoryColor, setCategoryColor] = useState(Object.values(categories)[0])
  const [status, setStatus] = useState('')

  function handleSubmit (e) {
    e.preventDefault()
    const form = e.target

    const amount = parseFloat(form.elements.amount.value)
    const description = form.elements.description.value
    const category = form.elements.category.value
    const date = form.elements.date.value
    const currency = settings.currency

    if (!amount) {
      setErrorMsg('add amount')
      return
    }

    if (!date) {
      setErrorMsg('add day')
      return
    }

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

  function handleCategories(e) {
    setCategoryColor(categories[e.target.value])
  }

  return (
    <>
      <div className={s.title}>[  create new expense  ]</div>
      <form onSubmit={handleSubmit} className={s.form}>
        <input
          type='number'
          name='amount'
          placeholder='Amount'
          step='0.01'
          min='0'
          className={s.input}
        />
        <input
          type='text'
          name='date'
          placeholder={'Date: ' + new Date().toLocaleDateString('en-CA')}
          defaultValue={new Date().toLocaleDateString('en-CA')}
          className={s.input}
        />
        <input
          name='description'
          placeholder='Description'
          className={`${s.input} ${s.description}`}
        />
        <div className={s.relative}>
          <select
            name='category'
            className={`${s.input} ${s.select}`}
            onChange={handleCategories}
          >
            {Object.entries(categories).map(([title]) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          <div className={s.dot} style={{ backgroundColor: categoryColor || 'none' }}></div>
        </div>
        
        <div className={s.relative} style={{ display: 'flex'}}>
          {errorMsg ? <div className={s.errorMsg}><span></span>{errorMsg}</div> : null}
          <button type='submit' disabled={isPending} className={s.button}>
            {isPending ? 'adding...' : '+ add expense +'}
          </button>
        </div>

        {status === 'success' && <p className={s.success}>Expense added!</p>}
        {status === 'error' && <p className={s.error}>Something went wrong.</p>}
      </form>
    </>
  )
}


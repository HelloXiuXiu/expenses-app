'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { addExpenseAction } from '@/lib/actions/actions'
import { Button } from '@/app/_components/common/ui/Button'
import { DATE_FORMAT } from '@/app/config'
import { formatNumericVal, isValidAmount, isValidDate, isFuture } from '@/utils/validation'
import { showBottomToast } from '@/utils/toaster'
import s from './styles.module.css'

function handleAmountInput(e) {
  e.target.value = formatNumericVal(e.target.value)
}

function handleAmountBlur(e) {
  e.target.value = isValidAmount(e.target.value) ? +e.target.value : ''
}

export function AddExpenseForm({ settings }) {
  const categories = Object.keys(settings.categories)

  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [categoryColor, setCategoryColor] = useState(settings.categories[categories[0]])

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target

    const amount = parseFloat(form.elements.amount.value)
    const description = form.elements.description.value
    const category = form.elements.category.value
    const date = form.elements.date.value
    // TO-DO allow multicurrency
    const currency = settings.currency

    if (!amount) {
      setErrorMsg('add amount')
      return
    }

    if (!date) {
      setErrorMsg('add day')
      return
    }

    if (!isValidDate(date)) {
      setErrorMsg('day should be YYYY-MM-DD')
      return
    }

    if (isFuture(date)) {
      setErrorMsg('day cannot be future')
      return
    }

    startTransition(async () => {
      const dayData = {
        amount,
        description,
        category,
        date,
        currency
      }
      const res = await addExpenseAction(dayData)

      let type = 'success'
      let text = 'Expense added successfully.'

      if (res?.error) {
        type = 'error'
        text = 'Something went wrong. Expense was not created.'
        // TO-DO invalidate route on error only
      } else {
        form.reset()
      }

    showBottomToast({ text, type })
    })
  }

  function handleCategories(e) {
    setCategoryColor(settings.categories[e.target.value])
  }

  if (!categories.length) return (
    <div className={s.noCategories}>
      <div  className={s.title}>[  to add an expense create at least one category  ]</div>
      {window.location.pathname !== '/account/settings' && (
        <Link href="/account/settings" style={{ marginBottom: '16px' }}>
          <Button.Middle>Go to Settings</Button.Middle>
        </Link>
      )}
    </div>
  )

  return (
    <>
      <div className={s.title}>[  create new expense  ]</div>
      <form
        onSubmit={handleSubmit}
        onChange={() => setErrorMsg('')}
        className={s.form}
      >
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          name="amount"
          placeholder="Amount"
          className={s.input}
          onInput={handleAmountInput}
          onBlur={handleAmountBlur}
        />
        <input
          type="text"
          name="date"
          placeholder="Date: YYYY-MM-DD"
          defaultValue={new Date().toLocaleDateString(DATE_FORMAT)}
          className={s.input}
        />
        <input
          name="description"
          placeholder="Description"
          className={`${s.input} ${s.description}`}
        />
        <div className={s.relative}>
          <select
            name="category"
            className={`${s.input} ${s.select}`}
            onChange={handleCategories}
          >
            {categories.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          <div className={s.dot} style={{ backgroundColor: categoryColor || "none" }}></div>
        </div>
        
        <div className={s.relative} style={{ display: "flex" }}>
          {errorMsg ? <div className={s.errorMsg}><span></span>{errorMsg}</div> : null}
          <Button.Large type="submit" disabled={isPending} style={{ margin: "45px 16px 16px 16px" }}>
            {isPending ? "adding..." : "+ add expense +"}
          </Button.Large>
        </div>
      </form>
    </>
  )
}

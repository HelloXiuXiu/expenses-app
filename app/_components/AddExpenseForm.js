'use client'

import { useState, useTransition } from 'react'
import { addExpenseAction } from '@/lib/actions/actions'
import { Button } from '@/app/_components/ui/Button'
import { DATE_FORMAT } from '@/app/_config/config'
import { formatNumericVal, isValidAmount, isInvalidDate } from '@/utils/validation'
import s from '@/app/_styles/_components/AddExpenseForm.module.css'

function handleAmountInput(e) {
  e.target.value = formatNumericVal(e.target.value)
}

function handleAmountBlur(e) {
  e.target.value = isValidAmount(e.target.value) ? +e.target.value : ''
}

// TO-DO handle no categories case
export function AddExpenseForm({ settings }) {
  const categories = settings.categories

  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [categoryColor, setCategoryColor] = useState(Object.values(categories)[0])
  const [status, setStatus] = useState('')

  function handleSubmit(e) {
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

    if (isInvalidDate(date)) {
      setErrorMsg('day should be YYYY-MM-DD')
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
      setStatus(res?.error ? 'error' : 'success')
      if (!res?.error) {
        form.reset()
      } else {
        // TO-DO show error toast here
      }
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
          type="text"
          inputMode="decimal"
          name="amount"
          placeholder="Amount"
          className={s.input}
          onInput={handleAmountInput}
          onBlur={handleAmountBlur}
        />
        <input
          type="text"
          name="date"
          // TO-DO test at night
          // TO-DO validate and show error
          placeholder={"Date: " + new Date().toLocaleDateString(DATE_FORMAT)}
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
            {Object.entries(categories).map(([title]) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          <div className={s.dot} style={{ backgroundColor: categoryColor || "none" }}></div>
        </div>
        
        <div className={s.relative} style={{ display: "flex"}}>
          {errorMsg ? <div className={s.errorMsg}><span></span>{errorMsg}</div> : null}
          <Button.Large type="submit" disabled={isPending} style={{ margin: "45px 16px 16px 16px" }}>
            {isPending ? "adding..." : "+ add expense +"}
          </Button.Large>
        </div>

        {status === "success" && <p className={s.success}>Expense added!</p>}
        {status === "error" && <p className={s.error}>Something went wrong.</p>}
      </form>
    </>
  )
}

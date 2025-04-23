'use client'

import { useState, useTransition } from 'react'
import { updateSettingsAction } from '@/lib/actions/actions'
import s from '@/app/_styles/_components/UpdateSettingsForm.module.css'

const DEFAULT_COLOR = '#EEEEEE'

export default function UpdateSettingsForm({ initialSettings }) {
  const [form, setForm] = useState({
    username: initialSettings.username || '',
    currency: initialSettings.currency || '',
    categories: initialSettings.categories || {},
  })

  const [newCategory, setNewCategory] = useState('')
  const [newColor, setNewColor] = useState(DEFAULT_COLOR)

  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryColorChange = (title, color) => {
    setForm(prev => ({
      ...prev,
      categories: { ...prev.categories, [title]: color },
    }))
  }

  const handleAddCategory = () => {
    if (newCategory && !form.categories[newCategory]) {
      setForm(prev => ({
        ...prev,
        categories: { ...prev.categories, [newCategory]: newColor },
      }))
      setNewCategory('')
      setNewColor(DEFAULT_COLOR)
    }
  }

  const handleRemoveCategory = title => {
    const updated = { ...form.categories }
    delete updated[title]
    setForm(prev => ({ ...prev, categories: updated }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateSettingsAction(form)
      setStatus(res.error ? 'error' : 'success')
    })
  }

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <div className={s.field}>
        <label className={s.label}>Username</label>
        <input
          name='username'
          value={form.username}
          onChange={handleChange}
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Currency</label>
        <select
          name='currency'
          value={form.currency}
          onChange={handleChange}
          className={s.input}
        >
          <option value='USD'>USD</option>
          <option value='EUR'>EUR</option>
          <option value='RSD'>RSD</option>
        </select>
      </div>

      <div className={s.field}>
        <label className={s.label}>Categories:</label>
        <div className={s.categories}>
          {Object.entries(form.categories).map(([title, color]) => (
            <div key={title} className={s.category}>
              <input
                type='color'
                value={color}
                onChange={e => handleCategoryColorChange(title, e.target.value)}
                className={s.colorInput}
              />
              <span>{title}</span>
              <button
                type='button'
                onClick={() => handleRemoveCategory(title)}
                className={s.removeButton}
              >
                X
              </button>
            </div>
          ))}

          <div className={s.category}>
            <input
              type='color'
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              className={s.colorInput}
            />
            <input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder='New category'
              className={s.input}
            />
            <button
              type='button'
              onClick={handleAddCategory}
              className={s.addButton}
            >
              ➕
            </button>
          </div>
        </div>
      </div>

      <button type='submit' disabled={isPending} className={s.button}>
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>

      {status === 'success' && <p className={s.success}>Settings saved!</p>}
      {status === 'error' && <p className={s.error}>Something went wrong.</p>}
    </form>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { updateSettingsAction } from '@/lib/actions/actions'
import { Button } from '@/app/_components/common/ui/Button'
import s from './styles.module.css'

const DEFAULT_COLOR = '#EEEEEE'

export default function UpdateSettingsForm({ initialSettings }) {
  const [form, setForm] = useState({
    username: initialSettings.username || '',
    currency: initialSettings.currency || '',
    categories: initialSettings.categories || {},
    deleted_categories: initialSettings.deleted_categories || {},
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
    const deletedCategories = getDeletedCategories(initialSettings.categories, form.categories)
    const newDeletedCategories = {
      ...initialSettings.deleted_categories,
      ...deletedCategories,
    }
    for (const key in newDeletedCategories) {
      if (key in form.categories) {
        delete newDeletedCategories[key]
      }
    }

    startTransition(async () => {
      if (isCategoriesChanged(initialSettings.categories, form.categories)) {
        // check if any change in categories and update categories
        const selectedCategories = localStorage.getItem('selectedCategories')
        updateLocalStorage(initialSettings, form, selectedCategories)
      }

      const res = await updateSettingsAction({
        ...form,
        deleted_categories: newDeletedCategories
      })
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

      <Button.Large type='submit' disabled={isPending || !isDataChanged(initialSettings, form)}>
        {isPending ? 'Saving...' : 'Save Settings'}
      </Button.Large>

      {status === 'success' && <p className={s.success}>Settings saved!</p>}
      {status === 'error' && <p className={s.error}>Something went wrong.</p>}
    </form>
  )
}

function updateLocalStorage(initialSettings, form, prevCategories) {
  if (!prevCategories) return

  const addedCategories = getAddedCategories(initialSettings.categories, form.categories)
  const deletedCategories = getDeletedCategories(initialSettings.categories, form.categories)

  let newCategories = ''

  if (isNotEmptyObj(deletedCategories)) {
    newCategories = prevCategories.split(',')
      .filter(category => !Object.keys(deletedCategories).includes(category))
      .join(',')
  }

  if (isNotEmptyObj(addedCategories)) {
    newCategories = [...prevCategories.split(','), ...Object.keys(addedCategories)]
      .join(',')
  }

  localStorage.setItem('selectedCategories', newCategories)
}

function isNotEmptyObj(obj) {
  return !!Object.keys(obj).length
}

function getDeletedCategories(prev, cur) {
  const deleted = {}

  for (const key in prev) {
    if (!cur[key]) {
      deleted[key] = prev[key]
    }
  }

  return deleted
}

function getAddedCategories(prev, cur) {
  const added = {}

  for (const key in cur) {
    if (!prev[key]) {
      added[key] = cur[key]
    }
  }

  return added
}

function isCategoriesChanged(prev, cur) {
  const keys1 = Object.keys(prev)
  const keys2 = Object.keys(cur)

  if (keys1.length !== keys2.length) return true

  for (const key of keys1) {
    if (prev[key] !== cur[key]) return true
  }

  return false
}

function isDataChanged(prev, cur) {
  return prev.username !== cur.username ||
    prev.currency !== cur.currency ||
    isCategoriesChanged(prev.categories, cur.categories)
}

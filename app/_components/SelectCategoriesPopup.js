import React, { useState, useTransition } from 'react'
import { revalidatePage } from '@/lib/actions/actions'
import s from '@/app/_styles/_components/SelectCategoriesPopup.module.css'

export const SelectCategoriesPopup = ({ allCategories, selectedCategories }) => {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(selectedCategories)

  function handleToggleCategory(category) {
    setSelected(selected => {
      const arr = selected ? selected.split(',') : []
      if (arr.includes(category)) {
        return arr.filter(item => item !== category).join(',')
      } else {
        return [...arr, category].join(',')
      }
    })
  }

  function saveCategories() {
    if (selected === selectedCategories) return

    startTransition(async () => {
      document.cookie = `selectedCategories=${selected.replaceAll(' ', '_')}; path=/calendar/days; SameSite=Lax`
      await revalidatePage('/calendar/days')
    })
  }

  return (
    <div className={s.box + ' categories-popup-box'}>
      <ul className={s.categories}>
        {Object.keys(allCategories).map(category => (
          <li key={category} className='categories-popup-option'>
            <label key={allCategories[category]} className={s.category}>
              <input
                type='checkbox'
                checked={selected?.includes(category)}
                onChange={() => handleToggleCategory(category)}
              />
              <span>{category}</span>
            </label>
          </li>
        ))}
      </ul>
      <button className={s.button + ' categories-popup-button'} onClick={saveCategories}>save</button>
    </div>
  )
}
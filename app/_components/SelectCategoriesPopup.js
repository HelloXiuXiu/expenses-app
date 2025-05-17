import s from '@/app/_styles/_components/SelectCategoriesPopup.module.css'

export const SelectCategoriesPopup = ({
  allCategories,
  selectedCategories,
  onSetSelectedCategories,
  showDeleted,
  setShowDeleted
}) => {
  function handleToggleCategory(category) {
    onSetSelectedCategories(selected => {
      let newCategories = ''
      const arr = selected ? selected.split(',') : []
      if (arr.includes(category)) {
        newCategories = arr.filter(item => item !== category).join(',')
      } else {
        newCategories = [...arr, category].join(',')
      }
      localStorage.setItem('selectedCategories', newCategories)
      return newCategories
    })
  }

  return (
    <div className={s.box + ' categories-popup-box'}>
      <ul className={s.categories}>
        {Object.keys(allCategories).map(category => (
          <li key={category} className='categories-popup-option'>
            <label className={s.category}>
              <input
                type='checkbox'
                checked={!!selectedCategories?.includes(category)}
                onChange={() => handleToggleCategory(category)}
              />
              <span>{category}</span>
            </label>
          </li>
        ))}
        <li className='categories-popup-option' style={{ marginTop: '20px'}}>
          <label className={s.category}>
            <input
              type='checkbox'
              checked={showDeleted}
              onChange={() => setShowDeleted(state => !state)}
            />
            <span>Show deleted categories</span>
          </label>
        </li>
      </ul>
    </div>
  )
}
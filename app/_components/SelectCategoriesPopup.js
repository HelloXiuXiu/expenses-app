import PopupHeader from '@/app/_components/PopupHeader'
import s from '@/app/_styles/_components/SelectCategoriesPopup.module.css'

export const SelectCategoriesPopup = ({
  allCategories,
  selectedCategories,
  onSetSelectedCategories,
  showDeleted,
  setShowDeleted,
  popupClass,
  closeClass
}) => {
  const isNoCategories = !allCategories || !Object.keys(allCategories).length
  const isAllSelected = Object.keys(allCategories).join(',') === selectedCategories
  const isNoSelected = selectedCategories === ''

  function handleToggleCategory(category) {
    onSetSelectedCategories(selected => {
      let updatedCategories = ''
      const arr = selected ? selected.split(',') : []
      if (arr.includes(category)) {
        updatedCategories = arr.filter(item => item !== category).join(',')
      } else {
        updatedCategories = [...arr, category].join(',')
      }
      localStorage.setItem('selectedCategories', updatedCategories)
      return updatedCategories
    })
  }

  function handleRightButtonClick() {
    if (isNoCategories) return

    // show all
    if (!isAllSelected || isNoSelected) {
      const updatedCategories = Object.keys(allCategories).join(',')
      onSetSelectedCategories(updatedCategories)
      localStorage.setItem('selectedCategories', updatedCategories)
    }  

    // hide all
    if (isAllSelected) {
      onSetSelectedCategories('')
      localStorage.setItem('selectedCategories', '')
    }
  }

  return (
    <div className={`${s.categories} ${popupClass}`}>
      <PopupHeader closeClass={closeClass} />
      {isNoCategories ? (
        <div className={s.noCategories}>
          [ no categories created ]
        </div> 
        ) : (
        <ul className={s.categoriesList}>
          {Object.keys(allCategories).map(category => (
            <li
              key={category}
              className={s.category}
              onClick={() => handleToggleCategory(category)}
            >
              <div
                className={s.categoryContent}
                style={{ opacity: !!selectedCategories?.includes(category) ? '1' :'0.2'}}
              >
                <span>{category}</span>
                <span style={{ backgroundColor: allCategories[category] }} className={s.dot}></span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className={s.buttons}>
        <button
          className={s.button}
          style={{ opacity: showDeleted ? '1' : '0.4'}}
          onClick={() => setShowDeleted(state => !state)}
        >
          <span style={{ opacity: showDeleted ? '1' : '0.6'}}>
            show deleted categories
          </span>
        </button>
        <button
          className={s.button}
          onClick={handleRightButtonClick}
          disabled={isNoCategories}
          style={{ minWidth: '80px' }}
        >
          {isAllSelected ? 'hide all' : isNoSelected ? 'show all' : 'clear all'}
        </button> 
      </div>
    </div>
  )
}
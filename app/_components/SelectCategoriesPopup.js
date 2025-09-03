import { Button } from '@/app/_components/ui/Button'
import s from '@/app/_styles/_components/SelectCategoriesPopup.module.css'

export const SelectCategoriesPopup = ({
  allCategories,
  selectedCategories,
  onSetSelectedCategories,
  showDeleted,
  setShowDeleted,
}) => {
  const isNoCategories = !allCategories || !Object.keys(allCategories).length
  const isNoSelected = selectedCategories === ''
  const isAllSelected =
    Object.keys(allCategories).sort().join(',') ===
    selectedCategories.split(',').sort().join()

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
    <div className={s.categories}>
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
                <span className={s.categotyText}>{category}</span>
                <span style={{ backgroundColor: allCategories[category] }} className={s.dot}></span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className={s.buttons}>
        <Button.Small
          style={{ opacity: showDeleted ? '1' : '0.4', flexGrow: 1}}
          onClick={() => setShowDeleted(state => !state)}
        >
          <span style={{ opacity: showDeleted ? '1' : '0.6'}}>
            show deleted categories
          </span>
        </Button.Small>
        <Button.Small
          onClick={handleRightButtonClick}
          disabled={isNoCategories}
          style={{ minWidth: '90px', flexGrow: 1 }}
        >
          {isAllSelected ? 'hide all' : isNoSelected ? 'show all' : 'clear all'}
        </Button.Small> 
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { AnimatedPopup } from '@/app/_components/common/animation/AnimatedPopup'
import { AddExpenseForm } from '../AddExpenseForm'
import s from './styles.module.css'

export default function NewExpense({ settings }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={s.addButton}>
        <svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M12 2V23' stroke='currentColor' strokeWidth='2'/>
          <path d='M1.5 12.5L22.5 12.5' stroke='currentColor' strokeWidth='2'/>
        </svg>
      </div>
      {isOpen && (
        <AnimatedPopup
          maxHeight={1000}
          width={465}
          onSetIsOpen={setIsOpen}
          styles={{ top: '50px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <AddExpenseForm settings={settings} />
        </AnimatedPopup>
      )}
    </>
  )
}

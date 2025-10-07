import ReactDOM from 'react-dom/client'
import { Toast } from '@/app/_components/ui/Toast'

const TOAST_TIMER = 2000

function setToastBoxStyles(elem) {
  Object.assign(elem.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: '99999999',
  })
}

function showToast({ text, icon, type, position }) {
  const container = document.createElement('div')
  setToastBoxStyles(container)
  document.body.appendChild(container)
  let toastElement = null

  const root = ReactDOM.createRoot(container)
  root.render(
    <Toast
      ref={(el) => (toastElement = el)}
      text={text}
      icon={icon}
      type={type}
      position={position}
    />
  )

  setTimeout(() => {
    if (!toastElement) return
    toastElement.dataset.closing = 'true'

    toastElement.addEventListener('animationend', (e) => {
      root.unmount()
      container.remove()
    }, { once: true })
  }, TOAST_TIMER)
}

export function showTopToast({ text, icon, type }) {
  showToast({ text, icon, type, position: 'topCenter' })
}

export function showBottomToast({ text, icon, type }) {
  showToast({ text, icon, type, position: 'bottomRight' })
}

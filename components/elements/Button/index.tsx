import Link from 'next/link'

import { Component } from '@typs/components'

import './index.sass'

type ButtonProps = {
  click?: () => void
  type?: 'a' | 'button'
  to?: string
}

const Button: Component<ButtonProps> = ({
  click,
  children,
  type,
  to,
  className,
}) => {
  return type && type === 'a' ? (
    <Link href={to!} className={`button${className ? ' ' + className : ''}`}>
      {children}
    </Link>
  ) : (
    <button
      onClick={click}
      className={`button${className ? ' ' + className : ''}`}
    >
      {children}
    </button>
  )
}

export default Button

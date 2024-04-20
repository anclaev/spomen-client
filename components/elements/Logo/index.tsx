import Link from 'next/link'

import { Component } from '@typs/components'

const Logo: Component<{}> = ({ className }) => {
  return (
    <Link
      href='/'
      className={`select-none ${className ? ' ' + className : ''}`}
    >
      <img src='/images/logo.svg' alt='Spomen Logo' />
    </Link>
  )
}

export default Logo

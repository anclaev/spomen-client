import Button from '@elements/Button'

import { Component } from '@typs/components'

import './index.sass'

const NotFound: Component<{}> = () => {
  return (
    <div className='not-found'>
      <span className='not-found__title'>Такой страницы не существует</span>
      <Button className='not-found__button' type='a' to='/'>
        На главную
      </Button>
    </div>
  )
}

export default NotFound

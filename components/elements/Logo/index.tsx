import Link from 'next/link'

const Logo = ({ className }: { className?: string }) => {
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

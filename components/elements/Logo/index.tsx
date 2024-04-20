import Link from 'next/link'

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href='/' className={className}>
      <img src='/images/logo.svg' alt='Spomen Logo' />
    </Link>
  )
}

export default Logo

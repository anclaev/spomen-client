export type RootProps = {
  children?: React.ReactNode
  className?: React.ReactNode
}

export type Component<T> = React.FC<RootProps & T>

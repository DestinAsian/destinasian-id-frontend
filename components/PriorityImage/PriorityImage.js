import NextImage from 'next/image'

export default function PriorityImage(props) {
  const {
    fill,
    sizes,
    unoptimized,
    loading: _loading,
    priority: _priority,
    ...rest
  } = props

  const resolvedSizes = fill && !sizes ? '100vw' : sizes

  const image = (
    <NextImage
      {...rest}
      fill={fill}
      sizes={resolvedSizes}
      priority
      unoptimized={unoptimized ?? true}
    />
  )

  if (!fill) return image

  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    >
      {image}
    </span>
  )
}

export default function resolveImageUrl(imageNode) {
  if (!imageNode) return null

  if (typeof imageNode === 'string') return imageNode

  return (
    imageNode.sourceUrl ||
    imageNode.mediaItemUrl ||
    imageNode.url ||
    imageNode.node?.sourceUrl ||
    imageNode.node?.mediaItemUrl ||
    null
  )
}

function getGraphQLEndpoint() {
  const explicit =
    process.env.WORDPRESS_GRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL
  if (explicit) return explicit

  const wp = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL
  if (!wp) return ''
  return `${wp.replace(/\/$/, '')}/index.php?graphql`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, map: {} })
  }

  const endpoint = getGraphQLEndpoint()
  if (!endpoint) {
    return res.status(500).json({ ok: false, map: {}, error: 'Missing endpoint' })
  }

  const uris =
    req.body && Array.isArray(req.body.uris)
      ? req.body.uris.filter((u) => typeof u === 'string' && u.trim())
      : []

  if (!uris.length) {
    return res.status(200).json({ ok: true, map: {} })
  }

  const deduped = uris.filter((uri, idx, arr) => arr.indexOf(uri) === idx)
  const variables = {}
  const queryArgs = []
  const queryFields = []

  deduped.forEach((uri, idx) => {
    const varName = `u${idx}`
    const fieldName = `n${idx}`
    variables[varName] = uri
    queryArgs.push(`$${varName}: String!`)
    queryFields.push(
      `${fieldName}: nodeByUri(uri: $${varName}) {
        __typename
        ... on Category {
          categoryImages {
            categoryImages { mediaItemUrl sourceUrl }
            categorySlide1 { mediaItemUrl sourceUrl }
          }
        }
      }`,
    )
  })

  const query = `query ResolveGuideFiturImages(${queryArgs.join(', ')}) { ${queryFields.join(' ')} }`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
    const json = await response.json()
    const data = json?.data || {}

    const map = {}
    deduped.forEach((uri, idx) => {
      const node = data?.[`n${idx}`]
      const image =
        node?.categoryImages?.categoryImages?.mediaItemUrl ||
        node?.categoryImages?.categoryImages?.sourceUrl ||
        node?.categoryImages?.categorySlide1?.mediaItemUrl ||
        node?.categoryImages?.categorySlide1?.sourceUrl ||
        ''
      if (image) map[uri] = image
    })

    return res.status(200).json({ ok: true, map })
  } catch {
    return res.status(500).json({ ok: false, map: {} })
  }
}

import { ApolloProvider } from '@apollo/client'
import client from '../utilities/apollo-client' // <── lokasi terbaru

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp

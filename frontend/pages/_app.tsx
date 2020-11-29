import { AppProps } from 'next/app'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import '../styles/globals.scss'
import Layout from '../components/layout'

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} /> 
      </Layout>
    </ApolloProvider>
  )
}

export default MyApp

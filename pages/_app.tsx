import '../styles/globals.css';
import '../styles/markdown.css';

import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { TagContextProvider } from '../components/context/TagContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TagContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TagContextProvider>
  );
}

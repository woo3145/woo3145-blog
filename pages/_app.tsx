import '../styles/globals.css';
import '../styles/markdown.css';

import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { TagContextProvider } from '../components/context/TagContext';

import { Noto_Sans_KR } from '@next/font/google';

const noto = Noto_Sans_KR({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['korean', 'latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${noto.className}`}>
      <TagContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TagContextProvider>
    </div>
  );
}

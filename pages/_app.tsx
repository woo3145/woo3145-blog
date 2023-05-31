import '../styles/globals.css';
import '../styles/markdown.css';
import 'highlight.js/styles/tomorrow-night-bright.css';
import { Noto_Sans_KR } from '@next/font/google';

import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import { TagContextProvider } from '../components/context/TagContext';
import Head from 'next/head';

const noto = Noto_Sans_KR({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['korean', 'latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>woo3145 - blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="woo3145의 개발 블로그 입니다." />
        <meta name="author" content="woo3145" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="woo3145 - blog" />

        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta
          key="twitter:title"
          name="twitter:title"
          content="woo3145 - blog"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="woo3145의 개발 블로그 입니다."
        />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${noto.style.fontFamily};
        }
      `}</style>
      <TagContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TagContextProvider>
    </>
  );
}

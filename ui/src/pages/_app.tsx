import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Navigation } from '../components/Navigation';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Doctor Visit Dashboard</title>
        <meta name="description" content="Real-time doctor visit dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navigation />
      <Component {...pageProps} />
    </>
  );
} 
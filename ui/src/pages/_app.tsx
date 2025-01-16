import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Navigation } from '../components/Navigation';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Doctor Visit Dashboard</title>
        <meta name="description" content="Real-time doctor visit dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navigation />
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.pathname} />
      </AnimatePresence>
    </>
  );
} 
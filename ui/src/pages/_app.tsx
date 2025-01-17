import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Navigation } from '../components/Navigation';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { socket } from '../utils/socket';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  useEffect(() => {
    const handleNavigation = (tab: string) => {
      switch (tab) {
        case 'doctors':
          router.push('/');
          break;
        case 'visits':
          router.push('/visit-trends');
          break;
        case 'family':
          router.push('/monthly-visits');
          break;
      }
    };

    socket.on('navigation:change', handleNavigation);
    return () => {
      socket.off('navigation:change', handleNavigation);
    };
  }, [router]);

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
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDevServerHeartbeat } from '../__create/useDevServerHeartbeat';
import { toPng } from 'html-to-image';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  useDevServerHeartbeat();

  // Sandbox & Screenshot Logic
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'sandbox:web:screenshot:request') {
        try {
          const images = Array.from(document.images);
          await Promise.all([
            'fonts' in document ? (document as any).fonts.ready : Promise.resolve(),
            ...images.map(img => new Promise(resolve => {
              img.crossOrigin = 'anonymous';
              if (img.complete) resolve(true);
              else { img.onload = () => resolve(true); img.onerror = () => resolve(true); }
            }))
          ]);
          await new Promise(resolve => setTimeout(resolve, 250));

          const width = window.innerWidth;
          const height = Math.floor(width / (16/9));

          const dataUrl = await toPng(document.body, {
            cacheBust: true,
            width,
            height,
            style: { width: `${width}px`, height: `${height}px`, margin: '0' },
          });

          window.parent.postMessage({ type: 'sandbox:web:screenshot:response', dataUrl }, '*');
        } catch (error: any) {
          window.parent.postMessage({ type: 'sandbox:web:screenshot:error', error: error.message }, '*');
        }
      }

      if (event.data.type === 'sandbox:navigation') {
        router.push(event.data.pathname);
      }
      
      if (event.data.type === 'sandbox:web:healthcheck') {
        window.parent.postMessage({ 
          type: 'sandbox:web:healthcheck:response', 
          healthy: true, 
          supportsErrorDetected: true 
        }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'sandbox:web:ready' }, '*');
    
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  useEffect(() => {
    if (pathname) {
      window.parent.postMessage({ type: 'sandbox:web:navigation', pathname }, '*');
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

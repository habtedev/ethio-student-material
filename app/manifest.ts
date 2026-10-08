import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ethio Student Material - Freshman Hero',
    short_name: 'EthioStudent',
    description: 'Ethiopian University Freshman Materials, Past Exams, Department Info & Telegram Bot Platform',
    start_url: '/',
    id: '/?source=pwa',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '640x640',
        type: 'image/png',
      },
    ],
    categories: ['education', 'books', 'productivity'],
    shortcuts: [
      {
        name: 'Materials Repository',
        short_name: 'Materials',
        description: 'Browse Ethiopian Freshman Modules, Worksheets & Past Exams',
        url: '/?tab=materials',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Department Info',
        short_name: 'Departments',
        description: 'Check University Department Guidelines and Streams',
        url: '/?tab=departments',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'University Guide',
        short_name: 'Universities',
        description: 'Read Campus Reviews & Survival Tips',
        url: '/?tab=universities',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}

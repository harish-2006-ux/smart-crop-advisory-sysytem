// Smart Agriculture Analytics - Service Worker
// Enables offline functionality and app-like behavior

const CACHE_NAME = 'agri-analytics-v1.2.0';
const STATIC_CACHE = 'agri-static-v1';
const DYNAMIC_CACHE = 'agri-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/analysis',
  '/image-analysis-page',
  '/pest-detection-page',
  '/market-prediction-page',
  '/data-history-page',
  '/performance-page',
  '/getting-started',
  '/static/manifest.json',
  '/static/service-worker.js',
  // Add CSS and JS files
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Caching static files');
      return cache.addAll(STATIC_FILES.map(url => {
        return new Request(url, {
          mode: 'cors',
          credentials: 'omit'
        });
      })).catch(error => {
        console.warn('⚠️ Some files failed to cache:', error);
        // Continue even if some files fail to cache
        return Promise.resolve();
      });
    })
  );
  
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static files and pages
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache
        return cachedResponse;
      }
      
      // Fetch from network and cache
      return fetch(request).then((networkResponse) => {
        // Only cache successful responses
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return networkResponse;
      }).catch(() => {
        // Return offline fallback for pages
        if (request.destination === 'document') {
          return caches.match('/') || createOfflinePage();
        }
        
        // Return placeholder for images
        if (request.destination === 'image') {
          return createPlaceholderImage();
        }
        
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Handle API requests with offline support
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('📡 API request failed, checking cache...');
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline header
      const modifiedResponse = new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: {
          ...cachedResponse.headers,
          'X-Served-From': 'cache'
        }
      });
      return modifiedResponse;
    }
    
    // Return offline error response
    return new Response(JSON.stringify({
      error: 'Offline - No cached data available',
      offline: true,
      message: 'Please check your internet connection and try again'
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'X-Served-From': 'offline'
      }
    });
  }
}

// Create offline fallback page
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Smart Agriculture Analytics</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 2rem; 
          background: #0a0f1c; 
          color: #f8fafc; 
        }
        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
        .retry-btn { 
          background: #10b981; 
          color: white; 
          padding: 1rem 2rem; 
          border: none; 
          border-radius: 0.5rem; 
          cursor: pointer; 
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="offline-icon">📡</div>
      <h1>You're Offline</h1>
      <p>Smart Agriculture Analytics is currently offline.</p>
      <p>Please check your internet connection and try again.</p>
      <button class="retry-btn" onclick="window.location.reload()">🔄 Retry</button>
      <br><br>
      <p><small>Some features may be available offline from cached data.</small></p>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create placeholder image for offline
function createPlaceholderImage() {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" fill="#1e293b"/>
      <text x="100" y="75" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="14">
        📷 Image Offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  console.log('📤 Syncing offline data...');
  
  try {
    // Check if we have any pending data to sync
    const pendingData = await getStoredOfflineData();
    
    if (pendingData.length > 0) {
      console.log(`📊 Found ${pendingData.length} items to sync`);
      
      for (const item of pendingData) {
        try {
          await fetch(item.url, {
            method: item.method,
            headers: item.headers,
            body: item.body
          });
          
          // Remove from offline storage after successful sync
          await removeOfflineData(item.id);
          
        } catch (error) {
          console.warn('⚠️ Failed to sync item:', item.id, error);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Utility functions for offline data storage
async function getStoredOfflineData() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function removeOfflineData(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('🗑️ Removed offline data:', id);
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/static/icons/icon-192x192.png',
    badge: '/static/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'agri-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/static/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/static/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Smart Agriculture Analytics', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

console.log('🌾 Smart Agriculture Analytics Service Worker Ready');
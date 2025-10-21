const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '.next', 'prerender-manifest.json');

const manifest = {
  version: 4,
  routes: {},
  dynamicRoutes: {},
  preview: {
    previewModeId: 'process.env.__NEXT_PREVIEW_MODE_ID',
    previewModeSigningKey: 'process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY',
    previewModeEncryptionKey: 'process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY'
  },
  notFoundRoutes: []
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✓ Fixed prerender-manifest.json');

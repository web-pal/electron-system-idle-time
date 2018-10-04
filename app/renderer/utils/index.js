import path from 'path';

export * from './timers';

export function getPreload() {
  return (
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), 'app/dist/preload.prod.js')
      : path.join(__dirname, '/preload.prod.js')
  );
}

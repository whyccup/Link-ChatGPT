// fix json type undefined
declare module '*.json' {
  const value: any;
  export default value;
}

// fix npm don't have @types/segment
declare module 'segment';

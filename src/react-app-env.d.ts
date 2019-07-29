/// <reference types="react-scripts" />


declare module 'js-yaml' {
  declare const safeLoad: <T> (data: string) => T;
}
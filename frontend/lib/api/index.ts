import { auth } from './modules/auth';
import { person } from './modules/person';
import { relationship } from './modules/relationship';

export const api = { auth, person, relationship };
export type ApiType = typeof api;

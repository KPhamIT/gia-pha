import { auth } from './modules/auth';
import { person } from './modules/person';
import { relationship } from './modules/relationship';
import { settings } from './modules/settings';

export const api = { auth, person, relationship, settings };
export type ApiType = typeof api;

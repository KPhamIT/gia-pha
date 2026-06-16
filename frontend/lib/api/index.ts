import { auth } from './modules/auth';
import { person } from './modules/person';
import { relationship } from './modules/relationship';
import { settings } from './modules/settings';
import { event } from './modules/event';
import { exportPreset } from './modules/export-preset';

export const api = { auth, person, relationship, settings, event, exportPreset };
export type ApiType = typeof api;

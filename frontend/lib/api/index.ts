import { auth } from './modules/auth';
import { person } from './modules/person';
import { relationship } from './modules/relationship';
import { settings } from './modules/settings';
import { event } from './modules/event';
import { exportPreset } from './modules/export-preset';
import { organizations } from './modules/organizations';
import { users } from './modules/users';
import { standardFeatures } from './modules/standard-features';
import { notifications } from './modules/notifications';
import { ceremonies } from './modules/ceremonies';

export const api = {
  auth,
  person,
  relationship,
  settings,
  event,
  exportPreset,
  organizations,
  users,
  standardFeatures,
  notifications,
  ceremonies,
};
export type ApiType = typeof api;

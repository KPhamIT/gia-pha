export const API_ROUTES = {
  AUTH_ME: '/auth/me',
  PERSON_LIST: '/person',
  PERSON: (id: number) => `/person/${id}`,
  PERSON_TREE: (id: number) => `/person/${id}/tree`,
  PERSON_DETAIL: (id: number) => `/person/${id}/detail`,
  RELATIONSHIP_LIST: '/relationship',
  RELATIONSHIP: (id: number) => `/relationship/${id}`,
  SETTINGS: '/settings',
};

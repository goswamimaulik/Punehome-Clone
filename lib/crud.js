import { Project, City, Locality, Developer, User, Lead } from './models';

const STAFF = ['admin', 'manager'];

// One config per admin table: model, what to join, who may write
export const CFG = {
  projects: { M: Project, slug: true, write: STAFF, pop: [{ path: 'city', select: 'name' }, { path: 'locality', select: 'name' }, { path: 'developer', select: 'name' }] },
  cities: { M: City, slug: true, write: STAFF },
  localities: { M: Locality, slug: true, write: STAFF, pop: [{ path: 'city', select: 'name' }] },
  developers: { M: Developer, slug: true, write: STAFF },
  users: { M: User, write: ['admin'], select: '-password' },
  leads: { M: Lead, write: ['admin', 'manager', 'agent'], pop: [{ path: 'project', select: 'title' }, { path: 'assignedTo', select: 'name' }] },
};

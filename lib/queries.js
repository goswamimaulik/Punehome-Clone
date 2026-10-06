import { db } from './db';
import { Project, City, Locality, Developer } from './models';

const plain = (x) => JSON.parse(JSON.stringify(x));
const POP = [{ path: 'city', select: 'name slug' }, { path: 'locality', select: 'name slug' }, { path: 'developer', select: 'name slug' }];

export async function listProjects(filter = {}, limit = 60) {
  await db();
  return plain(await Project.find({ published: true, ...filter }).populate(POP).sort({ createdAt: -1 }).limit(limit).lean());
}

export async function searchProjects(sp = {}) {
  await db();
  const f = {};
  if (sp.type) f.type = sp.type;
  if (sp.status) f.status = sp.status;
  if (sp.bhk) f.configs = sp.bhk;
  if (sp.priceMax) f.price = { $lte: Number(sp.priceMax) };
  if (sp.q) f.title = { $regex: sp.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (sp.city) { const c = await City.findOne({ slug: sp.city }); if (c) f.city = c._id; }
  if (sp.locality) { const l = await Locality.findOne({ slug: sp.locality }); if (l) f.locality = l._id; }
  return listProjects(f, 100);
}

export async function getProject(slug) {
  await db();
  return plain(await Project.findOne({ slug, published: true }).populate(POP).lean());
}

async function withCounts(Model, field) {
  await db();
  const list = plain(await Model.find({ active: true }).sort('name').lean());
  const rows = await Project.aggregate([{ $match: { published: true } }, { $group: { _id: '$' + field, n: { $sum: 1 } } }]);
  const m = Object.fromEntries(rows.map((r) => [String(r._id), r.n]));
  return list.map((x) => ({ ...x, count: m[x._id] || 0 }));
}
export const getCities = () => withCounts(City, 'city');
export const getLocalities = () => withCounts(Locality, 'locality');
export const getDevelopers = () => withCounts(Developer, 'developer');

export async function getBySlug(Model, slug) {
  await db();
  return plain(await Model.findOne({ slug, active: true }).lean());
}

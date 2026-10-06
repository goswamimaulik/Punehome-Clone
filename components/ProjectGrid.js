import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects }) {
  if (!projects.length) return <p className="py-10 text-center text-slate-500">No projects found.</p>;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => <ProjectCard key={p._id} p={p} />)}
    </div>
  );
}

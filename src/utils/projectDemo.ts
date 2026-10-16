import type { Project } from '../data/projects';

export function getProjectDemoPath(project: Pick<Project, 'id' | 'demo'>) {
  const raw = project.demo ?? `projects/${project.id}/index.html`;
  return raw.startsWith('/') ? raw : `/${raw}`;
}

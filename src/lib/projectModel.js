// Общая модель проекта для публичных страниц. Одинакова для демо-данных
// и для проектов из базы (см. api/projects.js → fromRow).
//
// {
//   id, category, status, isDemo, areaM2, completedAt, coverId,
//   photos: { before: [], after: [], gallery: [] },   // { id, src, thumb }
//   ru: { title, district, summary, task, work: [], result },
//   ko: { ... }
// }

export function localizeProject(project, lang) {
  const copy = project[lang] || project.ru;
  return { ...project, ...copy };
}

export function getCover(project) {
  const { after, gallery, before } = project.photos;
  const all = [...after, ...gallery, ...before];
  return (
    (project.coverId && all.find((photo) => photo.id === project.coverId)) ||
    all[0] ||
    null
  );
}

// Пары «до / после» по порядку: before[i] + after[i].
export function getPairs(project) {
  const { before, after } = project.photos;
  const count = Math.min(before.length, after.length);
  return Array.from({ length: count }, (_, i) => ({
    before: before[i],
    after: after[i],
  }));
}

export function getSimilarProjects(project, all, limit = 3) {
  const others = all.filter((item) => item.id !== project.id);
  const sameCategory = others.filter((item) => item.category === project.category);
  const rest = others.filter((item) => item.category !== project.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

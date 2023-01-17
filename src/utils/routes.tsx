export default (baseName: string): { path: string; title: string }[] => [
  {
    path: `${baseName}`,
    title: "Remote B",
  },
  {
    path: `${baseName}about`,
    title: "About",
  },
];

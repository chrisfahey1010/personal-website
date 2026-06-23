export interface NavigationItem {
  label: 'Home' | 'Projects' | 'Resume' | 'Contact';
  href: '/' | '/#projects' | '/#resume' | '/#contact';
}

export const launchNavigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Resume', href: '/#resume' },
  { label: 'Contact', href: '/#contact' },
];

export const launchRoutes = {
  home: launchNavigationItems[0].href,
  projects: launchNavigationItems[1].href,
  resume: launchNavigationItems[2].href,
  contact: launchNavigationItems[3].href,
} as const;

export const launchNavigationTargets = new Set(launchNavigationItems.map((item) => item.href));

export const normalizePathname = (pathname: string) => {
  if (pathname.startsWith('/#')) {
    return pathname;
  }

  if (pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

export const isLaunchNavigationTarget = (pathname: string): pathname is NavigationItem['href'] =>
  launchNavigationTargets.has(normalizePathname(pathname) as NavigationItem['href']);

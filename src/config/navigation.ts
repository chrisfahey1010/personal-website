export interface NavigationItem {
  label: 'Home' | 'Projects' | 'Resume' | 'Contact';
  href: '/' | '/projects/' | '/resume/' | '/contact/';
}

export const launchNavigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Resume', href: '/resume/' },
  { label: 'Contact', href: '/contact/' },
];

export const launchRoutes = {
  home: launchNavigationItems[0].href,
  projects: launchNavigationItems[1].href,
  resume: launchNavigationItems[2].href,
  contact: launchNavigationItems[3].href,
} as const;

export const builtPageRoutes = new Set(launchNavigationItems.map((item) => item.href));

export const normalizePathname = (pathname: string) => {
  if (pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

export const isBuiltPageRoute = (pathname: string): pathname is NavigationItem['href'] =>
  builtPageRoutes.has(normalizePathname(pathname) as NavigationItem['href']);

'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  return {
    routerPush: router.push,
    routerReplace: router.replace,
    routerBack: router.back,
    pathname: pathname,
    routerQuery: query,
  };
}

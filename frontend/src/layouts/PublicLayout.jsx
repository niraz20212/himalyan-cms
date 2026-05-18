import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';

export function PublicLayout() {
  const home = useSelector((state) => state.site.home);
  const headerMenu = home?.menus?.find((item) => item.location === 'HEADER');
  const footerMenu = home?.menus?.find((item) => item.location === 'FOOTER');

  return (
    <div>
      <SiteHeader menu={headerMenu?.items || []} />
      <Outlet />
      <SiteFooter companyInfo={home?.companyInfo} links={footerMenu?.items || []} />
    </div>
  );
}

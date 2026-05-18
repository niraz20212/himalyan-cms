import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { logoutThunk } from '../store/slices/authSlice';

export function PublicLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const home = useSelector((state) => state.site.home);
  const user = useSelector((state) => state.auth.user);
  const headerMenu = home?.menus?.find((item) => item.location === 'HEADER');
  const footerMenu = home?.menus?.find((item) => item.location === 'FOOTER');

  return (
    <div>
      <SiteHeader
        menu={headerMenu?.items || []}
        user={user}
        companyInfo={home?.companyInfo}
        onLogout={async () => {
          await dispatch(logoutThunk());
          navigate('/');
        }}
      />
      <Outlet />
      <SiteFooter companyInfo={home?.companyInfo} links={footerMenu?.items || []} />
    </div>
  );
}

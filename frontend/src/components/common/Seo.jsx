import { Helmet } from 'react-helmet-async';

export function Seo({ title, description }) {
  return (
    <Helmet>
      <title>{title || 'Himalayan Churpi'}</title>
      <meta name="description" content={description || 'Premium Himalayan dog chew exporter from Nepal.'} />
    </Helmet>
  );
}

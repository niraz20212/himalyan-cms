import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ResourceManager } from '../../features/admin/ResourceManager';

const samples = {
  products: JSON.stringify({ name: 'New Product', slug: 'new-product', shortDesc: 'Short description' }, null, 2),
  categories: JSON.stringify({ name: 'New Category', slug: 'new-category' }, null, 2),
  blogs: JSON.stringify({ title: 'New Blog', slug: 'new-blog', excerpt: 'Excerpt', content: '<p>Content</p>' }, null, 2),
  pages: JSON.stringify({ title: 'About Us', slug: 'about-us', summary: 'About page', template: 'default' }, null, 2),
  websiteSettings: JSON.stringify({ key: 'homepage_video', value: { url: 'https://example.com/video.mp4' } }, null, 2),
  inquiries: JSON.stringify({ type: 'CONTACT', name: 'Jane Doe', email: 'jane@example.com', message: 'Hello' }, null, 2),
};

export function ResourcePage() {
  const { resource } = useParams();
  return (
    <>
      <Toaster position="top-right" />
      <ResourceManager title={resource} resource={resource} sampleJson={samples[resource] || JSON.stringify({ title: 'Sample' }, null, 2)} />
    </>
  );
}

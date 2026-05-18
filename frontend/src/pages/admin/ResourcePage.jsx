import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ResourceManager } from '../../features/admin/ResourceManager';

const resourceConfigs = {
  products: {
    description: 'Add and edit products with clear labels instead of raw JSON.',
    primaryTitle: 'name',
    primaryDescription: 'shortDesc',
    primaryMeta: 'slug',
    fields: [
      { name: 'name', label: 'Product name', helpText: 'The main name customers see.' },
      { name: 'slug', label: 'Page URL slug', helpText: 'Use lowercase words with hyphens, for example classic-himalayan-yak-chew.' },
      { name: 'shortDesc', label: 'Short description', type: 'textarea', rows: 3, helpText: 'Short summary used in product cards.' },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 5, helpText: 'Longer explanation for the product detail page.', optional: true },
      { name: 'sku', label: 'SKU', helpText: 'Internal or export code.', optional: true },
      { name: 'exportAvailability', label: 'Export availability', helpText: 'Example: USA, EU, Japan.', optional: true },
      { name: 'featured', label: 'Featured product', type: 'checkbox', helpText: 'Show more prominently on the website.' },
      { name: 'published', label: 'Published', type: 'checkbox', helpText: 'Hide or show the product publicly.', defaultValue: true },
    ],
  },
  categories: {
    description: 'Manage product categories and website organization.',
    primaryTitle: 'name',
    primaryDescription: 'shortDesc',
    primaryMeta: 'slug',
    fields: [
      { name: 'name', label: 'Category name', helpText: 'Example: Yak Cheese Chews.' },
      { name: 'slug', label: 'Page URL slug', helpText: 'Example: yak-cheese-chews.' },
      { name: 'shortDesc', label: 'Short description', type: 'textarea', rows: 3, helpText: 'Brief category summary.', optional: true },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 5, helpText: 'Longer text for category context.', optional: true },
      { name: 'displayOrder', label: 'Display order', type: 'number', helpText: 'Smaller numbers appear first.', defaultValue: 0 },
    ],
  },
  exportCountries: {
    description: 'Add countries shown in the export coverage area and used in order forms.',
    primaryTitle: 'name',
    primaryDescription: 'description',
    primaryMeta: 'code',
    fields: [
      { name: 'name', label: 'Country name', helpText: 'Example: Canada.' },
      { name: 'code', label: 'Country code', helpText: 'Use a short code such as CA, US, JP.' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, helpText: 'Optional explanation for this market.', optional: true },
      { name: 'displayOrder', label: 'Display order', type: 'number', helpText: 'Smaller numbers appear first.', defaultValue: 0 },
    ],
  },
  blogs: {
    description: 'Manage blog posts and news content.',
    primaryTitle: 'title',
    primaryDescription: 'excerpt',
    primaryMeta: 'slug',
    fields: [
      { name: 'title', label: 'Blog title', helpText: 'Headline visible to readers.' },
      { name: 'slug', label: 'Page URL slug', helpText: 'Example: why-yak-cheese-chews-are-premium-dog-treats.' },
      { name: 'excerpt', label: 'Short excerpt', type: 'textarea', rows: 3, helpText: 'Summary shown on listing pages.', optional: true },
      { name: 'content', label: 'Article content', type: 'textarea', rows: 10, helpText: 'HTML content is supported.', optional: true },
      { name: 'published', label: 'Published', type: 'checkbox', helpText: 'Show this blog publicly.', defaultValue: true },
    ],
  },
  pages: {
    description: 'Manage simple pages such as About, Certifications, and Factory Process.',
    primaryTitle: 'title',
    primaryDescription: 'summary',
    primaryMeta: 'slug',
    fields: [
      { name: 'title', label: 'Page title', helpText: 'Main title of the page.' },
      { name: 'slug', label: 'Page URL slug', helpText: 'Example: about-us.' },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 4, helpText: 'Short intro paragraph.', optional: true },
      {
        name: 'template',
        label: 'Template',
        type: 'select',
        helpText: 'Choose the page layout type.',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Home', value: 'home' },
        ],
      },
      { name: 'published', label: 'Published', type: 'checkbox', helpText: 'Show this page publicly.', defaultValue: true },
    ],
  },
  websiteSettings: {
    description: 'Manage technical website settings using labels, with optional advanced JSON when needed.',
    primaryTitle: 'key',
    primaryDescription: 'value',
    primaryMeta: 'key',
    allowAdvancedJson: true,
    fields: [
      { name: 'key', label: 'Setting key', helpText: 'Example: homepage_video or whatsapp_number.' },
      { name: 'value', label: 'Setting value (JSON)', type: 'json', rows: 8, helpText: 'Structured value stored for the website.' },
    ],
  },
  inquiries: {
    description: 'Review and update incoming inquiries in a readable format.',
    primaryTitle: 'name',
    primaryDescription: 'message',
    primaryMeta: 'type',
    fields: [
      {
        name: 'type',
        label: 'Inquiry type',
        type: 'select',
        helpText: 'Classify the inquiry.',
        defaultValue: 'CONTACT',
        options: [
          { label: 'Contact', value: 'CONTACT' },
          { label: 'Distributor', value: 'DISTRIBUTOR' },
          { label: 'Wholesale', value: 'WHOLESALE' },
          { label: 'Order', value: 'ORDER' },
        ],
      },
      { name: 'name', label: 'Sender name', helpText: 'Name of the person contacting you.' },
      { name: 'email', label: 'Email address', helpText: 'Email used for follow-up.' },
      { name: 'company', label: 'Company', helpText: 'Optional company name.', optional: true },
      { name: 'phone', label: 'Phone', helpText: 'Optional phone number.', optional: true },
      { name: 'country', label: 'Country', helpText: 'Optional country.', optional: true },
      { name: 'message', label: 'Message', type: 'textarea', rows: 6, helpText: 'Full inquiry message.' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        helpText: 'Track handling progress.',
        defaultValue: 'NEW',
        options: [
          { label: 'New', value: 'NEW' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'Closed', value: 'CLOSED' },
        ],
      },
      { name: 'notes', label: 'Internal notes', type: 'textarea', rows: 4, helpText: 'Private admin notes.', optional: true },
    ],
  },
};

export function ResourcePage() {
  const { resource } = useParams();
  const config = resourceConfigs[resource] || {
    description: 'Manage this resource with a simple admin form. Advanced fields can still be previewed as JSON.',
    allowAdvancedJson: true,
    fields: [
      { name: 'title', label: 'Title', helpText: 'Main title or label.' },
    ],
  };

  return (
    <>
      <Toaster position="top-right" />
      <ResourceManager title={resource} resource={resource} config={config} />
    </>
  );
}

const resources = {
  categories: {
    model: 'category',
    include: { image: true, seo: true },
    orderBy: { createdAt: 'desc' },
  },
  products: {
    model: 'product',
    include: {
      category: true,
      images: { include: { media: true } },
      seo: true,
      relatedProducts: true,
    },
    orderBy: { createdAt: 'desc' },
  },
  blogs: {
    model: 'blog',
    include: { seo: true, coverImage: true },
    orderBy: { publishedAt: 'desc' },
  },
  testimonials: {
    model: 'testimonial',
    include: { avatar: true },
    orderBy: { createdAt: 'desc' },
  },
  faqs: {
    model: 'faq',
    include: {},
    orderBy: { displayOrder: 'asc' },
  },
  certifications: {
    model: 'certification',
    include: { logo: true },
    orderBy: { displayOrder: 'asc' },
  },
  exportCountries: {
    model: 'exportCountry',
    include: { flagMedia: true },
    orderBy: { displayOrder: 'asc' },
  },
  menus: {
    model: 'menu',
    include: { items: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  },
  pages: {
    model: 'page',
    include: { sections: { orderBy: { order: 'asc' } }, seo: true },
    orderBy: { createdAt: 'desc' },
  },
  media: {
    model: 'media',
    include: {},
    orderBy: { createdAt: 'desc' },
  },
  downloadableFiles: {
    model: 'downloadableFile',
    include: { media: true },
    orderBy: { createdAt: 'desc' },
  },
  websiteSettings: {
    model: 'websiteSetting',
    include: {},
    orderBy: { updatedAt: 'desc' },
  },
  companyInfo: {
    model: 'companyInfo',
    include: { logo: true, brochure: true },
    orderBy: { updatedAt: 'desc' },
  },
  socialLinks: {
    model: 'socialLink',
    include: {},
    orderBy: { displayOrder: 'asc' },
  },
  inquiries: {
    model: 'inquiry',
    include: {},
    orderBy: { createdAt: 'desc' },
  },
};

module.exports = resources;

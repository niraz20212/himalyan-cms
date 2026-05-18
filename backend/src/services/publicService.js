const prisma = require('../config/db');
const { serializeMedia, serializeProduct } = require('../utils/media');

const getWebsiteSnapshot = async () => {
  const [companyInfo, settings, homePage, products, categories, blogs, testimonials, faqs, certifications, countries, menus, files] =
    await Promise.all([
      prisma.companyInfo.findFirst({ include: { logo: true, brochure: true }, orderBy: { updatedAt: 'desc' } }),
      prisma.websiteSetting.findMany({ where: { deletedAt: null } }),
      prisma.page.findFirst({
        where: { slug: 'home', deletedAt: null },
        include: { sections: { orderBy: { order: 'asc' } }, seo: true },
      }),
      prisma.product.findMany({
        where: { deletedAt: null, published: true },
        include: { images: { include: { media: true } }, category: true, seo: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.category.findMany({ where: { deletedAt: null }, include: { image: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.blog.findMany({
        where: { deletedAt: null, published: true },
        include: { coverImage: true, seo: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.testimonial.findMany({ where: { deletedAt: null }, include: { avatar: true }, take: 6 }),
      prisma.faq.findMany({ where: { deletedAt: null }, orderBy: { displayOrder: 'asc' }, take: 8 }),
      prisma.certification.findMany({ where: { deletedAt: null }, include: { logo: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.exportCountry.findMany({ where: { deletedAt: null }, include: { flagMedia: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.menu.findMany({ where: { deletedAt: null }, include: { items: { orderBy: { order: 'asc' } } } }),
      prisma.downloadableFile.findMany({ where: { deletedAt: null }, include: { media: true } }),
    ]);

  return {
    companyInfo: companyInfo
      ? {
          ...companyInfo,
          logo: serializeMedia(companyInfo.logo),
          brochure: serializeMedia(companyInfo.brochure),
        }
      : null,
    settings,
    pages: { home: homePage },
    featuredProducts: products.map(serializeProduct),
    categories,
    blogs: blogs.map((blog) => ({ ...blog, coverImage: serializeMedia(blog.coverImage) })),
    testimonials: testimonials.map((testimonial) => ({ ...testimonial, avatar: serializeMedia(testimonial.avatar) })),
    faqs,
    certifications: certifications.map((certification) => ({ ...certification, logo: serializeMedia(certification.logo) })),
    exportCountries: countries.map((country) => ({ ...country, flagMedia: serializeMedia(country.flagMedia) })),
    menus,
    downloadableFiles: files.map((file) => ({ ...file, media: serializeMedia(file.media) })),
  };
};

module.exports = { getWebsiteSnapshot };

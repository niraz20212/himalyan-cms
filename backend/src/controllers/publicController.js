const prisma = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const publicService = require('../services/publicService');

const home = catchAsync(async (_req, res) => {
  const data = await publicService.getWebsiteSnapshot();
  res.json({ success: true, data });
});

const products = catchAsync(async (_req, res) => {
  const data = await prisma.product.findMany({
    where: { deletedAt: null, published: true },
    include: { images: { include: { media: true } }, category: true, seo: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data });
});

const productBySlug = catchAsync(async (req, res) => {
  const data = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: {
      images: { include: { media: true } },
      category: true,
      seo: true,
      relatedProducts: { include: { images: { include: { media: true } } } },
    },
  });
  res.json({ success: true, data });
});

const blogs = catchAsync(async (_req, res) => {
  const data = await prisma.blog.findMany({
    where: { deletedAt: null, published: true },
    include: { coverImage: true, seo: true },
    orderBy: { publishedAt: 'desc' },
  });
  res.json({ success: true, data });
});

const blogBySlug = catchAsync(async (req, res) => {
  const data = await prisma.blog.findUnique({
    where: { slug: req.params.slug },
    include: { coverImage: true, seo: true },
  });
  res.json({ success: true, data });
});

const pageBySlug = catchAsync(async (req, res) => {
  const data = await prisma.page.findUnique({
    where: { slug: req.params.slug },
    include: { sections: { orderBy: { order: 'asc' } }, seo: true },
  });
  res.json({ success: true, data });
});

const sitemap = catchAsync(async (_req, res) => {
  const [pages, products, blogs] = await Promise.all([
    prisma.page.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ where: { deletedAt: null, published: true }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { deletedAt: null, published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const urls = [
    ...pages.map((item) => ({ loc: `/${item.slug}`, lastmod: item.updatedAt.toISOString() })),
    ...products.map((item) => ({ loc: `/products/${item.slug}`, lastmod: item.updatedAt.toISOString() })),
    ...blogs.map((item) => ({ loc: `/blogs/${item.slug}`, lastmod: item.updatedAt.toISOString() })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item) => `<url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod></url>`)
  .join('')}
</urlset>`;

  res.type('application/xml').send(xml);
});

module.exports = { home, products, productBySlug, blogs, blogBySlug, pageBySlug, sitemap };

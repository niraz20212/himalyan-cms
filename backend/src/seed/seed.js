const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

async function main() {
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN' },
  });

  await prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } });
  await prisma.role.upsert({ where: { name: 'EDITOR' }, update: {}, create: { name: 'EDITOR' } });
  const userRole = await prisma.role.upsert({ where: { name: 'USER' }, update: {}, create: { name: 'USER' } });

  const password = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@himalayanchurpi.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@himalayanchurpi.com',
      password,
      roleId: superAdminRole.id,
    },
  });

  const userPassword = await bcrypt.hash('User@123', 10);
  await prisma.user.upsert({
    where: { email: 'user@himalayanchurpi.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@himalayanchurpi.com',
      password: userPassword,
      roleId: userRole.id,
    },
  });

  const company = await prisma.companyInfo.findFirst();
  if (!company) {
    await prisma.companyInfo.create({
      data: {
        companyName: 'Himalayan Churpi',
        tagline: 'Premium Himalayan Yak Cheese Dog Chews',
        description: 'Export-grade Nepali dog chews crafted from Himalayan yak milk with clean, natural ingredients.',
        address: 'Kathmandu, Nepal',
        phone: '+977-9800000000',
        email: 'hello@himalayanchurpi.com',
        whatsapp: '+9779800000000',
        googleMapUrl: 'https://maps.google.com',
        foundedYear: '2015',
      },
    });
  }

  const page = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      summary: 'Premium Himalayan dog chew export brand',
      template: 'home',
      sections: {
        create: [
          {
            name: 'Hero',
            sectionKey: 'hero',
            order: 1,
            content: {
              eyebrow: 'Made in Nepal',
              title: 'Authentic Himalayan Yak Cheese Churpi For Dogs',
              description: 'Natural, long-lasting and export-quality dog chews sourced from the Himalayan highlands.',
              primaryCta: { label: 'Explore Products', href: '/products' },
              secondaryCta: { label: 'Become a Distributor', href: '/contact' },
            },
          },
          {
            name: 'Trust Strip',
            sectionKey: 'trust',
            order: 2,
            content: {
              stats: [
                { label: 'Export Countries', value: '18+' },
                { label: 'Natural Ingredients', value: '100%' },
                { label: 'Factory Standards', value: 'Premium' },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.seo.upsert({
    where: { pageId: page.id },
    update: {},
    create: {
      pageId: page.id,
      metaTitle: 'Himalayan Churpi | Premium Yak Cheese Dog Chews',
      metaDescription: 'Nepali premium export brand for Himalayan yak cheese dog chews and natural pet treats.',
      keywords: 'Himalayan dog chew, yak cheese churpi, Nepali dog treats',
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: 'yak-cheese-chews' },
    update: {},
    create: {
      name: 'Yak Cheese Chews',
      slug: 'yak-cheese-chews',
      shortDesc: 'Natural Himalayan dog chews',
      description: 'Traditional churpi products for premium dog nutrition.',
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'classic-himalayan-yak-chew' },
    update: {},
    create: {
      name: 'Classic Himalayan Yak Chew',
      slug: 'classic-himalayan-yak-chew',
      shortDesc: 'Long-lasting yak cheese chew for dogs.',
      description: 'Handcrafted in Nepal using yak and cow milk with no artificial additives.',
      ingredients: 'Yak milk, cow milk, lime juice, salt',
      sku: 'HC-001',
      categoryId: category.id,
      featured: true,
      specifications: {
        shelfLife: '24 months',
        protein: 'High',
        origin: 'Nepal',
      },
      sizeVariants: ['Small', 'Medium', 'Large'],
      packagingTypes: ['Retail pouch', 'Bulk export carton'],
      exportAvailability: 'USA, EU, Japan, Australia',
      nutritionalValues: {
        protein: '65%',
        fat: '5%',
        moisture: '12%',
      },
    },
  });

  await prisma.seo.upsert({
    where: { productId: product.id },
    update: {},
    create: {
      productId: product.id,
      metaTitle: 'Classic Himalayan Yak Chew',
      metaDescription: 'Premium Nepali churpi dog chew for natural canine nutrition.',
    },
  });

  await prisma.blog.upsert({
    where: { slug: 'why-yak-cheese-chews-are-premium-dog-treats' },
    update: {},
    create: {
      title: 'Why Yak Cheese Chews Are Premium Dog Treats',
      slug: 'why-yak-cheese-chews-are-premium-dog-treats',
      excerpt: 'A look at what makes Himalayan churpi stand out in the global pet nutrition market.',
      content: '<p>Yak cheese chews combine natural protein, long-lasting chewability, and a clean ingredient profile.</p>',
      publishedAt: new Date(),
    },
  });

  await prisma.faq.createMany({
    data: [
      { question: 'Are your chews natural?', answer: 'Yes. Our products are crafted with traditional Himalayan methods.', displayOrder: 1 },
      { question: 'Do you support private label export?', answer: 'Yes. We support wholesale and private label export partnerships.', displayOrder: 2 },
    ],
    skipDuplicates: true,
  });

  await prisma.testimonial.createMany({
    data: [
      { name: 'Nordic Pet Imports', title: 'Distributor', quote: 'Consistent quality and a strong origin story make this brand stand out.' },
      { name: 'Happy Tails Retail', title: 'Retail Partner', quote: 'Premium packaging and reliable supply for international retail shelves.' },
    ],
    skipDuplicates: true,
  });

  const staticPages = [
    { title: 'About Us', slug: 'about-us', summary: 'Our Himalayan heritage, sourcing values, and export mission.' },
    { title: 'Certifications', slug: 'certifications', summary: 'Certifications and compliance standards for international export.' },
    { title: 'Factory Process', slug: 'factory-process', summary: 'A transparent look at our traditional and modern production standards.' },
    { title: 'Export Countries', slug: 'export-countries', summary: 'Markets served by our premium Nepali dog chew brand.' },
    { title: 'Gallery', slug: 'gallery', summary: 'Photo gallery of products, production, and Himalayan origin stories.' },
    { title: 'FAQ', slug: 'faq', summary: 'Frequently asked questions for buyers, distributors, and pet brands.' },
  ];

  for (const item of staticPages) {
    await prisma.page.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        ...item,
        sections: {
          create: [
            {
              name: 'Overview',
              sectionKey: 'overview',
              order: 1,
              content: {
                headline: item.title,
                body: item.summary,
              },
            },
          ],
        },
      },
    });
  }

  const headerMenu = await prisma.menu.upsert({
    where: { id: 'header-menu' },
    update: {},
    create: {
      id: 'header-menu',
      name: 'Header Menu',
      location: 'HEADER',
      items: {
        create: [
          { label: 'About', href: '/about-us', order: 1 },
          { label: 'Products', href: '/products', order: 2 },
          { label: 'Certifications', href: '/certifications', order: 3 },
          { label: 'Blogs', href: '/blogs', order: 4 },
          { label: 'Contact', href: '/contact', order: 5 },
        ],
      },
    },
    include: { items: true },
  });

  await prisma.menu.upsert({
    where: { id: 'footer-menu' },
    update: {},
    create: {
      id: 'footer-menu',
      name: 'Footer Menu',
      location: 'FOOTER',
      items: {
        create: headerMenu.items.map((item) => ({
          label: item.label,
          href: item.href,
          order: item.order,
        })),
      },
    },
  });

  const certificationTitles = ['Export Documentation Ready', 'Premium Quality Handling'];
  const existingCertifications = await prisma.certification.findMany({
    where: { title: { in: certificationTitles } },
    select: { title: true },
  });
  const existingCertificationSet = new Set(existingCertifications.map((item) => item.title));
  const certificationsToCreate = [
    { title: 'Export Documentation Ready', description: 'Prepared for international shipment and compliance workflows.', displayOrder: 1 },
    { title: 'Premium Quality Handling', description: 'Controlled sourcing and hygienic processing standards.', displayOrder: 2 },
  ].filter((item) => !existingCertificationSet.has(item.title));
  if (certificationsToCreate.length) {
    await prisma.certification.createMany({ data: certificationsToCreate });
  }

  for (const country of [
    { name: 'United States', code: 'US', description: 'Retail and distribution partners for North America.', displayOrder: 1 },
    { name: 'Germany', code: 'DE', description: 'Premium natural pet product importers.', displayOrder: 2 },
    { name: 'Japan', code: 'JP', description: 'High-quality specialty pet retail market.', displayOrder: 3 },
  ]) {
    await prisma.exportCountry.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

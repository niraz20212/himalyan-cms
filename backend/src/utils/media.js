const env = require('../config/env');

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value || '');

const resolveMediaUrl = (value) => {
  if (!value) {
    return '';
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${env.appUrl}${normalizedPath}`;
};

const normalizeMediaStorageValue = (value) => {
  if (!value) {
    return value;
  }

  if (value.startsWith(env.appUrl)) {
    const normalized = value.slice(env.appUrl.length);
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  return value;
};

const serializeMedia = (media) => {
  if (!media) {
    return media;
  }

  return {
    ...media,
    path: media.url,
    url: resolveMediaUrl(media.url),
  };
};

const serializeProduct = (product) => {
  if (!product) {
    return product;
  }

  const images = (product.images || []).map((image) => ({
    ...image,
    media: serializeMedia(image.media),
  }));
  const primaryImage = images.find((image) => image.isPrimary) || images[0];

  return {
    ...product,
    images,
    imageUrl: primaryImage?.media?.url || '',
    imagePath: primaryImage?.media?.path || '',
  };
};

module.exports = {
  normalizeMediaStorageValue,
  resolveMediaUrl,
  serializeMedia,
  serializeProduct,
};

import { API_BASE } from "../Config";

const FALLBACK_IMAGE = "https://via.placeholder.com/300";

export const getOptimizedImageUrl = (img, width = 500) => {
  if (!img || typeof img !== "string") {
    return FALLBACK_IMAGE;
  }

  // Cloudinary image
  if (img.includes("/upload/")) {
    const [beforeUpload, afterUpload] = img.split("/upload/");

    // Don't add Cloudinary transformations twice
    if (
      afterUpload.startsWith("f_auto") ||
      afterUpload.startsWith("q_auto") ||
      afterUpload.startsWith("w_")
    ) {
      return img;
    }

    return `${beforeUpload}/upload/f_auto,q_auto,w_${width}/${afterUpload}`;
  }

  // External image
  if (img.startsWith("http")) {
    return img;
  }

  // Django/local image
  const cleanPath = img.startsWith("/") ? img : `/${img}`;

  return `${API_BASE.replace(/\/$/, "")}${cleanPath}`;
};

export const getProductImage = (product, width = 500) => {
  return getOptimizedImageUrl(
    product?.image_1 ||
      product?.image_2 ||
      product?.image_3,
    width
  );
};

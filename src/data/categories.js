// Сжатые WebP-копии фото с главной (1600px). Сама главная по-прежнему
// использует исходные PNG из assets/img/services.
import bathroomImage from "../assets/img/services-webp/bathroom.webp";
import kitchenImage from "../assets/img/services-webp/kitchen.webp";
import verandaImage from "../assets/img/services-webp/veranda.webp";
import interiorImage from "../assets/img/services-webp/interior-finishing.webp";

// Порядок и id совпадают с карточками на главной (/portfolio?category=<id>).
export const CATEGORIES = [
  { id: "bathroom", image: bathroomImage },
  { id: "kitchen", image: kitchenImage },
  { id: "veranda", image: verandaImage },
  { id: "interior", image: interiorImage },
];

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id);

export function isCategory(value) {
  return CATEGORY_IDS.includes(value);
}

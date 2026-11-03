import { IMAGES } from "./images.js";
import verandaImage from "../assets/img/services-webp/veranda.webp";

// ДЕМОНСТРАЦИОННЫЕ данные для проверки дизайна (этап 1).
// Это не реальные объекты компании. Все проекты помечены isDemo
// и должны быть удалены до публичного запуска; на этапе 3 их заменят
// проекты из базы данных с той же структурой.
//
// Защита от случайной публикации: в рабочей сборке (npm run build)
// демо-проекты скрыты, если явно не задано VITE_SHOW_DEMO_PROJECTS=true.
const SHOW_DEMO =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO_PROJECTS === "true";

function remote(key) {
  return { src: `${IMAGES[key]}=w1600`, thumb: `${IMAGES[key]}=w800` };
}

function local(image) {
  return { src: image, thumb: image };
}

const ALL_PROJECTS = [
  {
    id: "demo-bathroom-yuseong",
    category: "bathroom",
    isDemo: true,
    areaM2: 6,
    completedAt: "2026-05",
    photos: {
      before: [remote("bathroom")],
      after: [remote("mapo")],
      gallery: [remote("dongtan")],
    },
    ru: {
      title: "Полная замена плитки в ванной комнате",
      district: "Тэджон, Юсон-гу",
      summary:
        "Демонтаж старой плитки, гидроизоляция и укладка новой плитки на стены и пол.",
      work: [
        "Демонтаж старой плитки",
        "Гидроизоляция пола и стен",
        "Укладка настенной плитки 300×600",
        "Затирка швов",
      ],
    },
    ko: {
      title: "욕실 타일 전체 교체",
      district: "대전 유성구",
      summary:
        "기존 타일을 철거한 뒤 방수 작업을 하고 벽과 바닥에 새 타일을 시공했습니다.",
      work: [
        "기존 타일 철거",
        "바닥·벽 방수",
        "벽 타일 300×600 시공",
        "줄눈 마감",
      ],
    },
  },
  {
    id: "demo-kitchen-seo",
    category: "kitchen",
    isDemo: true,
    areaM2: 4,
    completedAt: "2026-04",
    photos: {
      before: [remote("kitchen")],
      after: [remote("suwon")],
      gallery: [],
    },
    ru: {
      title: "Кухонный фартук с укладкой «ёлочкой»",
      district: "Тэджон, Со-гу",
      summary:
        "Облицовка стены над рабочей поверхностью белой плиткой с укладкой «ёлочкой».",
      work: [
        "Подготовка стены",
        "Укладка плитки «ёлочкой»",
        "Вырезы под розетки",
      ],
    },
    ko: {
      title: "주방 벽면 헤링본 타일",
      district: "대전 서구",
      summary:
        "싱크대 위 벽면에 화이트 타일을 헤링본 패턴으로 시공했습니다.",
      work: ["벽면 바탕 정리", "헤링본 패턴 타일 시공", "콘센트 위치 재단"],
    },
  },
  {
    id: "demo-interior-dong",
    category: "interior",
    isDemo: true,
    areaM2: 24,
    completedAt: "2026-03",
    photos: {
      before: [remote("songdo")],
      after: [remote("walls")],
      gallery: [remote("floor")],
    },
    ru: {
      title: "Плитка на стенах и полу в квартире",
      district: "Тэджон, Тон-гу",
      summary:
        "Укладка крупноформатной плитки на пол и облицовка стены в гостиной.",
      work: [
        "Выравнивание основания",
        "Укладка напольной плитки",
        "Облицовка стены",
      ],
    },
    ko: {
      title: "아파트 벽·바닥 타일 마감",
      district: "대전 동구",
      summary: "거실 바닥에 대형 타일을 깔고 벽면 타일을 시공했습니다.",
      work: ["바탕면 평탄 작업", "바닥 타일 시공", "벽면 타일 시공"],
    },
  },
  {
    id: "demo-kitchen-jung",
    category: "kitchen",
    isDemo: true,
    areaM2: null,
    completedAt: "2026-02",
    photos: {
      before: [],
      after: [remote("gangnam")],
      gallery: [],
    },
    ru: {
      title: "Облицовка кухонной стены крупноформатной плиткой",
      district: "Тэджон, Чун-гу",
      summary:
        "Пример проекта только с фотографией результата — без сравнения «до / после».",
      work: [],
    },
    ko: {
      title: "주방 벽면 대형 타일 시공",
      district: "대전 중구",
      summary:
        "시공 후 사진만 있는 예시입니다. 이 경우 전후 비교 없이 일반 사진으로 표시됩니다.",
      work: [],
    },
  },
  {
    id: "demo-veranda-daedeok",
    category: "veranda",
    isDemo: true,
    areaM2: 5,
    completedAt: "2026-01",
    photos: {
      before: [],
      after: [local(verandaImage)],
      gallery: [],
    },
    ru: {
      title: "Плитка на полу веранды",
      district: "Тэджон, Тэдок-гу",
      summary: "Подготовка основания и укладка напольной плитки на веранде.",
      work: ["Подготовка основания", "Укладка напольной плитки"],
    },
    ko: {
      title: "베란다 바닥 타일",
      district: "대전 대덕구",
      summary: "베란다 바닥 바탕면을 정리하고 바닥 타일을 시공했습니다.",
      work: ["바탕면 정리", "바닥 타일 시공"],
    },
  },
  {
    id: "demo-bathroom-seo",
    category: "bathroom",
    isDemo: true,
    areaM2: null,
    completedAt: null,
    photos: {
      before: [],
      after: [remote("ansan")],
      gallery: [],
    },
    ru: {
      title: "Обновление плитки в санузле",
      district: "Тэджон, Со-гу",
      summary:
        "Пример проекта без даты и площади — пустые поля на странице не показываются.",
      work: [],
    },
    ko: {
      title: "화장실 타일 보수",
      district: "대전 서구",
      summary:
        "날짜와 면적이 없는 예시입니다. 비어 있는 항목은 페이지에 표시되지 않습니다.",
      work: [],
    },
  },
];

export const DEMO_PROJECTS = ALL_PROJECTS.filter(
  (project) => SHOW_DEMO || !project.isDemo,
).map((project) => ({ status: "published", coverId: null, ...project }));

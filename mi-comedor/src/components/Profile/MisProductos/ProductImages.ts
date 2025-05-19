// src/utils/productImages.ts

export const getImageForDescription = (description: string): string => {
    const desc = description.trim().toLowerCase();

    if (desc.includes("arroz")) return "/images/arroz.png";
    if (desc.includes("leche")) return "/images/leche.png";
    if (desc.includes("aceite")) return "https://i.postimg.cc/hPwbfvYg/aceite.jpg";
    if (desc.includes("pan")) return "/images/pan.png";

    // Imagen por defecto
    return "/images/default.png";
};

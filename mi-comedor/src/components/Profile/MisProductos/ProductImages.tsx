// src/utils/productImages.ts

export const getImageForDescription = (description: string): string => {
    const desc = description.trim().toLowerCase();

    if (desc.includes("arroz")) return "https://i.postimg.cc/QdwNkC5Q/Disenosintitulo-7f862ee8-8552-4ba7-8c69-4c8a3f9fccc8-1200x1200.webp";
    if (desc.includes("leche")) return "https://i.postimg.cc/yxMnyF1q/images.jpg";
    if (desc.includes("aceite")) return "https://i.postimg.cc/hPwbfvYg/aceite.jpg";
    if (desc.includes("azucar")) return "https://i.postimg.cc/fL4xFw4X/20198548.webp";
    if (desc.includes("tallarin")) return "https://i.postimg.cc/DzhvYDj0/molitalia.jpg";
    if (desc.includes("fideos")) return "https://i.postimg.cc/tJRQ3GgQ/fa-1706658131990-2etjc00lgvgy6th.jpg";
    if (desc.includes("sal")) return "https://i.postimg.cc/ZRC5rNsx/descarga.jpg";
    if (desc.includes("harina")) return "https://i.postimg.cc/nc7gXL2j/tienda-010816-765cb2cb22bb911b8274355c4168a42aae9ce1b8-producto-large-90.png";
    if (desc.includes("lenteja")) return "https://i.postimg.cc/h4mpr5dN/coste-o-lenteja.jpg";
    if (desc.includes("frejol")) return "https://i.postimg.cc/yYQgSVNK/frontal-74719.webp";
    if (desc.includes("papa")) return "https://i.postimg.cc/g0Smg0fc/9000109-des2-700x700.webp";
    if (desc.includes("atun")) return "https://i.postimg.cc/1zPbDZXm/20390912.webp";

    // Imagen por defecto
    return "https://i.postimg.cc/GhvQG7fz/3d-delivery-box-parcel.jpg";
};

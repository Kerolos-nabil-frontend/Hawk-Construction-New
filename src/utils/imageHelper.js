export const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;

    // Remove '/api' from the end of the base URL if it exists, or default to localhost:5027
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5026";
    const baseUrl = apiBase.replace(/\/api\/?$/, "");

    // Ensure path starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};

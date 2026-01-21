export const getOptimizedUrl = (url, width = 800) => {
    // 1. Nếu không có url, trả về ảnh rỗng (hoặc ảnh lỗi mặc định nếu muốn)
    if (!url) return '';

    try {
        // 2. Nếu là ảnh base64 hoặc blob (ảnh upload từ máy) thì giữ nguyên
        if (url.startsWith('data:') || url.startsWith('blob:')) return url;

        // 3. Nếu link ảnh gốc bị lỗi không phải http/https (ví dụ đường dẫn tương đối) -> Trả về gốc
        if (!url.startsWith('http')) return url;

        // 4. Trả về link qua server nén wsrv.nl
        return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=80&output=webp`;
    } catch (e) {
        // 5. QUAN TRỌNG: Nếu có bất kỳ lỗi gì khi xử lý -> Trả về link gốc luôn
        return url; 
    }
};
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import CommentSection from '../components/CommentSection'; // 1. Import Bình luận
import { getOptimizedUrl } from '../utils/imageHelper';
function Chapter() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy các tham số từ URL
    const chapterUrl = searchParams.get('url');
    const chapterName = searchParams.get('name');
    const comicSlug = searchParams.get('comicSlug');
    const comicName = searchParams.get('comicName');
    const comicThumb = searchParams.get('comicThumb');

    const [images, setImages] = useState([]);
    const [chapters, setChapters] = useState([]); // Chứa danh sách tất cả chương
    const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
    const [loading, setLoading] = useState(true);

    // 1. Lấy ảnh của chương hiện tại
    useEffect(() => {
        if (!chapterUrl) return;

        const fetchChapterData = async () => {
            setLoading(true);
            try {
                // Gọi API lấy ảnh
                const res = await axiosClient.get(`/chapter?url=${chapterUrl}`);
                setImages(res.data.data.images);
                
                // Lưu lịch sử
                saveHistory();
                
                // Cuộn lên đầu trang mỗi khi đổi chương
                window.scrollTo(0, 0);
            } catch (error) {
                alert("Lỗi tải ảnh chương này!");
            } finally {
                setLoading(false);
            }
        };

        fetchChapterData();
    }, [chapterUrl]);

    // 2. Lấy danh sách toàn bộ chương (để làm nút Next/Prev)
    useEffect(() => {
        const fetchAllChapters = async () => {
            if (!comicSlug) return;
            try {
                const res = await axiosClient.get(`/${comicSlug}`);
                // API trả về danh sách chương (thường nằm trong mảng server_data)
                const list = res.data.data.chapters; 
                setChapters(list);
            } catch (error) {
                console.error("Lỗi lấy danh sách chương");
            }
        };
        fetchAllChapters();
    }, [comicSlug]);

    // 3. Tìm vị trí chương hiện tại trong danh sách
    useEffect(() => {
        if (chapters.length > 0 && chapterUrl) {
            // Tìm index của chương hiện tại dựa vào API Path
            const index = chapters.findIndex(chap => chap.apiPath === chapterUrl);
            setCurrentChapterIndex(index);
        }
    }, [chapters, chapterUrl]);

    // Hàm lưu lịch sử (Giữ nguyên logic cũ)
    const saveHistory = () => {
        if (!comicSlug) return;
        const historyItem = {
            slug: comicSlug,
            name: comicName,
            thumbnail: comicThumb,
            chapterName: chapterName,
            chapterUrl: chapterUrl,
            readAt: new Date().getTime()
        };
        let oldHistory = JSON.parse(localStorage.getItem('manga_history')) || [];
        oldHistory = oldHistory.filter(item => item.slug !== comicSlug);
        oldHistory.unshift(historyItem);
        localStorage.setItem('manga_history', JSON.stringify(oldHistory));
    };

    // Hàm chuyển chương
    const goToChapter = (chap) => {
        // Tạo URL mới với đầy đủ tham số
        const newUrl = `/doc-truyen?url=${encodeURIComponent(chap.apiPath)}&name=${encodeURIComponent(chap.name)}&comicName=${encodeURIComponent(comicName)}&comicSlug=${encodeURIComponent(comicSlug)}&comicThumb=${encodeURIComponent(comicThumb)}`;
        navigate(newUrl);
    };

    return (
        <div className="reader-container" style={{background: '#111', minHeight: '100vh', paddingBottom: '50px'}}>
            
            {/* --- THANH ĐIỀU HƯỚNG TRÊN CÙNG --- */}
            <div className="reader-header" style={{
                position: 'sticky',     // [QUAN TRỌNG] Thay đổi từ fixed -> sticky
                top: 0,                 // Dính chặt vào đỉnh màn hình
                zIndex: 1000,           // Đè lên ảnh
                background: '#222',     // Màu nền đục (không trong suốt) để che ảnh khi cuộn qua
                borderBottom: '1px solid #333', // Thêm viền nhẹ cho tách biệt
                padding: '10px 20px',   
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
            }}>
                <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'16px'}}>
                    ⬅ Quay lại
                </button>
                
                <h3 style={{fontSize: '14px', margin: 0, maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {chapterName}
                </h3>

                {/* Dropdown chọn nhanh chương */}
                <select 
                    value={chapterUrl} 
                    onChange={(e) => {
                        const selectedChap = chapters.find(c => c.apiPath === e.target.value);
                        if(selectedChap) goToChapter(selectedChap);
                    }}
                    style={{maxWidth: '100px', background:'#333', color:'white', border:'1px solid #555', padding:'5px'}}
                >
                    {chapters.map((chap) => (
                        <option key={chap.id} value={chap.apiPath}>
                            {chap.name}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* --- NỘI DUNG ẢNH --- */}
            <div className="pages" style={{maxWidth: '800px', margin: '0 auto'}}>
                {loading && <div className="loading" style={{color:'white', textAlign:'center', padding:'20px'}}>Đang tải ảnh...</div>}
                
                {!loading && images.map((img, index) => (
                    <img key={index} /* 2. SỬA DÒNG SRC NÀY */
                        /* Cũ: src={img} */
                        /* Mới: bọc nó lại như bên dưới (1000 là độ rộng ảnh) */
                        src={getOptimizedUrl(img, 1000)} 
                        
                        alt={`page-${index}`} 
                        loading="lazy" 
                        style={{width: '100%', display: 'block'}} />
                ))}
            </div>

            {/* --- THANH ĐIỀU HƯỚNG DƯỚI CÙNG (Đã sửa logic) --- */}
            {!loading && (
                <div className="navigation-buttons" style={{display:'flex', justifyContent:'center', gap:'15px', margin:'30px 0'}}>
                    
                    {/* Nút Chương Trước */}
                    {/* Logic cũ: index + 1. Logic mới: đổi thành index - 1 (hoặc ngược lại tùy data của bạn) */}
                    {/* Ở đây mình ĐẢO code so với lúc nãy: */}
                    {/* Nút Chương Sau */}
                    {currentChapterIndex > 0 && (
                        <button 
                            // Đổi logic thành lấy chương phía trước trong mảng
                            onClick={() => goToChapter(chapters[currentChapterIndex - 1])}
                            style={{padding:'10px 20px', background:'#61dafb', color:'black', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}
                        >
                            ⬅ Chương trước
                        </button>
                    )}

                    {currentChapterIndex < chapters.length - 1 && (
                        <button 
                            // Đổi logic thành lấy chương phía sau trong mảng
                            onClick={() => goToChapter(chapters[currentChapterIndex + 1])}
                            style={{padding:'10px 20px', background:'#444', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}
                        >
                             Chương sau ➡
                        </button>
                    )}

                    
                </div>
            )}

            {/* --- KHUNG BÌNH LUẬN --- */}
            <div className="container" style={{maxWidth: '800px', marginTop: '50px', padding: '0 10px'}}>
                 {/* Tái sử dụng Component Bình luận */}
                <CommentSection comicSlug={comicSlug} />
            </div>

        </div>
        
    );
}

export default Chapter;
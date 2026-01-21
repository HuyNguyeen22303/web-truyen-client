import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { getOptimizedUrl } from '../utils/imageHelper';
// 1. IMPORT CÁI NÀY (Nếu thiếu dòng này là lỗi trắng trang)
import CommentSection from '../components/CommentSection'; 

function Detail() {
    const { slug } = useParams();
    const [comic, setComic] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axiosClient.get(`/${slug}`);
                setComic(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDetail();
    }, [slug]);

    if (!comic) return <div className="loading">Đang tải chi tiết...</div>;

    return (
        <div className="container">
            <Link to="/" className="back-btn">⬅ Quay lại trang chủ</Link>
            
            {/* Phần thông tin truyện */}
            <div className="detail-box">
                {/* 2. SỬA DÒNG SRC NÀY */}
                {/* Cũ: src={comic.thumbnail} */}
                {/* Mới: bọc lại (500 là kích thước vừa đủ nét cho ảnh bìa) */}
                <img 
                    src={getOptimizedUrl(comic.thumbnail, 500)} 
                    
                    alt={comic.name} 
                    className="detail-img"
                />
                <div className="detail-info">
                    <h1>{comic.name}</h1>
                    <p><strong>Tác giả:</strong> {comic.author}</p>
                    <p><strong>Trạng thái:</strong> {comic.status}</p>
                    <div className="desc" dangerouslySetInnerHTML={{__html: comic.content}}></div>
                </div>
            </div>

            {/* Phần danh sách chương */}
            <div className="chapter-list">
                <h3>Danh sách chương</h3>
                <div className="chapters">
                    {comic.chapters.map((chap) => (
                        <Link 
                            key={chap.id} 
                            to={`/doc-truyen?url=${encodeURIComponent(chap.apiPath)}&name=${encodeURIComponent(chap.name)}&comicName=${encodeURIComponent(comic.name)}&comicSlug=${encodeURIComponent(comic.slug)}&comicThumb=${encodeURIComponent(comic.thumbnail)}`} 
                            className="chapter-btn"
                        >
                            {chap.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 2. CHÈN NÓ VÀO ĐÂY (Cuối cùng, trước thẻ đóng div) */}
            <CommentSection comicSlug={slug} /> 

        </div>
    );
}

export default Detail;
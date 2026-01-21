import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { getOptimizedUrl } from '../utils/imageHelper';
function Home() {
    const [comics, setComics] = useState([]);
    const [page, setPage] = useState(1); // Trang hiện tại
    const [loading, setLoading] = useState(false);

    const fetchHome = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/home?page=${pageNumber}`);
            if (pageNumber === 1) {
                setComics(res.data.data);
            } else {
                // [FIX LỖI LẶP] Lọc bỏ những truyện đã có rồi mới thêm vào
                setComics(prev => {
                    const newComics = res.data.data;
                    // Chỉ lấy những truyện có ID chưa tồn tại trong danh sách cũ
                    const uniqueComics = newComics.filter(
                        newItem => !prev.some(oldItem => oldItem.id === newItem.id)
                    );
                    return [...prev, ...uniqueComics];
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHome(1); // Load trang 1 lúc đầu
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHome(nextPage);
    };

    return (
        <div className="container">
            <h2>🔥 Truyện Mới Cập Nhật</h2>
            <div className="grid-comics">
                {comics.map((item, index) => (
                    <Link to={`/truyen/${item.slug}`} key={`${item.id}-${index}`} className="card">
                        <div className="img-wrapper">
                            {/* 2. SỬA DÒNG SRC NÀY */}
                            {/* Cũ: src={item.thumbnail} */}
                            {/* Mới: bọc lại (300 là kích thước nhỏ gọn cho thumbnail) */}
                            <img 
                                src={getOptimizedUrl(item.thumbnail, 300)} 
                                
                                alt={item.name} 
                                loading="lazy" 
                            />
                        </div>
                        <div className="info">
                            <h3>{item.name}</h3>
                            <p>Chap: {item.latestChapter}</p>
                        </div>
                    </Link>
                ))}
            </div>
            
            <div style={{textAlign: 'center', marginTop: 30}}>
                <button 
                    onClick={handleLoadMore} 
                    disabled={loading}
                    style={{
                        padding: '10px 30px', 
                        fontSize: '16px', 
                        cursor: 'pointer', 
                        background: '#61dafb', 
                        border: 'none', 
                        borderRadius: '5px',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Đang tải...' : 'Xem thêm truyện'}
                </button>
            </div>
        </div>
    );
}

export default Home;
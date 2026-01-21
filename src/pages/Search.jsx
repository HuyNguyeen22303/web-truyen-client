import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Lấy từ khóa từ URL
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchSearch = async () => {
            setLoading(true);
            try {
                // Gọi API search của backend
                const res = await axiosClient.get(`/search?q=${query}`);
                setComics(res.data.data);
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearch();
    }, [query]);

    return (
        <div className="container">
            <h2>🔎 Kết quả tìm kiếm: "{query}"</h2>
            
            {loading && <div className="loading">Đang tìm...</div>}
            
            {!loading && comics.length === 0 && <p>Không tìm thấy truyện nào!</p>}

            <div className="grid-comics">
                {comics.map((item) => (
                    <Link to={`/truyen/${item.slug}`} key={item.id} className="card">
                        <div className="img-wrapper">
                            <img src={item.thumbnail} alt={item.name} loading="lazy" />
                        </div>
                        <div className="info">
                            <h3>{item.name}</h3>
                            <p>Chap mới: {item.latestChapter}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Search;
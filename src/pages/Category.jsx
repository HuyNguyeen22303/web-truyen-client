import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Category() {
    const { slug } = useParams(); // Lấy slug thể loại từ URL
    const [comics, setComics] = useState([]);
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Khi đổi thể loại khác thì reset lại từ đầu
    useEffect(() => {
        setComics([]);
        setPage(1);
        fetchCategory(slug, 1);
    }, [slug]);

    const fetchCategory = async (catSlug, pageNum) => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/genres/${catSlug}?page=${pageNum}`);
            if (pageNum === 1) {
                setComics(res.data.data);
            } else {
                setComics(prev => [...prev, ...res.data.data]);
            }
            setTitle(res.data.titlePage);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCategory(slug, nextPage);
    };

    return (
        <div className="container">
            <h2>📂 Thể loại: {title}</h2>
            <div className="grid-comics">
                {comics.map((item, index) => (
                    <Link to={`/truyen/${item.slug}`} key={`${item.id}-${index}`} className="card">
                        <div className="img-wrapper">
                            <img src={item.thumbnail} alt={item.name} loading="lazy" />
                        </div>
                        <div className="info">
                            <h3>{item.name}</h3>
                            <p>{item.latestChapter}</p>
                        </div>
                    </Link>
                ))}
            </div>
            {comics.length > 0 && (
                <div style={{textAlign: 'center', marginTop: 30}}>
                    <button className="chapter-btn" onClick={handleLoadMore} disabled={loading}>
                        {loading ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Category;
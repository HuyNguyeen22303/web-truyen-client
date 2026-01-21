import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Lấy dữ liệu từ bộ nhớ trình duyệt
        const data = JSON.parse(localStorage.getItem('manga_history')) || [];
        setHistory(data);
    }, []);

    const clearHistory = () => {
        if(window.confirm('Bạn muốn xóa toàn bộ lịch sử?')) {
            localStorage.removeItem('manga_history');
            setHistory([]);
        }
    };

    return (
        <div className="container">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2>🕒 Lịch sử đọc truyện</h2>
                {history.length > 0 && (
                    <button onClick={clearHistory} style={{background:'red', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>
                        Xóa lịch sử
                    </button>
                )}
            </div>

            {history.length === 0 && <p style={{color:'#888'}}>Bạn chưa đọc truyện nào cả.</p>}

            <div className="grid-comics">
                {history.map((item, index) => (
                    // Lưu ý: Link này trỏ thẳng vào trang Đọc (Chapter) để đọc tiếp luôn
                    <Link 
                        to={`/doc-truyen?url=${encodeURIComponent(item.chapterUrl)}&name=${encodeURIComponent(item.chapterName)}&comicName=${encodeURIComponent(item.name)}&comicSlug=${encodeURIComponent(item.slug)}&comicThumb=${encodeURIComponent(item.thumbnail)}`} 
                        key={index} 
                        className="card"
                    >
                        <div className="img-wrapper">
                            <img src={item.thumbnail} alt={item.name} loading="lazy" />
                        </div>
                        <div className="info">
                            <h3>{item.name}</h3>
                            <p style={{color: '#61dafb'}}>Đọc tiếp: {item.chapterName}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default History;
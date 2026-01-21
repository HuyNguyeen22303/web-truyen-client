import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Nhớ import Link
import axios from 'axios';

function CommentSection({ comicSlug }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy thông tin User từ bộ nhớ trình duyệt
    const currentUser = JSON.parse(localStorage.getItem('user'));

    // Đảm bảo đúng Port Server của bạn (5000)
    const API_URL = 'https://web-truyen-server.onrender.com/api/comments';

    // 1. Load danh sách bình luận khi vào truyện
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${API_URL}/${comicSlug}`);
                setComments(res.data.data);
            } catch (error) {
                console.error("Lỗi tải bình luận", error);
            }
        };
        if (comicSlug) fetchComments();
    }, [comicSlug]);

    // 2. Xử lý Gửi bình luận
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra nội dung rỗng
        if (!content.trim()) return;

        // Nếu chưa đăng nhập thì chặn và báo lỗi
        if (!currentUser) {
            alert("Bạn phải đăng nhập mới được bình luận!");
            return;
        }

        setLoading(true);
        try {
            // Lấy token (cái vé) từ bộ nhớ
            const token = localStorage.getItem('token');

            const res = await axios.post(API_URL, {
                comicSlug,
                author: currentUser.fullName, // Lấy tên từ tài khoản đang đăng nhập
                content
            }, {
                // QUAN TRỌNG: Gửi kèm Token trong Header để Server kiểm tra
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Gửi thành công -> Thêm comment mới lên đầu danh sách
            setComments([res.data.data, ...comments]);
            setContent(''); // Xóa ô nhập
        } catch (error) {
            // Báo lỗi chi tiết từ Server gửi về (nếu có)
            alert('Lỗi: ' + (error.response?.data?.message || 'Không gửi được'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment-section" style={{marginTop: '30px', background: '#2a2a2a', padding: '20px', borderRadius: '10px'}}>
            <h3 style={{color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px'}}>
                💬 Bình luận ({comments.length})
            </h3>

            {/* LOGIC: Kiểm tra đã đăng nhập chưa? */}
            {!currentUser ? (
                // TRƯỜNG HỢP 1: Chưa đăng nhập -> Hiện thông báo yêu cầu Login
                <div style={{padding: '20px', textAlign: 'center', background: '#333', borderRadius: '5px', marginBottom: '20px', color: '#ccc'}}>
                    <p>Bạn cần <Link to="/dang-nhap" style={{color:'#61dafb', fontWeight:'bold', textDecoration:'none'}}>Đăng nhập</Link> để bình luận.</p>
                </div>
            ) : (
                // TRƯỜNG HỢP 2: Đã đăng nhập -> Hiện Form nhập liệu
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                    <div style={{color: '#aaa', fontSize: '14px'}}>
                        Đang bình luận với tên: <strong style={{color: '#61dafb'}}>{currentUser.fullName}</strong>
                    </div>
                    
                    <textarea 
                        placeholder="Chia sẻ cảm nghĩ của bạn..." 
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        style={{
                            padding: '10px', 
                            borderRadius: '5px', 
                            border: '1px solid #444', 
                            background: '#333', 
                            color: 'white', 
                            minHeight: '80px',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                        required
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            padding: '10px 20px', 
                            background: loading ? '#555' : '#61dafb', 
                            color: loading ? '#ccc' : '#000',
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: loading ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold',
                            alignSelf: 'flex-end' // Đẩy nút sang phải
                        }}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                </form>
            )}

            {/* Danh sách các bình luận cũ */}
            <div className="comment-list" style={{maxHeight: '500px', overflowY: 'auto', paddingRight: '5px'}}>
                {comments.map((cmt) => (
                    <div key={cmt._id} style={{borderBottom: '1px solid #444', padding: '15px 0'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <strong style={{color: '#61dafb', fontSize: '15px'}}>{cmt.author}</strong>
                            <span style={{fontSize: '12px', color: '#777'}}>
                                {new Date(cmt.createdAt).toLocaleString('vi-VN')}
                            </span>
                        </div>
                        <div style={{color: '#ddd', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap'}}>
                            {cmt.content}
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p style={{color: '#777', fontStyle: 'italic', textAlign: 'center', marginTop: '20px'}}>
                        Chưa có bình luận nào. Hãy là người đầu tiên!
                    </p>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
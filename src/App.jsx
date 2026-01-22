import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';

// Import tất cả các trang
import Home from './pages/Home';
import Detail from './pages/Detail';
import Chapter from './pages/Chapter';
import Search from './pages/Search';
import Category from './pages/Category';
import History from './pages/History';
import Login from './pages/Login';       // [MỚI] Import trang Đăng nhập
import Register from './pages/Register'; // [MỚI] Import trang Đăng ký

import axiosClient from './api/axiosClient';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [genres, setGenres] = useState([]); // Chứa danh sách thể loại
  const navigate = useNavigate();

  // [MỚI] 1. Kiểm tra User đã đăng nhập chưa (Lấy từ LocalStorage)
  const user = JSON.parse(localStorage.getItem('user'));

  // [MỚI] 2. Hàm Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); // Load lại trang để cập nhật giao diện
  };

  // 3. Lấy danh sách thể loại khi mở web
  useEffect(() => {
    const fetchGenres = async () => {
        try {
            const res = await axiosClient.get('/genres');
            setGenres(res.data.data);
        } catch (error) {
            console.error("Lỗi lấy thể loại:", error);
        }
    };
    fetchGenres();
  }, []);

  // 4. Xử lý tìm kiếm
  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim()) {
      navigate(`/tim-kiem?q=${keyword}`);
      setKeyword('');
    }
  };

  return (
    <>
      <header className="main-header">
          <div className="container header-content">
            
            {/* KHU VỰC TRÁI: Logo + Nút Lịch sử */}
            <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                <Link to="/" style={{textDecoration:'none', display: 'flex', alignItems: 'center'}}>
                    <h1>Manga 24h</h1>
                </Link>
                <Link to="/lich-su" style={{color:'#ccc', fontWeight:'bold', fontSize:'14px', textDecoration:'none'}}>
                    🕒 Lịch sử
                </Link>
            </div>

            {/* KHU VỰC PHẢI: Ô tìm kiếm + User */}
            <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                {/* Ô tìm kiếm */}
                <input 
                    type="text" 
                    placeholder="Tìm truyện..." 
                    className="search-input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleSearch}
                />

                {/* [MỚI] Phần hiển thị thông tin User */}
                <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                    {user ? (
                        // Nếu ĐÃ đăng nhập
                        <>
                            <span style={{color: '#61dafb', fontWeight:'bold', fontSize:'14px'}}>
                                Hi, {user.fullName}
                            </span>
                            <button 
                                onClick={handleLogout} 
                                style={{
                                    background:'#e74c3c', 
                                    color:'white', 
                                    border:'none', 
                                    padding:'5px 10px', 
                                    borderRadius:'4px', 
                                    cursor:'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Thoát
                            </button>
                        </>
                    ) : (
                        // Nếu CHƯA đăng nhập
                        <Link to="/dang-nhap" style={{color: 'white', fontWeight: 'bold', fontSize:'14px', textDecoration:'none'}}>
                            👤 Đăng nhập
                        </Link>
                    )}
                </div>
            </div>

          </div>
          
          {/* Thanh Menu Thể loại (Chạy ngang bên dưới) */}
          <div className="genre-bar">
             <div className="container genre-scroll">
                {genres.map(g => (
                    <Link to={`/the-loai/${g.slug}`} key={g._id} className="genre-item">
                        {g.name}
                    </Link>
                ))}
             </div>
          </div>
      </header>
      
      {/* KHU VỰC ROUTES: Điều hướng trang */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/truyen/:slug" element={<Detail />} />
        <Route path="/doc-truyen" element={<Chapter />} />
        <Route path="/tim-kiem" element={<Search />} />
        <Route path="/the-loai/:slug" element={<Category />} />
        <Route path="/lich-su" element={<History />} />
        
        {/* [MỚI] Thêm 2 đường dẫn Login/Register */}
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
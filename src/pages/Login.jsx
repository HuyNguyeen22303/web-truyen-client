import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Gọi API đăng nhập
            const res = await axios.post('https://web-truyen-server.onrender.com/api/auth/login', {
                username, password
            });

            // Nếu thành công:
            // 1. Lưu token vào bộ nhớ trình duyệt
            localStorage.setItem('token', res.data.token);
            // 2. Lưu thông tin user
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert('Đăng nhập thành công!');
            navigate('/'); // Chuyển về trang chủ
            window.location.reload(); // Reload để cập nhật Header (cách đơn giản nhất)
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi đăng nhập');
        }
    };

    return (
        <div className="container" style={{maxWidth: '400px', marginTop: '50px'}}>
            <h2>🔐 Đăng Nhập</h2>
            <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <input 
                    type="text" placeholder="Tên đăng nhập" 
                    value={username} onChange={e => setUsername(e.target.value)}
                    className="search-input" style={{width: '100%'}} required
                />
                <input 
                    type="password" placeholder="Mật khẩu" 
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="search-input" style={{width: '100%'}} required
                />
                <button type="submit" style={{padding: '10px', background: '#61dafb', border: 'none', cursor: 'pointer', fontWeight:'bold'}}>
                    Đăng Nhập
                </button>
            </form>
            <p style={{marginTop: '20px'}}>
                Chưa có tài khoản? <Link to="/dang-ky" style={{color: '#61dafb'}}>Đăng ký ngay</Link>
            </p>
        </div>
    );
}

export default Login;
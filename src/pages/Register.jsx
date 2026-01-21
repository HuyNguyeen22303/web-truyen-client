import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // GỌI TRỰC TIẾP URL ĐẦY ĐỦ CỦA SERVER RENDER
            // Nhớ thay đúng link render của bạn vào chỗ https://...
            const response = await axios.post(
                "https://web-truyen-server.onrender.com/api/auth/register",
                {
                    username: username,
                    password: password,
                    // ...
                },
            );

            console.log("Đăng ký thành công:", response.data);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    return (
        <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
            <h2>📝 Đăng Ký</h2>
            <form
                onSubmit={handleRegister}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
                <input
                    type="text"
                    placeholder="Tên hiển thị (VD: Huy Dev)"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="search-input"
                    style={{ width: "100%" }}
                    required
                />
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="search-input"
                    style={{ width: "100%" }}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="search-input"
                    style={{ width: "100%" }}
                    required
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        background: "#61dafb",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Đăng Ký
                </button>
            </form>
            <p style={{ marginTop: "20px" }}>
                Đã có tài khoản?{" "}
                <Link to="/dang-nhap" style={{ color: "#61dafb" }}>
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}

export default Register;

import axios from 'axios';

// Nếu Server Node.js của bạn chạy port khác 3000 thì sửa ở đây
const axiosClient = axios.create({
    baseURL: 'https://web-truyen-server.onrender.com/api/comics',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
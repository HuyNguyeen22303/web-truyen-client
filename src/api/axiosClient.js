import axios from 'axios';

// Nếu Server Node.js của bạn chạy port khác 3000 thì sửa ở đây
const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api/comics',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
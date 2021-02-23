import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-b8545-default-rtdb.firebaseio.com/'
});

export default instance;
const axios = require('axios')
const config = require('../config/config')

class UsuarioService {
    constructor() {

    }

    GetUserByLogin(username, password) {
        const url = `${config.UserEndPoint}?username=${username}&password=${password}`;
        return axios.get(url).then(res => res.data);
    }
}

module.exports = UsuarioService
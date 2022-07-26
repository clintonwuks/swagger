import axios from 'axios'

class swaggerService {
    retrieveApi() {
        console.log('executed service');
        return axios.get('https://petstore.swagger.io/v2/swagger.json')
    }
}
export default new swaggerService()
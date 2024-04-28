import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
    const res = await axios.post(baseUrl, credentials)
    return res
}   

export default  { login }
import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = '/api/notes' //! relative url

let token = null
const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token },
    }
    const res = await axios.post(baseUrl, newObject, config)
    return res.data
    // const request = axios.post(baseUrl, newObject)
    // return request.then(response => response.data)
}

const update = (id,newObject) => {
    const request = axios.put(`${baseUrl}/${id}`,newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data )
}

export default {getAll, create, update, remove, setToken}
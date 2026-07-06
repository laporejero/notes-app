import axios from 'axios'
import type { Note } from '../types'

const baseUrl = '/api/notes'

let token:string|null = null

const setToken = (newToken:string) => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.get(baseUrl, config)
    return response.data
}

const create = async (newNote:Note) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, newNote, config)
    return response.data
}

const update = (id:string, updatedNote:Note) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.put(`${baseUrl}/${id}`, updatedNote, config)
}

const deleteNote = (id:string) => {
    const config = {
        headers: { Authorization: token }
    }
    return axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, deleteNote, setToken }
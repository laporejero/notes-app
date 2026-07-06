import axios from 'axios'
import type { Note } from '../types'

const baseUrl = '/api/notes'

let token:string|null = null

const setToken = (newToken:string) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    return axios.get(baseUrl)
}

const create = async (newNote:Note) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, newNote, config)
    return response.data
}

const update = (id:string, updatedNote:Note) => {
    return axios.put(`${baseUrl}/${id}`, updatedNote)
}

const deleteNote = (id:string) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, deleteNote, setToken }
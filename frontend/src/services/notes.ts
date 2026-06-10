import axios from 'axios'
import type { Note } from '../types'

const baseUrl = '/api/notes'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = (newNote:Note) => {
    return axios.post(baseUrl, newNote)
}

const update = (id:string, updatedNote:Note) => {
    return axios.put(`${baseUrl}/${id}`, updatedNote)
}

const deleteNote = (id:string) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, deleteNote }
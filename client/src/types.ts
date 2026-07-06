export type Note = {
    id: string
    title: string
    note: string
    isFavorite: boolean
    pinned: boolean
    createdAt: string
}

export type User = {
    token: string,
    username: string,
    name: string
}

export type Filter = "All" | "Favorites" | "Pinned"

export type Sort = "Newest" | "Oldest" | "Favorites"
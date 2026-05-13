export type Note = {
    id: number
    title: string
    note: string
    isFavorite: boolean
    createdAt: string
}

export type Filter = "All" | "Favorites"

export type Sort = "Newest" | "Oldest" | "Favorites"
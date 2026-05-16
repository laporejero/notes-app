export type Note = {
    id: number
    title: string
    note: string
    isFavorite: boolean
    pinned: boolean
}

export type Filter = "All" | "Favorites"

export type Sort = "Newest" | "Oldest" | "Favorites"
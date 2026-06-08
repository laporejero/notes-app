export type Note = {
    id: number
    title: string
    note: string
    isFavorite: boolean
    pinned: boolean
}

export type Filter = "All" | "Favorites" | "Pinned"

export type Sort = "Newest" | "Oldest" | "Favorites"
export type Note = {
    id: number
    title: string
    note: string
    isFavorite: boolean
}

export type Filter = "All" | "Favorites"

export type Sort = "Newest" | "Oldest" | "Favorites"
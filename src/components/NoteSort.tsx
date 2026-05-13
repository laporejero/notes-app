import type { JSX } from "react"
import type { Sort } from "../types"

type NoteSortProps = {
    sort: Sort
    setSort: (sort: Sort) => void
}

function NoteSort({ sort, setSort }: NoteSortProps): JSX.Element {
    return (
        <form>
            <label>
                <span>Sort: </span>
                <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value as Sort)}
                >
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Favorites">Favorites</option>
                </select>
            </label>
        </form>
    )
}

export default NoteSort
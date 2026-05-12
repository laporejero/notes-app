import type { JSX } from "react"
import type { Filter } from "../types"

type NoteFilterProps = {
    filter: Filter
    setFilter: (filter: Filter) => void
}

function NoteFilter({ filter, setFilter }: NoteFilterProps): JSX.Element {
    return (
        <form>
            <label>
                Show notes:
                <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value as Filter)}
                >
                    <option value="All">All</option>
                    <option value="Favorites">Favorites</option>
                </select>
            </label>
        </form>
    )
}

export default NoteFilter
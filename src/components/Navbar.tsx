import type { JSX } from "react"

type NavbarProps = {
    search: string
    setSearch: (value: string) => void
}

function Navbar({ search, setSearch }: NavbarProps): JSX.Element {
    return (
        <>
            <nav className="navbar">
                <h3>Notes App</h3>
                <input 
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </nav>
        </>
    )
}

export default Navbar
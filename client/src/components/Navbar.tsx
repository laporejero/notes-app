import type { JSX } from "react"

type NavbarProps = {
    search: string
    setSearch: (value: string) => void
    handleLogout: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function Navbar({ search, setSearch, handleLogout }: NavbarProps): JSX.Element {
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
                <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
            </nav>
        </>
    )
}

export default Navbar
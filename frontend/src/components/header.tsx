import { ModeToggle } from "./mode-toggle"

export default function Header(){
    return(
        <header className="border-b mx-auto max-w-screen-xl py-5 px-2">
            <ModeToggle/>
        </header>
    )
}
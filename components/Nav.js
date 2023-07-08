import { Home, Settings, ShoppingBag, PackageSearch, FolderTree, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"

const Nav = () => {
    const router = useRouter()
    const { pathname } = router

    const navLinks = [
        { route: "/", icon: Home, label: "Inicio" },
        { route: "/products", icon: ShoppingBag, label: "Productos" },
        { route: "/categories", icon: FolderTree, label: "Categorías" },
        { route: "/orders", icon: PackageSearch, label: "Pedidos" },
        { route: "/settings", icon: Settings, label: "Configuración" }
    ]

    const inactiveLink = "flex gap-1 p-1"
    const activeLink = `${inactiveLink} bg-highlight text-black rounded-sm`
    const inactiveIcon = "w-6 h-6"
    const activeIcon = `${inactiveIcon} text-primary`

    const handleSignOut = async () => {
        await router.push("/")
        await signOut()
    };

    return (
        <div className="hidden md:flex">
            <aside className="top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto border-r-2">
                <Link href={"/"} className="flex mb-4 mr-6">
                    Panel de administración
                </Link>
                <nav className="flex flex-col gap-2">
                    {navLinks.map((navLink, index) => (
                        <Link
                            key={index}
                            href={navLink.route}
                            className={pathname === navLink.route ? activeLink : inactiveLink}
                        >
                            <navLink.icon className={pathname === navLink.route ? activeIcon : inactiveIcon} />
                            {navLink.label}
                        </Link>
                    ))}
                    <Link
                        href={"/"}
                        onClick={handleSignOut}
                        className="absolute bottom-0 flex gap-1 p-1 mb-2"
                    >
                        <LogOut />
                        Cerrar sesión
                    </Link>
                </nav>
            </aside>
        </div>
    );
};

export default Nav;

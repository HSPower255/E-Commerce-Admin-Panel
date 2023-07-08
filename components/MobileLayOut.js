import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Menu, X, Home, Settings, ShoppingBag, PackageSearch, FolderTree, LogOut, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"

const MobileLayOut = () => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { pathname } = router
    const inactiveLink = "flex gap-1 p-1"
    const activeLink = inactiveLink + " text-indigo-600"

    const signOutPusher = async () => {
        await router.push('/')
        await signOut()
    }

    return (
        <div className='fixed bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 py-2 px-4 '>
            <div className='w-full flex justify-between items-center'>
                <Link className='flex gap-1 font-bold text-indigo-600' href='/'>
                    <Wrench className='h-6 w-auto text-indigo-600' />
                    Panel de Administración
                </Link>
                <button onClick={() => setOpen(true)} className='bttn-default'>
                    <Menu className='h-6 w-6' />
                </button>
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as='div' className='relative z-10' onClose={setOpen}>
                    <div className='fixed inset-0' />
                    <div className='fixed inset-0 overflow-hidden'>
                        <div className='absolute inset-0 overflow-hidden'>
                            <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                                <Transition.Child
                                    as={Fragment}
                                    enter='transform transition ease-in-out duration-500 sm:duration-700'
                                    enterFrom='-translate-x-full'
                                    enterTo='translate-x-0'
                                    leave='transform transition ease-in-out duration-500 sm:duration-700'
                                    leaveFrom='translate-x-0'
                                    leaveTo='-translate-x-full'>
                                    <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                                        <div className='flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl'>
                                            <div className='px-4 sm:px-6'>
                                                <div className='flex items-start justify-between'>
                                                    <h1 className='text-indigo-600'>Panel de Administración</h1>
                                                    <div className='ml-3 flex h-7 items-center'>
                                                        <button
                                                            type='button'
                                                            className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                                            onClick={() => setOpen(false)}>
                                                            <X className='h-6 w-6' aria-hidden='true' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                                                <nav className="flex flex-col gap-2">
                                                    <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
                                                        <Home />
                                                        Inicio
                                                    </Link>
                                                    <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
                                                        <ShoppingBag />
                                                        Productos
                                                    </Link>
                                                    <Link href={'/categories'} className={pathname.includes('/categories') ? activeLink : inactiveLink}>
                                                        <FolderTree />
                                                        Categorías
                                                    </Link>
                                                    <Link href={'/orders'} className={pathname.includes('/orders') ? activeLink : inactiveLink}>
                                                        <PackageSearch />
                                                        Pedidos
                                                    </Link>
                                                    <Link href={'/settings'} className={pathname.includes('/settings') ? activeLink : inactiveLink}>
                                                        <Settings />
                                                        Configuración
                                                    </Link>
                                                    <Link href={'/'} onClick={signOutPusher} className="flex gap-1 p-1 absolute bottom-0">
                                                        <LogOut />
                                                        Cerrar sesión
                                                    </Link>
                                                </nav>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    )
}

export default MobileLayOut
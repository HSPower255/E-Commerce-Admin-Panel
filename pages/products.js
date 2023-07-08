import Layout from "@/components/Layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import Swal from 'sweetalert2'
import { toast } from "react-hot-toast"
import axios from "axios"
import { BeatLoader } from "react-spinners"

const Products = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, []
    )

    const fetchProducts = async () => {
        setIsLoading(true)
        axios.get('/api/products').then(response => {
            setProducts(response.data)
            setIsLoading(false)
        })
    }

    const deleteProduct = (product) => {
        Swal.fire({
            title: `¿Seguro qué quieres eliminar el producto "${product.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d55',
            confirmButtonText: 'Eliminar',
            customClass: {
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
            }
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = product
                await axios.delete(`/api/products?id=${_id}`)
                fetchProducts()
                toast.success('Producto eliminado correctamente!')
            }
        })
    }

    return (
        <Layout>
            <Link href={'/products/newproduct'} className="bttn-primary flex items-center">
                <Plus className="w-4 h-4" />
                Agregar nuevo producto
            </Link>
            {isLoading ? (
                <table className="basic mt-4">
                    <tr className="flex justify-center py-5">
                        <td>
                            <BeatLoader />
                        </td>
                    </tr>
                </table>
            ) : products.length > 0 && (
                <table className="basic mt-3">
                    <thead>
                        <tr>
                            <td>Productos</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>
                                    <Link className="bttn-default" href={`/products/edit/${product._id}`}>
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Link>
                                    <button className="bttn-red" onClick={() => deleteProduct(product)}>
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default Products
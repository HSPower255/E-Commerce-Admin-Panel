import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { Camera, Edit, Save } from "lucide-react"
import { PulseLoader } from "react-spinners"
import { ReactSortable } from "react-sortablejs"


const ProductForm = ({ _id, name: existingName, description: existingDescription, price: existingPrice, images: existingImages, category: existingCategory, properties: existingProperties }) => {
    const [name, setName] = useState(existingName || '')
    const [category, setCategory] = useState(existingCategory || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [images, setImages] = useState(existingImages || [])
    const [isUploading, setIsUpLoading] = useState(false)
    const [price, setPrice] = useState(existingPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const [categories, setCategories] = useState([])
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const router = useRouter()
    const { pathname } = router

    useEffect(() => {
        axios.get('/api/categories').then(response => {
            setCategories(response.data)
        })
    }, [])

    if (goToProducts) {
        router.push('/products')
    }

    //ADD PRODUCTS
    const createProduct = async (e) => {
        e.preventDefault()
        const data = { name, description, price, images, category, properties: productProperties }
        try {
            if (_id) {
                //Update products
                await axios.put('/api/products', { ...data, _id })
                toast.success('Producto editado correctamente!')
            } else {
                //Create Products
                await axios.post('/api/products', data)
                toast.success('Producto creado correctamente!')
            }
            setGoToProducts(true)
        } catch (error) {
            toast.error('Ha ocurrido un error!')
        }
    }

    const arrangeImages = (images) => {
        setImages(images)
    }

    const uploadImages = async (e) => {
        const files = e.target?.files
        if (files?.length > 0) {
            setIsUpLoading(true)
            const data = new FormData()
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUpLoading(false)
        }
    }

    let setProductProp = (propName, value) => {
        setProductProperties(prev => {
            const newProductProps = { ...prev }
            newProductProps[propName] = value
            return newProductProps
        })
    }

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category)
        propertiesToFill.push(...catInfo.properties)
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id)
            propertiesToFill.push(...parentCat.properties)
            catInfo = parentCat
        }
    }

    return (
        <form onSubmit={createProduct}>
            <label>Nombre del producto</label>
            <input
                required="true"
                type="text"
                placeholder="Nombre del producto"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <label>Categoría</label>
            <select
                required="true"
                value={category}
                onChange={e => setCategory(e.target.value)}>
                <option value="">Producto sin categoría</option>
                {categories.length > 0 && categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name}>
                    <label>{p.name}</label>
                    <div>
                        <select value={productProperties[p.name]}
                            onChange={e =>
                                setProductProp(p.name, e.target.value)
                            }
                        >
                            {p.values.map(propertiesValues => (
                                <option key={propertiesValues} value={propertiesValues}>{propertiesValues}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>Descripción</label>
            <textarea
                placeholder="Descripción del producto"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <label>Imágenes</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable className="flex flex-wrap gap-1" list={images} setList={arrangeImages}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24">
                            <img src={link} className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <PulseLoader size={8} color="#1E3A8A" />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
                    <Camera />
                    Agregar
                    <input onChange={uploadImages} type="file" className="hidden" />
                </label>
            </div>
            <label>Precio</label>
            <input
                min={0}
                required="true"
                type="number"
                placeholder="Precio del producto"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            {pathname.includes('/products/edit') ?
                <button
                    type="submit"
                    className="bttn-primary"
                >
                    <Edit className="w-4 h-4" />
                    Editar producto
                </button> :
                <button
                    type="submit"
                    className="bttn-primary"
                >
                    <Save className="w-4 h-4" />
                    Crear producto
                </button>
            }
        </form>
    )
}

export default ProductForm
import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import axios from "axios"
import { Edit, Trash2, Plus, Ban } from "lucide-react"
import { toast } from "react-hot-toast"
import Swal from 'sweetalert2'
import { BeatLoader } from "react-spinners"

const Categories = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = () => {
        setIsLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
            setIsLoading(false)
        })
    }

    const saveCategory = async (e) => {
        e.preventDefault()
        const data = {
            name, parentCategory, properties: properties.map(p => ({ name: p.name, values: p.values.split(','), })),
        }
        try {
            if (editedCategory) {
                data._id = editedCategory._id;
                await axios.put('/api/categories', data)
                toast.success('Categoría actualizada correctamente!')
                setEditedCategory(null)
            } else {
                await axios.post('/api/categories', data)
                toast.success('Categoría creada correctamente!')
            }
            setName('')
            setParentCategory('')
            setProperties([])
            fetchCategories()
        } catch (error) {
            toast.error('Ha ocurrido un error!')
        }
    }

    const editCategory = (category) => {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            }))
        )
    }

    const deleteCategory = (category) => {
        Swal.fire({
            title: `¿Seguro qué quieres eliminar la categoría "${category.name}"?`,
            icon: 'warning',
            confirmButtonColor: '#d55',
            confirmButtonText: 'Eliminar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
            }
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category
                await axios.delete(`/api/categories?_id=${_id}`)
                fetchCategories()
                toast.success('Categoría eliminada correctamente!')
            }
        })
    }

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        })
    }

    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }

    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })
    }

    const removeProperty = indexToRemove => {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            })
        })
    }

    return (
        <Layout>
            <h1>Categorías</h1>
            <label>
                {editedCategory ? `Editar categoría ${editedCategory.name}` : 'Crear nueva categoría'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={'Nombre de la categoría'}
                        onChange={e => setName(e.target.value)}
                        value={name}
                        required
                    />
                    <select
                        onChange={e => setParentCategory(e.target.value)}
                        value={parentCategory}
                    >
                        <option value="">Sin categoría raíz</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block">Propiedades</label>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input
                                type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                                placeholder="Nombre de la propiedad (Ej: Marca}"
                                required
                            />
                            <input
                                type="text"
                                className="mb-0"
                                onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                                value={property.values}
                                placeholder="Valor de la propiedad (Ej: Nivea)" />
                            <button
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="bttn-red">
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        className="bttn-default mb-5"
                        onClick={addProperty}
                        type="button"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar propiedad
                    </button>
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            className="bttn-red"
                            type="button"
                            onClick={() => {
                                setEditedCategory(null)
                                setName('')
                                setParentCategory('')
                                setProperties([])
                            }}>
                            <Ban className="w-4 h-4" />
                            Cancelar Edición
                        </button>
                    )}
                    <button className="bttn-primary" type="submit">
                        <Edit className="w-4 h-4" />
                        Guardar categoría
                    </button>
                </div>
            </form>
            {/*CATEGORIES LIST*/}
            {isLoading ? (
                <table className="basic mt-4">
                    <tr className="flex justify-center py-5">
                        <td>
                            <BeatLoader />
                        </td>
                    </tr>
                </table>
            ) : categories.length > 0 && !editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Nombre de la categoría</td>
                            <td>Categoría raíz</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button className="bttn-default" onClick={() => editCategory(category)}>
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </button>
                                    <button className="bttn-red" onClick={() => deleteCategory(category)}>
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout >
    )
}

export default Categories

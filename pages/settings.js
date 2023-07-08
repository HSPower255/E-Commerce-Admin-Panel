import Layout from "@/components/Layout"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const Settings = () => {
    const [featuredProductId, setFeaturedProductId] = useState(null)
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get('/api/products').then(response => {
            setProducts(response.data)
        })
        axios.get('/api/settings?name=featuredProductId').then(response => {
            setFeaturedProductId(response.data.value)
        })
    }, [])

    const saveSettings = async () => {
        await axios.put('/api/settings', { name: 'featuredProductId', value: featuredProductId })
        toast.success('Se ha guardado el producto destacado correctamente!')
    }

    return (
        <Layout>
            <h1>Configuración</h1>
            <label>Producto destacado</label>
            <select value={featuredProductId} onChange={e => setFeaturedProductId(e.target.value)}>
                {products.length > 0 && products.map(product => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                ))}
            </select>
            <div>
                <button onClick={saveSettings} className="bttn-primary"> Guardar </button>
            </div>
        </Layout>
    )
}

export default Settings
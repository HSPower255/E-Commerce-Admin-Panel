import mongooseConnect from "@/lib/mongoose"
import { Product } from "@/models/ProductModel"
import { isAdminReq } from "@/pages/api/auth/[...nextauth]"

const ProductMethods = async (req, res) => {
    const { method } = req
    await mongooseConnect()
    await isAdminReq(req, res)

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }))
        } else {
            res.json(await Product.find())
        }
    }

    if (method === 'POST') {
        const { name, description, price, images, category, properties } = req.body
        const productDoc = await Product.create({ name, description, price, images, category, properties })
        res.json(productDoc)
    }

    if (method === 'PUT') {
        const { name, description, price, images, _id, category, properties } = req.body
        await Product.updateOne({ _id }, { name, description, price, images, category, properties })
        res.json(true)
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query.id })
            res.json(true)
        }
    }
}

export default ProductMethods
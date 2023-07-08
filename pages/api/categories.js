import { Category } from "@/models/CategoryModel"
import mongooseConnect from "@/lib/mongoose"
import { isAdminReq } from "@/pages/api/auth/[...nextauth]"

const CategoryMethods = async (req, res) => {
  const { method } = req
  await mongooseConnect()
  await isAdminReq(req, res)

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'))
  }

  if (method === 'POST') {
    const { name, parentCategory, properties } = req.body
    const categoryDoc = await Category.create({ name, parent: parentCategory || undefined, properties })
    res.json(categoryDoc)
  }

  if (method === 'PUT') {
    const { name, parentCategory, properties, _id } = req.body
    const categoryDoc = await Category.updateOne({ _id }, { name, parent: parentCategory || undefined, properties })
    res.json(categoryDoc)
  }

  if (method === 'DELETE') {
    const { _id } = req.query
    await Category.deleteOne({ _id })
    res.json()
  }
}

export default CategoryMethods
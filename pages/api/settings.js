import mongooseConnect from "@/lib/mongoose"
import { Setting } from "@/models/SettingModel"
import { isAdminReq } from "@/pages/api/auth/[...nextauth]"

const SettingsMethods = async (req, res) => {
    const { method } = req
    await mongooseConnect()
    await isAdminReq(req, res)

    if (method === 'PUT') {
        const { name, value } = req.body
        const settingDoc = await Setting.findOne({ name })
        if (settingDoc) {
            settingDoc.value = value
            await settingDoc.save()
            res.json(settingDoc)
        } else {
            res.json(await Setting.create({ name, value }))
        }
    }

    if (method === 'GET') {
        const { name } = req.query
        res.json(await Setting.findOne({ name }))
    }
}

export default SettingsMethods
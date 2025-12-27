import { BundleDetails } from "../model/bundleDetails.js";
import LoginCred from "../model/loginCred.js";

export const getMemberList = async (req, res) => {
    try {
        const users = await LoginCred.find(
            {},
            { _id: 1, name: 1 }
        )
            .sort({ name: 1 })
            .lean();

        const list = users.map(u => ({
            id: u._id,
            name: u.name
        }));

        return res.json({
            ok: true,
            list
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            error: "FAILED_TO_FETCH_MEMBERS"
        });
    }
};

export const saveBundle = async (bundleMetadata) => {
    try {
        console.log(bundleMetadata)
        const bundle = new BundleDetails(bundleMetadata);
        await bundle.save();
        console.log("Bundle saved to cloud DB:", bundleMetadata.bundleName);
    } catch (err) {
        console.error("Error saving bundle to cloud:", err);
        throw err;
    }
};

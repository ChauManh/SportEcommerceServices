const upload = require("../middlewares/UploadMiddleWare");
const storeService = require("../services/Store.service");
const { processFiles } = require("../utils/UploadUtil");

const createStore = async (req, res) => {
  try {
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.error(-1, err.message);
      }

      const { store_address, store_phone, store_email } = req.body;

      if (!store_address || !store_phone || !store_email) {
        return res.error(3, "Thông tin là bắt buộc");
      }

      const { images } = processFiles(req.files);

      const newStore = {
        store_address,
        store_phone,
        store_email,
        store_banner: images,
      };

      const result = await storeService.createStore(newStore);
      return result.EC === 0
        ? res.success(result.data, result.EM)
        : res.error(result.EC, result.EM);
    });
  } catch (error) {
    return res.InternalError();
  }
};

const updateStore = async (req, res) => {
  try {
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.error(-1, err.message);
      }

      const store_id = req.params.id;
      const { store_address, store_phone, store_email, existing_banners } =
        req.body;

      let bannersToKeep = [];
      if (existing_banners) {
        bannersToKeep = JSON.parse(existing_banners);
      }

      const { images } = processFiles(req.files);

      const updatedStore = {
        store_address,
        store_phone,
        store_email,
        store_banner: [...bannersToKeep, ...images],
      };

      const result = await storeService.updateStore(updatedStore, store_id);
      return result.EC === 0
        ? res.success(result.data, result.EM)
        : res.error(result.EC, result.EM);
    });
  } catch (error) {
    return res.InternalError();
  }
};

const getDetailStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    const result = await storeService.getDetailStore(storeId);
    result.EC === 0
      ? res.success(result.EM, result.data)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};
module.exports = {
  createStore,
  updateStore,
  getDetailStore,
};

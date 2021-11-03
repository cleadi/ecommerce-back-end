const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const categoryNameData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.json(categoryNameData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", (req, res) => {
  try {
    const categoryIdData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    res.status(200).json(categoryIdData);
  } catch {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  Category.create(req.body)
    .then((newCategoryData) => res.json(newCategoryData))
    .catch((err) => res.status(500).json(err));
});

router.put("/:id", async (req, res) => {
  Category.update(req.body, { where: { id: req.params.id } })
    .then((updatedCategory) => {
      res.status(200).json(updatedCategory);
    })
    .catch((err) => res.status(400).json(err));
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryId = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(categoryId);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const router = require("express").Router();
const { Tag, Product, ProductTag, Category } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const allTagData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(allTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const singleTagData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    res.status(200).json(singleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", (req, res) => {
  Tag.create(req.body)
    .then((newTagData) => res.json(newTagData))
    .catch((err) => res.status(500).json(err));
});

router.put("/:id", (req, res) => {
  Tag.update(req.body, { where: { id: req.params.id } })
    .then((updatedTag) => {
      res.status(200).json(updatedTag);
    })
    .catch((err) => res.status(400).json(err));
});

router.delete("/:id", (req, res) => {
  try {
    const delTagId = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(delTagId);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

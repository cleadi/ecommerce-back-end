const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', (req, res) => {
  try {
    const allProdData = await Product.findByPk(req.params.id, {
      include: [{model: Category}] && [{model: Tag}],
    })
    res.status(200).json(allProdData)
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', (req, res) => {
  try {
    const oneProdData = await Product.findOne(req.params.id, {
      include: [{model: Category}] && [{model: Tag}],
    })
    res.status(200).json(oneProdData)
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", (req, res) => {
  // Product.create({
  //   product_name: req.body.product_name,
  //   price: req.body.price,
  //   stock: req.body.stock,
  // });

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const delOneProdById = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(delOneProdById);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

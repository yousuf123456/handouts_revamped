import prisma from "../app/_libs/prismadb";

function sleep(miliseconds: number) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {}
}

export const getCategory = async (category: string | undefined) => {
  const pipeline = [
    {
      $match: {
        name: category,
      },
    },

    {
      $graphLookup: {
        from: "Category",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentId",
        as: "categoryTree",
      },
    },
  ];

  // Because it always return an array
  const categories = await prisma.category.aggregateRaw({
    pipeline: pipeline,
  });

  const categoryData = categories[0] as any;
  if (!categoryData) return null;

  const parentCategoryData = {
    //@ts-ignore
    id: categoryData._id.$oid,
    name: categoryData.name,
    //@ts-ignore
    parentId: categoryData.parentId?.$oid || null,
  };

  //@ts-ignore
  const rawCategoryTreeData = categoryData.categoryTree;

  const prismaFormattedData = rawCategoryTreeData.map((category: any) => {
    const prismaFormattedCategory = {
      id: category._id.$oid,
      name: category.name,
      parentId: category.parentId.$oid,
    };

    return prismaFormattedCategory;
  });

  prismaFormattedData.push(parentCategoryData);

  return {
    rawCategoryData: prismaFormattedData,
    parent: parentCategoryData,
  };
};

async function main() {
  const allStores = await prisma.store.findMany({ skip: 1 });
  const allProducts = await prisma.product.findMany({ skip: 11 });

  await Promise.all(
    allProducts.map(async (product, index) => {
      const storeIndex = Math.floor(index / 10); // Calculate the store index

      await prisma.product.update({
        where: { id: product.id },
        data: { storeId: allStores[storeIndex].id },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

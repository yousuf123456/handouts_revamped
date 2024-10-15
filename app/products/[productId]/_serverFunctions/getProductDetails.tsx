import prisma from "@/app/_libs/prismadb";
import { AttributesType, VariantsType } from "@/app/_types";

export type ProductDetails = Awaited<
  Omit<ReturnType<typeof getProductDetails>, "attributes" | "variants">
> & {
  variants: VariantsType;
  attributes: AttributesType;
};

export const getProductDetails = async ({
  productId,
}: {
  productId: string;
}) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },

      include: {
        store: {
          select: {
            id: true,
            logo: true,
            name: true,
            createdAt: true,
            posRatings: true,
            neuRatings: true,
            negRatings: true,
            ratingsCount: true,
          },
        },
      },
    });

    return product as typeof product & {
      variants?: VariantsType;
      attributes: AttributesType;
    };
  } catch (e) {
    console.log("Error in getting product details: ", e);
    return null;
  }
};

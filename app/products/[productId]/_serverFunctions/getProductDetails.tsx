import prisma from "@/app/_libs/prismadb";
import { VariantsType } from "@/app/_types";

export type ProductDetails = Awaited<
  ReturnType<typeof getProductDetails & { variants: VariantsType }>
>;

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

    return product as typeof product & { variants?: VariantsType };
  } catch (e) {
    console.log("Error in getting product details: ", e);
    return null;
  }
};

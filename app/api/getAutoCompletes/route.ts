import prisma from "../../_libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchTerm } = await req.json();

    const pipeline = [
      {
        $search: {
          index: "productsSearch",
          autocomplete: {
            path: "name",
            query: searchTerm,
            tokenOrder: "any",
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      {
        $limit: 8,
      },
      {
        $project: {
          name: 1,
        },
      },
    ];

    const autoCompletes = (await prisma.product.aggregateRaw({
      pipeline: pipeline,
    })) as unknown as { name: string }[];

    return NextResponse.json(autoCompletes);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error !", { status: 500 });
  }
}

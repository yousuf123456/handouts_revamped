import { PipelineStage } from "mongoose";
import { SortStringType } from "@/app/_types";

interface options {
  page?: number;
  filterValue?: any;
  sort?: SortStringType;
  filterField?: string;
  ITEMS_PER_PAGE: number;
  itemsFieldName: string;
  ITEMS_PER_BUCKET_COUNT: number;
}

/* 
-The function takes in multiple params such as sort or filter.
-It skips or limits at bucket level for best query perf.
-If it needs to be filtered than skiping and limiting is done on individual items because of some limitations. 
*/

export const getPaginatedBucketPipeline = (
  pipeline: PipelineStage[],
  options: options,
) => {
  const {
    page,
    sort,
    filterField,
    filterValue,
    ITEMS_PER_PAGE,
    itemsFieldName,
    ITEMS_PER_BUCKET_COUNT,
  } = options;

  const sortBy = sort?.split("-")[0];
  const sortDirection = sort?.split("-")[1] as "asc" | "desc" | undefined;

  const hasToSortResults = !!sort;
  const hasToFilterResults = filterField && filterValue;

  const {
    bucketsToSkip,
    bucketsToLimit,
    unwindedItemsToSkip,
    paginationSplicingIndices,
  } = calculatePaginationInfo(
    page || 1,
    ITEMS_PER_PAGE,
    ITEMS_PER_BUCKET_COUNT,
  );

  // Sort the buckets so latest buckets come first
  pipeline.push({
    $sort: {
      _id: -1,
    },
  });

  // If filtering than unwind the items before limiting buckets or items
  if (hasToFilterResults) {
    pipeline.push({ $unwind: `$${itemsFieldName}` });
  }

  // Filter out the items from all unwinded items
  if (hasToFilterResults) {
    pipeline.push({
      $match: {
        [`${itemsFieldName}.${filterField}`]: filterValue,
      },
    });
  }

  // Skip the number of buckets if not filtering and items are not unwinded
  if (bucketsToSkip !== 0 || unwindedItemsToSkip !== 0) {
    if (!hasToFilterResults) {
      pipeline.push({
        $skip: bucketsToSkip,
      });
    }
  }

  // Limit the number of buckets if not filtering and items are not unwinded
  if (!hasToFilterResults) pipeline.push({ $limit: bucketsToLimit });

  // If not filtering that means items are not unwinded so unwind the items to be sorted
  if (!hasToFilterResults) {
    pipeline.push({
      $unwind: `$${itemsFieldName}`,
    });
  }

  // Sort the items from the given sort or by an id to return the latest items first
  pipeline.push({
    $sort: {
      [`${itemsFieldName}.${hasToSortResults ? sortBy : "_id"}`]:
        sortDirection === "asc" ? 1 : -1,
      ...(hasToSortResults && sortBy !== "_id"
        ? { [`${itemsFieldName}._id`]: -1 }
        : {}),
    },
  });

  // Skip the number of unwinded items
  pipeline.push({
    $skip: unwindedItemsToSkip,
  });

  // Limit the number of unwinded items
  pipeline.push({
    $limit: ITEMS_PER_PAGE,
  });

  // if (!hasToSortResults && !hasToFilterResults) {
  //   pipeline.push({
  //     $project: {
  //       [itemsFieldName]: {
  //         $slice: [
  //           `$${itemsFieldName}`,
  //           paginationSplicingIndices[0], // Starting Position
  //           ITEMS_PER_PAGE, // Number of elements to take after the starting position
  //         ],
  //       },
  //     },
  //   });
  // }

  return pipeline;
};

function calculatePaginationInfo(
  page: number,
  ITEMS_PER_PAGE: number,
  ITEMS_PER_BUCKET_COUNT: number,
) {
  const unwindedItemsToSkip = ((page || 1) - 1) * ITEMS_PER_PAGE;

  const bucketsToLimit = Math.ceil(ITEMS_PER_PAGE / ITEMS_PER_BUCKET_COUNT);

  const bucketsToSkip = Math.floor(
    ((page - 1) * ITEMS_PER_PAGE) / ITEMS_PER_BUCKET_COUNT,
  );

  const pageIndex = (page - 1) % (ITEMS_PER_BUCKET_COUNT / ITEMS_PER_PAGE);
  const startReviewIndex = pageIndex * ITEMS_PER_PAGE;
  const endReviewIndex = startReviewIndex + ITEMS_PER_PAGE;

  return {
    bucketsToSkip,
    bucketsToLimit,
    unwindedItemsToSkip,
    paginationSplicingIndices: [startReviewIndex, endReviewIndex],
  };
}

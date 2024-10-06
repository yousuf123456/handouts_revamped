// Return an array of objects with mongodb fields mapped to prisma type fields
export const mapMongoToPrisma = <T>(data: T[]): T[] => {
  const specialMongoKeys = ["$oid", "$date"];

  function transformItem<T>(item: any): T {
    if (Array.isArray(item)) {
      return item.map(transformItem) as T; // Recursively transform an array
    }

    if (typeof item === "object") {
      Object.keys(item).map((key) => {
        if (
          item[key] &&
          typeof item[key] === "object" &&
          !Object.keys(item[key]).some((key) => specialMongoKeys.includes(key))
        ) {
          return transformItem(item[key]);
        }

        if (key === "_id") {
          item["id"] = item[key]["$oid"];
          delete item[key];
          return;
        }

        if (item[key] && item[key]["$oid"]) item[key] = item[key]["$oid"];

        if (item[key] && item[key]["$date"]) item[key] = item[key]["$date"];
      });
    }

    return item;
  }

  return data.map((item) => transformItem(item));
};

import React from "react";

import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductBreadcrumbsProps {
  productName: string;
  categories: Category[];
}

const buildBreadcrumbPath = (categories: Category[]): Category[] => {
  const path: Category[] = [];
  let currentCategory = categories.find((cat) => cat.parentId === null);

  while (currentCategory) {
    path.push(currentCategory);

    currentCategory = categories.find(
      (cat) => cat.parentId === currentCategory?.id,
    );
  }

  return path;
};

export default function ProductBreadcrumbs({
  categories,
  productName,
}: ProductBreadcrumbsProps) {
  const breadcrumbPath = buildBreadcrumbPath(categories);

  return (
    <Breadcrumb className="mb-4 max-[960px]:hidden">
      <BreadcrumbList>
        {breadcrumbPath.map((category, index) => (
          <React.Fragment key={category.id}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${category.name}`}>
                {category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbPath.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbPage>{productName}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

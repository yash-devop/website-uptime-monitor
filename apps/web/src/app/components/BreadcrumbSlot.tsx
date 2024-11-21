import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";

export default function BreadcrumbSlot({
  elements,
}: {
  elements?: {
    label: string;
    url: string;
  }[];
}) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className="w-full flex-nowrap">
          {elements?.map((item, idx) => (
            <>
              <BreadcrumbItem className="cursor-pointer px-2 py-1 rounded-md hover:bg-sidebar-border hover:text-white">
                <BreadcrumbLink className="hover:text-white" href={item.url}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
              {idx !== elements.length - 1 && <BreadcrumbSeparator />}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

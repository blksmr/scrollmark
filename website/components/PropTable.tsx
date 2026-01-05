import { cn } from "@/lib/utils"
import { Fragment } from "react"
import Info from "./icons/Info"

type Prop = {
  name: string
  type: string
  default?: string
  description: string
}

type PropTableProps = {
  items: Prop[]
}

const cellPadding = "px-3 py-2"

export function PropTable({ items }: PropTableProps) {
  return (
    <div className="mt-6 h-full w-full overflow-hidden rounded-lg border border-gray-4">
      <table className="h-full w-full md:table-fixed">
        <thead className="border-gray-4 border-b bg-table-header-background text-left font-default text-default">
          <tr>
            <th className={cn(cellPadding, "w-[170px] font-normal text-small py-1.5 text-xs")}>Prop</th>
            <th className={cn(cellPadding, "font-normal text-small py-1.5 text-xs")}>Type</th>
            <th className={cn(cellPadding, "w-[120px] font-normal text-small py-1.5 text-xs")}>Default</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <Fragment key={item.name}>
              <tr className="w-full text-left font-default text-default">
                <td className={cn(cellPadding, "font-mono text-fd-primary")}><code>{item.name}</code></td>
                <td className={cn(cellPadding, "font-mono text-fd-muted-foreground")}><code>{item.type}</code></td>
                <td className={cn(cellPadding, "font-mono text-fd-muted-foreground", {'text-text-muted': !item.default})}><code>{item.default ?? '-'}</code></td>
              </tr>
              <tr className={cn("w-full text-left", index < items.length - 1 && "border-b")}>
                <td colSpan={3} className={cn(cellPadding, "font-normal text-small text-sm")}>
                  <div className="flex items-center gap-2">
                    <Info className="text-gray-400" />
                    {item.description}
                  </div>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

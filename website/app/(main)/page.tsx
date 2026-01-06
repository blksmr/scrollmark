import { APP_NAME } from "@/config/site";
import { getHomePage } from "@/lib/fumadocs";
import { getMDXComponents } from "@/mdx-components";

export default function Page() {
  const page = getHomePage();

  if (!page) {
    return <div>Not found</div>;
  }

  const MDX = page.data.body;

  return (
    <article>
      <header className="flex w-full mb-6">
        <div className="flex gap-2 items-center font-medium">{APP_NAME}</div>
      </header>
      <MDX components={getMDXComponents()} />
    </article>
  );
}

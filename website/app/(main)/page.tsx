import { APP_NAME } from "@/config/site";
import { getHomePage } from "@/lib/fumadocs";
import { getMDXComponents } from "@/mdx-components";
import packageJson from "../../../packages/domet/package.json";

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
        <small className="text-sm text-gray-500">v{packageJson.version}</small>
      </header>
      <MDX components={getMDXComponents()} />
    </article>
  );
}

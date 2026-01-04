import Documentation from "@/content/documentation.mdx";
import { getMDXComponents } from "@/mdx-components";
import { getHomePage } from "@/lib/fumadocs";
import { Logo } from "@/components/Logo";

export default function Page() {
  const page = getHomePage();

  if (!page) {
    return <div>Not found</div>;
  }

  const { title } = page.data;
  const MDX = page.data.body;
  return (
    <article className="md:max-w-[640px] w-[80%] mx-auto py-32">
      <header className="flex w-full justify-between mb-6">
        <h1 className="flex items-center gap-2 text-base font-medium">
          <Logo />
          Scrowl
        </h1>
      </header>
      <MDX components={getMDXComponents()} />
    </article>
  );
}

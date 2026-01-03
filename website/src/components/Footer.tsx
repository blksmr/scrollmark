import { Heading } from "./Heading";

export function Footer() {
  return (
    <footer className="mt-12 pt-8">
      <Heading>Support</Heading>
      <p>
        For any issues or feature requests, please open an issue on{" "}
        <a
          href="https://github.com/blksmr/scrowl/issues"
          className="link-hover"
        >
          GitHub
        </a>
        .
      </p>
      <p className="text-sm">
        You can also reach out to me on{" "}
        <a
          href="https://x.com/blkasmir"
          className="link-hover"
        >
          Twitter
        </a>
        .
      </p>
    </footer>
  );
}

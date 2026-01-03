export function Footer() {
  return (
    <footer className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(0, 0, 0, 0.08)" }}>
      <p className="leading-relaxed mb-4">
        For any issues or feature requests, please open an issue on{" "}
        <a
          href="https://github.com/blksmr/scrowl"
          className="link-hover"
          target="_blank"
          rel="noopener noreferrer"
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
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        .
      </p>
    </footer>
  );
}

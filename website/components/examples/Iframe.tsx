type IframeProps = {
  src: string;
  height?: number;
};

export function Iframe({ src, height = 400 }: IframeProps) {
  return (
    <iframe
      src={src}
      title="Example"
    />
  );
}

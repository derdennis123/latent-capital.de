interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  return (
    <div
      className="ghost-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

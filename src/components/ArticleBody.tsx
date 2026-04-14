import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleBodyProps {
  markdown: string;
}

export function ArticleBody({ markdown }: ArticleBodyProps) {
  return (
    <div className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="headline mt-10 mb-3 text-[1.6rem]">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="headline mt-8 mb-2 text-xl">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-ink pl-4 italic text-muted">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal pl-6">{children}</ol>
          ),
          hr: () => <hr className="my-10 rule-thin" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

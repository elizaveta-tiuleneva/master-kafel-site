// Единая ширина контента внутренних страниц; боковые отступы как у Header.
// break-keep: корейский текст переносится по словам, а не посреди слова.
export default function PageContainer({ as = "div", className = "", children, ...rest }) {
  const Tag = as;
  return (
    <Tag {...rest} className={`mx-auto w-full max-w-[1240px] break-keep px-5 sm:px-7 ${className}`}>
      {children}
    </Tag>
  );
}

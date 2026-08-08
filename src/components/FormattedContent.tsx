import React from 'react';

interface FormattedContentProps {
  content: string;
  className?: string;
  accentColor?: string;
  headingColor?: string;
  bodyColor?: string;
}

export const FormattedContent: React.FC<FormattedContentProps> = ({
  content,
  className = '',
  accentColor = '#2563eb',
  headingColor,
  bodyColor,
}) => {
  if (!content) return null;

  // Split content into lines for structured rendering
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2.5 space-y-1.5 pl-4 list-disc" style={{ color: bodyColor || undefined }}>
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                {renderInlineFormatted(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-2.5 space-y-1.5 pl-4 list-decimal" style={{ color: bodyColor || undefined }}>
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-1 font-medium">
                {renderInlineFormatted(item)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const renderInlineFormatted = (text: string) => {
    // Process **bold**, *italic*, and `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold" style={{ color: headingColor || bodyColor || undefined }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headings (e.g. ### Heading or # Heading)
    if (trimmed.startsWith('#')) {
      flushList();
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      const text = trimmed.replace(/^#+\s*/, '');
      if (level === 1) {
        elements.push(
          <h2 key={index} className="text-xl font-extrabold mt-4 mb-2 tracking-tight" style={{ color: headingColor || accentColor }}>
            {renderInlineFormatted(text)}
          </h2>
        );
      } else if (level === 2) {
        elements.push(
          <h3 key={index} className="text-lg font-bold mt-3 mb-1.5" style={{ color: headingColor || accentColor }}>
            {renderInlineFormatted(text)}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={index} className="text-base font-semibold mt-2 mb-1" style={{ color: headingColor || undefined }}>
            {renderInlineFormatted(text)}
          </h4>
        );
      }
      return;
    }

    // Bullet list items (e.g. * item or - item or • item)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const itemText = trimmed.replace(/^[*•-]\s*/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Numbered list items (e.g. 1. item or ১. item)
    if (/^(\d+|[\u09E6-\u09EF]+)\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^(\d+|[\u09E6-\u09EF]+)\.\s*/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Quote or Callout line (e.g. > Quote)
    if (trimmed.startsWith('>')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote key={index} className="my-3 p-3.5 border-l-4 rounded-r-xl bg-slate-50 dark:bg-slate-900/80 italic text-sm" style={{ borderColor: accentColor, color: bodyColor || undefined }}>
          {renderInlineFormatted(quoteText)}
        </blockquote>
      );
      return;
    }

    // Standard paragraph line
    flushList();
    elements.push(
      <p key={index} className="my-2 leading-relaxed text-sm md:text-base font-normal" style={{ color: bodyColor || undefined }}>
        {renderInlineFormatted(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-1 font-bengali ${className}`}>{elements}</div>;
};

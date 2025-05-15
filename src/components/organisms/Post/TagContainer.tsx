'use client';

const TagContainer = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag: string) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default TagContainer;

import { COLOR_SEMANTIC_FILL_NORMAL, COLOR_SEMANTIC_LABEL_NEUTRAL } from '@/config/color.config';

const Tag = ({ tag }: { tag: string }) => (
  <div
    className="box-border flex h-[30px] w-[90px] items-center rounded px-2 py-1 text-center text-sm whitespace-nowrap"
    style={{ backgroundColor: COLOR_SEMANTIC_FILL_NORMAL }}
  >
    <span className="inline-block stroke-current text-base text-[#FEAF75]">#</span>
    <span className="w-full text-xs font-medium" style={{ color: COLOR_SEMANTIC_LABEL_NEUTRAL }}>
      {tag}
    </span>
  </div>
);

export default Tag;

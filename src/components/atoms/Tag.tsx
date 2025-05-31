import { COLOR_SEMANTIC_FILL_NORMAL, COLOR_SEMANTIC_LABEL_NEUTRAL } from '@/config/color.config';

const Tag = ({ tag, onClick }: { tag: string, onClick: ()=>void }) => (
  <div
    className="flex justify-center h-[32px] w-[90px] items-center rounded-lg px-[8px] text-center text-sm whitespace-nowrap box-border cursor-pointer"
    style={{ backgroundColor: COLOR_SEMANTIC_FILL_NORMAL }}
    onClick={onClick}
  >
    <span className="text-base text-[#FEAF75]">#</span>
    <span
      className="ml-1 font-bold text-[12px]"
      style={{ color: COLOR_SEMANTIC_LABEL_NEUTRAL }}
    >
      {tag}
    </span>
  </div>
);

export default Tag;

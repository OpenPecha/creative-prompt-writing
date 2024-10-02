type Props = {
  current: number;
  max: number;
  accepted: number;
  showHeader?: boolean;
};

function Progress({ current, max, accepted, showHeader = true }: Props) {
  return (
    <div
      className="tooltip  tooltip-bottom flex flex-col"
      title={`accepted: ${accepted} / reviewed: ${current} / total: ${max}`}
    >
      {showHeader && <div className="self-start">Progress</div>}
      <progress
        className="progress progress-success w-56"
        max={max}
        value={current}
      ></progress>
    </div>
  );
}

export default Progress;

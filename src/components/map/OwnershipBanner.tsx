interface Props {
  ownerName: string;
  facilityCount: number;
  onClose: () => void;
}

export function OwnershipBanner({ ownerName, facilityCount, onClose }: Props) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 text-sm">
      <span className="font-medium">{ownerName}</span>
      <span className="text-gray-400">
        {facilityCount} {facilityCount === 1 ? "facility" : "facilities"}
      </span>
      <button
        onClick={onClose}
        className="ml-1 text-gray-400 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

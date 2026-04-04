import { Star } from "lucide-react";

export function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i <= value ? "fill-warning text-warning" : "text-muted-foreground/30"} ${!readonly ? "cursor-pointer" : ""}`}
          onClick={() => !readonly && onChange?.(i)}
        />
      ))}
    </div>
  );
}

import { Baby, Car, Home, MoreHorizontal, ShoppingBasket, Tag, type LucideIcon } from "lucide-react";

const ICONS_BY_CATEGORY_NAME: Record<string, LucideIcon> = {
  食費: ShoppingBasket,
  "住居・光熱費": Home,
  "ベビー・子ども": Baby,
  "交通・移動": Car,
  その他: MoreHorizontal,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS_BY_CATEGORY_NAME[name] ?? Tag;
  return <Icon className={className} />;
}

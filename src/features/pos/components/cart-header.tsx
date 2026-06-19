import { useCartStore } from "@/stores/cart-store";
import { OrderType } from "@/types/sale.types";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardHeader, CardTitle } from "@/components/ui/card";

export function CartHeader() {
  const { orderType, setOrderType } = useCartStore();

  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-xl">Current Order</CardTitle>
      <Tabs
        value={orderType}
        onValueChange={(v) => setOrderType(v as OrderType)}
        className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dine_in">Dine In</TabsTrigger>
          <TabsTrigger value="take_away">Take Away</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
  );
}

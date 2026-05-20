import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, isOpen, setOpen, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const totalPrice = items.reduce((n, i) => n + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "SEK";

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-l border-border">
        <SheetHeader className="px-6 py-5 border-b border-border space-y-1">
          <SheetTitle className="font-display tracking-tight text-xl">Varukorg</SheetTitle>
          <SheetDescription className="font-mono text-[11px] uppercase tracking-[0.18em]">
            {totalItems === 0 ? "Tom" : `${totalItems} artikel${totalItems !== 1 ? "" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center px-6">
              <div className="text-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Din varukorg är tom.</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const img = item.product.node.images?.edges?.[0]?.node;
                return (
                  <li key={item.variantId} className="flex gap-4 p-5">
                    <div className="w-20 h-20 bg-secondary flex-shrink-0 overflow-hidden">
                      {img && (
                        <img src={img.url} alt={img.altText ?? item.product.node.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-snug">{item.product.node.title}</h4>
                      {item.selectedOptions.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {item.selectedOptions.map((o) => o.value).join(" · ")}
                        </p>
                      )}
                      <p className="font-mono text-sm mt-2">
                        {parseFloat(item.price.amount).toLocaleString("sv-SE")} {item.price.currencyCode}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="h-7 w-7 flex items-center justify-center hover:bg-secondary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="h-7 w-7 flex items-center justify-center hover:bg-secondary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Ta bort"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4 bg-background">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Summa exkl. moms</span>
              <span className="font-display text-xl font-semibold">
                {totalPrice.toLocaleString("sv-SE")} {currency}
              </span>
            </div>
            <Button
              onClick={checkout}
              disabled={isLoading || isSyncing}
              className="w-full h-12 rounded-none bg-safety text-safety-foreground hover:bg-safety/90 font-semibold tracking-wide"
            >
              {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Till kassan"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              Checkout via Shopify. Faktura och offert tillgängliga vid utcheckning.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

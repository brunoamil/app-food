import { useContext, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatCurrency } from "@/helpers/format-currenty"

import { CartProductItem } from "../[productId]/components/cart-product-item"
import { CartContext } from "../context/cart"
import { FinishOrderDialog } from "./finish-order-dialog"

export const CartSheet = () => {
  const [finishOrderDialogIsOpen, setFinishOrderDialogIsOpen] = useState(false);
  const { isOpen, toggleCart, products, total } = useContext(CartContext)
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-[80%]">
        <SheetHeader>
          <SheetTitle className="text-left">Sacola</SheetTitle>

        </SheetHeader>
        <div className="flex flex-col h-full py-5">
          <div className="flex-auto">
            {products.map(product => (<CartProductItem key={product.id} product={product} />))}

          </div>
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold text-sm">{formatCurrency(total)}</p>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full rounded-full" onClick={() => setFinishOrderDialogIsOpen(true)}>Finalizar pedido</Button>
          <FinishOrderDialog onOpenChange={setFinishOrderDialogIsOpen} open={finishOrderDialogIsOpen} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
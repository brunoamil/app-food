"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConsumptionMethod } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format"
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrder } from "../actions/create-order";
import { CartContext } from "../context/cart";
import { isValidCpf } from "../helpers/cpf";

const formSchema = z.object({
    nome: z.string().trim().min(1, {
        message: 'Nome obrigatorio'
    }),
    cpf: z.string().trim().min(1, {
        message: 'CPF obrigatorio'
    }).refine(value => isValidCpf(value), {
        message: "CPF inválido"
    })
})

type FormSchema = z.infer<typeof formSchema>

interface FinishOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
    const { products } = useContext(CartContext)
    const searchParams = useSearchParams()
    const { slug } = useParams<{ slug: string }>();

    const [isPendingx, startTransitionx] = useTransition();
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: '',
            cpf: '',
        },
        shouldUnregister: true,
    });

    const onSubmit = async (data: FormSchema) => {

        try {
            const consumptionMethod = searchParams.get("consumptionMethod") as ConsumptionMethod;
            startTransitionx(async () => {
                await createOrder({
                    consumptionMethod,
                    customerCpf: data.cpf,
                    customerName: data.nome,
                    products,
                    slug
                });

                onOpenChange(false);
                toast.success("Pedido realizado com sucesso");
            });

           
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Finalizar Pedido</DrawerTitle>
                    <DrawerDescription>Insira suas informações abaixo para finalizar o pedido</DrawerDescription>
                </DrawerHeader>
                <div className="p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite seu nome" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cpf</FormLabel>
                                        <FormControl>
                                            <PatternFormat placeholder="Digite seu CPF" {...field} format="###.###.###-##" customInput={Input} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DrawerFooter>
                                <Button type="submit" variant={"destructive"} disabled={isPendingx}>{isPendingx && <Loader2Icon className="animate-spin"/>}Finalizar</Button>
                                <DrawerClose asChild>
                                    <Button variant="secondary" className="w-full rounded-full">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>

            </DrawerContent>
        </Drawer>
    )
}
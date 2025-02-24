"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { PatternFormat } from "react-number-format";
import { z } from "zod"

import { Button } from "@/components/ui/button";
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

import { isValidCpf, removeCpfPunctuation } from "../../menu/helpers/cpf"

const formSchema = z.object({

    cpf: z.string().trim().min(1, {
        message: 'CPF obrigatorio'
    }).refine(value => isValidCpf(value), {
        message: "CPF inválido"
    })
})

type FormSchema = z.infer<typeof formSchema>

export const CpfForm = () => {
    const router = useRouter();
    const pathName = usePathname();
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: '',
        },
        shouldUnregister: true,
    });

    const onSubmit = async (data: FormSchema) => {
       router.replace(`${pathName}?cpf=${removeCpfPunctuation(data.cpf)}`)
    }

    const handleCancel = () => {
        router.back();
    }

    return (
        <Drawer open>
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Visualizar pedidos</DrawerTitle>
                    <DrawerDescription>Insira seu CPF para visualizar seus pedidos</DrawerDescription>
                </DrawerHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem className="px-4">
                                        <FormLabel>Cpf</FormLabel>
                                        <FormControl>
                                            <PatternFormat placeholder="Digite seu CPF" {...field} format="###.###.###-##" customInput={Input} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DrawerFooter>
                                <Button variant={"destructive"} className="w-full rounded-full">Confirmar</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="w-full rounded-full" onClick={handleCancel}>Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
            </DrawerContent>
        </Drawer>
    )
}
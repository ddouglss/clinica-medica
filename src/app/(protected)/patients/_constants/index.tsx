"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"

type DetalhesFieldProps = {
  form: UseFormReturn<any> 
}

export const DetalhesField = ({ form }: DetalhesFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {!isExpanded ? (
        <Button type="button" variant="outline" onClick={() => setIsExpanded(true)}>
          + Adicionar detalhes
        </Button>
      ) : (
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva as observações do paciente..."
                  className="max-w-full min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setIsExpanded(false)}
              >
                Recolher
              </Button>
            </FormItem>
          )}
        />
      )}
    </>
  )
}

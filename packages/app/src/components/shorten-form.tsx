'use client';

import { ComponentProps } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { insertURLSchema } from '@/schema';
import { shorten } from '@/app/actions';
import { cn } from '@/lib/utils';

const FormSchema = insertURLSchema.pick({ url: true });

export const ShortenForm = ({
  className,
  ...props
}: ComponentProps<'form'>) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { success, errors } = await shorten(data.url);
    if (success) return form.reset();
    if (errors.fieldErrors.url?.length)
      return form.setError('url', { message: errors.fieldErrors.url[0] });
    throw new Error('Unexpected error');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'w-full max-w-sm space-y-2 sm:flex sm:space-x-2 sm:space-y-0',
          className,
        )}
        {...props}
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input aria-label="Original URL" placeholder="URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          aria-label="Shorten Original URL"
          className="w-full max-w-sm sm:w-auto"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

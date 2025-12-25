import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
      <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 dark:text-gray-300">{label}</FormLabel>
          <FormControl>
            <Input
              className="h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
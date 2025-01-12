import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoInputProps {
  id: string;
  register: any; // Replace with the appropriate type for register
  error?: { message?: string }; // Replace with the appropriate error type
  label?: string; // Add label prop here
}

const LogoInput: React.FC<LogoInputProps> = ({ id, register, error, label }) => {
  const { toast } = useToast(); // Initialize the toast

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Get the selected files
    if (files && files.length > 0) {
      const file = files[0]; // Select the first file

      // Check file size
      if (file.size > 2 * 1024 * 1024) { // Check if file is larger than 2MB
        toast({
          title: "Error",
          description: "File size exceeds 2MB.",
          variant: "destructive",
        });
        return; // Exit the function
      }

      // Convert file to base64 string using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        // Base64 encoded string of the file
        const base64String = reader.result as string;

        // Trigger registration update with the base64 string
        register.onChange({ target: { value: base64String } });
      };

      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  return (
    <div className=" mb-4">
      {label && (
        <Label htmlFor={id} className="block mb-1">
          {label}
        </Label>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center">
        <Input
          id={id}
          type="file"
          {...register}
          onChange={handleChange}
          accept="image/*"
          className="border border-gray-300 p-2 rounded-lg bg-[#E9F4FF] " // Customize styles as needed
        />
      </div>
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default LogoInput;

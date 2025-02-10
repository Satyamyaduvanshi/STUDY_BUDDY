interface InputProps {
    type: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
  }
  
  export function Input({ type, value, onChange, placeholder, className, required }: InputProps) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border p-2 rounded ${className}`}
        required={required} 
      />
    );
  }
  
interface CountProps {
  count: number;
}

export const Count = ({ count }: CountProps) => {
  return (
    <span className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-foreground/10 text-primary">
      {count}
    </span>
  );
};

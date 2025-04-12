export function TableHead({ className, ...props }) {
  return (
    <thead className={`bg-gray-100 dark:bg-gray-800 ${className}`} {...props} />
  );
}
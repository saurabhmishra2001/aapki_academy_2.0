export function TableCell({ className, ...props }) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:my-0 ${className}`}
      {...props}
    />
  );
}
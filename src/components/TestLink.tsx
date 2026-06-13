export function TestLink({ href, label = "Test all API EndPoints here" }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {label}
    </a>
  );
}
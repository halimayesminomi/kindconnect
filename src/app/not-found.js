import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: 12 }}>404</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>Page not found.</p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}

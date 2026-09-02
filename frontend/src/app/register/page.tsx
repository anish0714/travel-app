"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const RegisterPage = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ firstName, lastName, email, password });
      router.push("/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-ink">Create an account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="text"
            required
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
          <input
            type="text"
            required
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-route px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-route-dark disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-route hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

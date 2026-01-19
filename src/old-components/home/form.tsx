"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeForm() {
  const session = useSession();
  const [qty, setQty] = useState<number>(1);
  const [amount, setAmount] = useState<number>(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = searchParams.get("new");

  useEffect(() => {
    if (!login && session.status === "authenticated")
      router.push("/dashboard/contracts");
  }, [session.data]);

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
      setAmount((qty - 1) * 1);
    }
  };

  const handleIncrement = () => {
    setQty(qty + 1);
    setAmount((qty + 1) * 1);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem("QTY", `${qty}`);

    if (session.status === "authenticated") {
      router.push(`/dashboard/contracts/new?signers=${qty}`);
      return;
    } else {
      router.push(`/signin?signers=${qty}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <span className="signing-form-title">Number of people signing</span>
      <div className="signing-form-qty-wrap">
        <button
          type="button"
          className="signing-form-qty-btn"
          onClick={handleDecrement}
        >
          <i className="icon-minus" />
        </button>
        <input type="text" className="form-control" value={qty} readOnly />
        <button
          type="button"
          className="signing-form-qty-btn"
          onClick={handleIncrement}
        >
          <i className="icon-plus" />
        </button>
      </div>
      <div className="form-group">
        <label htmlFor="total" className="form-label">
          Your Total Document E-Signing Fee
        </label>
        <input
          type="text"
          className="form-control"
          value={`$${amount}`}
          readOnly
        />
      </div>
      <div className="text-center">
        <button type="submit" className="btn btn-outline-primary btn-sm">
          SIGN NOW! <i className="icon-chevron-right" />
        </button>
      </div>
    </form>
  );
}

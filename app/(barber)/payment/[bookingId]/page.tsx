"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { tzs } from "@/lib/barber-data";

const paymentMethods = [
  { id: "mpesa", name: "M-Pesa", logo: "📱", color: "from-green-500 to-green-600" },
  { id: "airtel", name: "Airtel Money", logo: "📲", color: "from-red-500 to-red-600" },
  { id: "tigo", name: "Tigo Pesa", logo: "💳", color: "from-blue-500 to-blue-600" },
  { id: "halopesa", name: "HaloPesa", logo: "💰", color: "from-purple-500 to-purple-600" },
];

export default function PaymentScreen({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("mpesa");
  const [processing, setProcessing] = useState(false);

  const servicePrice = 20000;
  const serviceFee = 2000;
  const total = servicePrice + serviceFee;

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      router.push(`/rating/${params.bookingId}`);
    }, 2000);
  };

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#0F3D2E] px-6 pb-6 pt-12">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Payment</h1>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-6 py-6">
        {/* Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">Payment Summary</h2>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Haircut + Beard</span>
              <span className="font-medium">{tzs(servicePrice)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Service Fee</span>
              <span className="font-medium">{tzs(serviceFee)}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#0F3D2E]">Total Amount</span>
              <span className="text-2xl font-bold text-[#0F3D2E]">{tzs(total)}</span>
            </div>
          </div>
        </div>

        {/* Methods */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">Select Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                  selectedMethod === method.id ? "border-[#0F3D2E] bg-[#0F3D2E]/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${method.color}`}>{method.logo}</div>
                <span className="flex-1 text-left font-semibold text-gray-700">{method.name}</span>
                {selectedMethod === method.id && <CheckCircle2 className="h-6 w-6 text-[#0F3D2E]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl bg-[#C9A227]/10 p-5">
          <h3 className="mb-2 font-semibold text-[#0F3D2E]">Payment Instructions</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
            <li>Click &quot;Pay Now&quot; button below</li>
            <li>You&apos;ll receive a prompt on your phone</li>
            <li>Enter your mobile money PIN</li>
            <li>Confirm the payment</li>
          </ol>
        </div>

        {/* Security */}
        <div className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-[#0F3D2E]">Secure Payment</h3>
            <p className="text-sm text-gray-600">Your payment is secured with end-to-end encryption. We never store your mobile money PIN.</p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={handlePayment}
          disabled={processing}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing Payment...
            </span>
          ) : (
            `Pay ${tzs(total)}`
          )}
        </Button>
      </div>
    </div>
  );
}

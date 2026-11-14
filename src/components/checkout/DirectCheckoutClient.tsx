"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BagShopping,
  CheckCircle,
  CloseCircle,
  Tag,
  Truck,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { siteConfig } from "@/config";
import { checkoutDirectProduct } from "@/lib/actions/checkout";
import { sendPhoneOtpAction, verifyPhoneOtpAction } from "@/lib/actions/otp";
import { BANGLADESH_DIVISIONS, type DivisionId } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface DirectCheckoutClientProps {
  product: Product;
  quantity: number;
  unitPrice: number;
  initialName?: string;
  initialPhone?: string;
  initialPhoneVerified?: boolean;
  allowCoupons?: boolean;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingMinAmount: number;
}

export function DirectCheckoutClient({
  product,
  quantity,
  unitPrice,
  initialName = "",
  initialPhone = "",
  initialPhoneVerified = false,
  allowCoupons = true,
  insideDhakaFee = 60,
  outsideDhakaFee = 120,
  freeShippingMinAmount = 1500,
}: DirectCheckoutClientProps) {
  const rawSubtotal = unitPrice * quantity;

  // Selected Division: defaults to 'dhaka'
  const [selectedDivision, setSelectedDivision] = useState<DivisionId>("dhaka");

  // Derive deliveryZone automatically from selectedDivision:
  // 'dhaka' => inside_dhaka, others => outside_dhaka
  const deliveryZone =
    selectedDivision === "dhaka" ? "inside_dhaka" : "outside_dhaka";

  // Coupon States
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Phone Verification & OTP States (Feature gated via siteConfig)
  const isVerificationEnabled = Boolean(
    siteConfig.features?.enablePhoneVerification,
  );
  const [phone, setPhone] = useState(initialPhone);
  const [isPhoneVerified, setIsPhoneVerified] = useState(
    isVerificationEnabled ? initialPhoneVerified : true,
  );
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [mockHint, setMockHint] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Resend Timer Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);

  // Check free shipping condition
  const isFreeDelivery =
    freeShippingMinAmount > 0 && discountedSubtotal >= freeShippingMinAmount;
  const deliveryCharge = isFreeDelivery
    ? 0
    : deliveryZone === "outside_dhaka"
      ? outsideDhakaFee
      : insideDhakaFee;

  const finalPayableTotal = Math.max(1, discountedSubtotal + deliveryCharge);

  // Handle phone changes: if number is changed from verified one, reset verification
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (isVerificationEnabled && isPhoneVerified && val !== initialPhone) {
      setIsPhoneVerified(false);
      setOtpSent(false);
      setOtpCode("");
      setOtpMessage(null);
      setOtpError(null);
    }
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 11) {
      setOtpError("সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।");
      return;
    }

    setIsSendingOtp(true);
    setOtpError(null);
    setOtpMessage(null);
    setMockHint(null);

    try {
      const res = await sendPhoneOtpAction(phone.trim());
      if (res.success) {
        setOtpSent(true);
        setOtpMessage(res.message);
        if (res.mockOtp) {
          setMockHint(res.mockOtp);
        }
        setCountdown(60);
      } else {
        setOtpError(res.message);
      }
    } catch {
      setOtpError("ওটিপি পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError("সম্পূর্ণ ৬ ডিজিটের কোড দিন।");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await verifyPhoneOtpAction(phone.trim(), otpCode);
      if (res.success) {
        setIsPhoneVerified(true);
        setOtpSent(false);
        setOtpCode("");
        setOtpMessage("মোবাইল নম্বর সফলভাবে যাচাই হয়েছে!");
        setMockHint(null);
      } else {
        setOtpError(res.message);
      }
    } catch {
      setOtpError("কোড যাচাই ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Apply Coupon Handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal: rawSubtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponError(data.error || "কুপন কোডটি সঠিক নয়।");
      } else {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
          message: data.message,
        });
        setCouponError("");
      }
    } catch {
      setCouponError("কুপন যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const variant = product.variants[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
      {/* Left Column: Delivery Form */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-6">
        <Card className="border-border/80 bg-card rounded-xl sm:rounded-2xl shadow-xs py-0 gap-0 [--card-spacing:0px]">
          <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-5 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              ডেলিভারির ঠিকানা ও তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 sm:pt-2">
            <form
              action={checkoutDirectProduct}
              className="space-y-3 sm:space-y-4"
            >
              <input type="hidden" name="handle" value={product.handle} />
              <input
                type="hidden"
                name="quantity"
                value={quantity.toString()}
              />
              <input type="hidden" name="paymentMethod" value="cod" />
              <input
                type="hidden"
                name="couponCode"
                value={appliedCoupon ? appliedCoupon.code : ""}
              />
              <input type="hidden" name="division" value={selectedDivision} />
              <input type="hidden" name="deliveryZone" value={deliveryZone} />

              {/* Customer Name */}
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="text-xs sm:text-sm font-semibold text-foreground/90"
                >
                  আপনার নাম
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={initialName}
                  placeholder="আপনার পূর্ণ নাম"
                  className="rounded-lg sm:rounded-xl h-10 text-sm px-3 bg-background"
                />
              </div>

              {/* Phone Number with OTP Verification */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="phone"
                    className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5"
                  >
                    <span>মোবাইল নম্বর</span>
                    {isVerificationEnabled && isPhoneVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle className="size-3" /> যাচাইকৃত
                      </span>
                    )}
                  </Label>
                  {isVerificationEnabled && !isPhoneVerified && !otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || !phone || phone.length < 11}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isSendingOtp ? "ওটিপি পাঠানো হচ্ছে..." : "ওটিপি পাঠান"}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="০১XXXXXXXXX"
                    className="rounded-lg sm:rounded-xl h-10 text-sm px-3 font-mono bg-background"
                  />
                </div>

                {/* OTP Input Section (shown when OTP is sent) */}
                {isVerificationEnabled && !isPhoneVerified && otpSent && (
                  <div className="rounded-lg sm:rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        ৬ ডিজিটের কোডটি লিখুন:
                      </span>
                      {countdown > 0 ? (
                        <span className="text-muted-foreground font-mono text-[11px]">
                          পুনরায় পাঠান ({countdown}s)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          কোড পুনরায় পাঠান
                        </button>
                      )}
                    </div>

                    <div className="flex justify-center py-1">
                      <InputOTP
                        maxLength={6}
                        value={otpCode}
                        onChange={(val) => setOtpCode(val)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {mockHint && (
                      <p className="text-[11px] text-center text-amber-600 dark:text-amber-400 font-mono bg-amber-500/10 py-1 rounded">
                        ডেমো কোড: <strong>{mockHint}</strong>
                      </p>
                    )}

                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || otpCode.length !== 6}
                      size="sm"
                      className="w-full rounded-md bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-9 text-xs"
                    >
                      {isVerifyingOtp ? (
                        <Spinner className="size-3" />
                      ) : (
                        "যাচাই সম্পন্ন করুন"
                      )}
                    </Button>
                  </div>
                )}

                {otpMessage && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {otpMessage}
                  </p>
                )}
                {otpError && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                    {otpError}
                  </p>
                )}
              </div>

              {/* Division Selection (Auto Delivery Charge Calculation) */}
              <div className="space-y-1.5 pt-0.5">
                <Label
                  htmlFor="division-select"
                  className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Truck className="size-4 text-emerald-600" />
                    <span>আপনার বিভাগ নির্বাচন করুন</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ডেলিভারি চার্জ: {isFreeDelivery ? "ফ্রি" : `৳${deliveryCharge}`}
                  </span>
                </Label>

                <Select
                  value={selectedDivision}
                  onValueChange={(val) => {
                    if (val) setSelectedDivision(val as DivisionId);
                  }}
                >
                  <SelectTrigger
                    id="division-select"
                    className="w-full h-10 rounded-lg sm:rounded-xl bg-background text-sm font-medium"
                  >
                    <SelectValue placeholder="বিভাগ নির্বাচন করুন">
                      {(val: string | null) => {
                        const matched = BANGLADESH_DIVISIONS.find((d) => d.id === val);
                        return matched ? matched.nameBn : "বিভাগ নির্বাচন করুন";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectGroup>
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <SelectItem key={div.id} value={div.id} label={div.nameBn}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span className="font-medium text-foreground">{div.nameBn}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {isFreeDelivery
                                ? "ফ্রি ডেলিভারি"
                                : div.isDhaka
                                  ? `৳${insideDhakaFee} (২৪-৪৮ ঘণ্টা)`
                                  : `৳${outsideDhakaFee} (২-৩ দিন)`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  {selectedDivision === "dhaka"
                    ? `* ঢাকা বিভাগে ডেলিভারি চার্জ ৳${insideDhakaFee} (২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি)`
                    : `* ঢাকার বাইরে ডেলিভারি চার্জ ৳${outsideDhakaFee} (২-৩ কার্যদিবসে ক্যাশ অন ডেলিভারি)`}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <Label
                  htmlFor="address"
                  className="text-xs sm:text-sm font-semibold text-foreground/90"
                >
                  সম্পূর্ণ ডেলিভারি ঠিকানা
                </Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="বাড়ি/ফ্ল্যাট নং, রাস্তা, এলাকা, থানা ও জেলা"
                  className="rounded-lg sm:rounded-xl h-10 text-sm px-3 bg-background"
                />
              </div>

              {/* Coupon Application Box */}
              {allowCoupons ? (
                <div className="pt-0.5">
                  {!isCouponOpen && !appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => setIsCouponOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                    >
                      <Tag className="size-3.5 shrink-0" />
                      <span>আপনার কি কোনো কুপন বা প্রোমোকোড আছে?</span>
                    </button>
                  ) : (
                    <div className="rounded-lg sm:rounded-xl border border-border/80 bg-neutral-50/60 dark:bg-neutral-900/40 p-2.5 sm:p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Tag className="size-3.5 text-emerald-600 shrink-0" />
                          <span>কুপন বা ডিসকাউন্ট কোড</span>
                        </Label>
                        {!appliedCoupon && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsCouponOpen(false);
                              setCouponError("");
                            }}
                            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            বন্ধ করুন
                          </button>
                        )}
                      </div>

                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-2 rounded-md sm:rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-200">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <CheckCircle className="size-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              কুপন{" "}
                              <strong className="font-mono uppercase">
                                {appliedCoupon.code}
                              </strong>{" "}
                              যুক্ত হয়েছে (-৳
                              {appliedCoupon.discountAmount.toLocaleString(
                                "bn-BD",
                              )}
                              )
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-muted-foreground hover:text-red-600 transition-colors p-1 shrink-0"
                            title="কুপন মুছুন"
                          >
                            <CloseCircle className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            placeholder="প্রোমোকোড লিখুন (যেমন: SWAS10)"
                            className="rounded-md sm:rounded-lg h-9 text-xs font-mono uppercase bg-background"
                          />
                          <Button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={isApplying || !couponCode.trim()}
                            variant="outline"
                            size="sm"
                            className="rounded-md sm:rounded-lg h-9 px-3.5 text-xs font-semibold shrink-0 cursor-pointer border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          >
                            {isApplying ? (
                              <Spinner className="size-3" />
                            ) : (
                              "প্রয়োগ করুন"
                            )}
                          </Button>
                        </div>
                      )}

                      {couponError ? (
                        <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                          {couponError}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="rounded-lg sm:rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-2.5 sm:p-3 text-center">
                <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-normal">
                  অর্ডারটি কনফার্ম করার পর ডেলিভারিম্যান থেকে পণ্যটি বুঝে নিয়ে মূল্য পরিশোধ
                  করুন।
                </p>
              </div>

              {/* Checkout Submit Button - requires OTP verification if enabled */}
              {isVerificationEnabled && !isPhoneVerified ? (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !phone || phone.length < 11}
                  size="lg"
                  className="w-full rounded-lg sm:rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-11 sm:h-12 text-sm sm:text-base shadow-xs mt-1 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <Spinner className="size-4" />
                  ) : (
                    <span>মোবাইল নম্বর ওটিপি দিয়ে যাচাই করুন</span>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-lg sm:rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-11 sm:h-12 text-sm sm:text-base shadow-xs mt-1 cursor-pointer"
                >
                  <BagShopping className="size-4 shrink-0" />
                  <span>
                    অর্ডার কনফার্ম করুন — ৳
                    {finalPayableTotal.toLocaleString("bn-BD")}
                  </span>
                </Button>
              )}

              <p className="text-[10px] sm:text-[11px] text-center text-muted-foreground">
                অর্ডারটি নিশ্চিত করার পর আমাদের প্রতিনিধি আপনাকে কল দিয়ে কনফার্ম করবেন।
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 space-y-4 sm:space-y-6">
        <div className="sticky top-8 space-y-4">
          {/* Falaq Food Style "YOUR ORDER" Card */}
          <div className="overflow-hidden rounded-[12px] sm:rounded-[14px] border border-border/80 bg-card shadow-xs">
            {/* Table Header: PRODUCT / SUBTOTAL */}
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
              <span>পণ্য</span>
              <span>মোট</span>
            </div>

            {/* Product Item Row */}
            <div className="flex items-start gap-3.5 px-4 py-4 sm:px-5 sm:py-4 border-b border-border/70 last:border-b-0">
              {/* Thumbnail */}
              <div className="relative size-[56px] sm:size-[64px] shrink-0 overflow-hidden rounded-md border border-border/80 bg-neutral-100 dark:bg-neutral-900">
                {product.featuredImage?.url ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    sizes="64px"
                    className="size-full object-cover"
                  />
                ) : null}
              </div>

              {/* Title & Price Info */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="line-clamp-2 text-xs sm:text-sm font-semibold text-foreground leading-snug">
                  {product.title}
                </span>
                {variant?.title && variant.title !== "Default Title" ? (
                  <span className="text-[11px] text-muted-foreground">
                    {variant.title}
                  </span>
                ) : null}

                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="whitespace-nowrap text-xs text-muted-foreground font-mono">
                    × {quantity} (৳{unitPrice.toLocaleString("bn-BD")})
                  </span>
                  <span className="whitespace-nowrap text-sm font-bold text-foreground font-mono">
                    ৳{rawSubtotal.toLocaleString("bn-BD")}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtotals & Fees */}
            <div className="flex flex-col border-t border-border/80 bg-muted/20 text-xs sm:text-sm divide-y divide-border/60">
              <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 text-muted-foreground">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-foreground font-mono">
                  ৳{rawSubtotal.toLocaleString("bn-BD")}
                </span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>কুপন ছাড় ({appliedCoupon.code})</span>
                  <span className="font-mono">
                    -৳{appliedCoupon.discountAmount.toLocaleString("bn-BD")}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 text-muted-foreground">
                <div className="flex flex-col">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-[10px] text-muted-foreground/80">
                    {BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivision)
                      ?.nameBn ||
                      (deliveryZone === "inside_dhaka"
                        ? "ঢাকা বিভাগ"
                        : "ঢাকার বাইরে")}
                  </span>
                </div>
                <span
                  className={`font-semibold font-mono ${
                    isFreeDelivery
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-foreground"
                  }`}
                >
                  {isFreeDelivery ? "ফ্রি" : `৳${deliveryCharge}`}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 text-base sm:text-lg font-bold text-foreground bg-card">
                <span>সর্বমোট</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-lg sm:text-xl">
                  ৳{finalPayableTotal.toLocaleString("bn-BD")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

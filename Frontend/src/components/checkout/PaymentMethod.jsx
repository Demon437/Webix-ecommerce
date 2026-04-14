import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from 'lucide-react';

export default function PaymentMethod({ selected, onSelect, cardDetails, onCardDetailsChange }) {
    const handleChange = (field, value) => {
        onCardDetailsChange({ ...cardDetails, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">Payment Method</h3>

            <div className="space-y-4">
                {/* Credit/Debit Card Option */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                        borderColor: selected === 'credit_card' ? '#000' : '#e5e7eb',
                        backgroundColor: selected === 'credit_card' ? '#f9fafb' : '#fff'
                    }}>
                    <input
                        type="radio"
                        name="payment"
                        value="credit_card"
                        checked={selected === 'credit_card'}
                        onChange={(e) => onSelect(e.target.value)}
                        className="w-4 h-4"
                    />
                    <CreditCard className="h-5 w-5 ml-3 text-neutral-600" />
                    <span className="ml-3 font-medium text-neutral-900">Credit/Debit Card</span>
                </label>

                {/* Card Details (shown when credit card is selected) */}
                {selected === 'credit_card' && (
                    <div className="space-y-4 p-4 bg-neutral-50 rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardDetails?.cardNumber || ""}
                                onChange={(e) => handleChange("cardNumber", e.target.value)}
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                    id="expiryDate"
                                    placeholder="MM/YY"
                                    value={cardDetails?.expiryDate || ""}
                                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    type="password"
                                    value={cardDetails?.cvv || ""}
                                    onChange={(e) => handleChange("cvv", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Digital Wallet Option */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                    style={{
                        borderColor: selected === 'wallet' ? '#000' : '#e5e7eb',
                        backgroundColor: selected === 'wallet' ? '#f9fafb' : '#fff'
                    }}>
                    <input
                        type="radio"
                        name="payment"
                        value="wallet"
                        checked={selected === 'wallet'}
                        onChange={(e) => onSelect(e.target.value)}
                        className="w-4 h-4"
                    />
                    <Wallet className="h-5 w-5 ml-3 text-neutral-600" />
                    <span className="ml-3 font-medium text-neutral-900">Digital Wallet</span>
                </label>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">Razorpay will handle secure payment processing. Your card details are safe with us.</p>
            </div>
        </div>
    );
}
import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => {
                setIsSubscribed(false);
                setEmail("");
            }, 3000);
        }
    };

    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-50 p-8 md:p-12 lg:p-16"
                >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-200 rounded-full blur-3xl opacity-30" />

                    <div className="relative max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-900 mb-6">
                            <Mail className="h-7 w-7 text-white" />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                            Stay in the Loop
                        </h2>
                        <p className="text-neutral-600 mt-3 max-w-md mx-auto">
                            Subscribe to our newsletter and get 10% off your first order, plus exclusive access to new arrivals and special offers.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 rounded-full border-neutral-200 focus:border-neutral-400"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className={`h-14 px-8 rounded-full transition-all duration-300 ${isSubscribed
                                        ? 'bg-green-600 hover:bg-green-600'
                                        : 'bg-neutral-900 hover:bg-neutral-800'
                                    }`}
                                disabled={isSubscribed}
                            >
                                {isSubscribed ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />
                                        Subscribed!
                                    </>
                                ) : (
                                    <>
                                        Subscribe
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <p className="text-xs text-neutral-500 mt-4">
                            By subscribing, you agree to our Privacy Policy and consent to receive updates.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
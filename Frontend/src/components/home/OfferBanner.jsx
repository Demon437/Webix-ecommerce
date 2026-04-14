import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { motion } from 'framer-motion';

export default function OfferBanner() {

    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 14,
        minutes: 36,
        seconds: 42
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) { seconds = 59; minutes--; }
                if (minutes < 0) { minutes = 59; hours--; }
                if (hours < 0) { hours = 23; days--; }
                if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[80vh] overflow-hidden">

            {/* Background Image */}
            <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1 }}
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
                <div className="max-w-3xl text-white">

                    {/* Tag */}
                    <span className="text-sm uppercase tracking-widest text-white/70">
                        Limited Time Sale
                    </span>

                    {/* Heading */}
                    <h2 className="text-5xl md:text-7xl font-bold mt-4 leading-tight">
                        Up to 50% Off
                        <br />
                        <span className="text-neutral-300">Summer Collection</span>
                    </h2>

                    {/* Countdown */}
                    <div className="flex gap-4 mt-8">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="bg-white/10 backdrop-blur-lg px-5 py-4 rounded-xl text-center">
                                <p className="text-2xl font-bold">
                                    {String(value).padStart(2, '0')}
                                </p>
                                <p className="text-xs uppercase text-white/60">{unit}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link to={createPageUrl("Products")}>
                        <Button className="mt-10 bg-white text-black px-8 h-14 rounded-full hover:scale-105 transition">
                            Shop Now
                            <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Floating SALE Badge */}
            <motion.div
                className="absolute bottom-10 right-10 bg-white text-black px-6 py-4 rounded-2xl shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <p className="text-3xl font-bold">50%</p>
                <p className="text-sm">OFF</p>
            </motion.div>

        </section>
    );
}
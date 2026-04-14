import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { motion } from 'framer-motion';

export default function HeroBanner() {

    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            setMouse({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section className="relative h-screen overflow-hidden bg-black text-white">

            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    scale: 1.05,
                    x: mouse.x * 0.2,
                    y: mouse.y * 0.2
                }}
                transition={{ type: "spring", stiffness: 30 }}
            >
                <img
                    src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1600"
                    className="w-full h-full object-cover opacity-80"
                />
            </motion.div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
                <div className="max-w-2xl">

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold leading-tight"
                    >
                        New Season
                        <br />
                        <span className="text-neutral-300">New Style</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-lg text-neutral-300"
                    >
                        Discover the latest trends in men's & kids fashion.
                        Designed for confidence. Built for comfort.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8"
                    >
                        <Link to={createPageUrl("Products")}>
                            <Button className="bg-white text-black px-8 h-14 rounded-full text-base hover:scale-105 transition">
                                Shop Collection
                                <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Floating Tag */}
            <motion.div
                className="absolute bottom-10 right-10 text-sm text-white/70"
                animate={{
                    x: mouse.x,
                    y: mouse.y
                }}
            >
                ★ Trending 2026
            </motion.div>

        </section>
    );
}
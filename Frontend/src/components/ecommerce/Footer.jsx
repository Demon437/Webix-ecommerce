import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook, Twitter, Instagram, Youtube,
    Mail, MapPin, Phone, ArrowRight,
    CreditCard, Shield, Truck, RotateCcw
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const footerLinks = {
    shop: [
        { name: "Electronics", href: "Products?category=electronics" },
        { name: "Clothing", href: "Products?category=clothing" },
        { name: "Home & Living", href: "Products?category=home" },
        { name: "Beauty", href: "Products?category=beauty" },
        { name: "New Arrivals", href: "Products" },
    ],
    support: [
        { name: "Help Center", href: "#" },
        { name: "Track Order", href: "#" },
        { name: "Shipping Info", href: "#" },
        { name: "Returns", href: "#" },
        { name: "Size Guide", href: "#" },
    ],
    company: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Affiliates", href: "#" },
    ],
};

const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹4000+" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: CreditCard, title: "Flexible Payment", desc: "Multiple options" },
];

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        setEmail("");
        // Handle newsletter subscription
    };

    return (
        <footer className="bg-neutral-900 text-white">
            {/* Features Bar */}
            <div className="border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center">
                                    <feature.icon className="h-5 w-5 text-neutral-300" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{feature.title}</h4>
                                    <p className="text-sm text-neutral-400">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to={createPageUrl("Home")} className="text-2xl font-bold tracking-tight">
                            LUXE
                        </Link>
                        <p className="mt-4 text-neutral-400 max-w-sm leading-relaxed">
                            Discover curated collections of premium products. Quality meets style in every piece we offer.
                        </p>

                        {/* Newsletter */}
                        <div className="mt-8">
                            <h4 className="font-medium mb-3">Subscribe to our newsletter</h4>
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500"
                                />
                                <Button type="submit" className="bg-white text-neutral-900 hover:bg-neutral-100">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-8">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={createPageUrl(link.href)}
                                        className="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-500">
                            © 2026 LUXE. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Fashion Enthusiast",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        content: "Absolutely love the quality of products here. The customer service is exceptional and delivery is always on time. Highly recommend!",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Tech Professional",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        content: "Best online shopping experience I've ever had. The product descriptions are accurate and the prices are unbeatable.",
        rating: 5
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Interior Designer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        content: "Found some amazing home decor pieces here. The curation is fantastic and everything arrived in perfect condition.",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 px-6 bg-neutral-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                        What Our Customers Say
                    </h2>
                    <p className="text-neutral-500 mt-3 max-w-md mx-auto">
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <Quote className="h-10 w-10 text-neutral-200 mb-4" />

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-neutral-600 leading-relaxed mb-6">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}